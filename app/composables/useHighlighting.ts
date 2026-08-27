type PendingSelection = {
  text: string
  startOffset: number
  endOffset: number
}

// Not a singleton — each EmailBody instance gets its own highlighting state
export function useHighlighting() {
  const pendingSelection = ref<PendingSelection | null>(null)
  const showPopover = ref(false)
  const popoverAnchor = ref<{ x: number; y: number } | null>(null)

  function onMouseUp(event: MouseEvent, containerEl: HTMLElement): void {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed) {
      clearPending()
      return
    }

    const range = selection.getRangeAt(0)

    // Ensure the selection is within the email body container
    if (!containerEl.contains(range.commonAncestorContainer)) {
      clearPending()
      return
    }

    // Compute both boundaries from the range itself. Deriving endOffset from
    // selectedText.length breaks for large selections that span existing
    // highlights (whose tooltip text can leak into toString()).
    let startOffset = getAbsoluteOffset(containerEl, range.startContainer, range.startOffset)
    let endOffset = getAbsoluteOffset(containerEl, range.endContainer, range.endOffset)
    if (startOffset > endOffset) [startOffset, endOffset] = [endOffset, startOffset]

    // Reconstruct the flagged text from the body text nodes (ignoring tooltip
    // labels) so it stays consistent with the offsets above.
    const bodyText = getContainerText(containerEl)

    // Trim leading/trailing whitespace from the OFFSETS (not just the text).
    // A trailing newline/space left in the stored range renders as a
    // highlighted line break under whitespace-pre-wrap, making the highlight
    // appear longer than the selected word — and stacking overlaps compounds it.
    const raw = bodyText.slice(startOffset, endOffset)
    startOffset += raw.length - raw.trimStart().length
    endOffset -= raw.length - raw.trimEnd().length

    const text = bodyText.slice(startOffset, endOffset)
    if (!text) {
      clearPending()
      return
    }

    pendingSelection.value = { text, startOffset, endOffset }
    popoverAnchor.value = { x: event.clientX, y: event.clientY }
    showPopover.value = true
  }

  function clearPending(): void {
    pendingSelection.value = null
    showPopover.value = false
    popoverAnchor.value = null
    window.getSelection()?.removeAllRanges()
  }

  /**
   * TreeWalker that visits only the email body's text nodes, skipping any
   * marked with `data-ignore-offset` (e.g. tooltip labels rendered inside
   * highlight spans) so they never affect offset counting.
   */
  function makeBodyTextWalker(container: HTMLElement): TreeWalker {
    return document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
      acceptNode(textNode) {
        let el = textNode.parentElement
        while (el && el !== container) {
          if (el.hasAttribute('data-ignore-offset')) return NodeFilter.FILTER_REJECT
          el = el.parentElement
        }
        return NodeFilter.FILTER_ACCEPT
      },
    })
  }

  /** Concatenate all body text (excluding ignored nodes). */
  function getContainerText(container: HTMLElement): string {
    const walker = makeBodyTextWalker(container)
    let text = ''
    while (walker.nextNode()) text += walker.currentNode.textContent ?? ''
    return text
  }

  /**
   * Compute the absolute character offset (within the body text) of a DOM
   * boundary point (node, nodeOffset). Handles both text-node anchors and
   * element-node anchors — the latter occur for large selections whose
   * start/end land on a segment boundary rather than inside a text node.
   */
  function getAbsoluteOffset(
    container: HTMLElement,
    node: Node,
    nodeOffset: number,
  ): number {
    // A range from the container start up to the boundary point; used to
    // position each text node relative to the boundary.
    const boundary = document.createRange()
    boundary.setStart(container, 0)
    try {
      boundary.setEnd(node, nodeOffset)
    } catch {
      return 0
    }

    const walker = makeBodyTextWalker(container)
    let charCount = 0

    while (walker.nextNode()) {
      const current = walker.currentNode
      const len = current.textContent?.length ?? 0

      // Is the end of this text node at or before the boundary?
      if (boundary.comparePoint(current, len) <= 0) {
        charCount += len
        continue
      }

      // The boundary falls inside (or before) this text node.
      if (boundary.comparePoint(current, 0) <= 0 && boundary.endContainer === current) {
        return charCount + boundary.endOffset
      }
      return charCount
    }

    return charCount
  }

  return {
    pendingSelection: readonly(pendingSelection),
    showPopover: readonly(showPopover),
    popoverAnchor: readonly(popoverAnchor),
    onMouseUp,
    clearPending,
  }
}
