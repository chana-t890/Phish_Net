<script setup lang="ts">
import type {
  AdminAssignmentListItem,
  AdminSessionStatus,
  AdminUser,
  AdminUserSession,
} from '~/types/admin'

definePageMeta({})

type AnalyticsSessionRow = AdminUserSession & {
  userId: string
  userName: string
  userEmail: string
}

type ScoreBucket = {
  label: string
  count: number
}

const loading = ref(false)
const error = ref<string | null>(null)
const analyticsRange = ref<'ALL_TIME' | 'PER_MONTH'>('ALL_TIME')
const selectedMonth = ref(new Date().toISOString().slice(0, 7))

const users = ref<AdminUser[]>([])
const assignments = ref<AdminAssignmentListItem[]>([])
const sessions = ref<AnalyticsSessionRow[]>([])

function getSelectedMonthRange(): { start: Date; end: Date } | null {
  const monthValue = selectedMonth.value
  if (!monthValue) return null

  const [yearString, monthString] = monthValue.split('-')
  const year = Number(yearString)
  const month = Number(monthString)
  if (!year || !month) return null

  return {
    start: new Date(year, month - 1, 1, 0, 0, 0, 0),
    end: new Date(year, month, 0, 23, 59, 59, 999),
  }
}

function isInSelectedRange(isoDate: string): boolean {
  if (analyticsRange.value === 'ALL_TIME') return true

  const range = getSelectedMonthRange()
  if (!range) return true

  const target = new Date(isoDate)
  return target >= range.start && target <= range.end
}

function isCreatedOnOrBeforeSelectedPeriodEnd(isoDate: string): boolean {
  if (analyticsRange.value === 'ALL_TIME') return true

  const range = getSelectedMonthRange()
  if (!range) return true

  return new Date(isoDate) <= range.end
}

const periodUsers = computed(() => users.value.filter((user) => isInSelectedRange(user.createdAt)))
const periodAssignments = computed(() => assignments.value.filter((assignment) => isInSelectedRange(assignment.createdAt)))
const periodSessions = computed(() => sessions.value.filter((session) => isInSelectedRange(session.startedAt)))

const totalUsers = computed(() => users.value.filter((user) => isCreatedOnOrBeforeSelectedPeriodEnd(user.createdAt)).length)
const totalAssignments = computed(() => periodAssignments.value.length)
const totalSessions = computed(() => periodSessions.value.length)
const completedSessions = computed(() => periodSessions.value.filter((session) => session.status === 'COMPLETED').length)

const percentCompleted = computed(() => {
  if (totalSessions.value === 0) return 0
  return (completedSessions.value / totalSessions.value) * 100
})

const passRate = computed(() => {
  const finished = periodSessions.value.filter((session) => {
    const status = session.status
    return status === 'COMPLETED' || status === 'FAILED'
  })

  if (finished.length === 0) return 0
  const passed = finished.filter((session) => session.status === 'COMPLETED').length
  return (passed / finished.length) * 100
})

const trainingStatus = computed(() => {
  const now = Date.now()
  let assigned = 0
  let completed = 0
  let overdue = 0

  for (const session of periodSessions.value) {
    const status = session.status

    if (status === 'COMPLETED') {
      completed += 1
      continue
    }

    if (session.deadline && new Date(session.deadline).getTime() < now) {
      overdue += 1
      continue
    }

    assigned += 1
  }

  return { assigned, completed, overdue }
})

const scoreDistribution = computed<ScoreBucket[]>(() => {
  const buckets: ScoreBucket[] = [
    { label: '<60', count: 0 },
    { label: '60-69', count: 0 },
    { label: '70-79', count: 0 },
    { label: '80-89', count: 0 },
    { label: '90+', count: 0 },
  ]

  const scores = periodSessions.value
    .map((session) => session.score)
    .filter((score): score is number => score !== null && score !== undefined)

  for (const score of scores) {
    const pct = score * 100
    if (pct < 60) buckets[0]!.count += 1
    else if (pct < 70) buckets[1]!.count += 1
    else if (pct < 80) buckets[2]!.count += 1
    else if (pct < 90) buckets[3]!.count += 1
    else buckets[4]!.count += 1
  }

  return buckets
})

const scoreBucketMax = computed(() => {
  const max = Math.max(...scoreDistribution.value.map((bucket) => bucket.count), 0)
  return max === 0 ? 1 : max
})

const recentSessions = computed(() => {
  return [...periodSessions.value]
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .slice(0, 12)
})

function csvCell(value: string | number): string {
  const text = String(value)
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

function buildCsvRows(): string {
  const header = ['User Name', 'User Email', 'Started At', 'Completed At', 'Status', 'Score', 'Attempt']

  const rows = periodSessions.value
    .slice()
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .map((session) => [
      session.userName,
      session.userEmail,
      session.startedAt,
      session.completedAt ?? '',
      session.status,
      session.score === null ? '' : `${(session.score * 100).toFixed(1)}%`,
      session.attemptNumber,
    ])

  return [header, ...rows]
    .map((row) => row.map((value) => csvCell(value)).join(','))
    .join('\n')
}

function downloadCsv(): void {
  if (!import.meta.client) return

  const csv = buildCsvRows()
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  const suffix = analyticsRange.value === 'PER_MONTH' ? selectedMonth.value : 'all-time'

  anchor.href = url
  anchor.download = `analytics-${suffix}.csv`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

async function downloadPdf(): Promise<void> {
  if (!import.meta.client) return

  const [{ default: pdfMake }, { default: virtualFileSystem }] = await Promise.all([
    import('pdfmake/build/pdfmake'),
    import('pdfmake/build/vfs_fonts'),
  ])
  pdfMake.vfs = virtualFileSystem
  const suffix = analyticsRange.value === 'PER_MONTH' ? selectedMonth.value : 'all-time'
  const sessionRows = periodSessions.value
    .slice()
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())

  pdfMake.createPdf({
    content: [
      { text: 'Phish-Net Analytics Report', style: 'header' },
      { text: `Period: ${analyticsRange.value === 'PER_MONTH' ? selectedMonth.value : 'All time'}`, margin: [0, 0, 0, 12] },
      {
        columns: [
          { text: `Users: ${totalUsers.value}` },
          { text: `Assignments: ${totalAssignments.value}` },
          { text: `Completed: ${completedSessions.value}` },
          { text: `Pass rate: ${toPercent(passRate.value)}` },
        ],
        margin: [0, 0, 0, 16],
      },
      {
        table: {
          headerRows: 1,
          widths: ['*', '*', '*', 'auto', 'auto', 'auto'],
          body: [
            ['User', 'Email', 'Started', 'Status', 'Score', 'Attempt'],
            ...sessionRows.map((session) => [
              session.userName,
              session.userEmail,
              formatDateTime(session.startedAt),
              session.status,
              formatScore(session.score),
              String(session.attemptNumber),
            ]),
          ],
        },
        layout: 'lightHorizontalLines',
      },
    ],
    styles: {
      header: { fontSize: 18, bold: true, margin: [0, 0, 0, 8] },
    },
    defaultStyle: { fontSize: 8 },
  }).download(`analytics-${suffix}.pdf`)
}

function toPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

function formatDateTime(value: string | null): string {
  if (!value) return '-'
  return new Date(value).toLocaleString()
}

function formatScore(value: number | null): string {
  if (value === null) return '-'
  return `${(value * 100).toFixed(1)}%`
}

function statusBadgeClass(status: AdminSessionStatus): string {
  if (status === 'COMPLETED') return 'bg-green-100 text-green-700'
  if (status === 'FAILED') return 'bg-red-100 text-red-700'
  return 'bg-amber-100 text-amber-700'
}

function assignmentStatusPercent(key: 'assigned' | 'completed' | 'overdue'): number {
  if (totalSessions.value === 0) return 0
  return (trainingStatus.value[key] / totalSessions.value) * 100
}

async function fetchAnalytics(): Promise<void> {
  loading.value = true
  error.value = null

  try {
    const [userRows, assignmentRows] = await Promise.all([
      $fetch<AdminUser[]>('/api/admin/users'),
      $fetch<AdminAssignmentListItem[]>('/api/admin/assignments'),
    ])

    users.value = userRows
    assignments.value = assignmentRows.filter((assignment) => !assignment.isPractice)

    const sessionRowsPerUser = await Promise.all(
      userRows.map(async (user) => {
        const rows = await $fetch<AdminUserSession[]>(`/api/admin/users/${user.id}/sessions`)
        return rows.map((session) => ({
          ...session,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
        }))
      }),
    )

    sessions.value = sessionRowsPerUser.flat()
  } catch (e: any) {
    error.value = e.data?.message ?? 'Failed to load analytics'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchAnalytics()
})
</script>

<template>
  <AdminLayout>
    <template #title>Analytics</template>

    <template #actions>
      <div class="flex items-center gap-2">
        <button
          class="rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          :disabled="loading"
          @click="downloadCsv"
        >
          Export CSV
        </button>
        <button
          class="rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          :disabled="loading"
          @click="downloadPdf"
        >
          Export PDF
        </button>
        <button
          class="rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          :disabled="loading"
          @click="fetchAnalytics"
        >
          Refresh
        </button>
      </div>
    </template>

    <div class="space-y-6">
      <p v-if="error" class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
        {{ error }}
      </p>

      <section class="rounded-lg border border-neutral-200 bg-white p-4">
        <div class="flex flex-wrap items-end gap-3">
          <div>
            <label for="analytics-range" class="mb-1 block text-sm font-medium text-neutral-700">Time range</label>
            <select
              id="analytics-range"
              v-model="analyticsRange"
              class="rounded-md border border-neutral-300 px-3 py-2 text-sm"
            >
              <option value="ALL_TIME">All time</option>
              <option value="PER_MONTH">Per month</option>
            </select>
          </div>

          <div v-if="analyticsRange === 'PER_MONTH'">
            <label for="analytics-month" class="mb-1 block text-sm font-medium text-neutral-700">Month</label>
            <input
              id="analytics-month"
              v-model="selectedMonth"
              type="month"
              class="rounded-md border border-neutral-300 px-3 py-2 text-sm"
            >
          </div>
        </div>
      </section>

      <div v-if="loading && totalAssignments === 0" class="text-sm text-neutral-500">
        Loading analytics...
      </div>

      <template v-else>
        <section class="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <div class="rounded-lg border border-neutral-200 bg-white p-4">
            <p class="text-xs uppercase tracking-wide text-neutral-500">Total users</p>
            <p class="mt-2 text-2xl font-semibold text-neutral-900">{{ totalUsers }}</p>
          </div>
          <div class="rounded-lg border border-neutral-200 bg-white p-4">
            <p class="text-xs uppercase tracking-wide text-neutral-500">Total assignments</p>
            <p class="mt-2 text-2xl font-semibold text-neutral-900">{{ totalAssignments }}</p>
          </div>
          <div class="rounded-lg border border-neutral-200 bg-white p-4">
            <p class="text-xs uppercase tracking-wide text-neutral-500">Total completed</p>
            <p class="mt-2 text-2xl font-semibold text-neutral-900">{{ completedSessions }}</p>
          </div>
          <div class="rounded-lg border border-neutral-200 bg-white p-4">
            <p class="text-xs uppercase tracking-wide text-neutral-500">Percent completed</p>
            <p class="mt-2 text-2xl font-semibold text-neutral-900">{{ toPercent(percentCompleted) }}</p>
          </div>
          <div class="rounded-lg border border-neutral-200 bg-white p-4">
            <p class="text-xs uppercase tracking-wide text-neutral-500">Pass rate</p>
            <p class="mt-2 text-2xl font-semibold text-neutral-900">{{ toPercent(passRate) }}</p>
          </div>
        </section>

        <section class="grid gap-4 xl:grid-cols-2">
          <div class="rounded-lg border border-neutral-200 bg-white p-4">
            <h2 class="mb-4 text-base font-semibold text-neutral-900">Score Distribution</h2>

            <div class="space-y-3">
              <div v-for="bucket in scoreDistribution" :key="bucket.label" class="space-y-1">
                <div class="flex items-center justify-between text-xs text-neutral-600">
                  <span>{{ bucket.label }}</span>
                  <span>{{ bucket.count }}</span>
                </div>
                <div class="h-2 rounded-full bg-neutral-100">
                  <div
                    class="h-2 rounded-full bg-brand-600"
                    :style="{ width: `${(bucket.count / scoreBucketMax) * 100}%` }"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-lg border border-neutral-200 bg-white p-4">
            <h2 class="mb-4 text-base font-semibold text-neutral-900">Training Status Breakdown</h2>

            <div class="space-y-4">
              <div>
                <div class="mb-1 flex items-center justify-between text-xs text-neutral-600">
                  <span>Assigned</span>
                  <span>{{ trainingStatus.assigned }}</span>
                </div>
                <div class="h-2 rounded-full bg-neutral-100">
                  <div class="h-2 rounded-full bg-amber-500" :style="{ width: `${assignmentStatusPercent('assigned')}%` }" />
                </div>
              </div>

              <div>
                <div class="mb-1 flex items-center justify-between text-xs text-neutral-600">
                  <span>Completed</span>
                  <span>{{ trainingStatus.completed }}</span>
                </div>
                <div class="h-2 rounded-full bg-neutral-100">
                  <div class="h-2 rounded-full bg-green-600" :style="{ width: `${assignmentStatusPercent('completed')}%` }" />
                </div>
              </div>

              <div>
                <div class="mb-1 flex items-center justify-between text-xs text-neutral-600">
                  <span>Overdue</span>
                  <span>{{ trainingStatus.overdue }}</span>
                </div>
                <div class="h-2 rounded-full bg-neutral-100">
                  <div class="h-2 rounded-full bg-red-600" :style="{ width: `${assignmentStatusPercent('overdue')}%` }" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="rounded-lg border border-neutral-200 bg-white p-4">
          <h2 class="mb-4 text-base font-semibold text-neutral-900">Recent Sessions</h2>

          <div v-if="recentSessions.length === 0" class="text-sm text-neutral-500">
            No sessions yet.
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-neutral-200 text-sm">
              <thead class="bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
                <tr>
                  <th class="px-3 py-2">User</th>
                  <th class="px-3 py-2">Started</th>
                  <th class="px-3 py-2">Completed</th>
                  <th class="px-3 py-2">Status</th>
                  <th class="px-3 py-2">Score</th>
                  <th class="px-3 py-2">Attempt</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-200 bg-white text-neutral-700">
                <tr v-for="session in recentSessions" :key="session.id">
                  <td class="px-3 py-2">
                    <div class="font-medium text-neutral-900">{{ session.userName }}</div>
                    <div class="text-xs text-neutral-500">{{ session.userEmail }}</div>
                  </td>
                  <td class="px-3 py-2">{{ formatDateTime(session.startedAt) }}</td>
                  <td class="px-3 py-2">{{ formatDateTime(session.completedAt) }}</td>
                  <td class="px-3 py-2">
                    <span class="rounded-full px-2 py-1 text-xs font-semibold" :class="statusBadgeClass(session.status)">
                      {{ session.status }}
                    </span>
                  </td>
                  <td class="px-3 py-2">{{ formatScore(session.score) }}</td>
                  <td class="px-3 py-2">{{ session.attemptNumber }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </template>
    </div>
  </AdminLayout>
</template>
