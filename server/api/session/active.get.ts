import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const now = new Date()

  const [assignment, inProgressSession] = await Promise.all([
    prisma.trainingAssignment.findFirst({
      where: {
        userId: user.id,
        isPractice: false,
        deadline: { gte: now },
      },
      orderBy: { deadline: 'asc' },
      select: { id: true, deadline: true },
    }),
    prisma.session.findFirst({
      where: { userId: user.id, status: 'IN_PROGRESS' },
      orderBy: { startedAt: 'desc' },
      select: { id: true, assignmentId: true },
    }),
  ])

  return {
    assignment: assignment
      ? { id: assignment.id, deadline: assignment.deadline.toISOString() }
      : null,
    inProgressSession,
  }
})
