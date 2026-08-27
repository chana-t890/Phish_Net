import type { Session, SessionEmail, UserFlagLocal, FlagCategory, ZoneType } from '~/types/session'

// useState keys are scoped to the Nuxt app instance — safe for SSR
export function useSession() {
  const session = useState<Session | null>('current-session', () => null)
  const activeEmailId = useState<string | null>('active-email-id', () => null)
  const readEmailIds = useState<string[]>('read-email-ids', () => [])
  const respondedEmailIds = useState<string[]>('responded-email-ids', () => [])
  const loading = useState<boolean>('session-loading', () => false)
  const error = useState<string | null>('session-error', () => null)

  const activeEmail = computed<SessionEmail | null>(() => {
    if (!session.value || !activeEmailId.value) return null
    return session.value.sessionEmails.find(e => e.id === activeEmailId.value) ?? null
  })

  const allSubmitted = computed<boolean>(() => {
    if (!session.value || session.value.sessionEmails.length === 0) return false
    return session.value.sessionEmails.every(e => e.submitted)
  })

  const allChatResponded = computed<boolean>(() => {
    if (!session.value) return false
    const submitted = session.value.sessionEmails.filter(e => e.submitted)
    if (submitted.length === 0) return false
    // An email counts as "responded" if the user replied this session
    // (respondedEmailIds, in-memory) OR the saved chat history already
    // contains a user message (survives a page reload / re-fetch).
    return submitted.every(
      e => respondedEmailIds.value.includes(e.id) || e.reasoningAccepted,
    )
  })

  function markChatResponded(emailId: string): void {
    if (!respondedEmailIds.value.includes(emailId)) {
      respondedEmailIds.value = [...respondedEmailIds.value, emailId]
    }
  }

  // An email is "done" only once its chat answer qualified: in-memory this
  // session (respondedEmailIds) or persisted (reasoningAccepted) after a reload.
  function isChatResponded(emailId: string): boolean {
    if (respondedEmailIds.value.includes(emailId)) return true
    const email = session.value?.sessionEmails.find(e => e.id === emailId)
    return email?.reasoningAccepted ?? false
  }

  const runningScore = computed<{ passed: number; total: number } | null>(() => {
    if (!session.value) return null
    const phishing = session.value.sessionEmails.filter(
      e => e.submitted && e.generatedEmail.isPhishing,
    )
    if (phishing.length === 0) return null
    return { passed: phishing.filter(e => e.userPassed).length, total: phishing.length }
  })

  async function startSession(isPractice = false, assignmentId?: string): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<Session>('/api/session/start', {
        method: 'POST',
        body: { isPractice, assignmentId },
      })
      session.value = data
      activeEmailId.value = data.sessionEmails[0]?.id ?? null
      readEmailIds.value = []
    } catch (e: any) {
      error.value = e.data?.message ?? 'Failed to start session'
    } finally {
      loading.value = false
    }
  }

  async function fetchSession(id: string): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<Session>(`/api/session/${id}`)
      session.value = data
      if (!activeEmailId.value && data.sessionEmails.length > 0) {
        activeEmailId.value = data.sessionEmails[0]?.id ?? null
      }
    } catch (e: any) {
      error.value = e.data?.message ?? 'Failed to load session'
    } finally {
      loading.value = false
    }
  }

  async function submitEmail(sessionEmailId: string, markedLegitimate: boolean): Promise<void> {
    const res = await $fetch<{
      sessionEmailId: string
      submitted: boolean
      submittedAt: string | null
      markedLegitimate: boolean
      userPassed: boolean | null
      revealedFlags: Array<{
        id: string
        text: string
        startOffset: number
        endOffset: number
        category: string
        zone: string | null
      }>
    }>('/api/session/submit-email', {
      method: 'POST',
      body: { sessionEmailId, markedLegitimate },
    })
    if (session.value) {
      const email = session.value.sessionEmails.find(e => e.id === sessionEmailId)
      if (email) {
        email.submitted = res.submitted
        email.markedLegitimate = res.markedLegitimate
        email.submittedAt = res.submittedAt
        email.userPassed = res.userPassed
        email.revealedFlags = res.revealedFlags.map(f => ({
          id: f.id,
          text: f.text,
          startOffset: f.startOffset,
          endOffset: f.endOffset,
          category: f.category as FlagCategory,
          zone: f.zone as ZoneType | null,
        }))
        if (markedLegitimate) email.userFlags = []
      }
    }
  }

  async function saveFlag(
    sessionEmailId: string,
    flag: Omit<UserFlagLocal, 'id' | 'sessionEmailId'>,
  ): Promise<UserFlagLocal> {
    const res = await $fetch<{
      id: string
      sessionEmailId: string
      flagCategory: string
      flaggedText: string
      startOffset: number | null
      endOffset: number | null
      zoneType: string | null
    }>('/api/session/flag', {
      method: 'POST',
      body: { sessionEmailId, ...flag },
    })
    const saved: UserFlagLocal = {
      id: res.id,
      sessionEmailId: res.sessionEmailId,
      flagCategory: res.flagCategory as FlagCategory,
      flaggedText: res.flaggedText,
      startOffset: res.startOffset,
      endOffset: res.endOffset,
      zoneType: res.zoneType as ZoneType | null,
    }
    if (session.value) {
      const email = session.value.sessionEmails.find(e => e.id === sessionEmailId)
      if (email) email.userFlags.push(saved)
    }
    return saved
  }

  async function removeFlag(flagId: string): Promise<void> {
    await $fetch(`/api/session/flag/${flagId}`, { method: 'DELETE' })
    if (session.value) {
      for (const email of session.value.sessionEmails) {
        const idx = email.userFlags.findIndex(f => f.id === flagId)
        if (idx !== -1) {
          email.userFlags.splice(idx, 1)
          break
        }
      }
    }
  }

  async function completeSession(): Promise<void> {
    if (!session.value) return
    const res = await $fetch<{
      sessionId: string
      status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
      score: number | null
      completedAt: string | null
    }>('/api/session/complete', {
      method: 'POST',
      body: { sessionId: session.value.id },
    })
    session.value.status = res.status
    session.value.score = res.score
    session.value.completedAt = res.completedAt
  }

  function selectEmail(emailId: string): void {
    activeEmailId.value = emailId
    if (!readEmailIds.value.includes(emailId)) {
      readEmailIds.value = [...readEmailIds.value, emailId]
    }
  }

  function isRead(emailId: string): boolean {
    return readEmailIds.value.includes(emailId)
  }

  function loadSession(s: Session): void {
    session.value = s
    activeEmailId.value = s.sessionEmails[0]?.id ?? null
    readEmailIds.value = []
  }

  function reset(): void {
    session.value = null
    activeEmailId.value = null
    readEmailIds.value = []
    respondedEmailIds.value = []
    loading.value = false
    error.value = null
  }

  return {
    session: readonly(session),
    activeEmail,
    activeEmailId: readonly(activeEmailId),
    allSubmitted,
    allChatResponded,
    runningScore,
    loading: readonly(loading),
    error: readonly(error),
    loadSession,
    startSession,
    fetchSession,
    submitEmail,
    saveFlag,
    removeFlag,
    completeSession,
    selectEmail,
    isRead,
    markChatResponded,
    isChatResponded,
    reset,
  }
}
