import { requireAdmin } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Template id is required' })
  }

  const template = await prisma.emailTemplate.findUnique({
    where: { id },
    include: {
      expectedFlags: true,
      createdBy: { select: { id: true, name: true, email: true } },
      reviewedBy: { select: { id: true, name: true, email: true } },
    },
  })

  if (!template) {
    throw createError({ statusCode: 404, statusMessage: 'Template not found' })
  }

  return template
})
