<script setup lang="ts">
definePageMeta({})

const router = useRouter()
const { session, loading, error, startSession } = useSession()

async function handleStart() {
  await startSession(true)
  if (session.value) {
    router.push(`/training/session?id=${session.value.id}`)
  }
}
</script>

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-[#0f172a] flex items-center justify-center p-8">
    <div class="bg-white dark:bg-[#1e293b] rounded-xl border border-neutral-200 dark:border-[#334155] p-8 max-w-md w-full shadow-sm">
      <h1 class="text-2xl font-semibold text-neutral-900 dark:text-[#f8fafc] mb-2">Practice Mode</h1>
      <p class="text-neutral-500 dark:text-[#94a3b8] text-sm mb-6">
        Practice sessions are not recorded in your official training history and don't count toward any assignment.
      </p>
      <p v-if="error" class="text-red-600 text-sm mb-4">{{ error }}</p>
      <button
        :disabled="loading"
        class="w-full bg-brand-600 text-white font-medium px-4 py-3 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50"
        @click="handleStart"
      >
        {{ loading ? 'Starting…' : 'Start Practice Session' }}
      </button>
      <NuxtLink
        to="/training"
        class="block mt-3 text-center text-sm text-neutral-500 dark:text-[#94a3b8] hover:text-neutral-700 dark:hover:text-[#f8fafc]"
      >
        ← Back to training
      </NuxtLink>
    </div>
  </div>
</template>
