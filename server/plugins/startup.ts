import { ingestKaggleTemplates } from '../utils/kaggle'

/**
 * Server startup plugin
 * Validates required environment variables, then seeds email_templates from
 * Kaggle when the table is empty. Seeding failures are non-fatal so the app
 * can still boot (e.g. missing Kaggle credentials in dev).
 */

export default defineNitroPlugin(async (nitroApp) => {
  const requiredEnvVars = [
    'DATABASE_URL',
  ]

  const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

  if (missingVars.length > 0) {
    const errorMessage = `
      ❌ Server startup failed. Missing required environment variables:
      ${missingVars.map((v) => `  - ${v}`).join('\n')}

      Please set all required variables in .env or your deployment environment.
    `
    console.error(errorMessage)
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
  }

  console.log('✅ Environment validation passed')

  try {
    const summary = await ingestKaggleTemplates()
    if (summary.skipped) {
      console.log('✅ Email templates already seeded — skipping Kaggle ingestion')
    } else {
      console.log(`✅ Kaggle ingestion complete — inserted ${summary.recordsInserted} template(s)`)
    }
  } catch (error) {
    console.warn(
      `⚠️  Kaggle ingestion skipped: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
})
