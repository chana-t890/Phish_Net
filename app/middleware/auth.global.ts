// Global route middleware — protects all pages. Unauthenticated users are sent to /login.
export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()

  const publicRoutes = ['/login']
  if (publicRoutes.includes(to.path)) return

  if (!loggedIn.value) {
    return navigateTo('/login')
  }
})
