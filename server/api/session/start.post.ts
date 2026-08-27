import { prisma } from '../../utils/prisma'
import { invokeModel } from '../../utils/bedrock'
import { requireAuth } from '../../utils/auth'
import { shapeSession, SESSION_INCLUDE } from '../../utils/session'
import { normalizeGeneratedFlags, validateTemplateResources } from '../../utils/emailTemplates'

type StartSessionBody = {
  isPractice?: boolean
  assignmentId?: string
}

type AiEmailFlag = {
  id: string
  text: string
  startOffset: number
  endOffset: number
  category: string
  zone: string | null
}

type AiEmail = {
  templateId?: string
  subject: string
  body: string
  sender: string
  isPhishing: boolean
  attachments: Array<{ filename: string; suspicious: boolean }>
  urls: Array<{ displayText: string; href: string; suspicious: boolean }>
  expectedFlags: AiEmailFlag[]
}

type AssignedTemplate = NonNullable<Awaited<ReturnType<typeof prisma.emailTemplate.findUnique>>> & {
  expectedFlags: AiEmailFlag[]
}

const GENERATION_SYSTEM_PROMPT = `You are creating phishing awareness training emails for a corporate security training platform.
Generate realistic-looking emails that employees would receive in a corporate inbox.
Use ONLY fictional company names, domains, and personal names — never real brands or real people.
Return ONLY valid JSON with no extra text, no markdown fences, nothing before or after the JSON object.`

function buildGenerationPrompt(
  seeds: Array<{ category: string; isPhishing: boolean; rawSubject: string; rawBody: string; rawSender: string }>,
  count: number,
  kind: 'phishing' | 'legit',
): string {
  const seedList = seeds
    .map(
      (s, i) =>
        `[Seed ${i + 1}] category=${s.category} isPhishing=${s.isPhishing}\nSubject: ${s.rawSubject}\nSender: ${s.rawSender}\nBody: ${s.rawBody.slice(0, 350)}`,
    )
    .join('\n\n')

  const isPhishing = kind === 'phishing'
  const typeDesc = isPhishing ? 'phishing' : 'legitimate (safe, non-phishing)'
  const flagRules = isPhishing
    ? `- expectedFlags: every email MUST have at least 2 expectedFlags; each:
  { "id": "flag-1", "text": "exact substring from body", "startOffset": 0, "endOffset": 10, "category": "urgency_language", "zone": null }
- zone: "sender" | "subject" | "url" | "attachment" | null (null = body free-text)
- For zone=null: startOffset/endOffset are character positions in body; text must match body.slice(startOffset, endOffset)
- For zone="sender"/"subject"/"url"/"attachment": set startOffset=0, endOffset=0
- category must be one of: suspicious_url | urgency_language | grammar_error | fake_sender | info_request | money_request | too_good_to_be_true | threatening_language | suspicious_attachment`
    : `- expectedFlags: MUST be an empty array [] for every email — these are legitimate, safe emails with no red flags
- Do NOT include urgency, threats, credential/payment requests, or suspicious links/attachments; write realistic ordinary business correspondence`

  return `Using these ${seeds.length} seed emails as style/category inspiration, generate exactly ${count} ${typeDesc} training emails. Every email MUST have "isPhishing": ${isPhishing}.

SEEDS:
${seedList}

Return this exact JSON (no extra text):
{
  "emails": [
    {
      "subject": "string",
      "body": "plain text with real \\n line breaks",
      "sender": "Display Name <address@fictional.example>",
      "isPhishing": ${isPhishing},
      "attachments": [],
      "urls": [],
      "expectedFlags": []
    }
  ]
}

Rules:
- attachments: array of { "filename": "string", "suspicious": boolean }
- urls: array of { "displayText": "string", "href": "http://...", "suspicious": boolean } — include any link mentioned in the body
${flagRules}`
}

function shuffleEmails(emails: AiEmail[]): AiEmail[] {
  for (let i = emails.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[emails[i], emails[j]] = [emails[j]!, emails[i]!]
  }
  return emails
}

async function callBedrockForEmails(
  seeds: any[],
  count: number,
  kind: 'phishing' | 'legit',
): Promise<AiEmail[]> {
  const prompt = buildGenerationPrompt(seeds, count, kind)
  let raw: string

  try {
    raw = await invokeModel([{ role: 'user', content: prompt }], {
      systemPrompt: GENERATION_SYSTEM_PROMPT,
      maxTokens: 8192,
      temperature: 0.9,
    })
  } catch {
    throw createError({ statusCode: 502, statusMessage: 'Email generation failed — Bedrock unavailable' })
  }

  // Strip potential markdown fences the model might add
  const cleaned = raw.replace(/^```(?:json)?\s*/m, '').replace(/\s*```\s*$/m, '').trim()
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw createError({ statusCode: 502, statusMessage: 'AI returned an unparseable response' })
  }

  let parsed: { emails: AiEmail[] }
  try {
    parsed = JSON.parse(jsonMatch[0])
  } catch {
    throw createError({ statusCode: 502, statusMessage: 'AI response was not valid JSON' })
  }

  if (!Array.isArray(parsed.emails) || parsed.emails.length === 0) {
    throw createError({ statusCode: 502, statusMessage: 'AI returned no emails' })
  }

  return parsed.emails.map((email) => ({
    ...email,
    expectedFlags: normalizeGeneratedFlags(email.expectedFlags, email.body),
  }))
}

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = (await readBody(event)) as StartSessionBody
  const isPractice = body.isPractice === true
  let assignment: Awaited<ReturnType<typeof prisma.trainingAssignment.findUnique>> & {
    template?: AssignedTemplate | null
  } | null = null

  if (body.assignmentId) {
    assignment = await prisma.trainingAssignment.findUnique({
      where: { id: body.assignmentId },
      include: { template: { include: { expectedFlags: true } } },
    })
    if (!assignment) {
      throw createError({ statusCode: 404, statusMessage: 'Assignment not found' })
    }
    if (assignment.userId !== user.id) {
      throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }
  }

  const previousAttempts = await prisma.session.count({
    where: { userId: user.id, assignmentId: body.assignmentId ?? null },
  })

  const assignedTemplate = assignment?.template
  if (assignedTemplate && assignedTemplate.status !== 'APPROVED') {
    throw createError({ statusCode: 409, statusMessage: 'The assigned template is no longer approved' })
  }

  let templateWhere: { status: 'APPROVED'; usageMode?: 'INSPIRATION' | 'DIRECT' } = {
    status: 'APPROVED',
    usageMode: 'INSPIRATION',
  }
  let templateCount = await prisma.emailTemplate.count({
    where: { status: 'APPROVED', usageMode: 'INSPIRATION' },
  })
  if (templateCount === 0) {
    templateWhere = { status: 'APPROVED' }
    templateCount = await prisma.emailTemplate.count({ where: templateWhere })
  }
  if (templateCount === 0) {
    throw createError({
      statusCode: 503,
      statusMessage: 'No email templates available — dataset has not been loaded yet',
    })
  }

  const skip = Math.floor(Math.random() * Math.max(1, templateCount - 12))
  const seeds = await prisma.emailTemplate.findMany({
    where: templateWhere,
    take: 12,
    skip,
  })

  // SPEC §7.2: 5–7 emails, ~70% phishing, randomly determined. Generate the
  // phishing and legit sets in two parallel Bedrock calls to roughly halve latency.
  const totalEmails = 5 + Math.floor(Math.random() * 3) // 5, 6, or 7
  const phishingRatio = 0.6 + Math.random() * 0.2 // ~60–80%, centered on 70%
  const phishingCount = Math.min(totalEmails - 1, Math.max(2, Math.round(totalEmails * phishingRatio)))
  const legitCount = totalEmails - phishingCount

  const aiPhishingCount = Math.max(0, phishingCount - (assignedTemplate?.isPhishing ? 1 : 0))
  const aiLegitCount = totalEmails - (assignedTemplate ? 1 : 0) - aiPhishingCount
  const [phishingEmails, legitEmails] = await Promise.all([
    aiPhishingCount > 0 ? callBedrockForEmails(seeds, aiPhishingCount, 'phishing') : Promise.resolve([]),
    aiLegitCount > 0 ? callBedrockForEmails(seeds, aiLegitCount, 'legit') : Promise.resolve([]),
  ])

  // Force the category from the source call rather than trusting the model to honor the ratio.
  const generatedAiEmails = shuffleEmails([
    ...phishingEmails.slice(0, aiPhishingCount).map((email) => ({ ...email, isPhishing: true })),
    ...legitEmails.slice(0, aiLegitCount).map((email) => ({ ...email, isPhishing: false, expectedFlags: [] })),
  ])
  const assignedEmail: AiEmail | null = assignedTemplate
    ? {
        templateId: assignedTemplate.id,
        subject: assignedTemplate.rawSubject,
        body: assignedTemplate.rawBody,
        sender: assignedTemplate.rawSender,
        isPhishing: assignedTemplate.isPhishing,
        ...validateTemplateResources(assignedTemplate.attachments, assignedTemplate.urls),
        expectedFlags: assignedTemplate.expectedFlags.map((flag) => ({
          id: flag.id,
          text: flag.text,
          startOffset: flag.startOffset,
          endOffset: flag.endOffset,
          category: flag.category,
          zone: flag.zone,
        })),
      }
    : null
  const aiEmails = assignedEmail ? [assignedEmail, ...generatedAiEmails] : generatedAiEmails

  const session = await prisma.$transaction(async (tx) => {
    const newSession = await tx.session.create({
      data: {
        userId: user.id,
        assignmentId: body.assignmentId ?? null,
        isPractice,
        attemptNumber: previousAttempts + 1,
        status: 'IN_PROGRESS',
      },
    })

    for (const email of aiEmails) {
      const genEmail = await tx.generatedEmail.create({
        data: {
          subject: email.subject,
          body: email.body,
          sender: email.sender,
          templateId: email.templateId,
          isPhishing: email.isPhishing === true,
          attachments: email.attachments ?? [],
          urls: email.urls ?? [],
        },
      })

      if (email.isPhishing && Array.isArray(email.expectedFlags) && email.expectedFlags.length > 0) {
        await tx.expectedFlag.createMany({
          data: email.expectedFlags.map((flag) => ({
            generatedEmailId: genEmail.id,
            text: flag.text,
            startOffset: Number(flag.startOffset) || 0,
            endOffset: Number(flag.endOffset) || 0,
            category: flag.category,
            zone: flag.zone ?? null,
          })),
        })
      }

      await tx.sessionEmail.create({
        data: { sessionId: newSession.id, generatedEmailId: genEmail.id },
      })
    }

    return tx.session.findUniqueOrThrow({
      where: { id: newSession.id },
      include: SESSION_INCLUDE,
    })
  })

  return shapeSession(session as any)
})
