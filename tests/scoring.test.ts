import { describe, expect, it } from 'vitest'
import {
  scoreEmail,
  scoreSession,
  type ExpectedFlagInput,
  type UserFlagInput,
} from '../server/utils/scoring'

const expectedBodyFlag: ExpectedFlagInput = {
  id: 'expected-1',
  category: 'urgency_language',
  zone: null,
  startOffset: 0,
  endOffset: 6,
  text: 'Urgent',
}

const matchingUserFlag: UserFlagInput = {
  id: 'user-1',
  flagCategory: 'urgency_language',
  zoneType: null,
  startOffset: 0,
  endOffset: 6,
  flaggedText: 'Urgent',
}

describe('scoreEmail', () => {
  it('does not score legitimate emails', () => {
    const result = scoreEmail('email-1', false, [], [matchingUserFlag])

    expect(result.isScored).toBe(false)
    expect(result.excludedReason).toBe('NOT_PHISHING')
    expect(result.passed).toBeNull()
  })

  it('matches body ranges and reports false positives', () => {
    const result = scoreEmail('email-1', true, [expectedBodyFlag], [
      matchingUserFlag,
      { ...matchingUserFlag, id: 'user-2', startOffset: 20, endOffset: 27, flaggedText: 'payment' },
    ])

    expect(result.passed).toBe(true)
    expect(result.correctHits).toBe(1)
    expect(result.missedFlags).toBe(0)
    expect(result.falsePositives).toBe(1)
    expect(result.falsePositiveUserFlagIds).toEqual(['user-2'])
  })

  it('supports predefined zone matches without body offsets', () => {
    const expected: ExpectedFlagInput = {
      id: 'expected-url',
      category: 'suspicious_url',
      zone: 'url',
      startOffset: 0,
      endOffset: 0,
    }
    const user: UserFlagInput = {
      id: 'user-url',
      flagCategory: 'suspicious_url',
      zoneType: 'url',
      startOffset: null,
      endOffset: null,
    }

    const result = scoreEmail('email-1', true, [expected], [user])

    expect(result.matches[0]).toMatchObject({ isZoneMatch: true, categoryMatch: true })
    expect(result.hitRate).toBe(1)
  })
})

describe('scoreSession', () => {
  it('averages scored phishing email credit and excludes legitimate email', () => {
    const result = scoreSession([
      { sessionEmailId: 'phishing-1', isPhishing: true, expectedFlags: [expectedBodyFlag], userFlags: [matchingUserFlag] },
      { sessionEmailId: 'phishing-2', isPhishing: true, expectedFlags: [expectedBodyFlag], userFlags: [] },
      { sessionEmailId: 'legitimate-1', isPhishing: false, expectedFlags: [], userFlags: [] },
    ])

    expect(result.sessionScore).toBe(0.5)
    expect(result.totalPhishingEmailsScored).toBe(2)
    expect(result.phishingEmailsPassed).toBe(1)
    expect(result.passedThreshold).toBe(false)
    expect(result.emailResults[2]?.excludedReason).toBe('NOT_PHISHING')
  })
})