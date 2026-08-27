<template>
  <NuxtLayout>
    <header
      v-if="loggedIn && route.path !== '/login'"
      class="relative flex items-center justify-between h-12 px-6 border-b border-neutral-200 dark:border-[#334155] bg-white dark:bg-[#1e293b]"
    >
      <div class="flex items-center gap-2.5">
        <div class="flex items-center justify-center size-8">
          <img src="/icons/logo-hook-light.svg" alt="" class="size-7" />
        </div>
        <span class="font-extrabold text-xl text-brand-600 dark:text-[#4f8ef7]">PhishNet</span>
      </div>

      <div class="flex items-center gap-4">
        <button
          type="button"
          aria-label="Toggle dark mode"
          class="flex items-center justify-center size-[26px] rounded-full border border-neutral-200 dark:border-[#334155] bg-neutral-50 dark:bg-[#161f2e] text-neutral-500 dark:text-[#94a3b8] hover:opacity-80 transition-opacity"
          @click="toggle"
        >
          <ClientOnly>
            <img v-if="mode === 'dark'" src="/icons/moon-dark.svg" alt="" class="size-3.5" />
            <img v-else src="/icons/moon-light.svg" alt="" class="size-3.5" />
          </ClientOnly>
        </button>

        <button
          type="button"
          class="flex items-center justify-center size-8 rounded-2xl bg-blue-50 dark:bg-[#1e3a8a] text-brand-600 dark:text-[#4f8ef7] font-bold text-xs"
          @click="showAvatarMenu = !showAvatarMenu"
        >
          {{ initials }}
        </button>
      </div>

      <!-- Avatar dropdown -->
      <div
        v-if="showAvatarMenu"
        class="absolute right-6 top-14 w-60 flex flex-col gap-3 p-3 rounded-xl border border-neutral-200 dark:border-[#334155] bg-white dark:bg-[#1e293b] shadow-lg"
      >
        <div>
          <p class="font-semibold text-sm text-neutral-900 dark:text-[#f8fafc]">{{ user?.name }}</p>
          <p class="text-xs text-neutral-500 dark:text-[#94a3b8]">{{ user?.email }}</p>
        </div>
        <div class="h-px bg-neutral-200 dark:bg-[#334155]" />
        <a
          href="/api/auth/signout"
          class="flex items-center gap-2.5 text-[13px] font-medium text-neutral-900 dark:text-[#f8fafc] hover:text-brand-600 dark:hover:text-[#4f8ef7]"
        >
          <img src="/icons/logout.svg" alt="" class="size-[18px]" />
          Log out
        </a>
      </div>
    </header>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute()
const { loggedIn, user } = useUserSession()
const { mode, toggle } = useColorMode()

const showAvatarMenu = ref(false)

const initials = computed(() => {
  const name = user.value?.name?.trim()
  if (!name) return '?'
  const parts = name.split(/\s+/)
  return parts.length === 1
    ? parts[0].slice(0, 2).toUpperCase()
    : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
})

// Close the avatar dropdown on route change
watch(() => route.path, () => { showAvatarMenu.value = false })
</script>
