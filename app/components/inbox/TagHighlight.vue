<script lang="ts">
import { defineComponent, computed, h, type PropType, type VNode } from 'vue'
import type { FlagCategory, UserFlagLocal } from '~/types/session'

const CATEGORY_COLORS: Record<FlagCategory, string> = {
  suspicious_url: 'bg-red-500/30',
  urgency_language: 'bg-orange-500/30',
  grammar_error: 'bg-yellow-400/30',
  fake_sender: 'bg-purple-500/30',
  info_request: 'bg-pink-500/30',
  money_request: 'bg-rose-500/30',
  too_good_to_be_true: 'bg-green-500/30',
  threatening_language: 'bg-orange-600/30',
  suspicious_attachment: 'bg-gray-500/30',
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

const TOOLTIP_CLASS =
  'pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-neutral-800 px-2 py-0.5 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity z-50'

export default defineComponent({
  name: 'TagHighlight',
  props: {
    flags: {
      type: Array as PropType<UserFlagLocal[]>,
      required: true,
    },
    readonly: {
      type: Boolean,
      required: true,
    },
  },
  emits: {
    edit: (_flagId: string) => true,
  },
  setup(props, { slots, emit }) {
    const primaryFlag = computed(() => props.flags[0] ?? null)

    const tooltipLabel = computed(() => {
      if (props.flags.length === 1) return CATEGORY_LABELS[props.flags[0].flagCategory]
      return props.flags.map(f => CATEGORY_LABELS[f.flagCategory]).join(' + ')
    })

    const editable = computed(() => !props.readonly && primaryFlag.value !== null)

    function handleClick(e: MouseEvent) {
      e.stopPropagation()
      if (editable.value && primaryFlag.value) {
        emit('edit', primaryFlag.value.id)
      }
    }

    return () => {
      // Render the slot (body text) exactly once, then wrap it in one colored
      // layer per flag. Each layer uses a semi-transparent background so
      // overlapping tags naturally blend via normal alpha compositing —
      // this works correctly against both light and dark surfaces, unlike
      // mix-blend-mode: multiply which only reads correctly on white.
      let node: VNode | VNode[] = slots.default ? slots.default() : []

      for (let i = props.flags.length - 1; i >= 0; i--) {
        const isOutermost = i === 0
        node = h(
          'span',
          {
            class: [
              CATEGORY_COLORS[props.flags[i].flagCategory],
              'rounded-sm',
              isOutermost && editable.value ? 'cursor-pointer hover:brightness-95' : '',
            ],
            ...(isOutermost ? { onClick: handleClick } : {}),
          },
          [node],
        )
      }

      return h('span', { class: 'relative inline group' }, [
        h('span', { class: TOOLTIP_CLASS, 'data-ignore-offset': '' }, tooltipLabel.value),
        node,
      ])
    }
  },
})
</script>
