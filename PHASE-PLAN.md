# Phish-Net Project Plan

This plan reflects the current implementation and separates completed portfolio work
from optional production hardening.

## Completed

### Phase 1 - Real learner training flow

- Kaggle templates are ingested on first startup when the template table is empty.
- Dataset rows are cached in `.cache/kaggle`, deduplicated, and kept out of the admin
  authoring list.
- Learner sessions use real PostgreSQL data and Bedrock-generated emails.
- Practice sessions, assignments, flagging, submission, resume, and completion are wired
  to the server APIs.

### Phase 2 - Scoring, feedback, and summaries

- Server-side scoring compares body selections and predefined zones deterministically.
- Phishing emails receive partial credit; the session score averages phishing-email scores.
- Submitted emails reveal expected flags only after submission.
- Learners must provide a relevant explanation before continuing.
- AI explanations and coaching chat stream through SSE.
- Session summaries show scores, email results, missed flags, explanations, and feedback.

### Phase 3 - Admin dashboard

- User list, user detail, role/deactivation controls, and session history are implemented.
- Assignment creation and assignment listing are implemented.
- Analytics are implemented.
- Admin-created email templates support direct authoring, expected flags, resources,
  review status, usage mode, search, and filtering.
- Dataset templates remain available for training without cluttering the admin template list.

### Phase 4 - Authentication

- Production authentication uses Okta SAML through Passport.
- Users are provisioned from the SAML identity and roles are synchronized from
  `ADMIN_EMAILS`.
- Admin and learner route middleware is enabled.
- The development login is restricted to localhost and non-production environments.
- Session ownership and deactivated-user checks are enforced server-side.

### Phase 5 - Portfolio documentation

- [README.md](README.md) documents setup, architecture, workflows, configuration, and
  security notes.
- [SPEC.md](SPEC.md) documents the current data model, API routes, scoring, ingestion,
  and application behavior.

## Optional Production Hardening

These items are not required for a GitHub portfolio, but are the next engineering steps
for a public deployment:

1. Add timeout and cancellation handling for Bedrock generation and chat requests.
2. Validate assignment user IDs and enforce email-body bounds for submitted offsets.
3. Remove or complete the unused `server/utils/reqResponseValidator.ts` helper.
4. Move large first-run Kaggle ingestion to an explicit seed or background job so startup
   is not blocked by parsing and hashing the source data.
5. Add rate limiting, structured audit logging, monitoring, and production secret rotation.
6. Add browser-level end-to-end tests for authentication, learner training, AI chat, and
   admin workflows.

## Portfolio Polish

1. Add a GitHub Actions workflow for TypeScript checks and automated tests.
2. Add screenshots or a short product demo to the README.
3. Document a safe demo setup that does not require committing AWS, Okta, Kaggle, or
   database credentials.
4. Keep this plan and the README updated when features change.

## Verification Checklist

1. Start PostgreSQL, apply migrations, and verify a fresh database can load templates.
2. Verify learner flow: start, flag, submit, review, explain, chat, complete, and summary.
3. Verify admin flow: users, assignments, analytics, and custom templates.
4. Verify authentication: production routes require SAML and learners cannot access admin.
5. Run `npx tsc --noEmit`.
6. Run `npm test -- --run`.
7. Run `npm run build` before releases.
