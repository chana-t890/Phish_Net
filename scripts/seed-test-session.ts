/**
 * Dev-only helper: creates one in-progress practice session owned by the local
 * dev user (dev@phishnet.local) so the learner flow can be tested without Kaggle
 * seeding or Bedrock generation.
 *
 * Run:  npx --yes tsx scripts/seed-test-session.ts
 */
import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../prisma/generated/prisma/client'

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('Missing required env: DATABASE_URL')

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Same user the dev auth stub auto-provisions, so the session is "owned" by you.
  const user = await prisma.user.upsert({
    where: { email: 'dev@phishnet.local' },
    update: {},
    create: { email: 'dev@phishnet.local', name: 'Dev User', role: 'ADMIN' },
  })

  // --- Phishing email (with expected flags computed from the body) ---
  const phishBody =
    'Dear User,\n\n'
    + 'Your account has been suspended. Verify your identity immediately at '
    + 'http://secure-verify.example.net or your access will be locked within 24 hours.\n\n'
    + 'IT Support'

  const flag = (text: string, category: string, zone: string | null = null) => {
    const startOffset = phishBody.indexOf(text)
    return { text, startOffset, endOffset: startOffset + text.length, category, zone }
  }

  const phish = await prisma.generatedEmail.create({
    data: {
      subject: 'Urgent: your account has been suspended',
      body: phishBody,
      sender: 'IT Support <it-support@secure-verify.example.net>',
      isPhishing: true,
      attachments: [],
      urls: [
        {
          displayText: 'http://secure-verify.example.net',
          href: 'http://secure-verify.example.net',
          suspicious: true,
        },
      ],
      expectedFlags: {
        create: [
          flag('immediately', 'urgency_language'),
          flag('http://secure-verify.example.net', 'suspicious_url'),
          flag('locked within 24 hours', 'threatening_language'),
        ],
      },
    },
  })

  // --- Legitimate email (no expected flags) ---
  const legitBody =
    'Hi team,\n\n'
    + 'Reminder: the Q3 planning meeting is this Thursday at 2pm in Room B. '
    + 'Please bring your department reports.\n\n'
    + 'Thanks,\nSarah'

  const legit = await prisma.generatedEmail.create({
    data: {
      subject: 'Q3 planning meeting — Thursday 2pm',
      body: legitBody,
      sender: 'Sarah Lee <sarah.lee@yourcompany.com>',
      isPhishing: false,
      attachments: [],
      urls: [],
    },
  })

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      isPractice: true,
      status: 'IN_PROGRESS',
      sessionEmails: {
        create: [
          { generatedEmail: { connect: { id: phish.id } } },
          { generatedEmail: { connect: { id: legit.id } } },
        ],
      },
    },
  })

  console.log('\n✅ Test session created')
  console.log('   Session ID:', session.id)
  console.log('   Open:       http://localhost:3000/training/session?id=' + session.id + '\n')
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
