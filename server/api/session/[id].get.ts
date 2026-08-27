import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'
import { shapeSession, SESSION_INCLUDE } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id = getRouterParam(event, 'id')

  if (!id || typeof id !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Session id is required' })
  }

  const session = await prisma.session.findUnique({
    where: { id },
    include: SESSION_INCLUDE,
  })

  if (!session) {
    throw createError({ statusCode: 404, statusMessage: 'Session not found' })
  }

  if (session.userId !== user.id && user.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  return shapeSession(session as any)
})
