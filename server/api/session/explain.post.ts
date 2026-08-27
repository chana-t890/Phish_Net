import { prisma } from '../../utils/prisma'
import { invokeModelStream } from '../../utils/bedrock'
import { requireAuth } from '../../utils/auth'

type ExplainBody = {
  sessionEmailId?: string
}

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = (await readBody(event)) as ExplainBody

  if (!body?.sessionEmailId || typeof body.sessionEmailId !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'sessionEmailId is required' })
  }

  const sessionEmail = await prisma.sessionEmail.findUnique({
    where: { id: body.sessionEmailId },
    include: {
      session: true,
      generatedEmail: true,
      userFlags: true,
    },
  })

  if (!sessionEmail) {
    throw createError({ statusCode: 404, statusMessage: 'Session email not found' })
  }
  if (sessionEmail.session.userId !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  if (!sessionEmail.submitted) {
    throw createError({ statusCode: 400, statusMessage: 'Email must be submitted before requesting an explanation' })
  }

  const email = sessionEmail.generatedEmail
  const markedLegitimate = !email.isPhishing
    ? false
    : sessionEmail.userFlags.length === 0 && sessionEmail.userPassed === false

  let flagContext: string
  if (markedLegitimate) {
    flagContext = 'The trainee marked this email as safe (legitimate).'
  } else if (sessionEmail.userFlags.length > 0) {
    const categories = sessionEmail.userFlags.map((f) => f.flagCategory).join(', ')
    flagContext = `The trainee flagged ${sessionEmail.userFlags.length} item(s) with categories: ${categories}.`
  } else {
    flagContext = 'The trainee did not flag any specific items.'
  }

  const systemPrompt = `You are a friendly phishing awareness training coach. A trainee just submitted their analysis of an email.
Your job: send the opening message asking them to explain their reasoning in their own words.
IMPORTANT: Do NOT give any feedback, hints, or reveal anything about the email's red flags. Just ask them to explain.
Keep the message to 2–3 sentences. Be warm and encouraging.`

  const userMessage = `Email context:
Subject: "${email.subject}"
From: "${email.sender}"
${flagContext}

Write the opening message asking the trainee to explain their analysis.`

  setResponseHeaders(event, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  })

  const encoder = new TextEncoder()
  let fullText = ''

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of invokeModelStream(
          [{ role: 'user', content: userMessage }],
          { systemPrompt, maxTokens: 256, temperature: 0.8 },
        )) {
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

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, messageId: saved.id })}\n\n`))
      } catch {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`))
      } finally {
        controller.close()
      }
    },
  })

  return sendStream(event, stream)
})
