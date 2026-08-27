<script setup lang="ts">
import type { DeepReadonly } from 'vue'
import type { Session } from '~/types/session'

const props = defineProps<{ session: DeepReadonly<Session> }>()

const router = useRouter()
const { activeEmailId, allSubmitted, allChatResponded, selectEmail, completeSession } = useSession()

const submittedCount = computed(() =>
  props.session.sessionEmails.filter(e => e.submitted).length,
)
const totalCount = computed(() => props.session.sessionEmails.length)
const unsubmittedCount = computed(() => totalCount.value - submittedCount.value)

const activeSessionEmail = computed(() =>
  props.session.sessionEmails.find(e => e.id === activeEmailId.value) ?? null,
)

// A finished session (COMPLETED or FAILED) is opened in read-only review mode.
// The reading pane is already read-only for submitted emails; here we just
// swap the “Complete Session” action for a link back to the results page.
const isReview = computed(() => props.session.status !== 'IN_PROGRESS')

async function handleComplete() {
  await completeSession()
  router.push(`/training/summary/${props.session.id}`)
}
</script>

<template>
  <div class="grid h-screen" style="grid-template-columns: 340px 1fr">
    <!-- Email list panel -->
    <div class="border-r border-neutral-200 dark:border-[#334155] bg-white dark:bg-[#161f2e] flex flex-col h-screen overflow-hidden">
      <div class="p-5 border-b border-neutral-200 dark:border-[#334155] flex flex-col gap-3 shrink-0">
        <div class="flex items-center gap-3">
          <p class="font-bold text-lg text-neutral-900 dark:text-[#f8fafc]">Training Inbox</p>
          <span class="text-[13px] text-neutral-500 dark:text-[#94a3b8]">{{ unsubmittedCount }} unread</span>
        </div>

        <p class="text-xs text-neutral-500 dark:text-[#94a3b8]">
          {{ submittedCount }} of {{ totalCount }} submitted
        </p>

        <!-- Review mode: session already finished -->
        <template v-if="isReview">
          <p class="text-xs text-neutral-500 dark:text-[#94a3b8]">Review mode — read only</p>
          <NuxtLink
            :to="`/training/summary/${session.id}`"
            class="block w-full text-center bg-brand-600 text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-brand-700 transition-colors"
          >
            Back to results
          </NuxtLink>
        </template>

        <!-- Active session: allow completing -->
        <template v-else>
          <p v-if="allSubmitted && !allChatResponded" class="text-xs text-amber-600 dark:text-amber-400">
            Reply to the AI coach for each email to finish
          </p>
          <button
            v-if="allSubmitted"
            :disabled="!allChatResponded"
            class="w-full bg-green-600 text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-green-600"
            @click="handleComplete"
          >
            Complete Session
          </button>
        </template>
      </div>

      <div class="flex-1 overflow-y-auto">
        <EmailList
          :session-emails="session.sessionEmails"
          :active-email-id="activeEmailId"
          @select="selectEmail"
        />
      </div>
    </div>

    <!-- Reading pane -->
    <div class="overflow-hidden">
      <ReadingPane :session-email="activeSessionEmail" />
    </div>
  </div>
</template>
