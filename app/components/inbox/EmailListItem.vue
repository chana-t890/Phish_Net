<script setup lang="ts">
import type { SessionEmail } from '~/types/session'

const props = defineProps<{
  sessionEmail: SessionEmail
  isActive: boolean
}>()

defineEmits<{ click: [] }>()

const { isRead, isChatResponded } = useSession()

const read = computed(() => isRead(props.sessionEmail.id))

// "Done" = submitted AND the AI-coach chat answer qualified.
const complete = computed(
  () => props.sessionEmail.submitted && isChatResponded(props.sessionEmail.id),
)

const senderName = computed(() => {
  // Parse "Display Name <email@example.com>" or just return the raw string
  const match = props.sessionEmail.generatedEmail.sender.match(/^([^<]+)/)
  return match ? match[1].trim() : props.sessionEmail.generatedEmail.sender
})

const preview = computed(() =>
  props.sessionEmail.generatedEmail.body.slice(0, 60).replace(/\n/g, ' '),
)

const outcome = computed<'correct' | 'missed' | null>(() => {
  if (!props.sessionEmail.submitted || props.sessionEmail.userPassed === null) return null
  return props.sessionEmail.userPassed ? 'correct' : 'missed'
})
</script>

<template>
  <div
    class="flex items-start gap-2 px-3 py-3 cursor-pointer border-b border-neutral-100 dark:border-[#334155] hover:bg-neutral-50 dark:hover:bg-[#1e2c4a] transition-colors"
    :class="{
      'bg-blue-50 dark:bg-[#1e2c4a] !border-l-2 !border-l-brand-600 dark:!border-l-[#4f8ef7]': isActive,
    }"
    @click="$emit('click')"
  >
    <!-- Unread dot -->
    <div class="mt-1.5 w-2 flex-shrink-0">
      <div
        v-if="!read && !sessionEmail.submitted"
        class="w-2 h-2 rounded-full bg-brand-600"
      />
    </div>

    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between gap-1">
        <span
          class="text-sm truncate"
          :class="read || sessionEmail.submitted
            ? 'font-normal text-neutral-700 dark:text-[#94a3b8]'
            : 'font-semibold text-neutral-900 dark:text-[#f8fafc]'"
        >
          {{ senderName }}
        </span>
        <span v-if="complete" class="flex-shrink-0">
          <img src="/icons/checkmark-light.svg" alt="Submitted" class="size-3.5 dark:hidden" />
          <img src="/icons/checkmark-dark.svg" alt="Submitted" class="size-3.5 hidden dark:block" />
        </span>
      </div>
      <p
        class="text-xs truncate"
        :class="read || sessionEmail.submitted ? 'text-neutral-500 dark:text-[#94a3b8]' : 'font-medium text-neutral-700 dark:text-[#f8fafc]'"
      >
        {{ sessionEmail.generatedEmail.subject }}
      </p>
      <p class="text-xs text-neutral-400 dark:text-[#64748b] truncate">{{ preview }}</p>
      <div v-if="outcome && complete" class="flex gap-1 items-center pt-1">
        <template v-if="outcome === 'correct'">
          <img src="/icons/checkmark-light.svg" alt="" class="size-3.5 dark:hidden" />
          <img src="/icons/checkmark-dark.svg" alt="" class="size-3.5 hidden dark:block" />
          <span class="font-semibold text-[10px] text-green-500">Handled correctly (Reported)</span>
        </template>
        <template v-else>
          <img src="/icons/suspicious-url-tag-light.svg" alt="" class="size-3.5 dark:hidden" />
          <img src="/icons/suspicious-url-tag-dark.svg" alt="" class="size-3.5 hidden dark:block" />
          <span class="font-semibold text-[10px] text-red-500">Missed</span>
        </template>
      </div>
    </div>
  </div>
</template>
