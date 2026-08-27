import { prisma } from './prisma'
import type { H3Event } from 'h3'
import type { Role } from '../../prisma/generated/prisma/enums'

/**
 * Maps an email to a Role based on the ADMIN_EMAILS env var (comma-separated,
 * case-insensitive). Re-evaluated on every login per SPEC §4.3.
 */
export function resolveRole(email: string): Role {
  const adminEmails = useRuntimeConfig().adminEmails as string
  const admins = adminEmails
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  return admins.includes(email.toLowerCase()) ? 'ADMIN' : 'LEARNER'
}

/**
 * Returns the authenticated user record from the database, based on the SAML
 * session cookie set by the ACS callback (server/routes/auth.post.ts).
 * Re-fetches from the DB on every call so role changes / deactivation take
 * effect immediately without requiring re-login.
 */
export async function getAuthUser(event: H3Event) {
  const session = await getUserSession(event)
  const email = session?.user?.email
  if (!email) return null

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || user.deactivatedAt) return null
  return user
}

export async function requireAuth(event: H3Event) {
  const user = await getAuthUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  return user
}

export async function requireAdmin(event: H3Event) {
  const user = await requireAuth(event)
  if (user.role !== 'ADMIN') throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  return user
}

