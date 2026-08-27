import { prisma } from '../../../utils/prisma'
import { requireAdmin } from '../../../utils/auth'

type PatchUserBody = {
  role?: 'ADMIN' | 'LEARNER'
  deactivatedAt?: string | null
}

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')

  if (!id || typeof id !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'User id is required' })
  }

  const body = (await readBody(event)) as PatchUserBody

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(body.role !== undefined && { role: body.role }),
      ...(body.deactivatedAt !== undefined && {
        deactivatedAt: body.deactivatedAt ? new Date(body.deactivatedAt) : null,
      }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      deactivatedAt: true,
      updatedAt: true,
    },
  })

  return updated
})
