import type {
  AdminPatchUserBody,
  AdminPatchedUser,
  AdminUser,
  AdminUserSession,
} from '~/types/admin'

export function useAdminUsers() {
  const users = useState<AdminUser[]>('admin-users-list', () => [])
  const userSessions = useState<AdminUserSession[]>('admin-user-sessions', () => [])
  const loading = useState<boolean>('admin-users-loading', () => false)
  const error = useState<string | null>('admin-users-error', () => null)

  async function fetchUsers(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      users.value = await $fetch<AdminUser[]>('/api/admin/users')
    } catch (e: any) {
      error.value = e.data?.message ?? 'Failed to load users'
    } finally {
      loading.value = false
    }
  }

  async function updateUser(userId: string, payload: AdminPatchUserBody): Promise<AdminPatchedUser | null> {
    loading.value = true
    error.value = null
    try {
      const updated = await $fetch<AdminPatchedUser>(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        body: payload,
      })

      users.value = users.value.map((user) =>
        user.id === userId
          ? {
              ...user,
              role: updated.role,
              deactivatedAt: updated.deactivatedAt,
              updatedAt: updated.updatedAt,
            }
          : user,
      )

      return updated
    } catch (e: any) {
      error.value = e.data?.message ?? 'Failed to update user'
      return null
    } finally {
      loading.value = false
    }
  }

  async function fetchUserSessions(userId: string): Promise<void> {
    loading.value = true
    error.value = null
    try {
      userSessions.value = await $fetch<AdminUserSession[]>(`/api/admin/users/${userId}/sessions`)
    } catch (e: any) {
      error.value = e.data?.message ?? 'Failed to load user sessions'
    } finally {
      loading.value = false
    }
  }

  function clearUserSessions(): void {
    userSessions.value = []
  }

  function reset(): void {
    users.value = []
    userSessions.value = []
    loading.value = false
    error.value = null
  }

  return {
    users: readonly(users),
    userSessions: readonly(userSessions),
    loading: readonly(loading),
    error: readonly(error),
    fetchUsers,
    updateUser,
    fetchUserSessions,
    clearUserSessions,
    reset,
  }
}
