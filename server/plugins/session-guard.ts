/**
 * Startup guard: ensures NUXT_SESSION_PASSWORD is set before accepting traffic.
 * Without it, session cookies are unsigned and trivially forgeable.
 */
export default defineNitroPlugin(() => {
  const password = process.env.NUXT_SESSION_PASSWORD
  const isDev = process.env.AUTH_DEV_EMAIL && (process.env.NODE_ENV !== 'production')

  if (!password && !isDev) {
    throw new Error(
      'NUXT_SESSION_PASSWORD is required. Generate one with: openssl rand -base64 33',
    )
  }
})
