<script setup lang="ts">
import type { SessionEmail } from '~/types/session'

const props = defineProps<{
  sessionEmail: SessionEmail
}>()

const emit = defineEmits<{
  submit: [markedLegitimate: boolean]
}>()

const { removeFlag } = useSession()

const clearing = ref(false)

const hasFlags = computed(() => props.sessionEmail.userFlags.length > 0)

async function handleClearFlags() {
  if (!hasFlags.value || clearing.value) return
  clearing.value = true
  try {
    await Promise.all(props.sessionEmail.userFlags.map(f => removeFlag(f.id)))
  } finally {
    clearing.value = false
  }
}

function handleReport() {
  if (!hasFlags.value || clearing.value) return
  emit('submit', false)
}

async function handleMarkLegitimate() {
  if (clearing.value) return
  if (hasFlags.value) {
    clearing.value = true
    try {
      // Remove all existing flags when marking as legitimate
      await Promise.all(props.sessionEmail.userFlags.map(f => removeFlag(f.id)))
    } finally {
      clearing.value = false
    }
  }
  emit('submit', true)
}
</script>

<template>
  <div class="flex items-start gap-3 px-6 py-3">
    <button
      :disabled="!hasFlags || clearing"
      class="border-[1.5px] border-brand-600 dark:border-[#4f8ef7] text-brand-600 dark:text-[#4f8ef7] text-[13px] font-bold px-5 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-[#1e2c4a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      @click="handleClearFlags"
    >
      Clear Flags
    </button>

    <button
      :disabled="!hasFlags || clearing"
      class="flex items-center gap-2 bg-red-500 text-white text-[13px] font-bold px-5 py-3 rounded-lg hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      @click="handleReport"
    >
      <img src="/icons/report-flag-light.svg" alt="" class="size-4" />
      Finish and Report
    </button>

    <button
      :disabled="clearing"
      class="bg-brand-600 text-white text-[13px] font-bold px-5 py-3 rounded-lg hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      @click="handleMarkLegitimate"
    >
      Mark as Legitimate
    </button>
  </div>
</template>
