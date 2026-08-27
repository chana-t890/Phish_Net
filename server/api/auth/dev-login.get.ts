/**
 * Development login bypass. Only active when AUTH_DEV_EMAIL is set
 * AND the request host starts with "localhost". Skips Okta SAML entirely.
 */
import { prisma } from '~~/server/utils/prisma'
import { resolveRole } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const host = getRequestHeader(event, 'host') || ''

  const isLocalhost = host === 'localhost' || host.startsWith('localhost:')
  if (!config.authDevEmail || !isLocalhost || process.env.NODE_ENV === 'production') {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  const email = String(config.authDevEmail).toLowerCase()
  const role = resolveRole(email)

  const dbUser = await prisma.user.upsert({
    where: { email },
    update: { role },
    create: { email, name: 'Dev User', role },
  })

  await setUserSession(event, {
    user: {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role,
    },
  })

  return sendRedirect(event, '/')
})
