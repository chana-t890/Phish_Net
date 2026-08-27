export type ValidationPassPath = "five_words" | "keyword" | "question_mark";
export type ValidationErrorCode = "empty" | "insufficient_reasoning";

export interface FirstResponseValidationConfig {
  minWordsLong: number;       // default 5
  minWordsSignal: number;     // default 2
  keywords: string[];         // configurable
}

export interface FirstResponseValidationResult {
  isValid: boolean;
  trimmed: string;
  wordCount: number;
  hasQuestionMark: boolean;
  matchedKeywords: string[];
  passPath?: ValidationPassPath;
  errorCode?: ValidationErrorCode;
  errorMessage?: string;
}

export const DEFAULT_REASONING_KEYWORDS: string[] = [
  "typo", "typos", "grammar",
  "domain", "email", "sender",
  "url", "link",
  "attachment",
  "urgent", "pressure",
  "request", "unexpected",
  "login", "password", "credential",
  "mismatch", "mismatched",
  "scam", "phishing", "fake", "spoofed", "suspiciously",
  "weird", "weirdly", "strange", "strangely", "odd", "oddly",
  "unusual", "unusually", "off", "tone", "wording",
  "safe", "legitimate"
];

export const DEFAULT_VALIDATION_CONFIG: FirstResponseValidationConfig = {
  minWordsLong: 5,
  minWordsSignal: 2,
  keywords: [...DEFAULT_REASONING_KEYWORDS]
};

function mergeConfig(
  overrides?: Partial<FirstResponseValidationConfig>
): FirstResponseValidationConfig {
  return {
    minWordsLong: overrides?.minWordsLong ?? DEFAULT_VALIDATION_CONFIG.minWordsLong,
    minWordsSignal: overrides?.minWordsSignal ?? DEFAULT_VALIDATION_CONFIG.minWordsSignal,
    keywords: overrides?.keywords?.length
      ? [...overrides.keywords]
      : [...DEFAULT_VALIDATION_CONFIG.keywords]
  };
}

function tokenizeWords(input: string): string[] {
  return input.match(/[A-Za-z0-9]+(?:['’][A-Za-z0-9]+)*/g) ?? [];
}

function normalizeForKeywordMatching(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findMatchedKeywords(input: string, keywords: string[]): string[] {
  if (!input || keywords.length === 0) return [];

  const normalizedText = normalizeForKeywordMatching(input);
  const tokenSet = new Set(tokenizeWords(normalizedText).map(w => w.toLowerCase()));
  const matches = new Set<string>();

  for (const raw of keywords) {
    const keyword = raw.trim().toLowerCase();
    if (!keyword) continue;

    if (keyword.includes(" ")) {
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const phraseRegex = new RegExp("(^|\\s)" + escaped + "(\\s|$)", "i");
      if (phraseRegex.test(normalizedText)) matches.add(raw);
    } else if (tokenSet.has(keyword)) {
      matches.add(raw);
    }
  }

  return [...matches];
}

export function validateFirstMandatoryResponse(
  input: string,
  config?: Partial<FirstResponseValidationConfig>
): FirstResponseValidationResult {
  const resolved = mergeConfig(config);
  const trimmed = input.trim();

  if (!trimmed) {
    return {
      isValid: false,
      trimmed,
      wordCount: 0,
      hasQuestionMark: false,
      matchedKeywords: [],
      errorCode: "empty",
      errorMessage: "Please enter an explanation before continuing."
    };
  }

  const wordCount = tokenizeWords(trimmed).length;
  const hasQuestionMark = trimmed.includes("?");

  // Rule 1: 5+ words
  if (wordCount >= resolved.minWordsLong) {
    return {
      isValid: true,
      trimmed,
      wordCount,
      hasQuestionMark,
      matchedKeywords: [],
      passPath: "five_words"
    };
  }

  // Rule 2 or 3 require at least 2 words
  if (wordCount >= resolved.minWordsSignal) {
    const matchedKeywords = findMatchedKeywords(trimmed, resolved.keywords);

    // Rule 2: 2+ words + keyword
    if (matchedKeywords.length > 0) {
      return {
        isValid: true,
        trimmed,
        wordCount,
        hasQuestionMark,
        matchedKeywords,
        passPath: "keyword"
      };
    }

    // Rule 3: 2+ words + question mark
    if (hasQuestionMark) {
      return {
        isValid: true,
        trimmed,
        wordCount,
        hasQuestionMark,
        matchedKeywords: [],
        passPath: "question_mark"
      };
    }
  }

  return {
    isValid: false,
    trimmed,
    wordCount,
    hasQuestionMark,
    matchedKeywords: [],
    errorCode: "insufficient_reasoning",
    errorMessage:
      "Please provide a bit more reasoning (for example: key clues, a question, or a longer explanation)."
  };
}

export function createFirstMandatoryResponseValidator(
  config?: Partial<FirstResponseValidationConfig>
) {
  const resolved = mergeConfig(config);
  return (input: string) => validateFirstMandatoryResponse(input, resolved);
}