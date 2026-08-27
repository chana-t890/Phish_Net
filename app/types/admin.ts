// The only role values the admin UI is allowed to read/write.
export type AdminUserRole = 'ADMIN' | 'LEARNER'

// The status values shown in admin progress and reporting screens.
export type AdminSessionStatus = 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'

// A single user row for the admin users table.
export type AdminUser = {
  id: string
  name: string
  email: string
  role: AdminUserRole
  deactivatedAt: string | null
  createdAt: string
  updatedAt: string
}

// What the admin page sends when changing a user's role or active state.
export type AdminPatchUserBody = {
  role?: AdminUserRole
  deactivatedAt?: string | null
}
 
// The updated user returned after an admin edit is saved.
export type AdminPatchedUser = {
  id: string
  name: string
  email: string
  role: AdminUserRole
  deactivatedAt: string | null
  updatedAt: string
}

// One historical training attempt shown on a user's detail page.
// This is a summary view (counts/scores), not the full raw session record.
export type AdminUserSession = {
  id: string
  assignmentId: string | null
  status: AdminSessionStatus
  score: number | null
  attemptNumber: number
  isPractice: boolean
  startedAt: string
  completedAt: string | null
  deadline: string | null
  emailCount: number
  submittedCount: number
  phishingPassed: number
  phishingTotal: number
}

// Quick snapshot of the most recent attempt for an assignment.
export type AdminAssignmentLatestSession = {
  id: string
  status: AdminSessionStatus
  score: number | null
  attemptNumber: number
  completedAt: string | null
}

// A single row in the assignments page, including user and assigner details.
export type AdminAssignmentListItem = {
  id: string
  deadline: string
  isPractice: boolean
  createdAt: string
  template: {
    id: string
    rawSubject: string
    usageMode: 'INSPIRATION' | 'DIRECT'
    status: 'DRAFT' | 'APPROVED' | 'REJECTED' | 'ARCHIVED'
  } | null
  user: {
    id: string
    name: string
    email: string
  }
  assignedBy: {
    id: string
    name: string
  }
  latestSession: AdminAssignmentLatestSession | null
}

// Data required to create one deadline across multiple selected users.
export type AdminCreateAssignmentBody = {
  userIds: string[]
  deadline: string
  templateId?: string | null
}

// Minimal confirmation data returned for each assignment that was created.
export type AdminCreatedAssignment = {
  id: string
  userId: string
  deadline: string
  createdAt: string
}


