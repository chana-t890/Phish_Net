import { scoreEmail } from '../../utils/scoring'
import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

type SubmitEmailBody = {
  sessionEmailId?: string
  markedLegitimate?: boolean
}

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = (await readBody(event)) as SubmitEmailBody
  const markedLegitimate = body.markedLegitimate === true

  if (!body?.sessionEmailId || typeof body.sessionEmailId !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'sessionEmailId is required' })
  }

  if (body.markedLegitimate !== undefined && typeof body.markedLegitimate !== 'boolean') {
    throw createError({ statusCode: 400, statusMessage: 'markedLegitimate must be a boolean when provided' })
  }

  const sessionEmail = await prisma.sessionEmail.findUnique({
    where: { id: body.sessionEmailId },
    include: {
      generatedEmail: {
        include: {
          expectedFlags: true,
        },
      },
      session: true,
      userFlags: true,
    },
  })

  if (!sessionEmail) {
    throw createError({ statusCode: 404, statusMessage: 'Session email not found' })
  }
  if (sessionEmail.session.userId !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  if (sessionEmail.submitted) {
    throw createError({ statusCode: 400, statusMessage: 'Email has already been submitted' })
  }

  const expectedFlags = sessionEmail.generatedEmail.expectedFlags.map((flag) => ({
    id: flag.id,
    category: flag.category,
    zone: flag.zone,
    startOffset: flag.startOffset,
    endOffset: flag.endOffset,
    text: flag.text,
  }))

  const userFlagsForScoring = markedLegitimate
    ? []
    : sessionEmail.userFlags.map((flag) => ({
        id: flag.id,
        flagCategory: flag.flagCategory,
        zoneType: flag.zoneType,
        startOffset: flag.startOffset,
        endOffset: flag.endOffset,
        flaggedText: flag.flaggedText,
      }))

  let scoreResult = scoreEmail(
    sessionEmail.id,
    sessionEmail.generatedEmail.isPhishing,
    expectedFlags,
    userFlagsForScoring
  )

  // Product rule: marking a phishing email as legitimate is always a fail.
  if (markedLegitimate && sessionEmail.generatedEmail.isPhishing) {
    scoreResult = {
      ...scoreResult,
      isScored: true,
      excludedReason: null,
      correctHits: 0,
      partialHits: 0,
      creditScore: 0,
      missedFlags: expectedFlags.length,
      falsePositives: 0,
      hitRate: 0,
      passed: false,
      matches: [],
      missedExpectedFlagIds: expectedFlags.map((flag) => flag.id),
      falsePositiveUserFlagIds: [],
    }
  }

  const userPassed = scoreResult.isScored ? scoreResult.passed : null

  const updated = await prisma.sessionEmail.update({
    where: { id: sessionEmail.id },
    data: {
      submitted: true,
      markedLegitimate,
      submittedAt: new Date(),
      userPassed,
    },
    include: {
      generatedEmail: {
        include: {
          expectedFlags: true,
        },
      },
      userFlags: true,
    },
  })

  return {
    sessionEmailId: updated.id,
    submitted: updated.submitted,
    submittedAt: updated.submittedAt?.toISOString() ?? null,
    markedLegitimate,
    userPassed: updated.userPassed,
    scoring: scoreResult,
    revealedFlags: updated.generatedEmail.expectedFlags.map((f) => ({
      id: f.id,
      text: f.text,
      startOffset: f.startOffset,
      endOffset: f.endOffset,
      category: f.category,
      zone: f.zone,
    })),
  }
})
