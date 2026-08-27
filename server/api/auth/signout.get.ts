export default defineEventHandler(async (event) => {
  await clearUserSession(event)
  return sendRedirect(event, '/login?signout=1')
})
