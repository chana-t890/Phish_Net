import { describe, expect, it } from 'vitest'
import { normalizeGeneratedFlags } from '../server/utils/emailTemplates'
import { validateFirstMandatoryResponse } from '../server/utils/reqResponseValidator'

describe('normalizeGeneratedFlags', () => {
  it('repairs stale model offsets using exact body text', () => {
    const body = 'Please review the urgent payment request before noon.'
    const result = normalizeGeneratedFlags([
      {
        text: 'urgent payment request',
        startOffset: 0,
        endOffset: 21,
        category: 'urgency_language',
        zone: null,
      },
    ], body)

    expect(result).toEqual([{
      text: 'urgent payment request',
      startOffset: 18,
      endOffset: 41,
      category: 'urgency_language',
      zone: null,
    }])
  })

  it('uses the model offset to choose the nearest repeated phrase', () => {
    const body = 'Urgent action is needed. Ignore the first urgent notice.'
    const result = normalizeGeneratedFlags([
      {
        text: 'urgent',
        startOffset: 41,
        endOffset: 47,
        category: 'urgency_language',
        zone: null,
      },
    ], body)

    expect(result[0]).toMatchObject({ text: 'urgent', startOffset: 41, endOffset: 47 })
  })

  it('preserves valid zones and drops unusable body flags', () => {
    const result = normalizeGeneratedFlags([
      { text: 'Security Team', startOffset: 12, endOffset: 25, category: 'fake_sender', zone: 'sender' },
      { text: 'missing text', startOffset: 0, endOffset: 12, category: 'urgency_language', zone: null },
    ], 'A safe body')

    expect(result).toEqual([{
      text: 'Security Team',
      startOffset: 0,
      endOffset: 0,
      category: 'fake_sender',
      zone: 'sender',
    }])
  })
})

describe('validateFirstMandatoryResponse', () => {
  it('rejects empty and insufficient responses', () => {
    expect(validateFirstMandatoryResponse('')).toMatchObject({ isValid: false, errorCode: 'empty' })
    expect(validateFirstMandatoryResponse('a')).toMatchObject({
      isValid: false,
      errorCode: 'insufficient_reasoning',
    })
  })

  it('accepts a longer explanation without a keyword', () => {
    const result = validateFirstMandatoryResponse('The message contains several unusual details')

    expect(result.isValid).toBe(true)
    expect(result.passPath).toBe('five_words')
  })

  it('accepts short responses with a security keyword or question', () => {
    expect(validateFirstMandatoryResponse('Suspicious link')).toMatchObject({
      isValid: true,
      passPath: 'keyword',
      matchedKeywords: ['link'],
    })
    expect(validateFirstMandatoryResponse('its written really suspiciously')).toMatchObject({
      isValid: true,
      passPath: 'keyword',
      matchedKeywords: ['suspiciously'],
    })
    expect(validateFirstMandatoryResponse('its written weirdly')).toMatchObject({
      isValid: true,
      passPath: 'keyword',
      matchedKeywords: ['weirdly'],
    })
    expect(validateFirstMandatoryResponse('Why this?')).toMatchObject({
      isValid: true,
      passPath: 'question_mark',
    })
  })
})