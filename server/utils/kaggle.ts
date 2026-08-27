import { createHash } from 'node:crypto'
import { execFile } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, readdir, readFile } from 'node:fs/promises'
import { join, extname, basename } from 'node:path'
import { createRequire } from 'node:module'
import { promisify } from 'node:util'
import type * as PapaParse from 'papaparse'
import type { PrismaClient } from '../../prisma/generated/prisma/client'
import { prisma as defaultPrisma } from './prisma'

const execFileAsync = promisify(execFile)
const require = createRequire(import.meta.url)
const Papa = require('papaparse') as typeof PapaParse

const DEFAULT_DATASETS = ['naserabdullahalam/phishing-email-dataset']
const DEFAULT_WORKING_DIR = join(process.cwd(), '.cache', 'kaggle')

type Logger = Pick<Console, 'info' | 'warn' | 'error'>

type AnyRecord = Record<string, unknown>

type NormalizedTemplate = {
  sourceDataset: string
  category: string
  rawSubject: string
  rawBody: string
  rawSender: string
  isPhishing: boolean
  bodyHash: string
}

export type KaggleIngestionOptions = {
  prismaClient?: PrismaClient
  datasets?: string[]
  workingDir?: string
  force?: boolean
  logger?: Logger
}

export type KaggleIngestionSummary = {
  skipped: boolean
  reason: 'ALREADY_POPULATED' | null
  datasets: string[]
  filesProcessed: number
  recordsRead: number
  recordsNormalized: number
  recordsDeduped: number
  recordsInserted: number
}
//Normalizes column keys by converting to lowercase and removing non-alphanumeric characters
function normalizeKey(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9]/g, '')
}
//Picks the first non-empty value from a record based on a list of candidate keys
function pickValue(record: AnyRecord, candidates: string[]): string | null {
  const map = new Map<string, unknown>()

  for (const [key, value] of Object.entries(record)) {
    map.set(normalizeKey(key), value)
  }

  for (const candidate of candidates) {
    const value = map.get(normalizeKey(candidate))
    if (value !== undefined && value !== null) {
      const asString = String(value).trim()
      if (asString.length > 0) {
        return asString
      }
    }
  }

  return null
}
//True for phishing emails, false for legit 
function parseLabelAsPhishing(labelValue: string | null): boolean | null {
  if (!labelValue) {
    return null
  }

  const value = labelValue.trim().toLowerCase()

  if (
    [
      '1',
      'true',
      'yes',
      'y',
      'phishing',
      'phishing_email',
      'phishing email',
      'spam',
      'spam_email',
      'spam email',
      'malicious',
      'fraud',
    ].includes(value)
  ) {
    return true
  }

  if (
    [
      '0',
      'false',
      'no',
      'n',
      'ham',
      'ham_email',
      'ham email',
      'legitimate',
      'legitimate_email',
      'legitimate email',
      'legit',
      'legit_email',
      'legit email',
      'safe',
      'safe_email',
      'safe email',
      'benign',
    ].includes(value)
  ) {
    return false
  }

  return null
}
//Maps the email to a category based on keywords
function normalizeCategory(value: string | null): string {
  if (!value) {
    return 'other'
  }

  const normalized = value.trim().toLowerCase().replace(/\s+/g, '_')

  if (normalized.includes('credential')) return 'credential_harvest'
  if (normalized.includes('ceo') || normalized.includes('boss')) return 'ceo_fraud'
  if (normalized.includes('invoice') || normalized.includes('payment')) return 'invoice'
  if (normalized.includes('nigerian') || normalized.includes('advance')) return 'nigerian'
  if (normalized.includes('package') || normalized.includes('delivery') || normalized.includes('shipping')) return 'package'
  if (normalized.includes('it') || normalized.includes('support') || normalized.includes('helpdesk')) return 'it_support'
  if (normalized.includes('lottery') || normalized.includes('prize')) return 'lottery'
  if (normalized.includes('job') || normalized.includes('offer')) return 'job_offer'

  return 'other'
}

function hashBody(body: string): string {
  return createHash('sha256').update(body).digest('hex')
}
//Lists all CSV and JSON files in a Kaggle directory and its subdirectories
async function listDatasetFiles(rootDir: string): Promise<string[]> {
  const output: string[] = []
  const queue = [rootDir]

  while (queue.length > 0) {
    const current = queue.shift()
    if (!current) {
      continue
    }

    const entries = await readdir(current, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(current, entry.name)

      if (entry.isDirectory()) {
        queue.push(fullPath)
        continue
      }

      const extension = extname(entry.name).toLowerCase()
      if (extension === '.csv' || extension === '.json') {
        output.push(fullPath)
      }
    }
  }

  return output
}
//Reads CSV rows from a file and returns them as an array of records
async function readCsvRows(filePath: string, logger: Logger): Promise<AnyRecord[]> {
  const content = await readFile(filePath, 'utf8')
  const parsed = Papa.parse<Record<string, unknown>>(content, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  })

  if (parsed.errors.length === 0) {
    return parsed.data as AnyRecord[]
  }

  const rowIndexesWithErrors = new Set<number>()
  let unscopedErrors = 0

  for (const error of parsed.errors) {
    if (typeof error.row === 'number') {
      rowIndexesWithErrors.add(error.row)
    } else {
      unscopedErrors += 1
    }
  }

  if (rowIndexesWithErrors.size > 0 || unscopedErrors > 0) {
    logger.warn(
      `[kaggle] CSV parse issues in ${filePath}: errors=${parsed.errors.length}, rowScoped=${rowIndexesWithErrors.size}, unscoped=${unscopedErrors}. Keeping valid rows only.`
    )
  }

  return (parsed.data as AnyRecord[]).filter((_, index) => !rowIndexesWithErrors.has(index))
}
//Reads JSON rows from a file and returns them as an array of records
async function readJsonRows(filePath: string): Promise<AnyRecord[]> {
  const content = await readFile(filePath, 'utf8')
  const parsed = JSON.parse(content) as unknown

  if (Array.isArray(parsed)) {
    return parsed.filter((row): row is AnyRecord => row !== null && typeof row === 'object')
  }

  if (parsed && typeof parsed === 'object') {
    const obj = parsed as Record<string, unknown>

    if (Array.isArray(obj.data)) {
      return obj.data.filter((row): row is AnyRecord => row !== null && typeof row === 'object')
    }

    return [obj]
  }

  return []
}
//If CSV calls CSV function, if JSON calls JSON function
async function readRowsFromFile(filePath: string, logger: Logger): Promise<AnyRecord[]> {
  const extension = extname(filePath).toLowerCase()
  if (extension === '.csv') {
    return readCsvRows(filePath, logger)
  }

  if (extension === '.json') {
    return readJsonRows(filePath)
  }

  return []
}
//Converts one raw row into a NormalizedTemplate, core row-cleaning step before filtering
function normalizeRecord(record: AnyRecord, sourceDataset: string): NormalizedTemplate | null {
  const subject =
    pickValue(record, ['subject', 'raw_subject', 'rawsubject', 'title']) ?? '(No Subject)'

  const body = pickValue(record, ['body', 'raw_body', 'rawbody', 'content', 'text', 'message', 'email_body'])
  if (!body) {
    return null
  }

  const sender =
    pickValue(record, ['sender', 'raw_sender', 'rawsender', 'from', 'from_email', 'sender_email']) ??
    'unknown@sender.local'

  const labelValue = pickValue(record, ['is_phishing', 'isphishing', 'label', 'class', 'spam', 'phishing'])
  const categoryValue = pickValue(record, ['category', 'attack_type', 'phishing_type', 'type'])
  const parsedLabel = parseLabelAsPhishing(labelValue)
  if (parsedLabel === null) {
    return null
  }

  const normalizedBody = body.trim()
  if (normalizedBody.length === 0) {
    return null
  }

  return {
    sourceDataset,
    category: normalizeCategory(categoryValue),
    rawSubject: subject.trim(),
    rawBody: normalizedBody,
    rawSender: sender.trim(),
    isPhishing: parsedLabel,
    bodyHash: hashBody(normalizedBody),
  }
}
// Resolves the path to the Kaggle CLI binary, checking for a local virtual environment first
function resolveKaggleBinary(): string {
  const localVenvBinary = join(process.cwd(), '.venv', 'bin', 'kaggle')
  return existsSync(localVenvBinary) ? localVenvBinary : 'kaggle'
}
//Downloads a Kaggle dataset using the Kaggle CLI
async function downloadDataset(datasetRef: string, outputDir: string): Promise<void> {
  await mkdir(outputDir, { recursive: true })

  const kaggleBinary = resolveKaggleBinary()
  const args = ['datasets', 'download', '-d', datasetRef, '-p', outputDir, '--unzip', '--force']

  await execFileAsync(kaggleBinary, args, {
    env: {
      ...process.env,
      KAGGLE_USERNAME: process.env.KAGGLE_USERNAME,
      KAGGLE_KEY: process.env.KAGGLE_KEY,
    },
  })
}
//Full pipeline controller
export async function ingestKaggleTemplates(options: KaggleIngestionOptions = {}): Promise<KaggleIngestionSummary> {
  //Choose Prisma client, dataset rules, working directory, logger, and force flag
  const prismaClient = options.prismaClient ?? defaultPrisma
  const datasets = options.datasets ?? DEFAULT_DATASETS
  const workingDir = options.workingDir ?? DEFAULT_WORKING_DIR
  const logger = options.logger ?? console
  const force = options.force ?? false

  if (!process.env.KAGGLE_USERNAME || !process.env.KAGGLE_KEY) {
    throw new Error('Missing Kaggle credentials: KAGGLE_USERNAME and KAGGLE_KEY must be set')
  }
//If force is false and db already has templates, skip ingestion and return summary
  if (!force) {
    const existingCount = await prismaClient.emailTemplate.count()
    if (existingCount > 0) {
      return {
        skipped: true,
        reason: 'ALREADY_POPULATED',
        datasets,
        filesProcessed: 0,
        recordsRead: 0,
        recordsNormalized: 0,
        recordsDeduped: 0,
        recordsInserted: 0,
      }
    }
  }

  await mkdir(workingDir, { recursive: true })

  let filesProcessed = 0
  let recordsRead = 0
  const normalizedRows: NormalizedTemplate[] = []
//For each dataset, download the dataset, read its files, normalize rows, and keep valid labeled rows
  for (const datasetRef of datasets) {
    const datasetSlug = datasetRef.replace('/', '__')
    const datasetDir = join(workingDir, datasetSlug)
    //download
    logger.info(`[kaggle] Downloading dataset ${datasetRef}...`)
    await downloadDataset(datasetRef, datasetDir)
    //list csv/json files
    const files = await listDatasetFiles(datasetDir)
    logger.info(`[kaggle] Found ${files.length} data file(s) for ${datasetRef}`)
    //parse each file
    for (const filePath of files) {
      const sourceName = `${datasetRef}:${basename(filePath)}`

      try {
        const rows = await readRowsFromFile(filePath, logger)
        filesProcessed += 1
        recordsRead += rows.length
        //normalize and filter rows
        for (const row of rows) {
          const normalized = normalizeRecord(row, sourceName)
          if (normalized) {
            normalizedRows.push(normalized)
          }
        }
      } catch (error) {
        logger.warn(
          `[kaggle] Skipping file ${filePath} due to parse error: ${error instanceof Error ? error.message : String(error)}`
        )
      }
    }
  }
  //deduplicate normalized rows
  const uniqueByHash = new Map<string, NormalizedTemplate>()
  for (const row of normalizedRows) {
    if (!uniqueByHash.has(row.bodyHash)) {
      uniqueByHash.set(row.bodyHash, row)
    }
  }

  const dedupedRows = Array.from(uniqueByHash.values())
  //if nothing left, return summary with zero inserts
  if (dedupedRows.length === 0) {
    logger.warn('[kaggle] No usable rows found after normalization')
    return {
      skipped: false,
      reason: null,
      datasets,
      filesProcessed,
      recordsRead,
      recordsNormalized: normalizedRows.length,
      recordsDeduped: 0,
      recordsInserted: 0,
    }
  }
  //bulk insert into email_templates table
  const result = await prismaClient.emailTemplate.createMany({
    data: dedupedRows,
    skipDuplicates: true,
  })

  logger.info(`[kaggle] Inserted ${result.count} template rows`)
  //Summary stats
  return {
    skipped: false,
    reason: null,
    datasets,
    filesProcessed,
    recordsRead,
    recordsNormalized: normalizedRows.length,
    recordsDeduped: dedupedRows.length,
    recordsInserted: result.count,
  }
}
