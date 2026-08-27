import { useSSE } from './useSSE'
import type { AiChatMessage } from '~/types/session'

export function useChat(sessionEmailId: string) {
  const messages = ref<AiChatMessage[]>([])
  const isSending = ref(false)
  const { streamPost } = useSSE()

  function loadHistory(existing: AiChatMessage[]) {
    messages.value = [...existing]
  }

  async function sendMessage(text: string): Promise<boolean> {
    if (isSending.value || !text.trim()) return false

    isSending.value = true
    let responded = false

    messages.value.push({
      id: crypto.randomUUID(),
      sessionEmailId,
      role: 'user',
      content: text.trim(),
      createdAt: new Date().toISOString(),
    })

    // Placeholder assistant message — chunks are appended to this in place
    const assistantId = crypto.randomUUID()
    messages.value.push({
      id: assistantId,
      sessionEmailId,
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString(),
    })

    try {
      for await (const event of streamPost('/api/session/chat', { sessionEmailId, message: text.trim() })) {
        if ('error' in event) {
          const msg = messages.value.find(m => m.id === assistantId)
          if (msg) msg.content = 'Something went wrong. Please try again.'
          break
        }

        if ('text' in event) {
          const msg = messages.value.find(m => m.id === assistantId)
          if (msg) msg.content += event.text
        }

        if ('done' in event) {
          // Replace the temporary id with the real DB-persisted id
          const msg = messages.value.find(m => m.id === assistantId)
          if (msg) msg.id = event.messageId
          responded = (event as { responded?: boolean }).responded ?? false
        }
      }
    } catch {
      const msg = messages.value.find(m => m.id === assistantId)
      if (msg) msg.content = 'Something went wrong. Please try again.'
    } finally {
      isSending.value = false
    }

    return responded
  }

  return { messages, isSending, sendMessage, loadHistory }
}
