<script setup lang="ts">
import type { AiChatMessage } from '~/types/session'
import { useChat } from '~/composables/useChat'
import MarkdownIt from 'markdown-it'

const markdown = new MarkdownIt({
  html: false,
  breaks: true,
  linkify: false,
})

const props = defineProps<{
  sessionEmailId: string
  isPhishing: boolean
  markedLegitimate: boolean
  emailSubject: string
  emailSender: string
  emailBody: string
  initialMessages?: AiChatMessage[]
  alreadyResponded?: boolean
}>()

const emit = defineEmits<{
  responded: []
}>()

const OPENING_PHISHING = `I can see what you flagged — before I give you any feedback, tell me in your own words: what made you suspicious about this email, and what do you think the attacker was trying to do?`
const OPENING_LEGITIMATE = `You marked this as a safe email — what made you feel it was legitimate?`

const { messages, isSending, sendMessage: chatSend, loadHistory } = useChat(props.sessionEmailId)

const inputText = ref('')
const hasUserResponded = ref(false)
const showNudge = ref(false)
const messagesEndEl = ref<HTMLElement | null>(null)

// Show dots only while waiting for the first streaming token
const showTypingIndicator = computed(() => {
  if (!isSending.value) return false
  const last = messages.value.at(-1)
  return !last || last.role !== 'assistant' || last.content === ''
})

onMounted(() => {
  if (props.initialMessages && props.initialMessages.length > 0) {
    loadHistory(props.initialMessages)
    hasUserResponded.value = props.alreadyResponded === true
  } else {
    messages.value.push({
      id: 'opening',
      sessionEmailId: props.sessionEmailId,
      role: 'assistant',
      content: props.markedLegitimate ? OPENING_LEGITIMATE : OPENING_PHISHING,
      createdAt: new Date().toISOString(),
    })
  }
})

// Auto-scroll as messages stream in
watch(messages, async () => {
  await nextTick()
  messagesEndEl.value?.scrollIntoView({ behavior: 'smooth' })
}, { deep: true })

async function sendMessage() {
  const text = inputText.value.trim()
  if (!text || isSending.value) return

  inputText.value = ''

  const accepted = await chatSend(text)

  if (accepted && !hasUserResponded.value) {
    hasUserResponded.value = true
    showNudge.value = false
    emit('responded')
  } else if (!accepted && !hasUserResponded.value) {
    showNudge.value = true
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

function renderAssistantMessage(content: string) {
  return markdown.render(content)
}
</script>

<template>
  <div class="flex flex-col h-full bg-neutral-50 dark:bg-[#161f2e] border-l border-neutral-200 dark:border-[#334155]">
    <!-- Header -->
    <div class="flex items-center gap-3 px-4 py-3 border-b border-neutral-200 dark:border-[#334155] bg-white dark:bg-[#1e293b] flex-shrink-0">
      <div class="flex items-center justify-center size-8 shrink-0">
        <img src="/icons/ai-coach-light.svg" alt="" class="size-8" />
      </div>
      <div>
        <p class="text-sm font-bold text-neutral-800 dark:text-[#f8fafc]">AI Coach</p>
        <p class="text-[11px] text-green-500 dark:text-emerald-400">Online</p>
      </div>
      <p v-if="!hasUserResponded" class="ml-auto text-xs text-amber-600 dark:text-amber-400">
        {{ showNudge ? 'Tell me a bit more about this email' : 'Reply to unlock' }}
      </p>
    </div>

    <!-- Messages -->
    <div class="flex-1 overflow-y-auto px-4 py-4 space-y-3">
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'"
      >
        <div
          :class="[
            'max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed',
            msg.role === 'user'
              ? 'bg-blue-600 text-white rounded-br-sm'
              : 'bg-blue-50 dark:bg-[#161f2e] text-neutral-800 dark:text-[#f8fafc] rounded-bl-sm',
          ]"
        >
          <div v-if="msg.role === 'assistant'" class="chat-markdown" v-html="renderAssistantMessage(msg.content)" />
          <template v-else>{{ msg.content }}</template>
        </div>
      </div>

      <!-- Typing indicator — shown only while waiting for the first token -->
      <div v-if="showTypingIndicator" class="flex justify-start">
        <div class="bg-white dark:bg-[#1e293b] border border-neutral-200 dark:border-[#334155] rounded-2xl rounded-bl-sm px-3 py-2">
          <span class="flex gap-1 items-center h-4">
            <span class="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-[#64748b] animate-bounce" style="animation-delay: 0ms" />
            <span class="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-[#64748b] animate-bounce" style="animation-delay: 150ms" />
            <span class="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-[#64748b] animate-bounce" style="animation-delay: 300ms" />
          </span>
        </div>
      </div>

      <div ref="messagesEndEl" />
    </div>

    <!-- Input -->
    <div class="px-3 pb-3 pt-2 border-t border-neutral-200 dark:border-[#334155] bg-white dark:bg-[#1e293b] flex-shrink-0">
      <div class="flex gap-2 items-end">
        <textarea
          v-model="inputText"
          rows="2"
          placeholder="Type your response…"
          class="flex-1 resize-none rounded-xl border border-neutral-300 dark:border-[#334155] dark:bg-[#161f2e] dark:text-[#f8fafc] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          :disabled="isSending"
          @keydown="handleKeydown"
        />
        <button
          :disabled="!inputText.trim() || isSending"
          class="flex-shrink-0 flex items-center gap-1.5 bg-blue-600 text-white rounded-xl px-3 py-2 text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          @click="sendMessage"
        >
          <img src="/icons/send-light.svg" alt="" class="size-3.5 brightness-0 invert" />
          Send
        </button>
      </div>
      <p class="text-xs text-neutral-400 dark:text-[#64748b] mt-1.5">Enter to send · Shift+Enter for new line</p>
    </div>
  </div>
</template>
