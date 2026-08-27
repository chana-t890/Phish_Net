<script setup lang="ts">
const route = useRoute()

const links = [
  { to: '/admin', label: 'Users' },
  { to: '/admin/assignments', label: 'Assignments' },
  { to: '/admin/templates', label: 'Email templates' },
  { to: '/admin/analytics', label: 'Analytics' },
]

function isActive(path: string): boolean {
  if (path === '/admin') {
    return route.path === '/admin' || route.path.startsWith('/admin/users/')
  }

  return route.path === path || route.path.startsWith(`${path}/`)
}
</script>

<template>
  <aside class="h-full border-r border-neutral-200 bg-neutral-50 p-4">
    <div class="mb-6">
      <p class="text-xs font-semibold uppercase tracking-wide text-neutral-500">Admin</p>
      <h2 class="mt-1 text-lg font-semibold text-neutral-900">Dashboard</h2>
    </div>

    <nav class="space-y-1">
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="block rounded-md px-3 py-2 text-sm font-medium transition-colors"
        :class="isActive(link.to)
          ? 'bg-brand-600 text-white'
          : 'text-neutral-700 hover:bg-neutral-200'"
      >
        {{ link.label }}
      </NuxtLink>
    </nav>
  </aside>
</template>
