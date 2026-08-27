import { scoreSession } from '../../utils/scoring'
import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

type CompleteSessionBody = {
  sessionId?: string
}

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = (await readBody(event)) as CompleteSessionBody

  if (!body?.sessionId || typeof body.sessionId !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'sessionId is required' })
  }

  const session = await prisma.session.findUnique({
    where: { id: body.sessionId },
    include: {
      sessionEmails: {
        include: {
          generatedEmail: {
            include: {
              expectedFlags: true,
            },
          },
          userFlags: true,
        },
      },
    },
  })

  if (!session) {
    throw createError({ statusCode: 404, statusMessage: 'Session not found' })
  }
  if (session.userId !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const notSubmittedCount = session.sessionEmails.filter((item) => !item.submitted).length
  if (notSubmittedCount > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'All session emails must be submitted before completing the session',
    })
  }

  const sessionScoreResult = scoreSession(
    session.sessionEmails.map((item) => ({
      sessionEmailId: item.id,
      isPhishing: item.generatedEmail.isPhishing,
      expectedFlags: item.generatedEmail.expectedFlags.map((flag) => ({
        id: flag.id,
        category: flag.category,
        zone: flag.zone,
        startOffset: flag.startOffset,
        endOffset: flag.endOffset,
        text: flag.text,
      })),
      userFlags: item.userFlags.map((flag) => ({
        id: flag.id,
        flagCategory: flag.flagCategory,
        zoneType: flag.zoneType,
        startOffset: flag.startOffset,
        endOffset: flag.endOffset,
        flaggedText: flag.flaggedText,
      })),
    }))
  )

  const updatedSession = await prisma.$transaction(async (tx) => {
    for (const result of sessionScoreResult.emailResults) {
      await tx.sessionEmail.update({
        where: { id: result.sessionEmailId },
        data: {
          userPassed: result.isScored ? result.passed : null,
        },
      })
    }

    return tx.session.update({
      where: { id: session.id },
      data: {
        status: sessionScoreResult.passedThreshold ? 'COMPLETED' : 'FAILED',
        completedAt: new Date(),
        score: sessionScoreResult.sessionScore,
      },
    })
  })

  return {
    sessionId: updatedSession.id,
    status: updatedSession.status,
    score: updatedSession.score,
    completedAt: updatedSession.completedAt,
    scoring: sessionScoreResult,
  }
})
