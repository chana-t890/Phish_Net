export type ColorMode = 'light' | 'dark'

const STORAGE_KEY = 'color-mode'

function applyMode(value: ColorMode): void {
  document.documentElement.classList.toggle('dark', value === 'dark')
}

export function useColorMode() {
  const mode = useState<ColorMode>('color-mode', () => 'light')

  function set(value: ColorMode): void {
    mode.value = value
    if (import.meta.client) {
      applyMode(value)
      localStorage.setItem(STORAGE_KEY, value)
    }
  }

  function toggle(): void {
    set(mode.value === 'dark' ? 'light' : 'dark')
  }

  function init(): void {
    if (!import.meta.client) return
    const stored = localStorage.getItem(STORAGE_KEY) as ColorMode | null
    const preferred = stored ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    mode.value = preferred
    applyMode(preferred)
  }

  return { mode, toggle, init }
}
