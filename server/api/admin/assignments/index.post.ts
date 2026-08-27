import { prisma } from '../../../utils/prisma'
import { requireAdmin } from '../../../utils/auth'

type CreateAssignmentBody = {
  userIds?: string[]
  deadline?: string
  templateId?: string | null
}

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event)
  const body = (await readBody(event)) as CreateAssignmentBody

  if (!Array.isArray(body?.userIds) || body.userIds.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'userIds must be a non-empty array' })
  }
  if (body.userIds.some((userId) => typeof userId !== 'string' || userId.trim().length === 0)) {
    throw createError({ statusCode: 400, statusMessage: 'userIds must contain only non-empty strings' })
  }
  if (new Set(body.userIds).size !== body.userIds.length) {
    throw createError({ statusCode: 400, statusMessage: 'userIds must not contain duplicates' })
  }
  if (!body.deadline || isNaN(Date.parse(body.deadline))) {
    throw createError({ statusCode: 400, statusMessage: 'deadline must be a valid ISO date string' })
  }

  const deadline = new Date(body.deadline)
  if (deadline <= new Date()) {
    throw createError({ statusCode: 400, statusMessage: 'deadline must be in the future' })
  }

  let templateId: string | null = null
  if (body.templateId !== undefined && body.templateId !== null) {
    if (typeof body.templateId !== 'string' || body.templateId.trim().length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'templateId must be a non-empty string' })
    }

    const template = await prisma.emailTemplate.findUnique({
      where: { id: body.templateId },
      select: { id: true, status: true },
    })
    if (!template) {
      throw createError({ statusCode: 400, statusMessage: 'Template not found' })
    }
    if (template.status !== 'APPROVED') {
      throw createError({ statusCode: 400, statusMessage: 'Only approved templates can be assigned' })
    }
    templateId = template.id
  }

  const existingUsers = await prisma.user.findMany({
    where: { id: { in: body.userIds } },
    select: { id: true },
  })
  const existingUserIds = new Set(existingUsers.map((user) => user.id))
  const missingUserIds = body.userIds.filter((userId) => !existingUserIds.has(userId))
  if (missingUserIds.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: `Cannot create assignments: user(s) not found: ${missingUserIds.join(', ')}`,
    })
  }

  const created = await prisma.$transaction(
    body.userIds.map((userId) =>
      prisma.trainingAssignment.create({
        data: {
          userId,
          assignedBy: admin.id,
          templateId,
          deadline,
          isPractice: false,
        },
        select: { id: true, userId: true, deadline: true, createdAt: true },
      }),
    ),
  )

  return created
})
