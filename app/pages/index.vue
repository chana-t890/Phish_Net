<script setup lang="ts">
const { loggedIn } = useUserSession()
if (loggedIn.value) {
  await navigateTo('/training')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-blue-50 dark:bg-[#0f172a]">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-blue-800 dark:text-[#4f8ef7] mb-4">Phish-Net</h1>
      <p class="text-neutral-600 dark:text-[#94a3b8] mb-8">Phishing Awareness Training</p>
      <NuxtLink
        to="/training"
        class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Go to Training
      </NuxtLink>
    </div>
  </div>
</template>
