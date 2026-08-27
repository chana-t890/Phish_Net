<script setup lang="ts">
import type { ZoneType, FlagCategory, UserFlagLocal } from '~/types/session'

const props = defineProps<{
  type: ZoneType
  content: string
  sessionEmailId: string
  readonly: boolean
  existingFlag: UserFlagLocal | null
}>()

const { saveFlag, removeFlag } = useSession()

const showPopover = ref(false)
const anchor = ref<{ x: number; y: number } | null>(null)

const zoneClass = computed(() => {
  switch (props.type) {
    case 'sender':
      return 'inline-block bg-gray-100 dark:bg-[#334155] rounded-full px-2 py-0.5 text-sm font-mono text-neutral-700 dark:text-[#94a3b8]'
    case 'subject':
      return 'block w-full bg-blue-50 dark:bg-[#1e2c4a] border border-blue-200 dark:border-[#334155] rounded px-2 py-1 text-neutral-800 dark:text-[#f8fafc] font-medium'
    case 'url':
      return 'text-blue-600 dark:text-[#4f8ef7] underline cursor-pointer'
    case 'attachment':
      return 'inline-flex items-center gap-1 bg-gray-100 dark:bg-[#334155] border border-gray-200 dark:border-[#334155] rounded px-2 py-1 text-sm text-neutral-700 dark:text-[#94a3b8]'
  }
})

const isFlagged = computed(() => !!props.existingFlag)

function handleClick(e: MouseEvent) {
  if (props.readonly) return
  e.preventDefault() // prevent any link behavior
  anchor.value = { x: e.clientX, y: e.clientY }
  showPopover.value = true
}

async function handleConfirm(category: FlagCategory) {
  showPopover.value = false
  anchor.value = null

  if (props.existingFlag) {
    // Edit: remove old flag and create new one with updated category
    await removeFlag(props.existingFlag.id)
  }

  await saveFlag(props.sessionEmailId, {
    flagCategory: category,
    flaggedText: props.content,
    startOffset: null,
    endOffset: null,
    zoneType: props.type,
  })
}

async function handleRemove() {
  showPopover.value = false
  anchor.value = null
  if (props.existingFlag) {
    await removeFlag(props.existingFlag.id)
  }
}

function handleCancel() {
  showPopover.value = false
  anchor.value = null
}
</script>

<template>
  <span
    :class="[
      zoneClass,
      isFlagged ? 'ring-2 ring-brand-400' : '',
      !readonly ? 'cursor-pointer' : '',
    ]"
    @click="handleClick"
  ><span v-if="type === 'attachment'" class="inline-flex">
      <img src="/icons/attachment-light.svg" alt="" class="size-3.5 dark:hidden" />
      <img src="/icons/attachment-dark.svg" alt="" class="size-3.5 hidden dark:block" />
    </span>{{ content }}
  </span>

  <TagPopover
    v-if="showPopover"
    :anchor="anchor"
    :session-email-id="sessionEmailId"
    :prefill-category="existingFlag?.flagCategory ?? null"
    :existing-flag-id="existingFlag?.id ?? null"
    @confirm="handleConfirm"
    @remove="handleRemove"
    @cancel="handleCancel"
  />
</template>
