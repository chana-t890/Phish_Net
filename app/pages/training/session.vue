<script setup lang="ts">
definePageMeta({})

const tips = [
  "Always check the sender's actual email address, not just the display name.",
  "Urgency is a red flag — legitimate organizations don't demand immediate action.",
  'Hover over links before clicking to see the real destination URL.',
  'Requests for gift cards or wire transfers are almost always scams.',
  'Poor spelling and grammar are common in phishing emails.',
  'If an offer seems too good to be true, it probably is.',
  'Your IT department will never ask for your password via email.',
]

const route = useRoute()
const router = useRouter()
const { session, loading, error, startSession, fetchSession } = useSession()

const currentTipIndex = ref(0)
const currentTip = computed(() => tips[currentTipIndex.value])
let tipInterval: ReturnType<typeof setInterval> | null = null

onMounted(async () => {
  tipInterval = setInterval(() => {
    currentTipIndex.value = (currentTipIndex.value + 1) % tips.length
  }, 3000)

  const sessionId = route.query.id as string | undefined
  if (sessionId) {
    await fetchSession(sessionId)
  } else {
    await startSession()
    if (session.value) {
      router.replace({ query: { id: session.value.id } })
    }
  }
})

onUnmounted(() => { 
  if (tipInterval) clearInterval(tipInterval)
})
</script>

<template>
  <div class="h-screen overflow-hidden">
    <!-- Loading overlay -->
    <div
      v-if="loading"
      class="h-full flex flex-col items-center justify-center gap-10 bg-[#f8f9fc] dark:bg-[#0f172a] p-12"
    >
      <div class="w-[100px] h-[100px] border-4 border-[#4f8ef7] border-t-transparent rounded-full animate-spin" />

      <div class="flex flex-col items-center gap-2 text-center w-[420px]">
        <p class="font-bold text-[22px] text-[#1e293b] dark:text-[#f8fafc]">Generating your training session…</p>
        <p class="text-sm text-[#64748b] dark:text-[#94a3b8]">Analyzing recent realistic email vectors for your profile</p>
      </div>

      <div class="flex flex-col gap-4 items-start p-6 w-[480px] max-w-full bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-2xl shadow-lg">
        <div class="flex gap-2.5 items-center w-full">
          <div class="flex items-center justify-center shrink-0 size-7 rounded-md bg-[#fef3c7] dark:bg-[#3b2e1e]">
            <svg class="size-4 text-[#f59e0b]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-3.5 10.9c.4.3.5.7.5 1.1v.5a1 1 0 001 1h4a1 1 0 001-1v-.5c0-.4.1-.8.5-1.1A6 6 0 0010 2zM8 17a1 1 0 001 1h2a1 1 0 001-1v-.5H8V17z" />
            </svg>
          </div>
          <p class="font-bold text-[13px] uppercase text-[#f59e0b]">Security Tip</p>
        </div>
        <p class="text-sm leading-5 text-[#64748b] dark:text-[#94a3b8] transition-opacity duration-500">{{ currentTip }}</p>
      </div>

      <div class="flex gap-1.5">
        <span
          v-for="i in 3"
          :key="i"
          class="size-1.5 rounded-full bg-[#4f8ef7] animate-pulse"
          :style="{ animationDelay: `${i * 150}ms` }"
        />
      </div>
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
      class="h-full flex items-center justify-center text-red-600 text-sm"
    >
      {{ error }}
    </div>

    <!-- Inbox -->
    <InboxLayout v-else-if="session" :session="session" />
  </div>
</template>
