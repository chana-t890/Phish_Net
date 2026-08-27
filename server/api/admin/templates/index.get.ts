import { requireAdmin } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'
import type { TemplateStatus, TemplateUseMode } from '../../../../prisma/generated/prisma/enums'
import { isTemplateStatus, isTemplateUseMode } from '../../../utils/emailTemplates'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const query = getQuery(event)
  const status = typeof query.status === 'string' ? query.status : undefined
  const usageMode = typeof query.usageMode === 'string' ? query.usageMode : undefined
  const search = typeof query.search === 'string' ? query.search.trim() : ''

  if (status !== undefined && !isTemplateStatus(status)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid template status' })
  }
  if (usageMode !== undefined && !isTemplateUseMode(usageMode)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid template usage mode' })
  }

  const templates = await prisma.emailTemplate.findMany({
    where: {
      sourceDataset: 'admin',
      ...(status && { status: status as TemplateStatus }),
      ...(usageMode && { usageMode: usageMode as TemplateUseMode }),
      ...(search && {
        OR: [
          { rawSubject: { contains: search, mode: 'insensitive' } },
          { rawBody: { contains: search, mode: 'insensitive' } },
          { rawSender: { contains: search, mode: 'insensitive' } },
          { category: { contains: search, mode: 'insensitive' } },
        ],
      }),
    },
    orderBy: { updatedAt: 'desc' },
    take: 200,
    include: {
      expectedFlags: true,
      createdBy: { select: { id: true, name: true, email: true } },
      reviewedBy: { select: { id: true, name: true, email: true } },
    },
  })

  return templates
})
