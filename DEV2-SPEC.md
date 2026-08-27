# Dev 2 — Training UI: Detailed Spec

## Decisions

| Question | Decision |
|---|---|
| Email body format | Plain text — render with `whitespace-pre-wrap`, offsets are character positions in the raw string |
| Loading screen | Full-page overlay on `session.vue` — shown while `POST /api/session/start` is pending, replaced by inbox once done |
| "Mark as Legitimate" + existing tags | Toggling clears all existing tags — call DELETE for each, reset local state |
| Zone popover category | Always open with all categories available, nothing pre-filled |
| Sidebar progress | "X of Y submitted" + running score (phishing emails passed / total phishing emails seen so far) |
| Overlapping tags | Allowed — render with stacked/blended colors (`mix-blend-mode: multiply` on highlight spans) |
| "Read" state | Set as soon as the user clicks the email (opens in reading pane) — tracked in local state only, not persisted |
| Session complete trigger | An explicit "Complete Session" button appears in the sidebar once all emails are submitted |
| Navigation lock (chat gate) | Dev 2's `EmailList` just emits the click event — Dev 3's `ChatPanel` is responsible for blocking navigation until the user has sent at least one message |

---

## Files to Create

### `app/types/session.ts`

Define these types exactly — all other files import from here:

- `FlagCategory` — union of the 9 string literals from SPEC §8.6:
  ```ts
  type FlagCategory =
    | 'suspicious_url'
    | 'urgency_language'
    | 'grammar_error'
    | 'fake_sender'
    | 'info_request'
    | 'money_request'
    | 'too_good_to_be_true'
    | 'threatening_language'
    | 'suspicious_attachment'
  ```
- `ZoneType` — `'sender' | 'subject' | 'url' | 'attachment'`
- `UserFlagLocal` — local flag shape before/after DB save (`id`, `sessionEmailId`, `flagCategory`, `flaggedText`, `startOffset | null`, `endOffset | null`, `zoneType | null`)
- `EmailAttachment` — `{ filename: string, suspicious: boolean }`
- `EmailUrl` — `{ displayText: string, href: string, suspicious: boolean }`
- `SessionEmail` — full shape including `userFlags`, `submitted`, `userPassed`; `revealedFlags` is optional (only present after submission)
- `Session` — top-level shape with `sessionEmails[]`

---

### `app/composables/useSession.ts`

Manages all session state. Exposes:

| Export | Type | Description |
|---|---|---|
| `session` | `readonly Ref<Session \| null>` | Full session state |
| `activeEmailId` | `readonly Ref<string \| null>` | Currently open email |
| `activeEmail` | `ComputedRef<SessionEmail \| null>` | Derived from `activeEmailId` |
| `loading` | `readonly Ref<boolean>` | |
| `error` | `readonly Ref<string \| null>` | |
| `startSession(isPractice)` | `() => Promise<void>` | POST `/api/session/start` |
| `fetchSession(id)` | `(id: string) => Promise<void>` | GET `/api/session/:id` |
| `submitEmail(sessionEmailId, markedLegitimate)` | `() => Promise<void>` | POST `/api/session/submit-email`; updates matching `sessionEmails` entry in local state with response (includes `revealedFlags`) |
| `saveFlag(sessionEmailId, flag)` | `() => Promise<UserFlagLocal>` | POST `/api/session/flag` |
| `removeFlag(flagId)` | `(id: string) => Promise<void>` | DELETE `/api/session/flag/:id` |
| `completeSession()` | `() => Promise<void>` | POST `/api/session/complete` |
| `selectEmail(emailId)` | `(id: string) => void` | Sets `activeEmailId` |

---

### `app/composables/useHighlighting.ts`

Handles mouse text selection in the email body. Exposes:

| Export | Description |
|---|---|
| `pendingSelection` | `{ text, startOffset, endOffset } \| null` |
| `showPopover` | bool |
| `popoverAnchor` | `{ x, y }` — mouse position from `mouseup` event |
| `onMouseUp(event, containerEl)` | Reads `window.getSelection()`, walks DOM of `containerEl` to compute absolute character offsets, sets `pendingSelection` and `showPopover` |
| `clearPending()` | Clears selection state and removes browser selection range |

**Offset calculation:** use `document.createTreeWalker` on the container with `NodeFilter.SHOW_TEXT`, accumulate text lengths until reaching the selection's `startContainer`.

---

### `app/pages/training/session.vue`

Two states controlled by a `loading` boolean:

**State 1 — Loading overlay** (while `startSession()` / `fetchSession()` is pending):
- Centered spinner
- Rotating tip every 3 seconds — cycle through the 7 tips from SPEC §7.4 using `setInterval`, cleared on unmount

**State 2 — Inbox** (once session data is loaded):
- Renders `<InboxLayout>` passing the full session

**On mount:** check for `?id=` query param — if present call `fetchSession(id)`; otherwise call `startSession()`.

---

### `app/components/inbox/InboxLayout.vue`

**Props:** `session: Session`

Three-column layout using CSS Grid (`grid-cols-[200px_300px_1fr]`), full viewport height, no scroll on outer shell.

| Column | Content |
|---|---|
| Left (200px) | Sidebar: "📥 Inbox (N)" count of unsubmitted emails; "📊 Progress" showing X of Y submitted + running score |
| Middle (300px) | `<EmailList>` |
| Right (1fr) | `<ReadingPane>` |

Pass `activeEmailId` down; emit `select-email` up to update it.

---

### `app/components/inbox/EmailList.vue` + `EmailListItem.vue`

`EmailList` renders the list of `SessionEmail` items in original order (never rearranged on submit).

**`EmailListItem` props:** `sessionEmail: SessionEmail`, `isActive: boolean`

| State | Visual |
|---|---|
| Unread + unsubmitted | Bold sender name, filled circle indicator |
| Read + unsubmitted | Normal weight, no circle |
| Submitted | Checkmark indicator on the right |
| Active | `bg-blue-50 border-l-2 border-blue-600` |

Shows: sender name (parsed from `sender` string), subject, first 60 chars of body as preview snippet.

---

### `app/components/inbox/ReadingPane.vue`

**Props:** `sessionEmail: SessionEmail | null`

Shows empty state ("Select an email") when null.

When loaded, renders in order:
1. `<PredefinedZone type="sender">` — full sender string
2. `<PredefinedZone type="subject">` — subject line
3. `<EmailBody>` — plain text body with URL zones injected inline
4. Attachment badges — one `<PredefinedZone type="attachment">` per attachment in the email
5. `<SubmitBar>` pinned to the bottom

After submission: reading pane is locked (no new tags). Leave a `<!-- FlagAnnotation placeholder -->` comment where `<EmailBody>` was — Dev 3 replaces this.

---

### `app/components/inbox/EmailBody.vue`

**Props:** `sessionEmail: SessionEmail`, `readonly: boolean` (true after submission)

Renders email body as plain text (`whitespace-pre-wrap`). Two layers:

**Highlight layer:** absolutely positioned `<TagHighlight>` for each `userFlag` with `startOffset`/`endOffset`. Split body text into three spans (before / highlighted / after) and apply `background-color` to the middle span. Sits visually behind the text using `mix-blend-mode` or `opacity`.

**Text layer:** raw body string. URL substrings are replaced inline with `<PredefinedZone type="url">` by scanning `generatedEmail.urls` array and matching `displayText` positions.

On `mouseup` (when not readonly): call `useHighlighting.onMouseUp`. If `pendingSelection` is set, render `<TagPopover>` at `popoverAnchor`.

---

### `app/components/inbox/PredefinedZone.vue`

**Props:** `type: ZoneType`, `content: string`, `sessionEmailId: string`, `readonly: boolean`, `existingFlag: UserFlagLocal | null`

| Zone type | Visual treatment |
|---|---|
| `sender` | Pill/badge — `bg-gray-100 rounded-full px-2 py-0.5 text-sm font-mono` |
| `subject` | Highlighted bar — `bg-blue-50 border border-blue-200 rounded px-2 py-1 block w-full` |
| `url` | Underlined — `text-blue-600 underline cursor-pointer` (never a real `<a>` link) |
| `attachment` | File badge — `bg-gray-100 border rounded px-2 py-1 inline-flex items-center gap-1` |

On click (when not readonly): open `<TagPopover>` positioned relative to this element. If `existingFlag` is set, popover opens in edit mode with a "Remove tag" option.

**Security:** URL `href` values are never rendered as real links — always intercept click and open popover instead.

---

### `app/components/inbox/TagPopover.vue`

**Props:** `anchor: { x, y } | null`, `sessionEmailId: string`, `prefillCategory: FlagCategory | null`, `existingFlagId: string | null`

**Emits:** `confirm(category: FlagCategory)`, `remove`, `cancel`

Renders as a floating card (`position: fixed`) near the anchor point. Repositions if it would overflow the viewport.

**Contents:**
1. Category `<select>` with all 9 options (display labels → `FlagCategory` values):

| Display label | Value |
|---|---|
| Suspicious / spoofed URL | `suspicious_url` |
| Urgency / pressure language | `urgency_language` |
| Spelling or grammar error | `grammar_error` |
| Fake / spoofed sender address | `fake_sender` |
| Request for personal information | `info_request` |
| Request for money / gift cards | `money_request` |
| Too-good-to-be-true offer | `too_good_to_be_true` |
| Threatening / fear-inducing language | `threatening_language` |
| Suspicious file attachment | `suspicious_attachment` |

2. "Tag it" button — disabled until category is selected; emits `confirm`
3. "Remove tag" button — only shown when `existingFlagId` is set; emits `remove`
4. "Cancel" button — emits `cancel`

Closes on `Escape` key or click outside.

---

### `app/components/inbox/TagHighlight.vue`

**Props:** `startOffset: number`, `endOffset: number`, `category: FlagCategory`, `bodyText: string`, `readonly: boolean`

**Emits:** `edit` — parent opens `TagPopover` in edit mode

Renders the body split into three `<span>` segments: before, highlighted, after. The highlighted span uses a background color based on category. When not readonly, the highlighted span is clickable and emits `edit`.

---

### `app/components/inbox/SubmitBar.vue`

**Props:** `sessionEmail: SessionEmail`

**Emits:** `submit(markedLegitimate: boolean)`

| Control | Behavior |
|---|---|
| "Mark as Legitimate" toggle | On enable: call `removeFlag` for all existing flags on this email, clear local flag state |
| "I'm Finished" button | Enabled when: ≥1 `userFlag` exists **OR** "Mark as Legitimate" is checked. Disabled otherwise. On click: emits `submit`. |

---

### `app/pages/training/index.vue` — Session start / resume

On mount: fetch active assignment + any `IN_PROGRESS` session for the current user.

| State | UI |
|---|---|
| In-progress session exists | "Resume Session" button → `/training/session?id=X`; "Start Over" button → `POST /api/session/start` with same `assignmentId`, navigate to new session |
| Active assignment, no in-progress session | "Start Training" button + "Practice" button |
| No assignment | "Practice" button only |

---

### `app/pages/training/practice.vue`

Single "Start Practice Session" button. On click: `startSession(isPractice: true)`, then navigate to `/training/session?id=X`. No `assignmentId` attached.
