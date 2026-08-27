import { prisma } from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

type SaveFlagBody = {
  sessionEmailId?: string
  flagCategory?: string
  flaggedText?: string
  startOffset?: number | null
  endOffset?: number | null
  zoneType?: string | null
}

const FLAG_CATEGORIES = new Set([
  'suspicious_url',
  'urgency_language',
  'grammar_error',
  'fake_sender',
  'info_request',
  'money_request',
  'too_good_to_be_true',
  'threatening_language',
  'suspicious_attachment',
])

const ZONE_TYPES = new Set(['sender', 'subject', 'url', 'attachment'])

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = (await readBody(event)) as SaveFlagBody

  if (!body?.sessionEmailId || typeof body.sessionEmailId !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'sessionEmailId is required' })
  }
  if (!body.flagCategory || typeof body.flagCategory !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'flagCategory is required' })
  }
  if (!body.flaggedText || typeof body.flaggedText !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'flaggedText is required' })
  }
  if (!FLAG_CATEGORIES.has(body.flagCategory)) {
    throw createError({ statusCode: 400, statusMessage: 'flagCategory is invalid' })
  }
  if (body.zoneType !== null && body.zoneType !== undefined && !ZONE_TYPES.has(body.zoneType)) {
    throw createError({ statusCode: 400, statusMessage: 'zoneType is invalid' })
  }

  const sessionEmail = await prisma.sessionEmail.findUnique({
    where: { id: body.sessionEmailId },
    include: {
      session: true,
      generatedEmail: { select: { body: true } },
    },
  })

  if (!sessionEmail) {
    throw createError({ statusCode: 404, statusMessage: 'Session email not found' })
  }
  if (sessionEmail.session.userId !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  if (sessionEmail.submitted) {
    throw createError({ statusCode: 400, statusMessage: 'Cannot add flags to a submitted email' })
  }

  const hasStartOffset = body.startOffset !== null && body.startOffset !== undefined
  const hasEndOffset = body.endOffset !== null && body.endOffset !== undefined
  if (hasStartOffset !== hasEndOffset) {
    throw createError({ statusCode: 400, statusMessage: 'startOffset and endOffset must be provided together' })
  }

  if (hasStartOffset && hasEndOffset) {
    if (body.zoneType !== null && body.zoneType !== undefined) {
      throw createError({ statusCode: 400, statusMessage: 'Zone flags cannot include body offsets' })
    }

    const startOffset = body.startOffset!
    const endOffset = body.endOffset!
    const bodyLength = sessionEmail.generatedEmail.body.length

    if (!Number.isInteger(startOffset) || !Number.isInteger(endOffset)) {
      throw createError({ statusCode: 400, statusMessage: 'Flag offsets must be whole numbers' })
    }
    if (startOffset < 0 || endOffset <= startOffset || endOffset > bodyLength) {
      throw createError({ statusCode: 400, statusMessage: 'Flag offsets must identify a range within the email body' })
    }
    if (body.flaggedText !== sessionEmail.generatedEmail.body.slice(startOffset, endOffset)) {
      throw createError({ statusCode: 400, statusMessage: 'flaggedText must match the selected email body range' })
    }
  } else if (body.zoneType === null || body.zoneType === undefined) {
    throw createError({ statusCode: 400, statusMessage: 'Body flags must include startOffset and endOffset' })
  }

  const flag = await prisma.userFlag.create({
    data: {
      sessionEmailId: body.sessionEmailId,
      flagCategory: body.flagCategory,
      flaggedText: body.flaggedText,
      startOffset: body.startOffset ?? null,
      endOffset: body.endOffset ?? null,
      zoneType: body.zoneType ?? null,
    },
  })

  return {
    id: flag.id,
    sessionEmailId: flag.sessionEmailId,
    flagCategory: flag.flagCategory,
    flaggedText: flag.flaggedText,
    startOffset: flag.startOffset,
    endOffset: flag.endOffset,
    zoneType: flag.zoneType,
  }
})
