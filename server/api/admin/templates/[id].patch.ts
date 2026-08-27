import { createHash } from 'node:crypto'
import { requireAdmin } from '../../../utils/auth'
import { prisma } from '../../../utils/prisma'
import {
  isTemplateStatus,
  isTemplateUseMode,
  validateTemplateFlags,
  validateTemplateResources,
} from '../../../utils/emailTemplates'
import type { TemplateStatus, TemplateUseMode } from '../../../../prisma/generated/prisma/enums'

type PatchTemplateBody = {
  category?: string
  rawSubject?: string
  rawBody?: string
  rawSender?: string
  isPhishing?: boolean
  usageMode?: string
  status?: string
  expectedFlags?: unknown
  attachments?: unknown
  urls?: unknown
  adminNotes?: string | null
}

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Template id is required' })
  }

  const current = await prisma.emailTemplate.findUnique({
    where: { id },
    include: { expectedFlags: true },
  })
  if (!current) {
    throw createError({ statusCode: 404, statusMessage: 'Template not found' })
  }

  const body = (await readBody(event)) as PatchTemplateBody
  const category = body.category === undefined ? current.category : body.category.trim()
  const rawSubject = body.rawSubject === undefined ? current.rawSubject : body.rawSubject.trim()
  const rawBody = body.rawBody === undefined ? current.rawBody : body.rawBody
  const rawSender = body.rawSender === undefined ? current.rawSender : body.rawSender.trim()
  const isPhishing = body.isPhishing === undefined ? current.isPhishing : body.isPhishing
  const usageMode = body.usageMode === undefined ? current.usageMode : body.usageMode
  const status = body.status === undefined ? current.status : body.status

  if (!category || !rawSubject || !rawBody.trim() || !rawSender) {
    throw createError({ statusCode: 400, statusMessage: 'category, subject, body, and sender are required' })
  }
  if (typeof isPhishing !== 'boolean') {
    throw createError({ statusCode: 400, statusMessage: 'isPhishing must be a boolean' })
  }
  if (!isTemplateUseMode(usageMode)) {
    throw createError({ statusCode: 400, statusMessage: 'usageMode must be INSPIRATION or DIRECT' })
  }
  if (!isTemplateStatus(status)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid template status' })
  }

  const expectedFlags = body.expectedFlags === undefined
    ? current.expectedFlags.map((flag) => ({
        text: flag.text,
        startOffset: flag.startOffset,
        endOffset: flag.endOffset,
        category: flag.category,
        zone: flag.zone,
      }))
    : validateTemplateFlags(body.expectedFlags, rawBody)
  const resources = validateTemplateResources(
    body.attachments === undefined ? current.attachments : body.attachments,
    body.urls === undefined ? current.urls : body.urls,
  )

  if (status === 'APPROVED' && usageMode === 'DIRECT' && isPhishing && expectedFlags.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'A phishing direct template must have at least one expected flag before approval',
    })
  }

  const reviewed = status === 'APPROVED' || status === 'REJECTED'
  return prisma.$transaction(async (tx) => {
    await tx.templateExpectedFlag.deleteMany({ where: { emailTemplateId: id } })
    return tx.emailTemplate.update({
      where: { id },
      data: {
        category,
        rawSubject,
        rawBody,
        rawSender,
        isPhishing,
        attachments: resources.attachments,
        urls: resources.urls,
        usageMode: usageMode as TemplateUseMode,
        status: status as TemplateStatus,
        bodyHash: createHash('sha256').update(rawBody).digest('hex'),
        adminNotes: body.adminNotes === undefined ? current.adminNotes : body.adminNotes,
        reviewedById: reviewed ? admin.id : null,
        reviewedAt: reviewed ? new Date() : null,
        expectedFlags: { create: expectedFlags },
      },
      include: {
        expectedFlags: true,
        createdBy: { select: { id: true, name: true, email: true } },
        reviewedBy: { select: { id: true, name: true, email: true } },
      },
    })
  })
})
