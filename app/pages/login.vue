<template>
  <div class="min-h-screen flex items-center justify-center bg-blue-50 dark:bg-[#0f172a] px-4">
    <div class="w-full max-w-md bg-white dark:bg-[#1e293b] rounded-lg shadow-md p-8 text-center">
      <h1 class="text-2xl font-bold text-blue-800 dark:text-[#4f8ef7] mb-1">Phish-Net</h1>
      <p class="text-neutral-600 dark:text-[#94a3b8] mb-6">Sign in to continue</p>

      <p v-if="errorMessage" class="mb-4 rounded-md bg-red-50 text-red-700 text-sm px-3 py-2">
        {{ errorMessage }}
      </p>
      <p v-if="signedOut" class="mb-4 rounded-md bg-blue-50 text-blue-700 text-sm px-3 py-2">
        You have been signed out.
      </p>

      <a
        href="/api/auth/saml/sso/login"
        class="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Sign in with Single Sign-On
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({})

const route = useRoute()

const signedOut = computed(() => route.query.signout === '1')
const errorMessage = computed(() => {
  if (route.query.error === 'saml') return 'Sign-in failed. Please try again.'
  if (route.query.error === 'no-email') return 'No email address received from identity provider.'
  if (route.query.error === 'deactivated') return 'Your account has been deactivated. Contact an admin.'
  if (route.query.error === 'session') return 'Sign-in failed while creating your session. Please try again.'
  return ''
})
</script>
