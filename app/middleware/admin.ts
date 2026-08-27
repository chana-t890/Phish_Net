// Admin role guard — apply via definePageMeta({ middleware: 'admin' }) on /admin/** pages.
export default defineNuxtRouteMiddleware(() => {
  const { loggedIn, user } = useUserSession()

  if (!loggedIn.value) {
    return navigateTo('/login')
  }
  if (user.value?.role !== 'ADMIN') {
    return navigateTo('/training')
  }
})
