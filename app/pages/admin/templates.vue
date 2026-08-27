<script setup lang="ts">
type TemplateUseMode = 'INSPIRATION' | 'DIRECT'
type TemplateStatus = 'DRAFT' | 'APPROVED' | 'REJECTED' | 'ARCHIVED'
type FlagZone = 'sender' | 'subject' | 'url' | 'attachment' | null
type TemplateFlag = {
  id?: string
  text: string
  startOffset: number
  endOffset: number
  category: string
  zone: FlagZone
}
type TemplateAttachment = {
  filename: string
  suspicious: boolean
}
type TemplateUrl = {
  displayText: string
  href: string
  suspicious: boolean
}
type EmailTemplate = {
  id: string
  sourceDataset: string
  category: string
  rawSubject: string
  rawBody: string
  rawSender: string
  isPhishing: boolean
  attachments: TemplateAttachment[]
  urls: TemplateUrl[]
  usageMode: TemplateUseMode
  status: TemplateStatus
  adminNotes: string | null
  createdAt: string
  updatedAt: string
  expectedFlags: TemplateFlag[]
}

type TemplateForm = {
  category: string
  rawSubject: string
  rawBody: string
  rawSender: string
  isPhishing: boolean
  attachments: TemplateAttachment[]
  urls: TemplateUrl[]
  usageMode: TemplateUseMode
  status: TemplateStatus
  adminNotes: string
  expectedFlags: TemplateFlag[]
}

const emptyForm = (): TemplateForm => ({
  category: '',
  rawSubject: '',
  rawBody: '',
  rawSender: '',
  isPhishing: true,
  attachments: [],
  urls: [],
  usageMode: 'INSPIRATION',
  status: 'DRAFT',
  adminNotes: '',
  expectedFlags: [],
})

const templates = ref<EmailTemplate[]>([])
const selectedId = ref<string | null>(null)
const form = ref<TemplateForm>(emptyForm())
const categoryInput = ref<HTMLInputElement | null>(null)
const search = ref('')
const statusFilter = ref<TemplateStatus | 'ALL'>('ALL')
const modeFilter = ref<TemplateUseMode | 'ALL'>('ALL')
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const notice = ref('')

const selectedTemplate = computed(() => templates.value.find((template) => template.id === selectedId.value) ?? null)
const filteredTemplates = computed(() => {
  const query = search.value.trim().toLowerCase()
  return templates.value.filter((template) => {
    const matchesStatus = statusFilter.value === 'ALL' || template.status === statusFilter.value
    const matchesMode = modeFilter.value === 'ALL' || template.usageMode === modeFilter.value
    const matchesSearch = !query || [template.category, template.rawSubject, template.rawSender, template.rawBody]
      .some((value) => value.toLowerCase().includes(query))
    return matchesStatus && matchesMode && matchesSearch
  })
})

async function fetchTemplates(): Promise<void> {
  loading.value = true
  error.value = ''
  try {
    templates.value = await $fetch<EmailTemplate[]>('/api/admin/templates')
  } catch (requestError: any) {
    error.value = requestError?.data?.statusMessage || 'Unable to load templates.'
  } finally {
    loading.value = false
  }
}

async function newTemplate(): Promise<void> {
  selectedId.value = null
  form.value = emptyForm()
  notice.value = 'New template form ready. Fill in the fields below, then choose Create draft.'
  error.value = ''
  await nextTick()
  categoryInput.value?.focus()
}

function editTemplate(template: EmailTemplate): void {
  selectedId.value = template.id
  form.value = {
    category: template.category,
    rawSubject: template.rawSubject,
    rawBody: template.rawBody,
    rawSender: template.rawSender,
    isPhishing: template.isPhishing,
    attachments: (template.attachments ?? []).map((attachment) => ({ ...attachment })),
    urls: (template.urls ?? []).map((url) => ({ ...url })),
    usageMode: template.usageMode,
    status: template.status,
    adminNotes: template.adminNotes ?? '',
    expectedFlags: template.expectedFlags.map((flag) => ({ ...flag })),
  }
  notice.value = ''
  error.value = ''
}

function addFlag(): void {
  form.value.expectedFlags.push({
    text: '',
    startOffset: 0,
    endOffset: 0,
    category: 'urgency_language',
    zone: null,
  })
}

function removeFlag(index: number): void {
  form.value.expectedFlags.splice(index, 1)
}

function addAttachment(): void {
  form.value.attachments.push({ filename: '', suspicious: false })
}

function addUrl(): void {
  form.value.urls.push({ displayText: '', href: '', suspicious: false })
}

function removeAttachment(index: number): void {
  form.value.attachments.splice(index, 1)
}

function removeUrl(index: number): void {
  form.value.urls.splice(index, 1)
}

function onZoneChange(flag: TemplateFlag): void {
  if (flag.zone) {
    flag.startOffset = 0
    flag.endOffset = 0
  }
}

function getExpectedFlagsForSave(): TemplateFlag[] {
  return form.value.expectedFlags.map((flag) => {
    const text = flag.text.trim()
    if (flag.zone) {
      return { ...flag, text, startOffset: 0, endOffset: 0 }
    }

    const startOffset = form.value.rawBody.indexOf(text)
    return { ...flag, text, startOffset, endOffset: startOffset + text.length }
  })
}

async function saveTemplate(): Promise<void> {
  saving.value = true
  error.value = ''
  notice.value = ''
  try {
    const payload = {
      ...form.value,
      expectedFlags: getExpectedFlagsForSave(),
      adminNotes: form.value.adminNotes || null,
    }
    const saved = selectedId.value
      ? await $fetch<EmailTemplate>(`/api/admin/templates/${selectedId.value}`, { method: 'PATCH', body: payload })
      : await $fetch<EmailTemplate>('/api/admin/templates', { method: 'POST', body: payload })
    const existingIndex = templates.value.findIndex((template) => template.id === saved.id)
    if (existingIndex >= 0) templates.value.splice(existingIndex, 1, saved)
    else templates.value.unshift(saved)
    editTemplate(saved)
    notice.value = saved.status === 'DRAFT' ? 'Draft saved.' : `Template marked ${saved.status.toLowerCase()}.`
  } catch (requestError: any) {
    error.value = requestError?.data?.statusMessage || 'Unable to save template.'
  } finally {
    saving.value = false
  }
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString()
}

function statusClass(status: TemplateStatus): string {
  if (status === 'APPROVED') return 'bg-green-100 text-green-700'
  if (status === 'REJECTED') return 'bg-red-100 text-red-700'
  if (status === 'ARCHIVED') return 'bg-neutral-200 text-neutral-600'
  return 'bg-amber-100 text-amber-700'
}

onMounted(fetchTemplates)
</script>

<template>
  <AdminLayout>
    <template #title>Email Templates</template>

    <template #actions>
      <button
        class="rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700"
        @click="newTemplate"
      >
        New template
      </button>
    </template>

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]">
      <div class="min-w-0 space-y-4">
        <div class="grid gap-3 md:grid-cols-[minmax(0,1fr)_160px_160px]">
          <input
            v-model="search"
            type="search"
            placeholder="Search subject, sender, body, or category"
            class="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          >
          <select v-model="statusFilter" class="rounded-lg border border-neutral-300 px-3 py-2 text-sm">
            <option value="ALL">All statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          <select v-model="modeFilter" class="rounded-lg border border-neutral-300 px-3 py-2 text-sm">
            <option value="ALL">All modes</option>
            <option value="INSPIRATION">Inspiration</option>
            <option value="DIRECT">Direct</option>
          </select>
        </div>

        <p v-if="error" class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{{ error }}</p>
        <p v-if="notice" class="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{{ notice }}</p>
        <p v-if="loading" class="text-sm text-neutral-500">Loading templates...</p>
        <p v-else-if="filteredTemplates.length === 0" class="text-sm text-neutral-500">No templates found.</p>

        <div v-else class="overflow-x-auto rounded-lg border border-neutral-200">
          <table class="min-w-full divide-y divide-neutral-200 text-sm">
            <thead class="bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th class="px-3 py-2">Template</th>
                <th class="px-3 py-2">Mode</th>
                <th class="px-3 py-2">Status</th>
                <th class="px-3 py-2">Updated</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-200 bg-white text-neutral-700">
              <tr
                v-for="template in filteredTemplates"
                :key="template.id"
                class="cursor-pointer hover:bg-neutral-50"
                :class="selectedId === template.id ? 'bg-brand-50' : ''"
                @click="editTemplate(template)"
              >
                <td class="max-w-[280px] px-3 py-3">
                  <p class="truncate font-medium text-neutral-900">{{ template.rawSubject }}</p>
                  <p class="mt-1 truncate text-xs text-neutral-500">{{ template.category }} · {{ template.rawSender }}</p>
                </td>
                <td class="px-3 py-3 text-xs font-semibold">{{ template.usageMode }}</td>
                <td class="px-3 py-3">
                  <span class="rounded-full px-2 py-1 text-xs font-semibold" :class="statusClass(template.status)">
                    {{ template.status }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-3 py-3 text-xs text-neutral-500">{{ formatDate(template.updatedAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <form class="space-y-4 border-t border-neutral-200 pt-5 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0" @submit.prevent="saveTemplate">
        <div class="flex items-center justify-between gap-3">
          <div>
            <h2 class="text-lg font-semibold text-neutral-900">{{ selectedTemplate ? 'Edit template' : 'New template' }}</h2>
          </div>
          <span v-if="selectedTemplate" class="rounded-full px-2 py-1 text-xs font-semibold" :class="statusClass(form.status)">
            {{ form.status }}
          </span>
        </div>

        <div class="grid gap-3 sm:grid-cols-2">
          <label class="text-sm font-medium text-neutral-700">
            Category
            <input ref="categoryInput" v-model="form.category" required class="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 font-normal" placeholder="Payroll" >
          </label>
          <label class="text-sm font-medium text-neutral-700">
            Sender
            <input v-model="form.rawSender" required class="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 font-normal" placeholder="Security Team <security@example>" >
          </label>
        </div>
        <label class="block text-sm font-medium text-neutral-700">
          Subject
          <input v-model="form.rawSubject" required class="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 font-normal" >
        </label>
        <label class="block text-sm font-medium text-neutral-700">
          Body
          <textarea v-model="form.rawBody" required rows="9" class="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 font-normal" />
        </label>

        <div class="grid gap-3 sm:grid-cols-2">
          <label class="text-sm font-medium text-neutral-700">
            Use mode
            <select v-model="form.usageMode" class="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 font-normal">
              <option value="INSPIRATION">AI inspiration</option>
              <option value="DIRECT">Exact learner email</option>
            </select>
          </label>
          <label class="text-sm font-medium text-neutral-700">
            Review status
            <select v-model="form.status" class="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 font-normal">
              <option value="DRAFT">Draft</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </label>
        </div>
        <label class="flex items-center gap-2 text-sm font-medium text-neutral-700">
          <input v-model="form.isPhishing" type="checkbox" class="h-4 w-4 rounded border-neutral-300 text-brand-600" >
          Phishing email
        </label>

        <div class="space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
          <div class="flex items-center justify-between gap-3">
            <div>
              <h3 class="text-sm font-semibold text-neutral-900">Email resources</h3>
              <p class="text-xs text-neutral-500">Add links or files that should appear in the email.</p>
            </div>
            <div class="flex gap-2">
              <button type="button" class="rounded-md border border-neutral-300 px-2 py-1 text-xs font-medium text-neutral-700 hover:bg-white" @click="addUrl">Add link</button>
              <button type="button" class="rounded-md border border-neutral-300 px-2 py-1 text-xs font-medium text-neutral-700 hover:bg-white" @click="addAttachment">Add file</button>
            </div>
          </div>
          <p v-if="form.urls.length === 0 && form.attachments.length === 0" class="text-xs text-neutral-500">No resources added.</p>
          <div v-for="(url, index) in form.urls" :key="`url-${index}`" class="space-y-2 rounded-md border border-neutral-200 bg-white p-3">
            <div class="flex justify-between gap-2">
              <span class="text-xs font-semibold text-neutral-500">Link {{ index + 1 }}</span>
              <button type="button" class="text-xs font-medium text-red-600 hover:text-red-700" @click="removeUrl(index)">Remove</button>
            </div>
            <div class="grid gap-2 sm:grid-cols-2">
              <input v-model="url.displayText" required class="rounded border border-neutral-300 px-2 py-1 text-sm" placeholder="Display text" >
              <input v-model="url.href" required type="url" class="rounded border border-neutral-300 px-2 py-1 text-sm" placeholder="https://example.com" >
            </div>
            <label class="flex items-center gap-2 text-xs font-medium text-neutral-700">
              <input v-model="url.suspicious" type="checkbox" class="h-4 w-4 rounded border-neutral-300 text-brand-600" >
              Suspicious resource
            </label>
          </div>
          <div v-for="(attachment, index) in form.attachments" :key="`attachment-${index}`" class="space-y-2 rounded-md border border-neutral-200 bg-white p-3">
            <div class="flex justify-between gap-2">
              <span class="text-xs font-semibold text-neutral-500">File {{ index + 1 }}</span>
              <button type="button" class="text-xs font-medium text-red-600 hover:text-red-700" @click="removeAttachment(index)">Remove</button>
            </div>
            <input v-model="attachment.filename" required class="w-full rounded border border-neutral-300 px-2 py-1 text-sm" placeholder="invoice.pdf" >
            <label class="flex items-center gap-2 text-xs font-medium text-neutral-700">
              <input v-model="attachment.suspicious" type="checkbox" class="h-4 w-4 rounded border-neutral-300 text-brand-600" >
              Suspicious resource
            </label>
          </div>
        </div>

        <div class="space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
          <div class="flex items-center justify-between gap-3">
            <div>
              <h3 class="text-sm font-semibold text-neutral-900">Expected flags</h3>
              <p class="text-xs text-neutral-500">Body ranges must match the email text exactly.</p>
            </div>
            <button type="button" class="rounded-md border border-neutral-300 px-2 py-1 text-xs font-medium text-neutral-700 hover:bg-white" @click="addFlag">Add flag</button>
          </div>
          <p v-if="form.expectedFlags.length === 0" class="text-xs text-neutral-500">No flags added.</p>
          <div v-for="(flag, index) in form.expectedFlags" :key="index" class="space-y-2 rounded-md border border-neutral-200 bg-white p-3">
            <div class="flex justify-between gap-2">
              <span class="text-xs font-semibold text-neutral-500">Flag {{ index + 1 }}</span>
              <button type="button" class="text-xs font-medium text-red-600 hover:text-red-700" @click="removeFlag(index)">Remove</button>
            </div>
            <input v-model="flag.text" required class="w-full rounded border border-neutral-300 px-2 py-1 text-sm" placeholder="Exact flagged text" >
            <div class="grid gap-2 sm:grid-cols-3">
              <select v-model="flag.category" class="rounded border border-neutral-300 px-2 py-1 text-xs">
                <option value="suspicious_url">Suspicious URL</option>
                <option value="urgency_language">Urgency language</option>
                <option value="grammar_error">Grammar error</option>
                <option value="fake_sender">Fake sender</option>
                <option value="info_request">Info request</option>
                <option value="money_request">Money request</option>
                <option value="too_good_to_be_true">Too good to be true</option>
                <option value="threatening_language">Threatening language</option>
                <option value="suspicious_attachment">Suspicious attachment</option>
              </select>
              <select v-model="flag.zone" class="rounded border border-neutral-300 px-2 py-1 text-xs" @change="onZoneChange(flag)">
                <option :value="null">Body text</option>
                <option value="sender">Sender</option>
                <option value="subject">Subject</option>
                <option value="url">URL</option>
                <option value="attachment">Attachment</option>
              </select>
            </div>
            <p v-if="flag.zone" class="text-xs text-neutral-500">
              This flag applies to the selected email field. Character positions are not needed.
            </p>
          </div>
        </div>

        <label class="block text-sm font-medium text-neutral-700">
          Admin notes
          <textarea v-model="form.adminNotes" rows="3" class="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 font-normal" placeholder="Optional review notes" />
        </label>
        <button type="submit" :disabled="saving" class="w-full rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60">
          {{ saving ? 'Saving...' : selectedId ? 'Save changes' : 'Create draft' }}
        </button>
      </form>
    </div>
  </AdminLayout>
</template>
