import { readRawBody } from 'h3'
import { parse } from 'querystring'
import passport from 'passport'
import { getSamlStrategy } from '~~/server/utils/passport'
import { prisma } from '~~/server/utils/prisma'
import { resolveRole } from '~~/server/utils/auth'

passport.use('saml', getSamlStrategy())

/**
 * SAML ACS callback. Okta POSTs the SAML Response here.
 * Validates signature, extracts identity, upserts user in DB, sets session cookie, redirects to /.
 */
export default defineEventHandler(async (event) => {
  const rawBody = await readRawBody(event)
  const body = parse(rawBody?.toString() || '')
  delete body.RelayState
  ;(event.node.req as unknown as { body: unknown }).body = body

  return new Promise<void>((resolve) => {
    passport.authenticate(
      'saml',
      { session: false },
      async (err: unknown, user: Record<string, unknown> | false) => {
        if (err || !user) {
          console.error('SAML auth failed:', err)
          event.node.res.writeHead(302, { Location: '/login?error=saml' })
          event.node.res.end()
          return resolve()
        }

        // NameIDFormat is emailAddress per IdP metadata, so nameID == email.
        const email = String(
          user.email || user.nameID || ''
        ).toLowerCase()

        if (!email) {
          event.node.res.writeHead(302, { Location: '/login?error=no-email' })
          event.node.res.end()
          return resolve()
        }

        const firstName = (user.firstName as string) || ''
        const lastName = (user.lastName as string) || ''
        const name = `${firstName} ${lastName}`.trim() || email
        const role = resolveRole(email)

        try {
          // Upsert user in DB — create on first login, update name/role on subsequent logins.
          const dbUser = await prisma.user.upsert({
            where: { email },
            update: { name, role },
            create: { email, name, role },
          })

          if (dbUser.deactivatedAt) {
            event.node.res.writeHead(302, { Location: '/login?error=deactivated' })
            event.node.res.end()
            return resolve()
          }

          await setUserSession(event, {
            user: {
              id: dbUser.id,
              email: dbUser.email,
              name: dbUser.name,
              role: dbUser.role,
            },
          })

          event.node.res.writeHead(302, { Location: '/' })
          event.node.res.end()
          resolve()
        } catch (upsertErr) {
          console.error('Failed to upsert user or set session:', upsertErr)
          event.node.res.writeHead(302, { Location: '/login?error=session' })
          event.node.res.end()
          resolve()
        }
      },
    )(event.node.req, event.node.res)
  })
})
