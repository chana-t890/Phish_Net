<script setup lang="ts">
import type { AdminAssignmentListItem, AdminSessionStatus } from '~/types/admin'

definePageMeta({})

const selectedUserIds = ref<string[]>([])
const dueDate = ref('')
const selectedTemplateId = ref('')
const directTemplates = ref<Array<{ id: string; rawSubject: string; category: string; usageMode: 'INSPIRATION' | 'DIRECT' }>>([])
const userFilter = ref('ALL')
const statusFilter = ref<'ALL' | AdminSessionStatus>('ALL')
const userFilterMenuOpen = ref(false)
const userFilterSearch = ref('')
const createFormOpen = ref(false)
const createUserSearch = ref('')

const banner = ref<{ type: 'success' | 'error'; message: string } | null>(null)

const { assignments, users, loading, error, fetchAssignments, fetchUsers, createAssignments } = useAdminAssignments()

const filteredAssignments = computed(() => {
  return assignments.value.filter((assignment) => {
    const matchesUser = userFilter.value === 'ALL' || assignment.user.id === userFilter.value
    const currentStatus: AdminSessionStatus = assignment.latestSession?.status ?? 'IN_PROGRESS'
    const matchesStatus = statusFilter.value === 'ALL' || currentStatus === statusFilter.value

    return matchesUser && matchesStatus
  })
})

const filteredUserOptions = computed(() => {
  const query = userFilterSearch.value.trim().toLowerCase()
  if (!query) return users.value

  return users.value.filter((user) => {
    return (
      user.name.toLowerCase().includes(query)
      || user.email.toLowerCase().includes(query)
    )
  })
})

const selectedUserFilterLabel = computed(() => {
  if (userFilter.value === 'ALL') return 'All users'
  const selected = users.value.find((user) => user.id === userFilter.value)
  return selected ? selected.name : 'All users'
})

const filteredCreateUsers = computed(() => {
  const query = createUserSearch.value.trim().toLowerCase()
  if (!query) return users.value

  return users.value.filter((user) => {
    return (
      user.name.toLowerCase().includes(query)
      || user.email.toLowerCase().includes(query)
    )
  })
})

const allUsersSelected = computed(() => {
  return users.value.length > 0 && selectedUserIds.value.length === users.value.length
})

const isCreateDisabled = computed(() => {
  return loading.value || selectedUserIds.value.length === 0 || dueDate.value.length === 0
})

onMounted(async () => {
  await Promise.all([
    fetchUsers(),
    fetchAssignments(),
    $fetch<Array<{ id: string; rawSubject: string; category: string; usageMode: 'INSPIRATION' | 'DIRECT' }>>('/api/admin/templates?status=APPROVED')
      .then((templates) => { directTemplates.value = templates })
      .catch(() => { directTemplates.value = [] }),
  ])
})

function formatDate(value: string | null): string {
  if (!value) return '-'
  return new Date(value).toLocaleString()
}

function statusBadgeClass(status: AdminSessionStatus): string {
  if (status === 'COMPLETED') return 'bg-green-100 text-green-700'
  if (status === 'FAILED') return 'bg-red-100 text-red-700'
  return 'bg-amber-100 text-amber-700'
}

function assignmentStatus(assignment: AdminAssignmentListItem): AdminSessionStatus {
  return assignment.latestSession?.status ?? 'IN_PROGRESS'
}

function deadlineDateToIso(dateValue: string): string {
  const localEndOfDay = new Date(`${dateValue}T23:59:59`)
  return localEndOfDay.toISOString()
}

function toggleSelectedUser(userId: string): void {
  if (selectedUserIds.value.includes(userId)) {
    selectedUserIds.value = selectedUserIds.value.filter((id) => id !== userId)
    return
  }

  selectedUserIds.value = [...selectedUserIds.value, userId]
}

function toggleAssignAllUsers(checked: boolean): void {
  if (checked) {
    selectedUserIds.value = users.value.map((user) => user.id)
    return
  }

  selectedUserIds.value = []
}

function toggleUserFilterMenu(): void {
  userFilterMenuOpen.value = !userFilterMenuOpen.value
  if (!userFilterMenuOpen.value) {
    userFilterSearch.value = ''
  }
}

function selectUserFilter(value: string): void {
  userFilter.value = value
  userFilterMenuOpen.value = false
  userFilterSearch.value = ''
}

function openCreateForm(): void {
  createFormOpen.value = true
}

function closeCreateForm(): void {
  createFormOpen.value = false
  createUserSearch.value = ''
}

function getLikelyDuplicateNames(): string[] {
  const selected = new Set(selectedUserIds.value)
  const duplicates = assignments.value.filter((assignment) => {
    if (!selected.has(assignment.user.id)) return false
    const status = assignmentStatus(assignment)
    return status === 'IN_PROGRESS'
  })

  return [...new Set(duplicates.map((item) => item.user.name))]
}

async function handleCreateAssignments(): Promise<void> {
  banner.value = null

  if (!dueDate.value || selectedUserIds.value.length === 0) {
    banner.value = { type: 'error', message: 'Select at least one user and a due date.' }
    return
  }

  const duplicateNames = getLikelyDuplicateNames()
  if (duplicateNames.length > 0 && import.meta.client) {
    const label = duplicateNames.slice(0, 4).join(', ')
    const suffix = duplicateNames.length > 4 ? ` and ${duplicateNames.length - 4} more` : ''
    const confirmed = window.confirm(
      `Some selected users may already have active assignments (${label}${suffix}). Create new assignments anyway?`,
    )
    if (!confirmed) return
  }

  const created = await createAssignments({
    userIds: selectedUserIds.value,
    deadline: deadlineDateToIso(dueDate.value),
    templateId: selectedTemplateId.value || null,
  })

  if (created) {
    banner.value = {
      type: 'success',
      message: `Created ${created.length} assignment${created.length === 1 ? '' : 's'}.`,
    }
    selectedUserIds.value = []
    dueDate.value = ''
    selectedTemplateId.value = ''
    createUserSearch.value = ''
    createFormOpen.value = false
    return
  }

  banner.value = {
    type: 'error',
    message: error.value ?? 'Failed to create assignments.',
  }
}
</script>

<template>
  <AdminLayout>
    <template #title>Assignments</template>

    <template #actions>
      <button
        v-if="createFormOpen"
        class="rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
        :disabled="loading"
        @click="closeCreateForm"
      >
        Back to Assignments
      </button>
      <div v-else class="flex items-center gap-2">
        <button
          class="rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="loading"
          @click="openCreateForm"
        >
          Create Assignment
        </button>
        <button
          class="rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          :disabled="loading"
          @click="fetchAssignments"
        >
          Refresh
        </button>
      </div>
    </template>

    <div class="space-y-6">
      <p v-if="error" class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
        {{ error }}
      </p>

      <p
        v-if="banner"
        class="rounded-md border px-3 py-2 text-sm"
        :class="banner.type === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'"
      >
        {{ banner.message }}
      </p>

      <section v-if="createFormOpen" class="rounded-lg border border-neutral-200 p-4">
        <h2 class="mb-3 text-base font-semibold text-neutral-900">Create Assignment</h2>

        <div class="space-y-4">
          <div>
            <p class="mb-2 text-sm font-medium text-neutral-700">Choose users</p>
            <label class="mb-2 flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                :checked="allUsersSelected"
                :disabled="loading || users.length === 0"
                @change="toggleAssignAllUsers(($event.target as HTMLInputElement).checked)"
              >
              <span>Assign to all users</span>
            </label>

            <input
              v-model="createUserSearch"
              type="text"
              placeholder="Search users by name or email"
              class="mb-2 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            >

            <div class="max-h-48 space-y-2 overflow-y-auto rounded-md border border-neutral-200 p-3">
              <label
                v-for="user in filteredCreateUsers"
                :key="user.id"
                class="flex items-center gap-2 text-sm text-neutral-700"
              >
                <input
                  type="checkbox"
                  :checked="selectedUserIds.includes(user.id)"
                  :disabled="loading"
                  @change="toggleSelectedUser(user.id)"
                >
                <span>{{ user.name }} <span class="text-neutral-500">({{ user.email }})</span></span>
              </label>

              <p v-if="users.length === 0" class="text-sm text-neutral-500">No users available.</p>
              <p v-else-if="filteredCreateUsers.length === 0" class="text-sm text-neutral-500">No users match your search.</p>
            </div>
          </div>

          <div class="max-w-xs">
            <label for="assignment-due" class="mb-1 block text-sm font-medium text-neutral-700">Due date</label>
            <input
              id="assignment-due"
              v-model="dueDate"
              type="date"
              class="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            >
            <p class="mt-1 text-xs text-neutral-500">Deadline is saved as end of day (local time).</p>
          </div>

          <div class="max-w-xl">
            <label for="assignment-template" class="mb-1 block text-sm font-medium text-neutral-700">Direct email template</label>
            <select
              id="assignment-template"
              v-model="selectedTemplateId"
              class="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 dark:bg-[#1e293b] dark:text-[#f8fafc]"
            >
              <option value="">Use AI-generated emails</option>
              <option v-for="template in directTemplates" :key="template.id" :value="template.id">
                {{ template.category }}: {{ template.rawSubject }}{{ template.usageMode === 'INSPIRATION' ? ' (AI library)' : '' }}
              </option>
            </select>
            <p class="mt-1 text-xs text-neutral-500">Choose any approved email to show exactly once in each learner session, or leave this set to AI-generated emails.</p>
          </div>

          <div>
            <div class="flex items-center gap-2">
              <button
                class="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="isCreateDisabled"
                @click="handleCreateAssignments"
              >
                Create Assignment
              </button>
              <button
                class="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                :disabled="loading"
                @click="closeCreateForm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </section>

      <section v-else class="rounded-lg border border-neutral-200 p-4">
        <div class="mb-3 flex flex-wrap items-end gap-3">
          <div class="relative">
            <label class="mb-1 block text-sm font-medium text-neutral-700">Filter by user</label>
            <button
              type="button"
              class="min-w-[220px] rounded-md border border-neutral-300 bg-white px-3 py-2 text-left text-sm text-neutral-700"
              @click="toggleUserFilterMenu"
            >
              <div class="flex items-center justify-between gap-2">
                <span>{{ selectedUserFilterLabel }}</span>
                <span class="text-xs text-neutral-500">{{ userFilterMenuOpen ? '▲' : '▼' }}</span>
              </div>
            </button>

            <div
              v-if="userFilterMenuOpen"
              class="absolute z-20 mt-1 w-full rounded-md border border-neutral-200 bg-white p-2 shadow-lg"
            >
              <input
                v-model="userFilterSearch"
                type="text"
                placeholder="Search users..."
                class="mb-2 w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
              >

              <div class="max-h-56 overflow-y-auto">
                <button
                  type="button"
                  class="block w-full rounded px-2 py-1.5 text-left text-sm hover:bg-neutral-100"
                  @click="selectUserFilter('ALL')"
                >
                  All users
                </button>
                <button
                  v-for="user in filteredUserOptions"
                  :key="user.id"
                  type="button"
                  class="block w-full rounded px-2 py-1.5 text-left text-sm hover:bg-neutral-100"
                  @click="selectUserFilter(user.id)"
                >
                  {{ user.name }}
                </button>

                <p v-if="filteredUserOptions.length === 0" class="px-2 py-1.5 text-sm text-neutral-500">
                  No users match your search.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label for="filter-status" class="mb-1 block text-sm font-medium text-neutral-700">Filter by status</label>
            <select
              id="filter-status"
              v-model="statusFilter"
              class="rounded-md border border-neutral-300 px-3 py-2 text-sm"
            >
              <option value="ALL">All statuses</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>
        </div>

        <h2 class="mb-3 text-base font-semibold text-neutral-900">Assignments</h2>

        <div v-if="loading && assignments.length === 0" class="text-sm text-neutral-500">
          Loading assignments...
        </div>

        <div v-else-if="filteredAssignments.length === 0" class="text-sm text-neutral-500">
          No assignments found for the selected filters.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-neutral-200 text-sm">
            <thead class="bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th class="px-3 py-2">Name</th>
                <th class="px-3 py-2">Email</th>
                <th class="px-3 py-2">Assigned Date</th>
                <th class="px-3 py-2">Due Date</th>
                <th class="px-3 py-2">Email Template</th>
                <th class="px-3 py-2">Status</th>
                <th class="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-200 bg-white text-neutral-700">
              <tr v-for="assignment in filteredAssignments" :key="assignment.id">
                <td class="px-3 py-2 font-medium text-neutral-900">{{ assignment.user.name }}</td>
                <td class="px-3 py-2">{{ assignment.user.email }}</td>
                <td class="px-3 py-2">{{ formatDate(assignment.createdAt) }}</td>
                <td class="px-3 py-2">{{ formatDate(assignment.deadline) }}</td>
                <td class="max-w-[220px] px-3 py-2 text-xs">
                  <span v-if="assignment.template" class="text-neutral-700">{{ assignment.template.rawSubject }}</span>
                  <span v-else class="text-neutral-400">AI-generated</span>
                </td>
                <td class="px-3 py-2">
                  <span class="rounded-full px-2 py-1 text-xs font-semibold" :class="statusBadgeClass(assignmentStatus(assignment))">
                    {{ assignmentStatus(assignment) }}
                  </span>
                </td>
                <td class="px-3 py-2">
                  <NuxtLink
                    :to="`/admin/users/${assignment.user.id}`"
                    class="rounded border border-neutral-300 px-2 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                  >
                    View
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </AdminLayout>
</template>
