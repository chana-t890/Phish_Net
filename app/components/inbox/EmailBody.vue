<script setup lang="ts">
import type { FlagCategory, UserFlagLocal, EmailUrl } from '~/types/session'
import type { SessionEmail } from '~/types/session'

const props = defineProps<{
  sessionEmail: SessionEmail
  readonly: boolean
}>()

const { saveFlag, removeFlag } = useSession()
const { pendingSelection, showPopover, popoverAnchor, onMouseUp, clearPending } = useHighlighting()

const bodyContainerEl = ref<HTMLElement | null>(null)

// The flag being edited via click on an existing highlight
const editingFlag = ref<UserFlagLocal | null>(null)
const editAnchor = ref<{ x: number; y: number } | null>(null)

// ─────────────────────────────────────────────
// Segment building
// ─────────────────────────────────────────────

type Segment = {
  text: string
  flags: UserFlagLocal[]
  urlData: EmailUrl | null
}

const segments = computed<Segment[]>(() => {
  const body = props.sessionEmail.generatedEmail.body
  const urls = props.sessionEmail.generatedEmail.urls ?? []
  const bodyFlags = props.sessionEmail.userFlags.filter(
    f => f.startOffset !== null && f.endOffset !== null && !f.zoneType,
  )

  // Collect all boundary points from flag and URL offsets
  const points = new Set<number>([0, body.length])

  const urlPositions: Array<{ start: number; end: number; url: EmailUrl }> = []
  for (const url of urls) {
    const idx = body.indexOf(url.displayText)
    if (idx === -1) continue
    const end = idx + url.displayText.length
    points.add(idx)
    points.add(end)
    urlPositions.push({ start: idx, end, url })
  }

  for (const flag of bodyFlags) {
    points.add(flag.startOffset!)
    points.add(flag.endOffset!)
  }

  const sorted = Array.from(points).sort((a, b) => a - b)
  const result: Segment[] = []

  for (let i = 0; i < sorted.length - 1; i++) {
    const start = sorted[i]
    const end = sorted[i + 1]
    const text = body.slice(start, end)
    if (!text) continue

    const coveringFlags = bodyFlags.filter(
      f => f.startOffset! <= start && f.endOffset! >= end,
    )
    const urlMatch = urlPositions.find(u => u.start <= start && u.end >= end)

    result.push({ text, flags: coveringFlags, urlData: urlMatch?.url ?? null })
  }

  return result
})

// ─────────────────────────────────────────────
// Mouse selection handler
// ─────────────────────────────────────────────

function handleMouseUp(e: MouseEvent) {
  if (props.readonly || !bodyContainerEl.value) return
  onMouseUp(e, bodyContainerEl.value)
}

// ─────────────────────────────────────────────
// Popover actions — new selection
// ─────────────────────────────────────────────

async function handleConfirmNew(category: FlagCategory) {
  if (!pendingSelection.value) return
  const selection = pendingSelection.value
  clearPending()
  try {
    await saveFlag(props.sessionEmail.id, {
      flagCategory: category,
      flaggedText: selection.text,
      startOffset: selection.startOffset,
      endOffset: selection.endOffset,
      zoneType: null,
    })
  } catch (error) {
    console.error('Failed to save email flag', error)
  }
}

function handleCancelNew() {
  clearPending()
}

// ─────────────────────────────────────────────
// Popover actions — edit existing highlight
// ─────────────────────────────────────────────

function handleEditFlag(flagId: string, e?: MouseEvent) {
  if (props.readonly) return
  const flag = props.sessionEmail.userFlags.find(f => f.id === flagId)
  if (!flag) return
  editingFlag.value = flag
  editAnchor.value = e ? { x: e.clientX, y: e.clientY } : { x: 200, y: 200 }
}

async function handleConfirmEdit(category: FlagCategory) {
  if (!editingFlag.value) return
  await removeFlag(editingFlag.value.id)
  await saveFlag(props.sessionEmail.id, {
    flagCategory: category,
    flaggedText: editingFlag.value.flaggedText,
    startOffset: editingFlag.value.startOffset,
    endOffset: editingFlag.value.endOffset,
    zoneType: null,
  })
  editingFlag.value = null
  editAnchor.value = null
}

async function handleRemoveEdit() {
  if (!editingFlag.value) return
  await removeFlag(editingFlag.value.id)
  editingFlag.value = null
  editAnchor.value = null
}

function handleCancelEdit() {
  editingFlag.value = null
  editAnchor.value = null
}
</script>

<template>
  <div
    ref="bodyContainerEl"
    class="whitespace-pre-wrap text-sm text-neutral-800 dark:text-[#f8fafc] leading-relaxed select-text"
    :class="{ 'cursor-text': !readonly }"
    @mouseup="handleMouseUp"
  >
    <template v-for="(segment, i) in segments" :key="i">
      <!-- URL predefined zone -->
      <PredefinedZone
        v-if="segment.urlData"
        type="url"
        :content="segment.urlData.displayText"
        :session-email-id="sessionEmail.id"
        :readonly="readonly"
        :existing-flag="sessionEmail.userFlags.find(f => f.zoneType === 'url' && f.flaggedText === segment.urlData!.displayText) ?? null"
      />

      <!-- Highlighted body text -->
      <TagHighlight
        v-else-if="segment.flags.length"
        :flags="segment.flags"
        :readonly="readonly"
        @edit="(flagId) => handleEditFlag(flagId)"
      >{{ segment.text }}</TagHighlight>

      <!-- Plain text -->
      <span v-else>{{ segment.text }}</span>
    </template>
  </div>

  <!-- Popover for new selection -->
  <TagPopover
    v-if="showPopover && pendingSelection"
    :anchor="popoverAnchor"
    :session-email-id="sessionEmail.id"
    :prefill-category="null"
    :existing-flag-id="null"
    @confirm="handleConfirmNew"
    @cancel="handleCancelNew"
  />

  <!-- Popover for editing existing highlight -->
  <TagPopover
    v-if="editingFlag"
    :anchor="editAnchor"
    :session-email-id="sessionEmail.id"
    :prefill-category="editingFlag.flagCategory"
    :existing-flag-id="editingFlag.id"
    @confirm="handleConfirmEdit"
    @remove="handleRemoveEdit"
    @cancel="handleCancelEdit"
  />
</template>
