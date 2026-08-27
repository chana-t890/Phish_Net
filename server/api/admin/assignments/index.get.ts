import { prisma } from '../../../utils/prisma'
import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const assignments = await prisma.trainingAssignment.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, name: true, email: true } },
      assigner: { select: { id: true, name: true } },
      template: { select: { id: true, rawSubject: true, usageMode: true, status: true } },
      sessions: {
        select: {
          id: true,
          status: true,
          score: true,
          attemptNumber: true,
          completedAt: true,
        },
        orderBy: { attemptNumber: 'desc' },
        take: 1,
      },
    },
  })

  return assignments.map((a) => ({
    id: a.id,
    deadline: a.deadline.toISOString(),
    isPractice: a.isPractice,
    template: a.template,
    createdAt: a.createdAt.toISOString(),
    user: a.user,
    assignedBy: a.assigner,
    latestSession: a.sessions[0] ?? null,
  }))
})
