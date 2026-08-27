const TEMPLATE_STATUSES = ['DRAFT', 'APPROVED', 'REJECTED', 'ARCHIVED'] as const
const TEMPLATE_USE_MODES = ['INSPIRATION', 'DIRECT'] as const
const FLAG_CATEGORIES = [
  'suspicious_url',
  'urgency_language',
  'grammar_error',
  'fake_sender',
  'info_request',
  'money_request',
  'too_good_to_be_true',
  'threatening_language',
  'suspicious_attachment',
] as const
const ZONE_TYPES = ['sender', 'subject', 'url', 'attachment'] as const

type TemplateFlagInput = {
  text?: unknown
  startOffset?: unknown
  endOffset?: unknown
  category?: unknown
  zone?: unknown
}

export type NormalizedGeneratedFlag = {
  text: string
  startOffset: number
  endOffset: number
  category: string
  zone: (typeof ZONE_TYPES)[number] | null
}

export type TemplateAttachment = {
  filename: string
  suspicious: boolean
}

export type TemplateUrl = {
  displayText: string
  href: string
  suspicious: boolean
}

export function isTemplateStatus(value: unknown): value is (typeof TEMPLATE_STATUSES)[number] {
  return typeof value === 'string' && TEMPLATE_STATUSES.includes(value as (typeof TEMPLATE_STATUSES)[number])
}

export function isTemplateUseMode(value: unknown): value is (typeof TEMPLATE_USE_MODES)[number] {
  return typeof value === 'string' && TEMPLATE_USE_MODES.includes(value as (typeof TEMPLATE_USE_MODES)[number])
}

export function validateTemplateResources(attachments: unknown, urls: unknown): {
  attachments: TemplateAttachment[]
  urls: TemplateUrl[]
} {
  if (attachments !== undefined && attachments !== null && !Array.isArray(attachments)) {
    throw createError({ statusCode: 400, statusMessage: 'attachments must be an array' })
  }
  if (urls !== undefined && urls !== null && !Array.isArray(urls)) {
    throw createError({ statusCode: 400, statusMessage: 'urls must be an array' })
  }

  const normalizedAttachments = (attachments ?? []).map((value, index) => {
    const item = value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null
    if (!item || typeof item.filename !== 'string' || !item.filename.trim() || typeof item.suspicious !== 'boolean') {
      throw createError({ statusCode: 400, statusMessage: `Invalid attachment at index ${index}` })
    }
    return { filename: item.filename.trim(), suspicious: item.suspicious }
  })
  const normalizedUrls = (urls ?? []).map((value, index) => {
    const item = value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null
    if (!item || typeof item.displayText !== 'string' || !item.displayText.trim() || typeof item.href !== 'string' || !item.href.trim() || typeof item.suspicious !== 'boolean') {
      throw createError({ statusCode: 400, statusMessage: `Invalid URL at index ${index}` })
    }
    try {
      const parsed = new URL(item.href)
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Unsupported protocol')
    } catch {
      throw createError({ statusCode: 400, statusMessage: `URL must be a valid http or https URL at index ${index}` })
    }
    return { displayText: item.displayText.trim(), href: item.href.trim(), suspicious: item.suspicious }
  })

  return { attachments: normalizedAttachments, urls: normalizedUrls }
}

export function validateTemplateFlags(flags: unknown, body: string) {
  if (!Array.isArray(flags)) {
    throw createError({ statusCode: 400, statusMessage: 'expectedFlags must be an array' })
  }

  return flags.map((rawFlag, index) => {
    const flag = rawFlag as TemplateFlagInput
    const text = typeof flag.text === 'string' ? flag.text.trim() : ''
    const category = typeof flag.category === 'string' ? flag.category : ''
    const zone = flag.zone === null || flag.zone === undefined ? null : flag.zone
    const startOffset = flag.startOffset
    const endOffset = flag.endOffset

    if (!text || !FLAG_CATEGORIES.includes(category as (typeof FLAG_CATEGORIES)[number])) {
      throw createError({ statusCode: 400, statusMessage: `Invalid expected flag at index ${index}` })
    }
    if (zone !== null && !ZONE_TYPES.includes(zone as (typeof ZONE_TYPES)[number])) {
      throw createError({ statusCode: 400, statusMessage: `Invalid expected flag zone at index ${index}` })
    }
    const normalizedZone = zone as (typeof ZONE_TYPES)[number] | null
    if (!Number.isInteger(startOffset) || !Number.isInteger(endOffset)) {
      throw createError({ statusCode: 400, statusMessage: `Expected flag offsets must be whole numbers at index ${index}` })
    }

    const start = startOffset as number
    const end = endOffset as number

    if (normalizedZone !== null) {
      if (start !== 0 || end !== 0) {
        throw createError({ statusCode: 400, statusMessage: `Zone expected flags must use offsets 0 and 0 at index ${index}` })
      }
    } else {
      if (start < 0 || end <= start || end > body.length) {
        throw createError({ statusCode: 400, statusMessage: `Expected flag range is outside the email body at index ${index}` })
      }
      if (body.slice(start, end) !== text) {
        throw createError({ statusCode: 400, statusMessage: `Expected flag text does not match its body range at index ${index}` })
      }
    }

    return { text, startOffset: start, endOffset: end, category, zone: normalizedZone }
  })
}

export function normalizeGeneratedFlags(flags: unknown, body: string): NormalizedGeneratedFlag[] {
  if (!Array.isArray(flags)) return []

  return flags.flatMap((rawFlag): NormalizedGeneratedFlag[] => {
    if (!rawFlag || typeof rawFlag !== 'object' || Array.isArray(rawFlag)) return []

    const flag = rawFlag as TemplateFlagInput
    const text = typeof flag.text === 'string' ? flag.text.trim() : ''
    const category = typeof flag.category === 'string' ? flag.category : ''
    const zone = flag.zone === null || flag.zone === undefined ? null : flag.zone

    if (!text || !FLAG_CATEGORIES.includes(category as (typeof FLAG_CATEGORIES)[number])) return []
    if (zone !== null && !ZONE_TYPES.includes(zone as (typeof ZONE_TYPES)[number])) return []

    const normalizedZone = zone as (typeof ZONE_TYPES)[number] | null
    if (normalizedZone !== null) {
      return [{ text, startOffset: 0, endOffset: 0, category, zone: normalizedZone }]
    }

    const suggestedStart = Number.isInteger(flag.startOffset) ? flag.startOffset as number : null
    const matches: number[] = []
    let searchStart = 0
    while (searchStart <= body.length - text.length) {
      const matchStart = body.indexOf(text, searchStart)
      if (matchStart === -1) break
      matches.push(matchStart)
      searchStart = matchStart + text.length
    }
    if (matches.length === 0) return []

    const startOffset = suggestedStart === null
      ? matches[0]!
      : matches.reduce((closest, match) => (
        Math.abs(match - suggestedStart) < Math.abs(closest - suggestedStart) ? match : closest
      ), matches[0]!)

    return [{
      text,
      startOffset,
      endOffset: startOffset + text.length,
      category,
      zone: null,
    }]
  })
}
