import { createHash } from 'node:crypto'
import { requireAdmin } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'
import { isTemplateUseMode, validateTemplateFlags, validateTemplateResources } from '../../../utils/emailTemplates'
import type { TemplateUseMode } from '../../../../prisma/generated/prisma/enums'

type CreateTemplateBody = {
  category?: string
  rawSubject?: string
  rawBody?: string
  rawSender?: string
  isPhishing?: boolean
  usageMode?: string
  expectedFlags?: unknown
  attachments?: unknown
  urls?: unknown
  adminNotes?: string | null
}

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event)
  const body = (await readBody(event)) as CreateTemplateBody
  const category = typeof body.category === 'string' ? body.category.trim() : ''
  const rawSubject = typeof body.rawSubject === 'string' ? body.rawSubject.trim() : ''
  const rawBody = typeof body.rawBody === 'string' ? body.rawBody : ''
  const rawSender = typeof body.rawSender === 'string' ? body.rawSender.trim() : ''
  const usageMode = body.usageMode ?? 'INSPIRATION'

  if (!category || !rawSubject || !rawBody.trim() || !rawSender) {
    throw createError({ statusCode: 400, statusMessage: 'category, subject, body, and sender are required' })
  }
  if (typeof body.isPhishing !== 'boolean') {
    throw createError({ statusCode: 400, statusMessage: 'isPhishing must be a boolean' })
  }
  if (!isTemplateUseMode(usageMode)) {
    throw createError({ statusCode: 400, statusMessage: 'usageMode must be INSPIRATION or DIRECT' })
  }

  const expectedFlags = validateTemplateFlags(body.expectedFlags ?? [], rawBody)
  const resources = validateTemplateResources(body.attachments, body.urls)
  const template = await prisma.emailTemplate.create({
    data: {
      sourceDataset: 'admin',
      category,
      rawSubject,
      rawBody,
      rawSender,
      isPhishing: body.isPhishing,
      attachments: resources.attachments,
      urls: resources.urls,
      bodyHash: createHash('sha256').update(rawBody).digest('hex'),
      usageMode: usageMode as TemplateUseMode,
      status: 'DRAFT',
      createdById: admin.id,
      adminNotes: body.adminNotes ?? null,
      expectedFlags: { create: expectedFlags },
    },
    include: { expectedFlags: true },
  })

  return template
})
