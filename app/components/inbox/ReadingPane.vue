<script setup lang="ts">
import type { SessionEmail } from '~/types/session'

const props = defineProps<{
  sessionEmail: SessionEmail | null
}>()

const { submitEmail, markChatResponded } = useSession()

const MIN_CHAT_WIDTH = 280
const MAX_CHAT_WIDTH = 560
const chatWidth = ref(320)
const isResizingChat = ref(false)
let resizeStartX = 0
let resizeStartWidth = 320

function clampChatWidth(width: number): number {
  return Math.min(MAX_CHAT_WIDTH, Math.max(MIN_CHAT_WIDTH, width))
}

function handleChatResizeMove(event: PointerEvent): void {
  if (!isResizingChat.value) return
  chatWidth.value = clampChatWidth(resizeStartWidth - (event.clientX - resizeStartX))
}

function stopChatResize(): void {
  if (!isResizingChat.value) return
  isResizingChat.value = false
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
  window.removeEventListener('pointermove', handleChatResizeMove)
  window.removeEventListener('pointerup', stopChatResize)
}

function startChatResize(event: PointerEvent): void {
  event.preventDefault()
  isResizingChat.value = true
  resizeStartX = event.clientX
  resizeStartWidth = chatWidth.value
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
  window.addEventListener('pointermove', handleChatResizeMove)
  window.addEventListener('pointerup', stopChatResize)
}

function adjustChatWidth(amount: number): void {
  chatWidth.value = clampChatWidth(chatWidth.value + amount)
}

onUnmounted(stopChatResize)

async function handleSubmit(markedLegitimate: boolean) {
  if (!props.sessionEmail) return
  await submitEmail(props.sessionEmail.id, markedLegitimate)
}

function handleChatResponded() {
  if (!props.sessionEmail) return
  markChatResponded(props.sessionEmail.id)
}
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- Empty state -->
    <div
      v-if="!sessionEmail"
      class="flex-1 flex items-center justify-center text-neutral-400 dark:text-[#64748b] text-sm"
    >
      Select an email to read
    </div>

    <!-- Submitted: split view — email overlay left, chat right -->
    <div v-else-if="sessionEmail.submitted" class="h-full flex overflow-hidden">
      <!-- Left: annotated email -->
      <div class="flex-1 flex flex-col overflow-hidden min-w-0">
        <div class="bg-blue-50 dark:bg-[#1e293b] border-b border-neutral-200 dark:border-[#334155] flex gap-5 items-center px-6 py-3 flex-shrink-0">
          <span class="flex gap-1.5 items-center text-xs font-semibold text-neutral-500 dark:text-[#94a3b8]">
            <span class="inline-block size-2 rounded-full bg-green-200" />
            Correctly flagged
          </span>
          <span class="flex gap-1.5 items-center text-xs font-semibold text-neutral-500 dark:text-[#94a3b8]">
            <span class="inline-block size-2 rounded-full bg-red-200" />
            Missed flag
          </span>
          <span class="flex gap-1.5 items-center text-xs font-semibold text-neutral-500 dark:text-[#94a3b8]">
            <span class="inline-block size-2 rounded-full bg-yellow-200" />
            Not a real flag
          </span>
        </div>

        <div class="border-b border-neutral-200 dark:border-[#334155] px-6 py-4 space-y-3 flex-shrink-0">
          <PredefinedZone
            type="sender"
            :content="sessionEmail.generatedEmail.sender"
            :session-email-id="sessionEmail.id"
            :readonly="true"
            :existing-flag="sessionEmail.userFlags.find(f => f.zoneType === 'sender') ?? null"
          />
          <PredefinedZone
            type="subject"
            :content="sessionEmail.generatedEmail.subject"
            :session-email-id="sessionEmail.id"
            :readonly="true"
            :existing-flag="sessionEmail.userFlags.find(f => f.zoneType === 'subject') ?? null"
          />
        </div>

        <div class="flex-1 overflow-y-auto px-6 py-4">
          <ReviewOverlay :session-email="sessionEmail" />

          <div
            v-if="sessionEmail.generatedEmail.attachments?.length"
            class="mt-4 flex flex-wrap gap-2"
          >
            <PredefinedZone
              v-for="(att, i) in sessionEmail.generatedEmail.attachments"
              :key="i"
              type="attachment"
              :content="att.filename"
              :session-email-id="sessionEmail.id"
              :readonly="true"
              :existing-flag="sessionEmail.userFlags.find(f => f.zoneType === 'attachment' && f.flaggedText === att.filename) ?? null"
            />
          </div>
        </div>

        <div class="bg-[#f8f9fc] dark:bg-[#0f172a] border-t border-neutral-200 dark:border-[#334155] px-6 py-5 flex-shrink-0 flex items-center justify-center gap-2">
          <img src="/icons/lock-light.svg" alt="" class="size-4 dark:hidden" />
          <img src="/icons/lock-dark.svg" alt="" class="size-4 hidden dark:block" />
          <span class="text-sm font-semibold text-neutral-500 dark:text-[#94a3b8]">Session submitted. Training actions are locked.</span>
        </div>
      </div>

      <!-- Right: chat panel -->
      <div
        class="w-2 flex-shrink-0 cursor-col-resize group flex items-stretch justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500"
        role="separator"
        aria-label="Resize AI Coach"
        aria-orientation="vertical"
        aria-valuemin="280"
        aria-valuemax="560"
        :aria-valuenow="chatWidth"
        tabindex="0"
        @pointerdown="startChatResize"
        @keydown.left.prevent="adjustChatWidth(16)"
        @keydown.right.prevent="adjustChatWidth(-16)"
      >
        <span class="w-px bg-neutral-200 dark:bg-[#334155] group-hover:bg-brand-400 group-focus-visible:bg-brand-500" />
      </div>
      <ChatPanel
        :key="sessionEmail.id"
        class="flex-shrink-0 min-w-0"
        :style="{ width: `${chatWidth}px` }"
        :session-email-id="sessionEmail.id"
        :is-phishing="sessionEmail.generatedEmail.isPhishing"
        :marked-legitimate="sessionEmail.markedLegitimate ?? sessionEmail.userFlags.length === 0"
        :email-subject="sessionEmail.generatedEmail.subject"
        :email-sender="sessionEmail.generatedEmail.sender"
        :email-body="sessionEmail.generatedEmail.body"
        :initial-messages="sessionEmail.chatMessages"
        :already-responded="sessionEmail.reasoningAccepted"
        @responded="handleChatResponded"
      />
    </div>

    <!-- Not yet submitted: normal tagging view -->
    <template v-else>
      <div class="border-b border-neutral-200 dark:border-[#334155] px-6 py-4 space-y-3 flex-shrink-0">
        <PredefinedZone
          type="sender"
          :content="sessionEmail.generatedEmail.sender"
          :session-email-id="sessionEmail.id"
          :readonly="false"
          :existing-flag="sessionEmail.userFlags.find(f => f.zoneType === 'sender') ?? null"
        />
        <PredefinedZone
          type="subject"
          :content="sessionEmail.generatedEmail.subject"
          :session-email-id="sessionEmail.id"
          :readonly="false"
          :existing-flag="sessionEmail.userFlags.find(f => f.zoneType === 'subject') ?? null"
        />
      </div>

      <div class="flex-1 overflow-y-auto px-6 py-4">
        <EmailBody
          :session-email="sessionEmail"
          :readonly="false"
        />

        <div
          v-if="sessionEmail.generatedEmail.attachments?.length"
          class="mt-4 flex flex-wrap gap-2"
        >
          <PredefinedZone
            v-for="(att, i) in sessionEmail.generatedEmail.attachments"
            :key="i"
            type="attachment"
            :content="att.filename"
            :session-email-id="sessionEmail.id"
            :readonly="false"
            :existing-flag="sessionEmail.userFlags.find(f => f.zoneType === 'attachment' && f.flaggedText === att.filename) ?? null"
          />
        </div>
      </div>

      <div class="bg-[#f8f9fc] dark:bg-[#0f172a] border-t border-neutral-200 dark:border-[#334155] flex-shrink-0">
        <SubmitBar :session-email="sessionEmail" @submit="handleSubmit" />
      </div>
    </template>
  </div>
</template>
