<script setup lang="ts">
definePageMeta({})

type ActiveAssignment = {
  id: string
  deadline: string
}

type InProgressSession = {
  id: string
  assignmentId: string | null
}

const router = useRouter()
const { startSession, loading } = useSession()

const assignment = ref<ActiveAssignment | null>(null)
const inProgressSession = ref<InProgressSession | null>(null)
const fetchError = ref<string | null>(null)

onMounted(async () => {
  try {
    const data = await $fetch<{
      assignment: ActiveAssignment | null
      inProgressSession: InProgressSession | null
    }>('/api/session/active')
    assignment.value = data.assignment
    inProgressSession.value = data.inProgressSession
  } catch (e: any) {
    fetchError.value = e.data?.message ?? 'Failed to load training status'
  }
})

async function handleStartOver() {
  await startSession(false, assignment.value?.id)
  if (true) navigateToSession()
}

async function handleStartNew() {
  await startSession(false, assignment.value?.id)
  navigateToSession()
}

async function handleStartPractice() {
  await startSession(true)
  navigateToSession()
}

function handleResume() {
  router.push(`/training/session?id=${inProgressSession.value!.id}`)
}

function navigateToSession() {
  // session state is set by startSession — navigate without id so session.vue reads from state
  router.push('/training/session')
}
</script>

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-[#0f172a] flex items-center justify-center p-8">
    <div class="bg-white dark:bg-[#1e293b] rounded-2xl border border-neutral-200 dark:border-[#334155] shadow-sm dark:shadow-lg p-10 max-w-[560px] w-full flex flex-col items-center gap-8">
      <div class="flex flex-col items-center gap-3">
        <div class="flex items-center justify-center size-16 rounded-2xl bg-blue-50 dark:bg-[#1e3a8a]">
          <img src="/icons/logo-hook-light.svg" alt="" class="size-7" />
        </div>
        <p class="font-bold text-xs uppercase text-brand-600 dark:text-[#4f8ef7]">Adaptive Simulation</p>
      </div>

      <h1 class="text-2xl font-extrabold text-neutral-900 dark:text-[#f8fafc] text-center">Phishing Training</h1>

      <p v-if="fetchError" class="text-red-600 text-sm">{{ fetchError }}</p>

      <!-- In-progress session exists -->
      <template v-if="inProgressSession">
        <p class="text-neutral-600 dark:text-[#94a3b8] text-sm text-center -mt-4">You have an unfinished session. Would you like to continue?</p>
        <div class="flex flex-col gap-3 w-full">
          <button
            class="w-full bg-brand-600 text-white font-medium px-4 py-3 rounded-lg hover:bg-brand-700 transition-colors"
            @click="handleResume"
          >
            Resume Session
          </button>
          <button
            :disabled="loading"
            class="w-full border border-neutral-300 dark:border-[#334155] text-neutral-700 dark:text-[#94a3b8] font-medium px-4 py-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-[#161f2e] transition-colors disabled:opacity-50"
            @click="handleStartOver"
          >
            Start Over
          </button>
          <NuxtLink
            to="/training/practice"
            class="w-full text-center text-sm font-medium text-brand-600 dark:text-[#4f8ef7] hover:underline"
          >
            Practice instead
          </NuxtLink>
        </div>
      </template>

      <!-- Active assignment, no in-progress session -->
      <template v-else-if="assignment">
        <div class="flex flex-col items-center gap-2 text-center w-full -mt-4">
          <p class="text-neutral-500 dark:text-[#64748b] text-[15px]">
            Due {{ new Date(assignment.deadline).toLocaleDateString() }}
          </p>
        </div>
        <button
          :disabled="loading"
          class="w-full h-[50px] bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50"
          @click="handleStartNew"
        >
          Start Training
        </button>
        <div class="h-px w-full bg-neutral-200 dark:bg-[#334155]" />
        <div class="flex items-center justify-between w-full">
          <div class="flex gap-2 items-center">
            <img src="/icons/inbox-icon.svg" alt="" class="size-4" />
            <p class="font-semibold text-[13px] text-neutral-900 dark:text-[#f8fafc]">5–7 emails</p>
          </div>
          <div class="flex gap-2 items-center">
            <img src="/icons/clock-icon.svg" alt="" class="size-4" />
            <p class="font-semibold text-[13px] text-neutral-900 dark:text-[#f8fafc]">10–15 min</p>
          </div>
          <div class="flex gap-2 items-center">
            <img src="/icons/shield-check-icon.svg" alt="" class="size-4" />
            <p class="font-semibold text-[13px] text-neutral-900 dark:text-[#f8fafc]">80% to pass</p>
          </div>
        </div>
        <NuxtLink
          to="/training/practice"
          class="w-full border border-neutral-300 dark:border-[#334155] text-neutral-700 dark:text-[#94a3b8] font-medium px-4 py-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-[#161f2e] transition-colors text-center"
        >
          Practice
        </NuxtLink>
      </template>

      <!-- No assignment -->
      <template v-else>
        <p class="text-neutral-600 dark:text-[#94a3b8] text-sm text-center -mt-4">No active assignment. You can practice any time.</p>
        <button
          :disabled="loading"
          class="block w-full bg-brand-600 text-white font-medium px-4 py-3 rounded-lg hover:bg-brand-700 transition-colors text-center disabled:opacity-50"
          @click="handleStartPractice"
        >
          {{ loading ? 'Starting…' : 'Start Practice Session' }}
        </button>
      </template>
    </div>
  </div>
</template>
