# Tech Dental — Project State (handoff)

Last updated: 28 Nov 2026
Repo: `D:\tech dental z` · branch `main` · remote `https://github.com/medibanadata-arch/Techdental.git`

Read this file first in a new session. It records the architecture, deploy steps,
chat-agent rules, and the open issues so nothing has to be rediscovered.

---

## 1. What this project is

Replacement of the old Laravel site for Tech Dental (techdentalcare.com) with the
same design, URLs, content and admin, plus a Bengali live-chat agent ("তানিয়া").

- **Astro SSR** (`@astrojs/node`, standalone) serving React pages through an Inertia shim → `astro-site/`
- **Original Laravel app** still in the repo (parity copy of the chat logic)
- Both read/write the **same** `database/database.sqlite`

Live: https://astro-production-a6c53551.up.railway.app
Railway: project `tech-dental`, service `astro`, Docker builder, `Dockerfile.astro`
Env: `PORT=3000`, `NODE_ENV=production`, `RAILWAY_DOCKERFILE_PATH=Dockerfile.astro`

Local: build then run `astro-site/dist/server/entry.mjs` on port 4322.

---

## 2. Commands

```powershell
# build
cd "D:\tech dental z\astro-site"; npm run build

# run locally (PowerShell)
cd "D:\tech dental z\astro-site"
$p = Get-NetTCPConnection -LocalPort 4322 -State Listen -ErrorAction SilentlyContinue |
     Select-Object -First 1 -ExpandProperty OwningProcess
if ($p) { Stop-Process -Id $p -Force }
$env:PORT='4322'; $env:HOST='127.0.0.1'
Start-Process node -ArgumentList "dist/server/entry.mjs" -WorkingDirectory "D:\tech dental z\astro-site" -WindowStyle Hidden

# push + deploy
cd "D:\tech dental z"
git add -A; git commit -m "..."; git push origin main
railway up --service astro --ci
```

Notes
- If `git push` fails with `CONNECT tunnel failed, response 502` the local proxy
  (`HTTP(S)_PROXY=http://127.0.0.1:40000`) is down. Workaround:
  `$env:HTTPS_PROXY=''; $env:HTTP_PROXY=''; git -c http.proxy= -c https.proxy= push origin main`
- PowerShell mangles Bengali output. For Bengali text use Node scripts and read the
  result with the file-read tool, never `console.log` through PowerShell pipes.
- `railway ssh` times out; rely on `railway up --ci` + live HTTP checks.

---

## 3. Key files

| Area | Path |
|---|---|
| Chat endpoint (Astro) | `astro-site/src/lib/api/aiChat.ts` |
| Chat defaults | `astro-site/src/lib/aiTrainingData.ts` |
| Admin handlers (Astro) | `astro-site/src/lib/admin/handlers/ai.ts` |
| Admin UI (Astro) | `astro-site/src/app/Pages/AiAssistant/AdminIndex.tsx` |
| Chat + admin (Laravel) | `app/Http/Controllers/AiAssistantController.php` |
| Admin UI (Laravel) | `resources/js/Pages/AiAssistant/AdminIndex.tsx` |
| Training text source of truth | `docs/live-chat-agent-tania.md` |
| Docker image | `Dockerfile.astro` |
| DB ignore rules (critical) | `database/.gitignore` → `*.sqlite*` + `!database.sqlite` |
| Gap-teeth catalog image | `public/uploads/ai/faka-dat-composite-veneer-cost.webp` (580×960, 99,646 B) |

Parity rule: any chat change must be applied to **both** Astro and Laravel copies.

---

## 4. Chat agent ("তানিয়া")

### Storage
- Single field: `ai_chat_settings.training_data` (persona + knowledge base merged).
- `ai_chat_settings.system_prompt` is intentionally **empty**; the prompt is built
  from `training_data` only. The old "System Instructions / Clinic Context" textarea
  was removed from both admin UIs.
- Source of truth on disk: `docs/live-chat-agent-tania.md`
  (currently 8,668 chars / 21,997 bytes, emoji list 😊 🦷 ✨ 📍 — 📞 removed by owner).
- Admin "Load Clinic Template" loads the same text (`DEFAULT_TRAINING_TEMPLATE`).
- Code defaults mirrored in `aiTrainingData.ts` and `AiAssistantController::DEFAULT_TRAINING_DATA`.

### Current settings (DB row id=1)
- `gemini_enabled = 1`, `gemini_model = gemini-3.5-flash-lite`
- `fallback_reply = "Test fallback"`  ← **placeholder, must be replaced**
- 4 keyword rules remain in `ai_chat_replies` (ids 1, 4, 5, 7)

### Request flow (`handleAiChat`)
1. Gemini (when enabled + API key) with system instruction = training data + 10 strict guidelines.
2. Keyword rules from `ai_chat_replies` (active, by priority).
3. `fallback_reply`, else a built-in Bangla fallback.

### Guidelines (in `aiChat.ts` / PHP controller)
1. answer only from training data
2. exact prices from training data
3. mention branches + hotline 09638-000505 when helpful
4. WhatsApp 01400-786162 only if explicitly asked
5. reply in the patient's language (Bangla/Banglish → Bangla, English → English)
6. include YouTube link if present in training data
7. output only the final patient-facing message (no reasoning)
8. doctor/schedule answers only from training data, else hotline
9. booking = hotline or online booking form only, never collect details
10. NO-GUESS rule: never confirm anything absent from training data (bKash/card/EMI,
    insurance, parking, prices…), point to the hotline instead

### Gap-teeth image
`chatReplyImage()` returns `/uploads/ai/faka-dat-composite-veneer-cost.webp` only when
the answer is about gap teeth **and** contains an amount, and is **not** about
braces/aligners. Applies to both Gemini replies and keyword replies.

### Memory
Only the last **10 messages** of the current conversation are sent, each truncated to
1,500 chars (`normalizeChatHistory`). Nothing older is remembered; admin
"Patient Search History (50)" is a log only, not memory.

---

## 5. Open issues (nothing implemented yet — owner must confirm)

1. **Language flips (main issue).** English questions are sometimes answered in Bangla.
   Causes: (a) four fixed Bangla sentences in the training text that the model copies
   verbatim — greeting, general branch answer, premium-option question, "more details?";
   (b) the whole knowledge base is Bengali; (c) last-10-message history bias; (d) no
   code-level language detection.
   Proposed short fix (agreed direction): remove the quotation marks around those four
   sentences (no English text needed) + add a per-request language directive with a
   Banglish keyword list, defaulting to Bangla when unsure. Not started.
2. **Unprompted salam.** Bot opens with "আসসালামু আলাইকুম"/"ওয়ালাইকুম আসসালাম" even when
   the patient never greeted. Fix: add a line "রোগী সালাম না দিলে নিজে থেকে সালাম বলবে না".
3. **Keyword rules.** Owner asked to delete all 4. Not done. Note rule id=1 has English
   keywords (`location, address, branch, timing, hours`) but a Bangla-only reply, so on
   Gemini failure an English question gets Bangla. If the rules are deleted, the
   `fallback_reply` placeholder must be replaced with a polite bilingual message first.
4. **`fallback_reply` = "Test fallback"** — a patient could see this.
5. **Railway filesystem is ephemeral.** Admin edits and uploads are lost on redeploy
   unless volumes are attached at `/app/database` and `/app/public/uploads`.

---

## 6. Verified state

- Legacy QC: 342/342 old URLs return 200, 0 title mismatches.
- Branch pages: EN/BN switch, bilingual SEO, compact fonts, "More About Mirpur" /
  "… ব্রাঞ্চ সম্পর্কে বিস্তারিত", FAQ tabs show only their own category.
- "Last Updated" is computed at render time (Nov 2026 / নভেম্বর ২০২৬, rolls over).
- Gap-teeth image shows only for gap-teeth cost answers (verified local + live).
- Chat: persona = তানিয়া, greeting, gap cost → image, broken tooth → no image,
  bKash/insurance/parking → "no info + hotline", English → English (when it complies).

## 7. Recent commits

```
0bec01ba Sync training data defaults with the emoji edit made in the admin panel
40eeaf05 Add no-guess guard so chat never confirms facilities missing from training data
86936221 Replace Tania training data with the new role + knowledge base text
24dbbbc8 Merge chat context and knowledge base into a single Tania training data field
2f4070cc Replace gap-teeth catalog image and show it only for gap cost answers
539b2d84 Ship SQLite database in Astro image and guard against empty DB
```

---

## 8. Guardrails

- Do not change prices, addresses, schedules, warranties, design, URLs or routing
  without an explicit request.
- Keep Astro and Laravel copies in sync.
- Keep `!database.sqlite` in `database/.gitignore`, otherwise `railway up` skips the DB
  and the live site fails with `no such table: redirects`.
- After changing `training_data` in the admin panel, the change lives only in the local
  DB file; it reaches production only on the next `railway up`.
