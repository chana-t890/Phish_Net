# Phish-Net - Phishing Awareness Training Web App
## Product Specification

## 1. Overview

Phish-Net is an internal phishing-awareness training application. Learners work through a simulated inbox, classify messages, highlight suspicious details, explain their reasoning, and receive AI coaching. Administrators manage users, assignments, analytics, and custom training templates.

Practice sessions are available without affecting official assignment records. A typical session contains 5 to 7 generated emails and is designed to take approximately 10 to 15 minutes.

## 2. Technology

| Layer | Technology |
|---|---|
| Frontend | Vue 3 and Nuxt 4 with SSR |
| Styling | Tailwind CSS |
| Backend | Nuxt 4 Nitro server routes |
| ORM and database | Prisma and PostgreSQL |
| AI | Amazon Bedrock with a configurable Anthropic Claude model |
| Authentication | Okta SAML with Passport and `@node-saml/passport-saml` |
| Dataset source | Kaggle API, cached locally for ingestion |
| Local infrastructure | Docker Compose |
| Tests | Vitest |

## 3. Configuration

The application reads configuration from environment variables. The complete placeholder list is maintained in `.env.example`.

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NUXT_SESSION_PASSWORD` | Session cookie signing secret; required outside local development |
| `AUTH_DEV_EMAIL` | Localhost-only development identity |
| `ADMIN_EMAILS` | Comma-separated email addresses granted the `ADMIN` role |
| `AWS_REGION` | AWS region for Bedrock |
| `AWS_PROFILE` | Optional AWS profile |
| `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` | Optional AWS credentials |
| `BEDROCK_MODEL_ID` | Bedrock model identifier; the example uses Claude Haiku 4.5 |
| `SAML_ISSUER` | SAML service-provider issuer |
| `SAML_ENTRY_POINT` | Okta SSO URL |
| `SAML_IDP_CERT` | Okta IdP signing certificate |
| `BASE_URL` | Public application URL and SAML callback base |
| `KAGGLE_USERNAME` and `KAGGLE_KEY` | Optional Kaggle dataset credentials |

Local development can use `AUTH_DEV_EMAIL` instead of Okta. The bypass is accepted only for localhost requests when the application is not running in production. AWS, Okta, and Kaggle settings are used by their respective integrations; Kaggle ingestion errors are non-fatal.

## 4. Authentication and Authorization

### 4.1 Authentication

Production authentication uses Okta SAML. The SAML response is posted to `POST /auth`, validated by the SAML strategy, and converted into a signed session cookie. There is no username/password login.

Local development can use `GET /api/auth/dev-login`. This route is restricted to localhost and non-production environments. `GET /api/auth/signout` clears the session.

### 4.2 User Provisioning and Roles

A successful SAML login provisions or updates a user using the IdP identity and available profile attributes. The user's role is synchronized from `ADMIN_EMAILS` on login. Matching addresses receive `ADMIN`; all other users receive `LEARNER`.

### 4.3 Route Protection

- `/admin/**` requires an authenticated administrator.
- `/training/**` requires an authenticated user.
- Session actions require ownership of the referenced session.
- Deactivated users cannot create or continue sessions.

## 5. Data Model

The canonical model is `prisma/schema.prisma`. The main persisted entities are listed below.

### 5.1 Users

`User` stores `id`, `name`, unique `email`, `role`, optional `deactivatedAt`, and timestamps. Roles are `ADMIN` and `LEARNER`.

### 5.2 Training Assignments

`TrainingAssignment` stores the learner `userId`, assigning administrator, optional `templateId`, `deadline`, `isPractice`, and timestamps. It relates to the assigned user, assigner, optional template, and resulting sessions.

### 5.3 Sessions

`Session` stores the learner, optional assignment, `IN_PROGRESS`/`COMPLETED`/`FAILED` status, nullable score, attempt number, practice state, and lifecycle timestamps.

### 5.4 Session Emails

`SessionEmail` links a session to a generated email and stores `submitted`, nullable `markedLegitimate`, nullable `userPassed`, `reasoningAccepted`, and submission timestamps. It relates to user flags, explanations, and chat messages.

### 5.5 Email Templates

`EmailTemplate` stores the source dataset, category, raw subject/body/sender, phishing status, optional attachments and URLs, a unique SHA-256 body hash, usage mode, review status, creator/reviewer references, review timestamp, notes, and timestamps.

Usage modes are `INSPIRATION` and `DIRECT`. Template statuses are `DRAFT`, `APPROVED`, `REJECTED`, and `ARCHIVED`.

Dataset-seeded templates remain available as training seeds. Admin-created templates use `sourceDataset = 'admin'` and are shown in the admin authoring list.

### 5.6 Generated Emails and Flags

`GeneratedEmail` stores the rendered subject, body, sender, phishing status, optional attachments and URLs, optional source template, and timestamps. Expected flags are stored in the related `ExpectedFlag` records, not in a JSON column.

Expected flags contain exact body text and offsets, a category, and an optional predefined zone. Body flags use offsets in the email body. Sender, subject, URL, and attachment flags use the corresponding zone and `0 / 0` offsets.

`UserFlag` stores the learner's category, selected text, optional body offsets, and optional zone. `UserExplanation` stores the learner's explanation and nullable AI feedback. `AiChatMessage` stores the conversation for the current email.

## 6. Kaggle Dataset Ingestion

When the `email_templates` table is empty and Kaggle credentials are configured, the startup plugin:

1. Downloads the configured dataset into the Git-ignored `.cache/kaggle` directory.
2. Reads CSV and JSON files as text data.
3. Normalizes valid rows into email templates.
4. Deduplicates rows by SHA-256 hash of the body.
5. Inserts the normalized templates into PostgreSQL.

Ingestion is skipped when templates already exist. Failures are logged without preventing the server from starting. The cache contains source data only for local ingestion and is excluded from version control.

## 7. Session Generation

`POST /api/session/start` creates an assigned or practice session. The server selects up to 12 approved inspiration templates as seed examples. If no inspiration templates are available, approved direct templates are eligible.

The server makes parallel Bedrock requests for phishing and legitimate email sets. It requests 5 to 7 total emails with a phishing ratio centered around 70 percent, then validates and persists the model response. Assigned direct templates are included as a fixed email when applicable.

Generated emails are persisted in `generated_emails`; their expected flags are persisted in `expected_flags`. The client receives email content without expected flags until the learner submits that email.

The model prompt requires fictional names and domains, valid JSON, plain-text bodies, and suspicious flags that refer to exact body substrings or predefined zones. Legitimate emails have no expected flags.

## 8. Learner Experience

### 8.1 Session Types

- Assigned sessions are linked to an administrator-created assignment and contribute to official records.
- Practice sessions can be started by the learner and do not affect official assignment reporting.

### 8.2 Inbox

The training view presents an Outlook-style inbox with an email list and reading pane. Learners can open messages in any order, see submitted and pending state, and inspect sender, subject, body, URLs, and attachments without downloading resources.

Sender, subject, URL, and attachment areas are predefined interactive zones. Learners can select arbitrary body text and assign a suspicious category through the tag popover. The UI persists flags and explanations through the session API.

### 8.3 Submission and Coaching

Submitting an email records the learner's classification and flags, returns the score result, and reveals the expected annotations for that email. A learner must provide an explanation before continuing. The explanation endpoint streams AI feedback through SSE. The chat endpoint provides an ongoing, email-scoped coaching conversation, also through SSE.

Session state is persisted after each action so an in-progress session can be resumed. Starting over creates a new attempt with newly generated emails.

## 9. Scoring

Scoring is deterministic and runs on the server. It compares learner flags with expected flags by category and either body-text overlap or predefined zone.

- Legitimate emails are excluded from the official phishing score but still receive feedback.
- A phishing email receives partial credit based on matched expected flags.
- An email passes when its partial-credit result reaches 50 percent.
- The final session score is the average partial-credit rate across scored phishing emails.
- A completed official session passes at an 80 percent session threshold.
- Practice scores are stored with the practice session but do not affect official assignment records.

## 10. Learner Summary

`/training/summary/[id]` displays completion status, score, per-email results, missed flags, explanations, AI feedback, and session timing. Completed sessions can be reviewed with annotations revealed. Retakes are represented by a new session and attempt number.

## 11. Admin Dashboard

The admin area includes:

- User list and user detail with session history
- Assignment creation and assignment status
- Analytics for learner and session activity
- Custom email-template authoring and review

The template list is filtered to `sourceDataset = 'admin'`, so imported dataset rows do not clutter the admin authoring workflow. Admins can search and filter custom templates by text, status, and usage mode. New body flag offsets are derived from exact flagged text; zone flags use predefined zones. Approved direct phishing templates must contain expected flags.

CSV/PDF report export, notifications, completion certificates, multi-tenant support, difficulty tiers, and free-text score impact are outside the current implementation.

## 12. API Routes

| Method | Path | Authorization | Purpose |
|---|---|---|---|
| POST | `/auth` | SAML callback | Authenticate through Okta |
| GET | `/api/auth/dev-login` | Localhost development | Create a development session |
| GET | `/api/auth/signout` | Authenticated | Clear the session |
| GET | `/api/session/active` | Owner | Fetch the owner's active session |
| POST | `/api/session/start` | Authenticated | Start an assigned or practice session |
| GET | `/api/session/:id` | Owner | Fetch a session without unrevealed expected flags |
| POST | `/api/session/submit-email` | Owner | Submit classification and flags |
| POST | `/api/session/flag` | Owner | Save a learner flag |
| POST | `/api/session/explain` | Owner | Stream explanation feedback through SSE |
| POST | `/api/session/chat` | Owner | Stream coaching chat through SSE |
| POST | `/api/session/complete` | Owner | Complete a session and compute its score |
| GET | `/api/admin/users` | Admin | List users |
| PATCH | `/api/admin/users/:id` | Admin | Update user role or activation |
| GET | `/api/admin/users/:id/sessions` | Admin | Fetch a user's session history |
| GET | `/api/admin/assignments` | Admin | List assignments |
| POST | `/api/admin/assignments` | Admin | Create an assignment |
| GET | `/api/admin/templates` | Admin | List admin-created templates |
| POST | `/api/admin/templates` | Admin | Create an admin template |
| GET | `/api/admin/templates/:id` | Admin | Fetch one template |
| PATCH | `/api/admin/templates/:id` | Admin | Update template content or review state |

## 13. Project Structure

```text
phish-net-real/
├── app/
│   ├── assets/css/main.css
│   ├── components/
│   │   ├── admin/
│   │   └── inbox/
│   ├── composables/
│   ├── middleware/
│   ├── pages/
│   │   ├── admin/
│   │   └── training/
│   └── plugins/
├── prisma/
│   ├── migrations/
│   ├── generated/
│   └── schema.prisma
├── public/icons/
├── server/
│   ├── api/
│   │   ├── admin/
│   │   ├── auth/
│   │   └── session/
│   ├── plugins/
│   ├── routes/
│   └── utils/
├── tests/
├── docker-compose.yml
├── nuxt.config.ts
├── package.json
├── README.md
└── SPEC.md
```

## 14. Security Considerations

- Expected flags remain server-side until the relevant email is submitted.
- Every admin API route checks the authenticated user's administrator role.
- Session ownership is checked before learner actions are accepted.
- Deactivated users cannot continue training.
- AWS, Kaggle, SAML, and session secrets are server-side environment configuration.
- The development login is restricted to localhost and disabled in production.
- Email resources are displayed by the training UI without downloading attachments.
- Prisma provides parameterized database queries.
- `.env`, `.cache/kaggle`, database files, and other local artifacts are excluded from Git.

Rate limiting, centralized audit logging, production secret rotation, dependency maintenance, and operational monitoring remain deployment responsibilities.

## 15. Validation

```powershell
npx tsc --noEmit
npm test -- --run
npm run build
```

The current automated suite covers request handlers and scoring behavior. Production deployment also requires organization-specific Okta configuration, AWS Bedrock access, hosted PostgreSQL, and operational controls.
