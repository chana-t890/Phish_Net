<script setup lang="ts">
import type { SessionEmail, ExpectedFlag, UserFlagLocal, FlagCategory } from '~/types/session'

const props = defineProps<{
  sessionEmail: SessionEmail
}>()

// ─────────────────────────────────────────────
// Segment classification
// ─────────────────────────────────────────────

type SegmentType = 'correct' | 'false-positive' | 'missed' | 'plain'

type ReviewSegment = {
  text: string
  type: SegmentType
  label: string | null
}

const CATEGORY_LABELS: Record<FlagCategory, string> = {
  suspicious_url: 'Suspicious URL',
  urgency_language: 'Urgency Language',
  grammar_error: 'Grammar Error',
  fake_sender: 'Fake Sender',
  info_request: 'Info Request',
  money_request: 'Money Request',
  too_good_to_be_true: 'Too Good to Be True',
  threatening_language: 'Threatening Language',
  suspicious_attachment: 'Suspicious Attachment',
}

const segments = computed<ReviewSegment[]>(() => {
  const body = props.sessionEmail.generatedEmail.body
  const userBodyFlags = props.sessionEmail.userFlags.filter(
    f => f.zoneType === null && f.startOffset !== null && f.endOffset !== null,
  )
  const revealedBodyFlags = (props.sessionEmail.revealedFlags ?? []).filter(
    f => f.zone === null,
  )

  const points = new Set<number>([0, body.length])
  for (const f of userBodyFlags) { points.add(f.startOffset!); points.add(f.endOffset!) }
  for (const f of revealedBodyFlags) { points.add(f.startOffset); points.add(f.endOffset) }

  const sorted = Array.from(points).sort((a, b) => a - b)
  const result: ReviewSegment[] = []

  for (let i = 0; i < sorted.length - 1; i++) {
    const start = sorted[i]
    const end = sorted[i + 1]
    const text = body.slice(start, end)
    if (!text) continue

    const coveringUser = userBodyFlags.filter(f => f.startOffset! <= start && f.endOffset! >= end)
    const coveringRevealed = revealedBodyFlags.filter(f => f.startOffset <= start && f.endOffset >= end)

    let type: SegmentType = 'plain'
    let label: string | null = null

    if (coveringUser.length > 0 && coveringRevealed.length > 0) {
      type = 'correct'
      label = CATEGORY_LABELS[coveringRevealed[0].category]
    }
    else if (coveringUser.length > 0) {
      type = 'false-positive'
      label = CATEGORY_LABELS[coveringUser[0].flagCategory]
    }
    else if (coveringRevealed.length > 0) {
      type = 'missed'
      label = CATEGORY_LABELS[coveringRevealed[0].category]
    }

    result.push({ text, type, label })
  }

  return result
})

const SEGMENT_STYLES: Record<SegmentType, string> = {
  correct: 'bg-green-500/30 rounded-sm',
  'false-positive': 'bg-yellow-400/30 rounded-sm',
  missed: 'bg-red-500/30 rounded-sm',
  plain: '',
}
</script>

<template>
  <div class="text-sm text-neutral-800 dark:text-[#f8fafc] leading-relaxed whitespace-pre-wrap font-mono">
    <!-- Body with annotations -->
    <span
      v-for="(seg, i) in segments"
      :key="i"
      class="relative group"
      :class="seg.type !== 'plain' ? 'inline' : ''"
    >
      <!-- Tooltip -->
      <span
        v-if="seg.label && seg.type !== 'plain'"
        class="pointer-events-none absolute -top-6 left-0 whitespace-nowrap rounded bg-neutral-800 px-2 py-0.5 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity z-50"
      >
        {{ seg.type === 'missed' ? '⚠ Missed: ' : seg.type === 'false-positive' ? '✗ ' : '✓ ' }}{{ seg.label }}
      </span>
      <span :class="SEGMENT_STYLES[seg.type]">{{ seg.text }}</span>
    </span>
  </div>
</template>
