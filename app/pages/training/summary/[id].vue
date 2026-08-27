<script setup lang="ts">
import type { Session } from '~/types/session'

// Human-friendly labels for the flag category codes.
const FLAG_LABELS: Record<string, string> = {
  suspicious_url: 'Suspicious link',
  urgency_language: 'Urgency / pressure',
  grammar_error: 'Spelling or grammar error',
  fake_sender: 'Fake sender',
  info_request: 'Requests personal info',
  money_request: 'Requests money',
  too_good_to_be_true: 'Too good to be true',
  threatening_language: 'Threatening language',
  suspicious_attachment: 'Suspicious attachment',
}
function flagLabel(category: string): string {
  return FLAG_LABELS[category] ?? category
}

function initialsFor(name: string): string {
  const display = senderNameFor(name)
  const parts = display.split(/\s+/)
  const first = parts[0] ?? ''
  const second = parts[1]
  const initials = second ? (first[0] ?? '') + (second[0] ?? '') : first.slice(0, 2)
  return initials.toUpperCase()
}

function senderNameFor(sender: string): string {
  const match = sender.match(/^([^<]+)/)
  return (match?.[1] ?? sender).trim()
}

function badgeFor(se: { generatedEmail: { isPhishing: boolean }; userPassed: boolean | null }) {
  if (!se.generatedEmail.isPhishing) return { label: 'LEGITIMATE', kind: 'neutral' as const }
  if (se.userPassed === true) return { label: 'CORRECT', kind: 'correct' as const }
  if (se.userPassed === false) return { label: 'MISSED', kind: 'missed' as const }
  return { label: 'NOT SCORED', kind: 'neutral' as const }
}

const route = useRoute()
const sessionId = route.params.id as string

const { data: session, pending, error } = await useFetch<Session>(
  `/api/session/${sessionId}`,
)

// Pass = the session reached the passing threshold (status COMPLETED).
// Fail = FAILED. Anything else (still in progress) is treated as not-yet-complete.
const passed = computed(() => session.value?.status === 'COMPLETED')
const scorePercent = computed(() =>
  session.value?.score != null ? Math.round(session.value.score * 100) : null,
)

// Circle gauge geometry (matches the Figma "SIMULATION SCORE" ring)
const GAUGE_RADIUS = 42
const GAUGE_CIRCUMFERENCE = 2 * Math.PI * GAUGE_RADIUS
const gaugeOffset = computed(() => {
  const pct = scorePercent.value ?? 0
  return GAUGE_CIRCUMFERENCE * (1 - pct / 100)
})

// Only phishing emails that were actually scored count toward the result.
// (A phishing email with no expected flags is excluded and has userPassed === null.)
const scoredPhishingEmails = computed(() =>
  (session.value?.sessionEmails ?? []).filter(
    (se) => se.generatedEmail.isPhishing && se.userPassed !== null,
  ),
)
const phishingPassedCount = computed(
  () => scoredPhishingEmails.value.filter((se) => se.userPassed === true).length,
)
const phishingTotalCount = computed(() => scoredPhishingEmails.value.length)

// Total time = completed time minus start time, shown as "Xm Ys".
const totalTime = computed(() => {
  if (!session.value?.completedAt) return null
  const ms =
    new Date(session.value.completedAt).getTime() -
    new Date(session.value.startedAt).getTime()
  if (ms < 0) return null
  const totalSeconds = Math.round(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes} minute${minutes === 1 ? '' : 's'}, ${seconds} second${seconds === 1 ? '' : 's'}`
})
</script>

<template>
  <div class="min-h-screen bg-[#f8f9fc] dark:bg-[#0f172a] p-12">
    <div class="max-w-5xl mx-auto">
      <!-- Loading -->
      <div v-if="pending" class="text-center text-neutral-500 dark:text-[#94a3b8] py-20">
        Loading your results…
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center text-red-600 py-20">
        Couldn't load this session's results.
      </div>

      <!-- Results -->
      <div v-else-if="session" class="flex flex-col gap-8">
        <div>
          <p class="font-extrabold text-[28px] text-neutral-900 dark:text-[#f8fafc]">Session Complete!</p>
          <p class="text-[15px] text-neutral-500 dark:text-[#94a3b8]">
            Review your training stats and analyze session emails below.
          </p>
        </div>

        <div class="flex flex-col lg:flex-row gap-10 items-start">
          <!-- Left column: score + metrics -->
          <div class="flex flex-col gap-6 w-full lg:w-[480px] shrink-0">
            <!-- Score card -->
            <div class="bg-white dark:bg-[#1e293b] border border-neutral-200 dark:border-[#334155] rounded-2xl p-7 flex flex-col gap-4">
              <p class="font-bold text-sm text-neutral-500 dark:text-[#94a3b8]">SIMULATION SCORE</p>
              <div class="flex gap-6 items-center">
                <div class="relative flex items-center justify-center size-[100px] shrink-0">
                  <svg class="size-[90px] -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" :r="GAUGE_RADIUS" fill="none" stroke="currentColor" stroke-width="8" class="text-neutral-100 dark:text-[#334155]" />
                    <circle
                      cx="50" cy="50" :r="GAUGE_RADIUS" fill="none" stroke="currentColor" stroke-width="8"
                      stroke-linecap="round"
                      :stroke-dasharray="GAUGE_CIRCUMFERENCE"
                      :stroke-dashoffset="gaugeOffset"
                      :class="passed ? 'text-green-500' : 'text-red-500'"
                    />
                  </svg>
                  <p class="absolute font-extrabold text-[22px] text-neutral-900 dark:text-[#f8fafc]">
                    {{ scorePercent != null ? `${scorePercent}%` : '—' }}
                  </p>
                </div>
                <div class="flex flex-col gap-2 items-start">
                  <span
                    class="px-2.5 py-1 rounded-md text-xs font-bold"
                    :class="passed ? 'bg-green-100 text-green-700 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'"
                  >
                    {{ passed ? 'PASSED' : 'FAILED' }}
                  </span>
                  <p class="text-[13px] text-neutral-500 dark:text-[#94a3b8]">Passing threshold: 80%</p>
                </div>
              </div>
            </div>

            <!-- Metrics breakdown card -->
            <div class="bg-white dark:bg-[#1e293b] border border-neutral-200 dark:border-[#334155] rounded-2xl p-7 flex flex-col gap-5">
              <p class="font-bold text-sm text-neutral-500 dark:text-[#94a3b8]">METRICS BREAKDOWN</p>
              <div class="flex flex-col gap-4">
                <div class="flex gap-3 items-center">
                  <div class="flex items-center justify-center size-8 shrink-0">
                    <img src="/icons/metric-accuracy-light.svg" alt="" class="size-8 dark:hidden" />
                    <img src="/icons/metric-accuracy-dark.svg" alt="" class="size-8 hidden dark:block" />
                  </div>
                  <div>
                    <p class="text-[13px] text-neutral-500 dark:text-[#94a3b8]">Simulation accuracy</p>
                    <p class="font-bold text-[15px] text-neutral-900 dark:text-[#f8fafc]">
                      Identified {{ phishingPassedCount }} of {{ phishingTotalCount }} emails correctly
                    </p>
                  </div>
                </div>
                <div class="flex gap-3 items-center">
                  <div class="flex items-center justify-center size-8 shrink-0">
                    <img src="/icons/metric-time-light.svg" alt="" class="size-8 dark:hidden" />
                    <img src="/icons/metric-time-dark.svg" alt="" class="size-8 hidden dark:block" />
                  </div>
                  <div>
                    <p class="text-[13px] text-neutral-500 dark:text-[#94a3b8]">Time elapsed</p>
                    <p class="font-bold text-[15px] text-neutral-900 dark:text-[#f8fafc]">
                      {{ totalTime ?? '—' }}
                    </p>
                  </div>
                </div>
                <div class="flex gap-3 items-center">
                  <div class="flex items-center justify-center size-8 shrink-0">
                    <img src="/icons/metric-path-light.svg" alt="" class="size-8 dark:hidden" />
                    <img src="/icons/metric-path-dark.svg" alt="" class="size-8 hidden dark:block" />
                  </div>
                  <div>
                    <p class="text-[13px] text-neutral-500 dark:text-[#94a3b8]">Session path</p>
                    <p class="font-bold text-[15px] text-neutral-900 dark:text-[#f8fafc]">
                      {{ session.isPractice ? 'Practice session' : 'Assigned training path' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right column: emails in this session -->
          <div class="flex flex-col gap-5 flex-1 min-w-0 w-full">
            <p class="font-bold text-sm text-neutral-500 dark:text-[#94a3b8]">EMAILS IN THIS SESSION</p>

            <div class="flex flex-col gap-3">
              <div
                v-for="se in session.sessionEmails"
                :key="se.id"
                class="bg-white dark:bg-[#1e293b] border border-neutral-200 dark:border-[#334155] rounded-xl p-4 flex flex-col gap-3"
              >
                <div class="flex gap-4 items-center">
                  <div
                    class="flex items-center justify-center size-9 rounded-full shrink-0 font-bold text-[13px]"
                    :class="{
                      'bg-blue-50 dark:bg-[#1e3a8a] text-brand-600 dark:text-[#4f8ef7]': badgeFor(se).kind === 'correct',
                      'bg-red-50 dark:bg-[#7f1d1d] text-red-500': badgeFor(se).kind === 'missed',
                      'bg-neutral-100 dark:bg-[#334155] text-neutral-500 dark:text-[#94a3b8]': badgeFor(se).kind === 'neutral',
                    }"
                  >
                    {{ initialsFor(se.generatedEmail.sender) }}
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="font-bold text-sm text-neutral-900 dark:text-[#f8fafc] truncate">
                      {{ senderNameFor(se.generatedEmail.sender) }}
                    </p>
                    <p class="text-xs text-neutral-500 dark:text-[#94a3b8] truncate">
                      {{ se.generatedEmail.sender }}
                    </p>
                    <p class="font-medium text-[13px] text-neutral-900 dark:text-[#f8fafc] truncate">
                      {{ se.generatedEmail.subject }}
                    </p>
                  </div>
                  <span
                    class="shrink-0 px-2 py-1 rounded-md text-[11px] font-bold"
                    :class="{
                      'bg-green-100 dark:bg-emerald-950 text-green-700 dark:text-emerald-400': badgeFor(se).kind === 'correct',
                      'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400': badgeFor(se).kind === 'missed',
                      'bg-neutral-100 dark:bg-[#334155] text-neutral-500 dark:text-[#94a3b8]': badgeFor(se).kind === 'neutral',
                    }"
                  >
                    {{ badgeFor(se).label }}
                  </span>
                </div>

                <!-- Warning signs (phishing emails only) -->
                <div
                  v-if="se.generatedEmail.isPhishing && se.revealedFlags && se.revealedFlags.length"
                  class="pl-[52px]"
                >
                  <p class="text-xs font-semibold text-neutral-500 dark:text-[#94a3b8] uppercase tracking-wide mb-1.5">
                    Warning signs in this email
                  </p>
                  <ul class="space-y-1">
                    <li
                      v-for="flag in se.revealedFlags"
                      :key="flag.id"
                      class="text-sm text-neutral-700 dark:text-[#94a3b8]"
                    >
                      <span class="font-medium text-neutral-900 dark:text-[#f8fafc]">{{ flagLabel(flag.category) }}</span>
                      <span> — “{{ flag.text }}”</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-4 pt-2">
              <NuxtLink
                :to="`/training/session?id=${session.id}`"
                class="px-6 py-3 rounded-lg border border-neutral-500 dark:border-[#94a3b8] text-neutral-500 dark:text-[#94a3b8] text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-[#161f2e] transition-colors"
              >
                Review Session
              </NuxtLink>
              <NuxtLink
                to="/training"
                class="text-sm font-semibold text-brand-600 dark:text-[#4f8ef7] underline"
              >
                Back to Training
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
