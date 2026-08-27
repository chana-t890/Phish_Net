<script setup lang="ts">
import type { AdminUser } from '~/types/admin'

definePageMeta({})

// Search text entered by the admin.
const searchQuery = ref('')

// Shared users state + actions from the composable data layer.
const { users, loading, error, fetchUsers } = useAdminUsers()

// Client-side search filter (name/email) for the users table.
const filteredUsers = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return users.value

  return users.value.filter((user) =>
    user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query),
  )
})

// Initial data load when the page opens.
onMounted(async () => {
  await fetchUsers()
})

// Formats API date strings for readable table output.
function formatDate(value: string | null | undefined): string {
  if (!value) return '-'
  return new Date(value).toLocaleString()
}

</script>

<template>
  <AdminLayout>
    <template #title>Users</template>

    <template #actions>
      <!-- Manual refresh action for reloading users from the server. -->
      <button
        class="rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
        :disabled="loading"
        @click="fetchUsers"
      >
        Refresh
      </button>
    </template>

    <div class="space-y-4">
      <div>
        <!-- Search input drives the computed filteredUsers list. -->
        <label for="user-search" class="mb-1 block text-sm font-medium text-neutral-700">Search users</label>
        <input
          id="user-search"
          v-model="searchQuery"
          type="text"
          placeholder="Search by name or email"
          class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        >
      </div>

      <!-- API/composable error feedback -->
      <p v-if="error" class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
        {{ error }}
      </p>

      <!-- Initial loading state before we have table data -->
      <div v-if="loading && users.length === 0" class="text-sm text-neutral-500">Loading users...</div>

      <!-- Empty state after filtering or when no users exist -->
      <div v-else-if="filteredUsers.length === 0" class="text-sm text-neutral-500">
        No users found.
      </div>

      <!-- Primary users table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-neutral-200 text-sm">
          <thead class="bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th class="px-3 py-2">Name</th>
              <th class="px-3 py-2">Email</th>
              <th class="px-3 py-2">Role</th>
              <th class="px-3 py-2">Status</th>
              <th class="px-3 py-2">Created</th>
              <th class="px-3 py-2">Updated</th>
              <th class="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-200 bg-white text-neutral-700">
            <tr v-for="user in filteredUsers" :key="user.id">
              <td class="px-3 py-2 font-medium text-neutral-900">{{ user.name }}</td>
              <td class="px-3 py-2">{{ user.email }}</td>
              <td class="px-3 py-2">
                <span
                  class="rounded-full px-2 py-1 text-xs font-semibold"
                  :class="user.role === 'ADMIN' ? 'bg-brand-100 text-brand-700' : 'bg-neutral-100 text-neutral-700'"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="px-3 py-2">
                <span
                  class="rounded-full px-2 py-1 text-xs font-semibold"
                  :class="user.deactivatedAt ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'"
                >
                  {{ user.deactivatedAt ? 'Deactivated' : 'Active' }}
                </span>
              </td>
              <td class="px-3 py-2">{{ formatDate(user.createdAt) }}</td>
              <td class="px-3 py-2">{{ formatDate(user.updatedAt) }}</td>
              <td class="px-3 py-2">
                <NuxtLink
                  :to="`/admin/users/${user.id}`"
                  class="rounded border border-neutral-300 px-2 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  View
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>
