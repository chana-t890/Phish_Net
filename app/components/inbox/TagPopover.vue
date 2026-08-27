<script setup lang="ts">
import type { FlagCategory } from '~/types/session'

const props = defineProps<{
  anchor: { x: number; y: number } | null
  sessionEmailId: string
  prefillCategory: FlagCategory | null
  existingFlagId: string | null
}>()

const emit = defineEmits<{
  confirm: [category: FlagCategory]
  remove: []
  cancel: []
}>()

const CATEGORY_OPTIONS: { label: string; value: FlagCategory }[] = [
  { label: 'Suspicious / spoofed URL', value: 'suspicious_url' },
  { label: 'Urgency / pressure language', value: 'urgency_language' },
  { label: 'Spelling or grammar error', value: 'grammar_error' },
  { label: 'Fake / spoofed sender address', value: 'fake_sender' },
  { label: 'Request for personal information', value: 'info_request' },
  { label: 'Request for money / gift cards', value: 'money_request' },
  { label: 'Too-good-to-be-true offer', value: 'too_good_to_be_true' },
  { label: 'Threatening / fear-inducing language', value: 'threatening_language' },
  { label: 'Suspicious file attachment', value: 'suspicious_attachment' },
]

const selectedCategory = ref<FlagCategory | null>(props.prefillCategory)
const popoverEl = ref<HTMLElement | null>(null)

// Compute clamped position so the popover never overflows the viewport
const position = computed(() => {
  if (!props.anchor) return { top: '0px', left: '0px' }
  const width = 360
  const height = 420
  const x = Math.min(props.anchor.x, window.innerWidth - width - 8)
  const y = Math.min(props.anchor.y + 8, window.innerHeight - height - 8)
  return { top: `${y}px`, left: `${x}px` }
})

function selectCategory(value: FlagCategory) {
  selectedCategory.value = value
}

function handleConfirm() {
  if (selectedCategory.value) emit('confirm', selectedCategory.value)
}

// Close on Escape key
function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('cancel')
}

// Close on click outside
function onPointerDown(e: PointerEvent) {
  if (popoverEl.value && !popoverEl.value.contains(e.target as Node)) {
    emit('cancel')
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
  document.addEventListener('pointerdown', onPointerDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
  document.removeEventListener('pointerdown', onPointerDown)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="anchor"
      ref="popoverEl"
      class="fixed z-50 flex flex-col gap-4 p-4 w-[360px] bg-white dark:bg-[#1e293b] border border-neutral-200 dark:border-[#334155] rounded-xl shadow-lg"
      :style="position"
    >
      <p class="font-bold text-sm text-neutral-900 dark:text-[#f8fafc]">Tag this as…</p>

      <div class="flex flex-col gap-0.5 w-full">
        <button
          v-for="opt in CATEGORY_OPTIONS"
          :key="opt.value"
          type="button"
          class="flex items-center px-2.5 py-2 rounded-md w-full text-left transition-colors"
          :class="selectedCategory === opt.value
            ? 'bg-brand-600 text-white font-semibold'
            : 'text-neutral-500 dark:text-[#94a3b8] font-medium hover:bg-neutral-50 dark:hover:bg-[#161f2e]'"
          @click="selectCategory(opt.value)"
        >
          <span class="flex-1 text-xs">{{ opt.label }}</span>
          <svg v-if="selectedCategory === opt.value" class="size-3.5" fill="none" viewBox="0 0 14 14">
            <path d="M11.6662 3.5L5.25017 9.9162L2.3338 6.99975" stroke="white" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>
      </div>

      <div class="flex gap-3 items-start justify-end w-full">
        <button
          class="px-3.5 py-2 rounded-lg text-sm font-semibold text-neutral-500 dark:text-[#94a3b8] hover:bg-neutral-50 dark:hover:bg-[#161f2e] transition-colors"
          @click="emit('cancel')"
        >
          Cancel
        </button>
        <button
          :disabled="!selectedCategory"
          class="px-3.5 py-2 rounded-lg text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          @click="handleConfirm"
        >
          Tag It
        </button>
      </div>

      <button
        v-if="existingFlagId"
        class="w-full text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 px-3 py-1.5 rounded transition-colors -mt-2"
        @click="emit('remove')"
      >
        Remove tag
      </button>
    </div>
  </Teleport>
</template>
