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

export type UserFlagLocal = {
  id: string
  sessionEmailId: string
  flagCategory: FlagCategory
  flaggedText: string
  startOffset: number | null
  endOffset: number | null
  zoneType: ZoneType | null
}

export type ExpectedFlag = {
  id: string
  text: string
  startOffset: number
  endOffset: number
  category: FlagCategory
  zone: ZoneType | null
}

export type EmailAttachment = {
  filename: string
  suspicious: boolean
}

export type EmailUrl = {
  displayText: string
  href: string
  suspicious: boolean
}

export type GeneratedEmail = {
  id: string
  subject: string
  body: string
  sender: string
  isPhishing: boolean
  attachments: EmailAttachment[]
  urls: EmailUrl[]
}

export type SessionEmail = {
  id: string
  sessionId: string
  generatedEmailId: string
  submitted: boolean
  markedLegitimate: boolean | null
  userPassed: boolean | null
  reasoningAccepted: boolean
  submittedAt: string | null
  generatedEmail: GeneratedEmail
  userFlags: UserFlagLocal[]
  revealedFlags?: ExpectedFlag[] // populated by server after submission only
  chatMessages?: AiChatMessage[]
}

export type Session = {
  id: string
  userId: string
  assignmentId: string | null
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
  score: number | null
  attemptNumber: number
  isPractice: boolean
  startedAt: string
  completedAt: string | null
  sessionEmails: SessionEmail[]
}

export type ChatRole = 'user' | 'assistant'

export type AiChatMessage = {
  id: string
  sessionEmailId: string
  role: ChatRole
  content: string
  createdAt: string
}
