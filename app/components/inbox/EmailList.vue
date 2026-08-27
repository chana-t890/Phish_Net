<script setup lang="ts">
import type { SessionEmail } from '~/types/session'

defineProps<{
  sessionEmails: SessionEmail[]
  activeEmailId: string | null
}>()

const emit = defineEmits<{ select: [emailId: string] }>()
</script>

<template>
  <div class="flex flex-col">
    <EmailListItem
      v-for="email in sessionEmails"
      :key="email.id"
      :session-email="email"
      :is-active="email.id === activeEmailId"
      @click="emit('select', email.id)"
    />
  </div>
</template>
