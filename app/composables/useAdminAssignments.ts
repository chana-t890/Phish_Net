import type {
  AdminAssignmentListItem,
  AdminCreateAssignmentBody,
  AdminCreatedAssignment,
  AdminUser,
} from '~/types/admin'

export function useAdminAssignments() {
  const assignments = useState<AdminAssignmentListItem[]>('admin-assignments-list', () => [])
  const users = useState<AdminUser[]>('admin-assignment-users', () => [])
  const loading = useState<boolean>('admin-assignments-loading', () => false)
  const error = useState<string | null>('admin-assignments-error', () => null)

  async function fetchAssignments(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      assignments.value = await $fetch<AdminAssignmentListItem[]>('/api/admin/assignments')
    } catch (e: any) {
      error.value = e.data?.message ?? 'Failed to load assignments'
    } finally {
      loading.value = false
    }
  }

  async function fetchUsers(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      users.value = await $fetch<AdminUser[]>('/api/admin/users')
    } catch (e: any) {
      error.value = e.data?.message ?? 'Failed to load users for assignment'
    } finally {
      loading.value = false
    }
  }

  async function createAssignments(payload: AdminCreateAssignmentBody): Promise<AdminCreatedAssignment[] | null> {
    loading.value = true
    error.value = null
    try {
      const created = await $fetch<AdminCreatedAssignment[]>('/api/admin/assignments', {
        method: 'POST',
        body: payload,
      })

      await fetchAssignments()
      return created
    } catch (e: any) {
      error.value = e.data?.message ?? 'Failed to create assignments'
      return null
    } finally {
      loading.value = false
    }
  }

  function reset(): void {
    assignments.value = []
    users.value = []
    loading.value = false
    error.value = null
  }

  return {
    assignments: readonly(assignments),
    users: readonly(users),
    loading: readonly(loading),
    error: readonly(error),
    fetchAssignments,
    fetchUsers,
    createAssignments,
    reset,
  }
}
