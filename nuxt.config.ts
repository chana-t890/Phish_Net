// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: false },

  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-auth-utils',
  ],

  components: [
    { path: '~/components', pathPrefix: false },
  ],

  nitro: {
    // Enable SSE for streaming AI responses
    experimental: {
      websocket: true,
    },
  },

  runtimeConfig: {
    // Server-only secrets
    databaseUrl: '',
    samlEntryPoint: process.env.SAML_ENTRY_POINT || '',
    samlIssuer: process.env.SAML_ISSUER || 'http://localhost:3000',
    samlIdpCert: process.env.SAML_IDP_CERT || '',
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    authDevEmail: process.env.AUTH_DEV_EMAIL || '',
    awsRegion: process.env.AWS_REGION || '',
    awsProfile: process.env.AWS_PROFILE || '',
    bedrockModelId: process.env.BEDROCK_MODEL_ID || '',
    adminEmails: process.env.ADMIN_EMAILS || '',
    kaggleUsername: '',
    kaggleKey: '',
    session: {
      name: 'phishnet-session',
      password: process.env.NUXT_SESSION_PASSWORD || '',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },

    public: {
      // Nothing sensitive exposed to client
    },
  },

  css: ['~/assets/css/main.css'],

  typescript: {
    strict: true,
  },
})
