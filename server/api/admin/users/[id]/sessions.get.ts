import { prisma } from '../../../../utils/prisma'
import { requireAdmin } from '../../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')

  if (!id || typeof id !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'User id is required' })
  }

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  const sessions = await prisma.session.findMany({
    where: { userId: id },
    orderBy: { startedAt: 'desc' },
    include: {
      assignment: { select: { deadline: true } },
      sessionEmails: {
        select: {
          id: true,
          submitted: true,
          userPassed: true,
          generatedEmail: { select: { isPhishing: true } },
        },
      },
    },
  })

  return sessions.map((s) => ({
    id: s.id,
    assignmentId: s.assignmentId,
    status: s.status,
    score: s.score,
    attemptNumber: s.attemptNumber,
    isPractice: s.isPractice,
    startedAt: s.startedAt.toISOString(),
    completedAt: s.completedAt?.toISOString() ?? null,
    deadline: s.assignment?.deadline?.toISOString() ?? null,
    emailCount: s.sessionEmails.length,
    submittedCount: s.sessionEmails.filter((e) => e.submitted).length,
    phishingPassed: s.sessionEmails.filter((e) => e.submitted && e.generatedEmail.isPhishing && e.userPassed).length,
    phishingTotal: s.sessionEmails.filter((e) => e.generatedEmail.isPhishing).length,
  }))
})
