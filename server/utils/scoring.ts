export const EMAIL_PASS_THRESHOLD = 0.5
export const SESSION_PASS_THRESHOLD = 0.8
export const TEXT_OVERLAP_THRESHOLD = 0.3
export const MAX_SPAN_RATIO = 5
export const WRONG_CATEGORY_CREDIT = 0.5

export type FlagCategory =
  | 'suspicious_url'
  | 'urgency_language'
  | 'grammar_error'
  | 'fake_sender'
  | 'info_request'
  | 'money_request'
  | 'too_good_to_be_true'
  | 'threatening_language'
  | 'suspicious_attachment'

export type ZoneType = 'sender' | 'subject' | 'url' | 'attachment'

export type ExpectedFlagInput = {
  id: string
  category: FlagCategory | string
  zone: ZoneType | string | null
  startOffset: number | null
  endOffset: number | null
  text?: string
}

export type UserFlagInput = {
  id: string
  flagCategory: FlagCategory | string
  zoneType: ZoneType | string | null
  startOffset: number | null
  endOffset: number | null
  flaggedText?: string
}

export type MatchDetail = {
  expectedFlagId: string
  userFlagId: string
  overlapRatio: number
  isZoneMatch: boolean
  categoryMatch: boolean
  creditWeight: number
}

export type EmailScoreResult = {
  sessionEmailId: string
  isPhishing: boolean
  isScored: boolean
  excludedReason: 'NOT_PHISHING' | 'ZERO_EXPECTED_FLAGS' | null
  expectedCount: number
  userCount: number
  correctHits: number
  partialHits: number
  creditScore: number
  missedFlags: number
  falsePositives: number
  hitRate: number | null
  passed: boolean | null
  matches: MatchDetail[]
  missedExpectedFlagIds: string[]
  falsePositiveUserFlagIds: string[]
}

export type SessionScoreInput = {
  sessionEmailId: string
  isPhishing: boolean
  expectedFlags: ExpectedFlagInput[]
  userFlags: UserFlagInput[]
}

export type SessionScoreResult = {
  sessionScore: number | null
  passedThreshold: boolean
  phishingEmailsPassed: number
  totalPhishingEmailsScored: number
  excludedPhishingEmailIds: string[]
  emailResults: EmailScoreResult[]
}

type CandidateMatch = {
  expectedIndex: number
  userIndex: number
  overlapRatio: number
  isZoneMatch: boolean
  categoryMatch: boolean
  creditWeight: number
}

function toValidRange(startOffset: number | null, endOffset: number | null): { start: number; end: number } | null {
  if (startOffset === null || endOffset === null) {
    return null
  }

  if (!Number.isInteger(startOffset) || !Number.isInteger(endOffset)) {
    return null
  }

  if (endOffset <= startOffset) {
    return null
  }

  return { start: startOffset, end: endOffset }
}

function overlapLength(aStart: number, aEnd: number, bStart: number, bEnd: number): number {
  const start = Math.max(aStart, bStart)
  const end = Math.min(aEnd, bEnd)
  return Math.max(0, end - start)
}

function isExactCategoryMatch(expectedCategory: string, userCategory: string): boolean {
  return expectedCategory === userCategory
}

function buildCandidateMatch(
  expected: ExpectedFlagInput,
  user: UserFlagInput,
  expectedIndex: number,
  userIndex: number
): CandidateMatch | null {
  const categoryMatch = isExactCategoryMatch(expected.category, user.flagCategory)
  const creditWeight = categoryMatch ? 1 : WRONG_CATEGORY_CREDIT

  const expectedZone = expected.zone
  const userZone = user.zoneType

  if (expectedZone !== null || userZone !== null) {
    if (expectedZone === null || userZone === null) {
      return null
    }

    if (expectedZone !== userZone) {
      return null
    }

    return {
      expectedIndex,
      userIndex,
      overlapRatio: 1,
      isZoneMatch: true,
      categoryMatch,
      creditWeight,
    }
  }

  const expectedRange = toValidRange(expected.startOffset, expected.endOffset)
  const userRange = toValidRange(user.startOffset, user.endOffset)

  if (!expectedRange || !userRange) {
    return null
  }

  const overlap = overlapLength(expectedRange.start, expectedRange.end, userRange.start, userRange.end)
  if (overlap === 0) {
    return null
  }

  const expectedSpan = expectedRange.end - expectedRange.start
  const userSpan = userRange.end - userRange.start
  const smallerSpan = Math.min(expectedSpan, userSpan)
  if (smallerSpan <= 0) {
    return null
  }

  if (userSpan > expectedSpan * MAX_SPAN_RATIO) {
    return null
  }

  const overlapRatio = overlap / smallerSpan
  if (overlapRatio < TEXT_OVERLAP_THRESHOLD) {
    return null
  }

  return {
    expectedIndex,
    userIndex,
    overlapRatio,
    isZoneMatch: false,
    categoryMatch,
    creditWeight,
  }
}

function getCandidateMatches(expectedFlags: ExpectedFlagInput[], userFlags: UserFlagInput[]): CandidateMatch[] {
  const candidates: CandidateMatch[] = []

  for (let expectedIndex = 0; expectedIndex < expectedFlags.length; expectedIndex += 1) {
    const expected = expectedFlags[expectedIndex]
    if (!expected) {
      continue
    }

    for (let userIndex = 0; userIndex < userFlags.length; userIndex += 1) {
      const user = userFlags[userIndex]
      if (!user) {
        continue
      }

      const candidate = buildCandidateMatch(expected, user, expectedIndex, userIndex)
      if (candidate) {
        candidates.push(candidate)
      }
    }
  }

  candidates.sort((a, b) => {
    if (b.creditWeight !== a.creditWeight) {
      return b.creditWeight - a.creditWeight
    }

    if (b.overlapRatio !== a.overlapRatio) {
      return b.overlapRatio - a.overlapRatio
    }

    if (a.expectedIndex !== b.expectedIndex) {
      return a.expectedIndex - b.expectedIndex
    }

    return a.userIndex - b.userIndex
  })

  return candidates
}

function chooseBestOneToOneMatches(expectedFlags: ExpectedFlagInput[], userFlags: UserFlagInput[]): MatchDetail[] {
  const candidates = getCandidateMatches(expectedFlags, userFlags)
  const usedExpected = new Set<number>()
  const usedUser = new Set<number>()
  const matches: MatchDetail[] = []

  for (const candidate of candidates) {
    if (usedExpected.has(candidate.expectedIndex) || usedUser.has(candidate.userIndex)) {
      continue
    }

    const expected = expectedFlags[candidate.expectedIndex]
    const user = userFlags[candidate.userIndex]
    if (!expected || !user) {
      continue
    }

    usedExpected.add(candidate.expectedIndex)
    usedUser.add(candidate.userIndex)

    matches.push({
      expectedFlagId: expected.id,
      userFlagId: user.id,
      overlapRatio: candidate.overlapRatio,
      isZoneMatch: candidate.isZoneMatch,
      categoryMatch: candidate.categoryMatch,
      creditWeight: candidate.creditWeight,
    })
  }

  return matches
}

export function scoreEmail(
  sessionEmailId: string,
  isPhishing: boolean,
  expectedFlags: ExpectedFlagInput[],
  userFlags: UserFlagInput[]
): EmailScoreResult {
  if (!isPhishing) {
    return {
      sessionEmailId,
      isPhishing,
      isScored: false,
      excludedReason: 'NOT_PHISHING',
      expectedCount: expectedFlags.length,
      userCount: userFlags.length,
      correctHits: 0,
      partialHits: 0,
      creditScore: 0,
      missedFlags: 0,
      falsePositives: 0,
      hitRate: null,
      passed: null,
      matches: [],
      missedExpectedFlagIds: [],
      falsePositiveUserFlagIds: [],
    }
  }

  if (expectedFlags.length === 0) {
    return {
      sessionEmailId,
      isPhishing,
      isScored: false,
      excludedReason: 'ZERO_EXPECTED_FLAGS',
      expectedCount: 0,
      userCount: userFlags.length,
      correctHits: 0,
      partialHits: 0,
      creditScore: 0,
      missedFlags: 0,
      falsePositives: userFlags.length,
      hitRate: null,
      passed: null,
      matches: [],
      missedExpectedFlagIds: [],
      falsePositiveUserFlagIds: userFlags.map((flag) => flag.id),
    }
  }

  const matches = chooseBestOneToOneMatches(expectedFlags, userFlags)

  const matchedExpectedIds = new Set(matches.map((match) => match.expectedFlagId))
  const matchedUserIds = new Set(matches.map((match) => match.userFlagId))

  const missedExpectedFlagIds = expectedFlags
    .filter((expected) => !matchedExpectedIds.has(expected.id))
    .map((expected) => expected.id)

  const falsePositiveUserFlagIds = userFlags
    .filter((user) => !matchedUserIds.has(user.id))
    .map((user) => user.id)

  const correctHits = matches.filter((match) => match.categoryMatch).length
  const partialHits = matches.length - correctHits
  const creditScore = matches.reduce((sum, match) => sum + match.creditWeight, 0)
  const expectedCount = expectedFlags.length
  const hitRate = creditScore / expectedCount
  const passed = hitRate >= EMAIL_PASS_THRESHOLD

  return {
    sessionEmailId,
    isPhishing,
    isScored: true,
    excludedReason: null,
    expectedCount,
    userCount: userFlags.length,
    correctHits,
    partialHits,
    creditScore,
    missedFlags: missedExpectedFlagIds.length,
    falsePositives: falsePositiveUserFlagIds.length,
    hitRate,
    passed,
    matches,
    missedExpectedFlagIds,
    falsePositiveUserFlagIds,
  }
}

export function scoreSession(input: SessionScoreInput[]): SessionScoreResult {
  const emailResults = input.map((email) =>
    scoreEmail(email.sessionEmailId, email.isPhishing, email.expectedFlags, email.userFlags)
  )

  const scoredPhishingResults = emailResults.filter((result) => result.isPhishing && result.isScored)
  const phishingEmailsPassed = scoredPhishingResults.filter((result) => result.passed).length
  const totalPhishingEmailsScored = scoredPhishingResults.length

  const excludedPhishingEmailIds = emailResults
    .filter((result) => result.isPhishing && !result.isScored)
    .map((result) => result.sessionEmailId)

  // Average of per-email partial credit (hitRate) so a single miss doesn't flip a
  // whole email to zero and swing the session — smoother than counting passed emails.
  const sessionScore =
    totalPhishingEmailsScored > 0
      ? scoredPhishingResults.reduce((sum, result) => sum + (result.hitRate ?? 0), 0) /
        totalPhishingEmailsScored
      : null

  const passedThreshold = sessionScore !== null && sessionScore >= SESSION_PASS_THRESHOLD

  return {
    sessionScore,
    passedThreshold,
    phishingEmailsPassed,
    totalPhishingEmailsScored,
    excludedPhishingEmailIds,
    emailResults,
  }
}
