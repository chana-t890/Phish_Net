import passport from 'passport'
import { getSamlStrategy } from '~~/server/utils/passport'

passport.use('saml', getSamlStrategy())

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const host = getRequestHeader(event, 'host') || ''

  // Dev bypass: strict localhost only, requires AUTH_DEV_EMAIL set, non-production
  const isLocalhost = host === 'localhost' || host.startsWith('localhost:')
  if (config.authDevEmail && isLocalhost && process.env.NODE_ENV !== 'production') {
    return sendRedirect(event, '/api/auth/dev-login')
  }

  return new Promise<void>((resolve, reject) => {
    passport.authenticate('saml', { session: false })(
      event.node.req,
      event.node.res,
      (err: unknown) => {
        if (err) return reject(err)
        resolve()
      },
    )
  })
})
