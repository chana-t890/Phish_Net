type DbExpectedFlag = {
  id: string
  text: string
  startOffset: number
  endOffset: number
  category: string
  zone: string | null
}

type DbUserFlag = {
  id: string
  sessionEmailId: string
  flagCategory: string
  flaggedText: string
  startOffset: number | null
  endOffset: number | null
  zoneType: string | null
}

type DbGeneratedEmail = {
  id: string
  subject: string
  body: string
  sender: string
  isPhishing: boolean
  attachments: unknown
  urls: unknown
  expectedFlags: DbExpectedFlag[]
}

type DbAiChatMessage = {
  id: string
  sessionEmailId: string
  isChatResponse: boolean
  content: string
  createdAt: Date
}

type DbSessionEmail = {
  id: string
  sessionId: string
  generatedEmailId: string
  submitted: boolean
  markedLegitimate: boolean | null
  userPassed: boolean | null
  reasoningAccepted: boolean
  submittedAt: Date | null
  generatedEmail: DbGeneratedEmail
  userFlags: DbUserFlag[]
  aiChatMessages: DbAiChatMessage[]
}

export type DbSession = {
  id: string
  userId: string
  assignmentId: string | null
  status: string
  score: number | null
  attemptNumber: number
  isPractice: boolean
  startedAt: Date
  completedAt: Date | null
  sessionEmails: DbSessionEmail[]
}

/**
 * Shapes a Prisma session result into the client-facing Session type.
 * - expectedFlags are stripped from unsubmitted emails
 * - revealedFlags (expectedFlags) are included for submitted emails only
 */
export function shapeSession(session: DbSession) {
  return {
    id: session.id,
    userId: session.userId,
    assignmentId: session.assignmentId,
    status: session.status as 'IN_PROGRESS' | 'COMPLETED' | 'FAILED',
    score: session.score,
    attemptNumber: session.attemptNumber,
    isPractice: session.isPractice,
    startedAt: session.startedAt.toISOString(),
    completedAt: session.completedAt?.toISOString() ?? null,
    sessionEmails: session.sessionEmails.map((se) => {
      const base = {
        id: se.id,
        sessionId: se.sessionId,
        generatedEmailId: se.generatedEmailId,
        submitted: se.submitted,
        markedLegitimate: se.markedLegitimate,
        userPassed: se.userPassed,
        reasoningAccepted: se.reasoningAccepted,
        submittedAt: se.submittedAt?.toISOString() ?? null,
        generatedEmail: {
          id: se.generatedEmail.id,
          subject: se.generatedEmail.subject,
          body: se.generatedEmail.body,
          sender: se.generatedEmail.sender,
          isPhishing: se.generatedEmail.isPhishing,
          attachments: (se.generatedEmail.attachments as any[]) ?? [],
          urls: (se.generatedEmail.urls as any[]) ?? [],
        },
        userFlags: se.userFlags.map((f) => ({
          id: f.id,
          sessionEmailId: f.sessionEmailId,
          flagCategory: f.flagCategory,
          flaggedText: f.flaggedText,
          startOffset: f.startOffset,
          endOffset: f.endOffset,
          zoneType: f.zoneType,
        })),
        chatMessages: se.aiChatMessages.map((m) => ({
          id: m.id,
          sessionEmailId: m.sessionEmailId,
          role: m.isChatResponse ? 'assistant' : 'user',
          content: m.content,
          createdAt: m.createdAt.toISOString(),
        })),
      }

      if (se.submitted) {
        return {
          ...base,
          revealedFlags: se.generatedEmail.expectedFlags.map((f) => ({
            id: f.id,
            text: f.text,
            startOffset: f.startOffset,
            endOffset: f.endOffset,
            category: f.category,
            zone: f.zone,
          })),
        }
      }

      return base
    }),
  }
}

/** Standard Prisma include clause for fetching a full session */
export const SESSION_INCLUDE = {
  sessionEmails: {
    include: {
      generatedEmail: {
        include: {
          expectedFlags: true,
        },
      },
      userFlags: true,
      aiChatMessages: { orderBy: { createdAt: 'asc' } },
    },
  },
} as const
