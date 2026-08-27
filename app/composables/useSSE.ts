export type SSEChunk =
  | { text: string }
  | { done: true; messageId: string }
  | { error: string }

export function useSSE() {
  async function* streamPost(url: string, body: Record<string, unknown>): AsyncGenerator<SSEChunk> {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      yield { error: `HTTP ${response.status}` }
      return
    }

    if (!response.body) {
      yield { error: 'No response body' }
      return
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // Split on newlines; keep the last (potentially incomplete) line in the buffer
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const raw = line.slice(6).trim()
          if (!raw) continue
          try {
            yield JSON.parse(raw) as SSEChunk
          } catch {
            // skip malformed lines
          }
        }
      }

      // Flush any remaining buffered line
      if (buffer.startsWith('data: ')) {
        const raw = buffer.slice(6).trim()
        if (raw) {
          try {
            yield JSON.parse(raw) as SSEChunk
          } catch {
            // skip
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }

  return { streamPost }
}
