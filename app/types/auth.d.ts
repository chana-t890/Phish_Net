// Augments nuxt-auth-utils' session types with the fields we store in
// setUserSession (server/routes/auth.post.ts, server/api/auth/dev-login.get.ts).
declare module '#auth-utils' {
  interface User {
    id: string
    email: string
    name: string
    role: 'ADMIN' | 'LEARNER'
  }
}

export {}
