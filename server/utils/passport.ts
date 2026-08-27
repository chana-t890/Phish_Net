import { Strategy as SamlStrategy, type VerifyWithoutRequest } from '@node-saml/passport-saml'

let strategy: SamlStrategy | null = null

/**
 * Build and cache the SAML strategy from runtime config. The strategy is created
 * once on first access and reused for all subsequent calls.
 */
export function getSamlStrategy(): SamlStrategy {
  if (strategy) return strategy

  const config = useRuntimeConfig()

  const entryPoint = (config.samlEntryPoint as string || '').trim()
  const idpCert = (config.samlIdpCert as string || '').trim()
  if (!entryPoint) {
    throw new Error('SAML_ENTRY_POINT is required but missing or empty')
  }
  if (!idpCert) {
    throw new Error('SAML_IDP_CERT is required but missing or empty')
  }

  const verify: VerifyWithoutRequest = (profile, done) => done(null, profile ?? undefined)

  strategy = new SamlStrategy(
    {
      callbackUrl: `${config.baseUrl}/auth`,
      entryPoint: config.samlEntryPoint as string,
      issuer: config.samlIssuer as string,
      idpCert: config.samlIdpCert as string,
    },
    verify,
    verify,
  )
  return strategy
}
