import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  prisma: {
    sessionEmail: { findUnique: vi.fn(), update: vi.fn() },
    aiChatMessage: { create: vi.fn() },
    emailTemplate: { findMany: vi.fn(), findUnique: vi.fn() },
    trainingAssignment: { create: vi.fn() },
    session: { findUnique: vi.fn(), update: vi.fn() },
    userFlag: { create: vi.fn() },
    user: { findMany: vi.fn() },
    $transaction: vi.fn(),
  },
  requireAuth: vi.fn(),
  requireAdmin: vi.fn(),
  invokeModel: vi.fn(),
  invokeModelStream: vi.fn(),
}))

vi.mock('../server/utils/prisma', () => ({ prisma: mocks.prisma }))
vi.mock('../server/utils/bedrock', () => ({
  invokeModel: mocks.invokeModel,
  invokeModelStream: mocks.invokeModelStream,
}))
vi.mock('../server/utils/auth', () => ({
  requireAuth: mocks.requireAuth,
  requireAdmin: mocks.requireAdmin,
}))

import completeSession from '../server/api/session/complete.post'
import chat from '../server/api/session/chat.post'
import createAssignments from '../server/api/admin/assignments/index.post'
import listTemplates from '../server/api/admin/templates/index.get'
import listUsers from '../server/api/admin/users/index.get'
import saveFlag from '../server/api/session/flag.post'
import submitEmail from '../server/api/session/submit-email.post'

function event(body: unknown): { body: unknown } {
  return { body }
}

const expectedFlag = {
  id: 'expected-1',
  category: 'urgency_language',
  zone: null,
  startOffset: 0,
  endOffset: 6,
  text: 'Urgent',
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubGlobal('getQuery', vi.fn(() => ({})))
  vi.stubGlobal('setResponseHeaders', vi.fn())
  vi.stubGlobal('sendStream', vi.fn((_event: unknown, stream: ReadableStream) => stream))
  mocks.requireAuth.mockResolvedValue({ id: 'user-1', role: 'LEARNER' })
  mocks.requireAdmin.mockResolvedValue({ id: 'admin-1', role: 'ADMIN' })
})

describe('flag handler', () => {
  it('rejects a flagged text that does not match its offsets', async () => {
    mocks.prisma.sessionEmail.findUnique.mockResolvedValue({
      submitted: false,
      session: { userId: 'user-1' },
      generatedEmail: { body: 'Urgent notice' },
    })

    await expect(saveFlag(event({
      sessionEmailId: 'email-1',
      flagCategory: 'urgency_language',
      flaggedText: 'notice',
      startOffset: 0,
      endOffset: 6,
      zoneType: null,
    }))).rejects.toMatchObject({ statusCode: 400 })
    expect(mocks.prisma.userFlag.create).not.toHaveBeenCalled()
  })

  it('saves an exact body range for the owning user', async () => {
    mocks.prisma.sessionEmail.findUnique.mockResolvedValue({
      submitted: false,
      session: { userId: 'user-1' },
      generatedEmail: { body: 'Urgent notice' },
    })
    mocks.prisma.userFlag.create.mockResolvedValue({
      id: 'user-flag-1',
      sessionEmailId: 'email-1',
      flagCategory: 'urgency_language',
      flaggedText: 'Urgent',
      startOffset: 0,
      endOffset: 6,
      zoneType: null,
    })

    const result = await saveFlag(event({
      sessionEmailId: 'email-1',
      flagCategory: 'urgency_language',
      flaggedText: 'Urgent',
      startOffset: 0,
      endOffset: 6,
      zoneType: null,
    }))

    expect(result).toMatchObject({ id: 'user-flag-1', flaggedText: 'Urgent' })
  })
})

describe('session handlers', () => {
  it('rejects submitting another user\'s email', async () => {
    mocks.requireAuth.mockResolvedValue({ id: 'user-2', role: 'LEARNER' })
    mocks.prisma.sessionEmail.findUnique.mockResolvedValue({
      submitted: false,
      session: { userId: 'user-1' },
      generatedEmail: { expectedFlags: [] },
      userFlags: [],
    })

    await expect(submitEmail(event({ sessionEmailId: 'email-1' }))).rejects.toMatchObject({ statusCode: 403 })
    expect(mocks.prisma.sessionEmail.update).not.toHaveBeenCalled()
  })

  it('marks a phishing email as failed when submitted as legitimate', async () => {
    const submittedAt = new Date('2026-08-24T12:00:00.000Z')
    mocks.prisma.sessionEmail.findUnique.mockResolvedValue({
      id: 'email-1',
      submitted: false,
      session: { userId: 'user-1' },
      generatedEmail: { isPhishing: true, expectedFlags: [expectedFlag] },
      userFlags: [],
    })
    mocks.prisma.sessionEmail.update.mockResolvedValue({
      id: 'email-1',
      submitted: true,
      submittedAt,
      userPassed: false,
      generatedEmail: { expectedFlags: [expectedFlag] },
      userFlags: [],
    })

    const result = await submitEmail(event({ sessionEmailId: 'email-1', markedLegitimate: true }))

    expect(result).toMatchObject({ sessionEmailId: 'email-1', submitted: true, userPassed: false })
    expect(mocks.prisma.sessionEmail.update).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ markedLegitimate: true }),
    }))
  })

  it('tells the coach a reported phishing email was classified correctly even when scoring failed', async () => {
    mocks.prisma.sessionEmail.findUnique.mockResolvedValue({
      submitted: true,
      markedLegitimate: false,
      userPassed: false,
      reasoningAccepted: true,
      session: { userId: 'user-1' },
      generatedEmail: {
        isPhishing: true,
        subject: 'Urgent notice',
        sender: 'attacker@example.com',
        body: 'Urgent action required',
        expectedFlags: [expectedFlag],
      },
      userFlags: [],
      aiChatMessages: [],
    })
    mocks.invokeModelStream.mockReturnValue((async function* () {
      yield 'You missed a red flag.'
    })())

    const result = await chat(event({ sessionEmailId: 'email-1', message: 'The link looked suspicious.' }))
    const prompt = mocks.invokeModelStream.mock.calls[0][1].systemPrompt as string

    expect(prompt).toContain('CORRECT CLASSIFICATION, FAILED SCORE')
    expect(prompt).toContain('Never describe the final classification as incorrect.')
    const reader = (result as ReadableStream<Uint8Array>).getReader()
    const chunks: Uint8Array[] = []
    let readResult = await reader.read()
    while (!readResult.done) {
      chunks.push(readResult.value)
      readResult = await reader.read()
    }
    const streamText = new TextDecoder().decode(
      chunks.reduce((all, chunk) => new Uint8Array([...all, ...chunk]), new Uint8Array()),
    )
    expect(streamText).toContain('Your final classification was correct')
    expect(streamText).not.toContain('Your final classification was incorrect')
  })

  it('allows an approved inspiration template to be assigned directly', async () => {
    mocks.prisma.emailTemplate.findUnique.mockResolvedValue({ id: 'template-1', status: 'APPROVED' })
    mocks.prisma.user.findMany.mockResolvedValue([{ id: 'user-1' }])
    mocks.prisma.trainingAssignment.create.mockReturnValue({ id: 'assignment-1' })
    mocks.prisma.$transaction.mockResolvedValue([{ id: 'assignment-1' }])

    const result = await createAssignments(event({
      userIds: ['user-1'],
      deadline: '2099-01-01T00:00:00.000Z',
      templateId: 'template-1',
    }))

    expect(result).toEqual([{ id: 'assignment-1' }])
    expect(mocks.prisma.emailTemplate.findUnique).toHaveBeenCalledWith(expect.objectContaining({
      select: { id: true, status: true },
    }))
  })

  it('rejects completing another user\'s session', async () => {
    mocks.requireAuth.mockResolvedValue({ id: 'user-2', role: 'LEARNER' })
    mocks.prisma.session.findUnique.mockResolvedValue({ id: 'session-1', userId: 'user-1', sessionEmails: [] })

    await expect(completeSession(event({ sessionId: 'session-1' }))).rejects.toMatchObject({ statusCode: 403 })
    expect(mocks.prisma.$transaction).not.toHaveBeenCalled()
  })

  it('completes an owned session after all emails are submitted', async () => {
    const completedAt = new Date('2026-08-24T12:00:00.000Z')
    mocks.prisma.session.findUnique.mockResolvedValue({
      id: 'session-1',
      userId: 'user-1',
      sessionEmails: [{
        id: 'email-1',
        submitted: true,
        generatedEmail: { isPhishing: true, expectedFlags: [expectedFlag] },
        userFlags: [{
          id: 'user-flag-1',
          flagCategory: 'urgency_language',
          zoneType: null,
          startOffset: 0,
          endOffset: 6,
          flaggedText: 'Urgent',
        }],
      }],
    })
    mocks.prisma.$transaction.mockImplementation(async (callback: (tx: typeof mocks.prisma) => unknown) => callback(mocks.prisma))
    mocks.prisma.session.update.mockResolvedValue({ id: 'session-1', status: 'COMPLETED', score: 1, completedAt })

    const result = await completeSession(event({ sessionId: 'session-1' }))

    expect(result).toMatchObject({ sessionId: 'session-1', status: 'COMPLETED', score: 1 })
    expect(mocks.prisma.sessionEmail.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'email-1' },
      data: { userPassed: true },
    }))
  })
})

describe('admin authorization', () => {
  it('lists only admin-created templates in the dashboard', async () => {
    mocks.prisma.emailTemplate.findMany.mockResolvedValue([])

    await expect(listTemplates({})).resolves.toEqual([])
    expect(mocks.prisma.emailTemplate.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ sourceDataset: 'admin' }),
    }))
  })

  it('does not list users when the admin guard rejects the request', async () => {
    mocks.requireAdmin.mockRejectedValue(Object.assign(new Error('Forbidden'), { statusCode: 403 }))

    await expect(listUsers({})).rejects.toMatchObject({ statusCode: 403 })
    expect(mocks.prisma.user.findMany).not.toHaveBeenCalled()
  })

  it('lists users after the admin guard succeeds', async () => {
    mocks.prisma.user.findMany.mockResolvedValue([{ id: 'user-1', email: 'user@example.com' }])

    await expect(listUsers({})).resolves.toEqual([{ id: 'user-1', email: 'user@example.com' }])
    expect(mocks.requireAdmin).toHaveBeenCalled()
  })
})