<script setup lang="ts">
import type { AdminAssignmentListItem, AdminSessionStatus, AdminUser } from '~/types/admin'

definePageMeta({})

const route = useRoute()
const userId = computed(() => String(route.params.id ?? ''))
const saving = ref(false)
const assignmentsLoading = ref(false)
const assignmentsError = ref<string | null>(null)
const userAssignments = ref<AdminAssignmentListItem[]>([])

const {
  users,
  userSessions,
  loading,
  error,
  fetchUsers,
  fetchUserSessions,
  updateUser,
  clearUserSessions,
} = useAdminUsers()

const currentUser = computed<AdminUser | null>(
  () => users.value.find((user) => user.id === userId.value) ?? null,
)

onMounted(async () => {
  if (!userId.value) return
  await fetchUsers()
  await fetchUserSessions(userId.value)
  await fetchUserAssignments(userId.value)
})

watch(
  userId,
  async (nextId, prevId) => {
    if (!nextId || nextId === prevId) return
    clearUserSessions()
    userAssignments.value = []
    await Promise.all([fetchUserSessions(nextId), fetchUserAssignments(nextId)])
  },
)

onBeforeUnmount(() => {
  clearUserSessions()
  userAssignments.value = []
})

const activeAssignments = computed(() => {
  const now = Date.now()
  return userAssignments.value.filter((assignment) => {
    const status = assignment.latestSession?.status ?? 'IN_PROGRESS'
    const deadlineMs = new Date(assignment.deadline).getTime()
    const isFinal = status === 'COMPLETED' || status === 'FAILED'
    return !isFinal && deadlineMs >= now
  })
})

function formatDateTime(value: string | null): string {
  if (!value) return '-'
  return new Date(value).toLocaleString()
}

function formatScore(score: number | null): string {
  if (score === null) return '-'
  return `${(score * 100).toFixed(1)}%`
}

function statusClass(status: string): string {
  if (status === 'COMPLETED') return 'bg-green-100 text-green-700'
  if (status === 'FAILED') return 'bg-red-100 text-red-700'
  return 'bg-amber-100 text-amber-700'
}

function assignmentStatus(assignment: AdminAssignmentListItem): AdminSessionStatus {
  const status = assignment.latestSession?.status ?? 'IN_PROGRESS'
  if (status === 'IN_PROGRESS' && new Date(assignment.deadline).getTime() < Date.now()) {
    return 'FAILED'
  }
  return status
}

async function fetchUserAssignments(targetUserId: string): Promise<void> {
  assignmentsLoading.value = true
  assignmentsError.value = null
  try {
    const allAssignments = await $fetch<AdminAssignmentListItem[]>('/api/admin/assignments')
    userAssignments.value = allAssignments.filter((assignment) => assignment.user.id === targetUserId && !assignment.isPractice)
  } catch (e: any) {
    assignmentsError.value = e.data?.message ?? 'Failed to load user assignments'
  } finally {
    assignmentsLoading.value = false
  }
}

async function handleMakeAdmin(): Promise<void> {
  if (!currentUser.value) return
  if (currentUser.value.role === 'ADMIN') return

  saving.value = true
  await updateUser(currentUser.value.id, { role: 'ADMIN' })
  saving.value = false
}

</script>

<template>
  <AdminLayout>
    <template #title>
      {{ currentUser ? `${currentUser.name} · User Details` : 'User Details' }}
    </template>

    <div class="space-y-6">
      <NuxtLink
        to="/admin"
        class="inline-flex items-center rounded border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
      >
        Back to Users
      </NuxtLink>

      <p v-if="error" class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
        {{ error }}
      </p>

      <section class="rounded-lg border border-neutral-200 p-4">
        <h2 class="mb-3 text-base font-semibold text-neutral-900">Account Settings</h2>

        <div v-if="currentUser" class="grid gap-4 md:grid-cols-2">
          <div>
            <p class="text-xs uppercase tracking-wide text-neutral-500">Name</p>
            <p class="text-sm text-neutral-900">{{ currentUser.name }}</p>
          </div>
          <div>
            <p class="text-xs uppercase tracking-wide text-neutral-500">Email</p>
            <p class="text-sm text-neutral-900">{{ currentUser.email }}</p>
          </div>
          <div>
            <p class="mb-1 text-xs uppercase tracking-wide text-neutral-500">Role</p>
            <div class="flex items-center gap-2">
              <span
                class="rounded-full px-2 py-1 text-xs font-semibold"
                :class="currentUser.role === 'ADMIN' ? 'bg-brand-100 text-brand-700' : 'bg-neutral-100 text-neutral-700'"
              >
                {{ currentUser.role }}
              </span>
              <button
                v-if="currentUser.role !== 'ADMIN'"
                class="rounded bg-brand-600 px-2 py-1 text-xs font-medium text-white hover:bg-brand-700"
                :disabled="saving"
                @click="handleMakeAdmin"
              >
                Make Admin
              </button>
            </div>
          </div>
          <div>
            <p class="mb-1 text-xs uppercase tracking-wide text-neutral-500">Status</p>
            <span
              class="rounded-full px-2 py-1 text-xs font-semibold"
              :class="currentUser.deactivatedAt ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'"
            >
              {{ currentUser.deactivatedAt ? 'Deactivated' : 'Active' }}
            </span>
          </div>
        </div>

        <p v-else class="text-sm text-neutral-500">
          User metadata is unavailable. Session history can still be loaded if the id is valid.
        </p>
      </section>

      <section class="rounded-lg border border-neutral-200 p-4">
        <h2 class="mb-3 text-base font-semibold text-neutral-900">Active Assignments</h2>

        <p v-if="assignmentsError" class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {{ assignmentsError }}
        </p>

        <div v-if="assignmentsLoading && userAssignments.length === 0" class="text-sm text-neutral-500">
          Loading assignments...
        </div>

        <template v-else>
          <div class="space-y-3">
            <div v-if="activeAssignments.length === 0" class="text-sm text-neutral-500">No active assignments.</div>
            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-neutral-200 text-sm">
                <thead class="bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
                  <tr>
                    <th class="px-3 py-2">Deadline</th>
                    <th class="px-3 py-2">Status</th>
                    <th class="px-3 py-2">Attempt</th>
                    <th class="px-3 py-2">Score</th>
                    <th class="px-3 py-2">Created</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-neutral-200 bg-white text-neutral-700">
                  <tr v-for="assignment in activeAssignments" :key="assignment.id">
                    <td class="px-3 py-2">{{ formatDateTime(assignment.deadline) }}</td>
                    <td class="px-3 py-2">
                      <span class="rounded-full px-2 py-1 text-xs font-semibold" :class="statusClass(assignmentStatus(assignment))">
                        {{ assignmentStatus(assignment) }}
                      </span>
                    </td>
                    <td class="px-3 py-2">{{ assignment.latestSession?.attemptNumber ?? '-' }}</td>
                    <td class="px-3 py-2">{{ formatScore(assignment.latestSession?.score ?? null) }}</td>
                    <td class="px-3 py-2">{{ formatDateTime(assignment.createdAt) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </template>
      </section>

      <section class="rounded-lg border border-neutral-200 p-4">
        <h2 class="mb-3 text-base font-semibold text-neutral-900">Session History</h2>

        <div v-if="loading && userSessions.length === 0" class="text-sm text-neutral-500">
          Loading session history...
        </div>

        <div v-else-if="userSessions.length === 0" class="text-sm text-neutral-500">
          No sessions found for this user.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-neutral-200 text-sm">
            <thead class="bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th class="px-3 py-2">Started</th>
                <th class="px-3 py-2">Completed</th>
                <th class="px-3 py-2">Status</th>
                <th class="px-3 py-2">Score</th>
                <th class="px-3 py-2">Attempt</th>
                <th class="px-3 py-2">Deadline</th>
                <th class="px-3 py-2">Submitted</th>
                <th class="px-3 py-2">Phishing</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-200 bg-white text-neutral-700">
              <tr v-for="session in userSessions" :key="session.id">
                <td class="px-3 py-2">{{ formatDateTime(session.startedAt) }}</td>
                <td class="px-3 py-2">{{ formatDateTime(session.completedAt) }}</td>
                <td class="px-3 py-2">
                  <span class="rounded-full px-2 py-1 text-xs font-semibold" :class="statusClass(session.status)">
                    {{ session.status }}
                  </span>
                </td>
                <td class="px-3 py-2">{{ formatScore(session.score) }}</td>
                <td class="px-3 py-2">{{ session.attemptNumber }}</td>
                <td class="px-3 py-2">{{ formatDateTime(session.deadline) }}</td>
                <td class="px-3 py-2">{{ session.submittedCount }} / {{ session.emailCount }}</td>
                <td class="px-3 py-2">{{ session.phishingPassed }} / {{ session.phishingTotal }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </AdminLayout>
</template>
