import { prisma } from '../../utils/prisma'
import { invokeModel, invokeModelStream } from '../../utils/bedrock'
import { requireAuth } from '../../utils/auth'
import { validateFirstMandatoryResponse } from '../../utils/reqResponseValidator'

type ChatBody = {
  sessionEmailId?: string
  message?: string
}

// Lenient AI relevance check: only rejects clearly off-topic chatter (e.g. pizza).
// Falls back to accept on any model error so infra hiccups never block a learner.
async function isReasoningRelevant(
  email: { subject: string; body: string },
  message: string,
): Promise<boolean> {
  try {
    const verdict = await invokeModel(
      [
        {
          role: 'user',
          content: `A security-awareness trainee was asked to explain their analysis of the email below.\n\nSubject: ${email.subject}\nBody:\n${email.body}\n\nTrainee's message: "${message}"\n\nIs the message at all related to this email, to phishing/email security, or to the trainee's reasoning about whether it is safe or suspicious? Be very lenient — accept any on-topic attempt, including short ones or questions. Answer NO only if it is clearly unrelated (e.g. about food, sports, or random chatter).\n\nReply with exactly one word: YES or NO.`,
        },
      ],
      { maxTokens: 5, temperature: 0, timeoutMs: 45_000 },
    )
    return /\byes\b/i.test(verdict)
  } catch {
    return true
  }
}

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = (await readBody(event)) as ChatBody

  if (!body?.sessionEmailId || typeof body.sessionEmailId !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'sessionEmailId is required' })
  }
  if (!body.message || typeof body.message !== 'string' || body.message.trim().length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'message is required' })
  }

  const sessionEmail = await prisma.sessionEmail.findUnique({
    where: { id: body.sessionEmailId },
    include: {
      session: true,
      generatedEmail: { include: { expectedFlags: true } },
      userFlags: true,
      aiChatMessages: { orderBy: { createdAt: 'asc' } },
    },
  })

  if (!sessionEmail) {
    throw createError({ statusCode: 404, statusMessage: 'Session email not found' })
  }
  if (sessionEmail.session.userId !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  if (!sessionEmail.submitted) {
    throw createError({ statusCode: 400, statusMessage: 'Email must be submitted before chatting' })
  }

  // Save the user's message first
  await prisma.aiChatMessage.create({
    data: {
      sessionEmailId: body.sessionEmailId,
      isChatResponse: false,
      content: body.message.trim(),
    },
  })

  const email = sessionEmail.generatedEmail

  // Gate the unlock: cheap heuristic first, then a lenient relevance judge.
  // Already-accepted emails stay accepted so follow-up questions flow normally.
  const alreadyAccepted = sessionEmail.reasoningAccepted
  let accepted = alreadyAccepted
  if (!alreadyAccepted) {
    const heuristic = validateFirstMandatoryResponse(body.message.trim())
    accepted = heuristic.isValid ? await isReasoningRelevant(email, body.message.trim()) : false
  }

  setResponseHeaders(event, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  })

  const encoder = new TextEncoder()

  // Answer didn't qualify: nudge for a real explanation WITHOUT revealing any
  // red flags, and leave the email locked (responded: false).
  if (!accepted) {
    const nudge = email.isPhishing
      ? `Before I give you any feedback, I'd like to hear your thinking. In your own words, what about this email felt off or suspicious — the sender, a link, the tone, or something it asked you to do? Even a sentence helps.`
      : `Before I give you any feedback, tell me a bit more: what made this email feel safe or legitimate to you? A sentence about the sender, the tone, or what it was asking is plenty.`

    const nudgeStream = new ReadableStream({
      async start(controller) {
        try {
          const saved = await prisma.aiChatMessage.create({
            data: { sessionEmailId: body.sessionEmailId!, isChatResponse: true, content: nudge },
          })
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: nudge })}\n\n`))
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, messageId: saved.id, responded: false })}\n\n`))
        } catch {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`))
        } finally {
          controller.close()
        }
      },
    })
    return sendStream(event, nudgeStream)
  }

  // Accepted: unlock the email on the first qualifying answer.
  if (!alreadyAccepted) {
    await prisma.sessionEmail.update({
      where: { id: body.sessionEmailId! },
      data: { reasoningAccepted: true },
    })
  }

  const expectedFlagsText =
    email.isPhishing && email.expectedFlags.length > 0
      ? email.expectedFlags
          .map((f) => `- [${f.category}] "${f.text}"${f.zone ? ` (zone: ${f.zone})` : ''}`)
          .join('\n')
      : 'None (this is a legitimate email)'

  const userFlagsText =
    sessionEmail.userFlags.length > 0
      ? sessionEmail.userFlags
          .map((f) => `- [${f.flagCategory}] "${f.flaggedText}"${f.zoneType ? ` (zone: ${f.zoneType})` : ''}`)
          .join('\n')
      : 'No items flagged'

  const markedLegitimate = sessionEmail.markedLegitimate ?? sessionEmail.userFlags.length === 0
  const classification = markedLegitimate ? 'LEGITIMATE' : 'PHISHING'
  const classificationWasCorrect = (markedLegitimate && !email.isPhishing) || (!markedLegitimate && email.isPhishing)
  const submissionResult = classificationWasCorrect
    ? sessionEmail.userPassed === false
      ? `CORRECT CLASSIFICATION, FAILED SCORE. The trainee submitted the ${classification} classification, and it was correct, but the submission did not pass scoring. Explain any expected red flags they missed or any incorrect flags they added; do not call the final classification incorrect.`
      : `CORRECT. The trainee submitted the ${classification} classification, and it was correct.`
    : `INCORRECT. The trainee submitted the ${classification} classification. The correct classification is ${email.isPhishing ? 'PHISHING' : 'LEGITIMATE'}.`

  const systemPrompt = `You are a phishing awareness training coach having a conversation with a trainee about an email they just analyzed.

EMAIL:
Subject: ${email.subject}
From: ${email.sender}
Body:
${email.body}

ANALYSIS:
Is phishing: ${email.isPhishing}
Submission result: ${submissionResult}
Expected red flags:
${expectedFlagsText}
Trainee's flags:
${userFlagsText}

Be conversational, educational, and encouraging. Answer questions specifically about this email.
Keep responses concise (under 200 words unless explaining something complex).
You may reference the expected red flags to teach — they are server-side context, not revealed to the trainee directly.`

  const decisionInstruction = !classificationWasCorrect
    ? 'The trainee made an incorrect final classification. State plainly that their submitted decision was incorrect and state the correct classification before praising or discussing any valid observations. Do not agree with a suspiciousness observation in a way that implies their final decision was correct.'
    : sessionEmail.userPassed === false
      ? 'The trainee\'s final classification was correct, but their score did not pass. Say explicitly that they classified the email correctly, then explain the missed or incorrectly flagged signals. Never describe the final classification as incorrect.'
    : 'Explicitly distinguish the trainee\'s final classification from their reasoning. Praise observations only when they are accurate, and state whether the final classification was correct.'

  const fullSystemPrompt = `${systemPrompt}

${decisionInstruction}`

  // Build conversation history in Bedrock message format
  const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
    ...sessionEmail.aiChatMessages.map((m) => ({
      role: (m.isChatResponse ? 'assistant' : 'user') as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user', content: body.message.trim() },
  ]

  const hasDecisionCorrection = sessionEmail.aiChatMessages.some(
    (message) => message.isChatResponse && /final classification was (?:in)?correct/i.test(message.content),
  )
  const decisionCorrection = !hasDecisionCorrection
    ? classificationWasCorrect && sessionEmail.userPassed === false
      ? `Your final classification was correct: this email was ${email.isPhishing ? 'phishing' : 'legitimate'}. Your score was not passing because some signals were missed or incorrectly flagged. I'll explain below.\n\n`
      : !classificationWasCorrect
        ? `Your final classification was incorrect: this email was ${email.isPhishing ? 'phishing' : 'legitimate'}. I'll explain why below.\n\n`
        : ''
    : ''
  let fullText = decisionCorrection

  const stream = new ReadableStream({
    async start(controller) {
      try {
        if (decisionCorrection) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: decisionCorrection })}\n\n`))
        }
        for await (const chunk of invokeModelStream(messages, {
          systemPrompt: fullSystemPrompt,
          maxTokens: 1024,
          temperature: 0.7,
        })) {
          fullText += chunk
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`))
        }

        const saved = await prisma.aiChatMessage.create({
          data: {
            sessionEmailId: body.sessionEmailId!,
            isChatResponse: true,
            content: fullText,
          },
        })

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, messageId: saved.id, responded: true })}\n\n`))
      } catch {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`))
      } finally {
        controller.close()
      }
    },
  })

  return sendStream(event, stream)
})
