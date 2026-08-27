import { prisma } from '../../../utils/prisma'
import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const flagId = getRouterParam(event, 'id')

  if (!flagId || typeof flagId !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Flag id is required' })
  }

  const flag = await prisma.userFlag.findUnique({
    where: { id: flagId },
    include: { sessionEmail: { include: { session: true } } },
  })

  if (!flag) {
    throw createError({ statusCode: 404, statusMessage: 'Flag not found' })
  }
  if (flag.sessionEmail.session.userId !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  if (flag.sessionEmail.submitted) {
    throw createError({ statusCode: 400, statusMessage: 'Cannot remove flags from a submitted email' })
  }

  await prisma.userFlag.delete({ where: { id: flagId } })

  setResponseStatus(event, 204)
  return null
})
