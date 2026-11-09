# TECH DENTAL CARE — COMPREHENSIVE WEBSITE AUDIT REPORT
**Audit Date:** November 8, 2026  
**Auditor:** Senior Full-Stack Developer & QA Lead  
**Application Stack:** Laravel 11 / PHP 8.2+, Inertia.js (React 18 + TypeScript), Tailwind CSS, Vite, SQLite  
**Environments Inspected:** Local Development (`http://127.0.0.1:8000`), Cloudflare Live Tunnel, Codebase Repository (`origin/main`)

---

## 1. Executive Summary

This comprehensive audit of the **Tech Dental** web application evaluated the codebase architecture, database schema, REST/Inertia routing, security posture, responsive design, user journeys, and runtime logs.

While the visual design and component architecture demonstrate substantial effort, the audit identified **several critical security vulnerabilities, broken user journeys, responsive layout breakages on tablet devices, data synchronization discrepancies between legacy and modern modules, and SEO domain mismatches**.

### Key Statistics:
- **Total Issues Identified:** 24
- **Critical Severity:** 3
- **High Severity:** 8
- **Medium Severity:** 9
- **Low Severity:** 4

---

## 2. Comprehensive Issue Matrix

| Issue ID | Category | Title | Severity | Affected Area |
| :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | Security | Unrestricted Public Registration Grants Full Admin Access | **Critical** | `routes/auth.php`, `RegisteredUserController.php` |
| **SEC-02** | Security | Arbitrary File Upload & Potential Remote Code Execution (RCE) | **Critical** | `MediaController.php`, `SettingController.php` |
| **SEC-03** | Security | Production SQLite Database Tracked & Exposed in Git Repository | **Critical** | `database/database.sqlite`, `.gitignore` |
| **SEC-04** | Security | SSL Verification Disabled on External APIs (`withoutVerifying`) | **High** | `AiAssistantController.php` |
| **SEC-05** | Security | Missing Rate Limiting on Public Endpoints (`api/ai-chat`, `/complaint-box`) | **High** | `routes/web.php`, `ComplaintController.php` |
| **SEC-06** | Security | Unsanitized Rich Content Rendering (Stored XSS Risk) | **High** | `Home.tsx`, `CustomPages/Show.tsx`, `PageController.php` |
| **SEC-07** | Security | Session Cookie Missing `Secure` Flag in Production | **Medium** | `config/session.php`, `.env` |
| **SEC-08** | Security | Lack of Role-Based Authorization Checks (RBAC) in User Management | **High** | `UserController.php` |
| **FUNC-01** | Functionality | Branch Pre-Selection Ignored on Appointment Booking Page | **High** | `BookAppointment/PublicIndex.tsx`, `Branch/PublicShow.tsx` |
| **FUNC-02** | Functionality | AI Chatbot Formatting Glitch (`• **WhatsApp:** ****`) & Topic Misalignment | **High** | `AiAssistantController.php` |
| **FUNC-03** | Functionality | AI Assistant 12-Second Hang due to Non-Existent Gemini Model | **High** | `AiAssistantController.php`, `ai_chat_settings` table |
| **FUNC-04** | Functionality | Non-Existent Service URLs Return HTTP 200 (Soft 404 / Duplicate Content) | **Medium** | `ServiceController.php` |
| **FUNC-05** | Functionality | Draft and Trashed Blog Articles Publicly Accessible | **Medium** | `BlogController.php` |
| **FUNC-06** | Functionality | Inconsistent "Book Appointment" Modal vs Form vs Redirect Flows | **Medium** | `Doctors/PublicSingle.tsx`, `Doctors/PublicIndex.tsx` |
| **FUNC-07** | Functionality | Hardcoded Branch Matching in Doctor Controller Overrides New Branches | **Medium** | `DoctorController.php` |
| **FUNC-08** | Functionality | Team Member Detail Route Fails for Non-Management Staff | **Medium** | `TeamMemberController.php` |
| **ARCH-01** | Architecture | Duplicate Pricing/Services System: Homepage Queries Legacy Table | **High** | `routes/web.php`, `BranchController.php`, `ServiceController.php` |
| **ARCH-02** | Architecture | Case-Sensitive Component Import Path Conflicts on Linux Deployments | **High** | Over 15 TSX files across `resources/js/Pages/` |
| **RESP-01** | UI / Responsive | Tablet (768px – 1024px) Layout Squeeze in Branch Hero & Shift Cards | **High** | `Branch/PublicShow.tsx` |
| **RESP-02** | UI / Responsive | Full Page Hard Refreshes Instead of Client-Side SPA Transitions | **Medium** | `TopHeader.tsx` |
| **SEO-01** | SEO / Branding | Incorrect Hardcoded Canonical Domain (`techdentalbd.com` vs `techdentalcare.com`) | **High** | `Branch/PublicShow.tsx`, `Services/PublicSingle.tsx`, etc. |
| **SEO-02** | SEO / Performance | Missing Database Indexes on Critical Route Slugs & Filter Columns | **Medium** | `database/migrations/`, `posts`, `locations`, `doctors` |
| **SEO-03** | SEO / Content | Irrelevant Foreign Practice Content Published on Live Blog | **Low** | `posts` table (ID 6: Chennai Clinic article) |
| **PERF-01** | Performance | Duplicate FontAwesome Loading & Excessive Synchronous Font Requests | **Medium** | `app.blade.php`, `resources/css/app.css` |

---

## 3. Detailed Audit Findings

---

### [SEC-01] Unrestricted Public Registration Grants Full Admin Access
- **Affected File/Page:** `routes/auth.php` (lines 15–18), `app/Http/Controllers/Auth/RegisteredUserController.php`
- **Severity:** **CRITICAL**
- **Description:** Anyone visiting `/register` on the live public website can create an account and is immediately authenticated. Because all administrative routes (`/dashboard`, `/users`, `/doctors-admin`, `/settings-admin`, `/homepage-cms`, `/media`, etc.) are protected only with `middleware('auth')` and do not verify administrative roles, any newly registered user receives unrestricted administrative access.
- **Root Cause:** Laravel Breeze default registration routes remained active in production with no role check or route disabling.
- **Recommended Solution:**
  1. Remove or disable the public registration routes (`register`) in `routes/auth.php`.
  2. Restrict user creation strictly to authenticated Administrators inside `UserController.php`.
  3. Introduce a dedicated `admin` or role middleware (`CheckRole:Administrator`) on all management routes.
- **Testing Requirements:**
  - Verify navigating to `GET /register` returns 404 Not Found or redirects to login.
  - Verify attempting a `POST /register` is rejected.
  - Verify only authenticated Administrators can access `/users` and `/settings-admin`.

---

### [SEC-02] Arbitrary File Upload & Potential Remote Code Execution (RCE)
- **Affected File/Page:** `app/Http/Controllers/MediaController.php` (lines 102–115, 241–261), `app/Http/Controllers/SettingController.php` (lines 58–79)
- **Severity:** **CRITICAL**
- **Description:** Files uploaded through the Media Manager and Settings (Logo/Favicon) are moved directly into public web-accessible directories (`public/uploads/files/` and `public/uploads/images/`) using client-supplied file extensions without strict MIME-type and extension validation. An attacker can upload executable scripts (e.g. `.php`, `.phtml`) and execute them directly via HTTP.
- **Root Cause:**
  - `MediaController::store` falls back to `files` subfolder and retains `$file->getClientOriginalExtension()`.
  - `SettingController::update` moves `logo_file` and `favicon_file` without Laravel validation rules (`mimes:png,jpg,webp,svg,ico|max:4096`).
- **Recommended Solution:**
  1. Add strict server-side validation rules to all file upload methods:
     `'file' => 'required|file|mimes:jpeg,jpg,png,webp,svg,gif,pdf|max:10240'`
  2. Enforce generated filenames with whitelisted extensions only.
  3. Disable script execution in web server configuration (Nginx/Apache) for the `/uploads/` directory.
- **Testing Requirements:**
  - Attempt uploading a `.php` or `.phtml` test script; verify upload is rejected with a 422 HTTP validation error.
  - Verify legitimate images (JPG, PNG, WebP) upload and convert smoothly.

---

### [SEC-03] Production SQLite Database Tracked & Exposed in Git Repository
- **Affected File/Page:** `database/database.sqlite`, `.gitignore`
- **Severity:** **CRITICAL**
- **Description:** The live production SQLite database file is actively tracked by Git and pushed to GitHub (`origin/main`). It contains sensitive data including user password hashes, appointment records with patient names, phone numbers, addresses, patient complaints, and third-party API keys.
- **Root Cause:** `.gitignore` specifies `*.log` and `/.env`, but omits `database/database.sqlite`.
- **Recommended Solution:**
  1. Add `*.sqlite`, `*.sqlite-journal`, and `/database/database.sqlite` to `.gitignore`.
  2. Untrack the database file from git history using `git rm --cached database/database.sqlite`.
  3. Rotate all credentials, API keys, and application keys immediately.
- **Testing Requirements:**
  - Run `git ls-files database/database.sqlite`; verify no output is returned.
  - Confirm database modifications do not stage SQLite binary diffs in `git status`.

---

### [SEC-04] SSL Verification Disabled on External APIs (`Http::withoutVerifying()`)
- **Affected File/Page:** `app/Http/Controllers/AiAssistantController.php` (lines 262, 573, 642, 680)
- **Severity:** **HIGH**
- **Description:** HTTP requests dispatched to `generativelanguage.googleapis.com` explicitly disable SSL certificate verification using `Http::withoutVerifying()`. This exposes outgoing AI requests and API keys to Man-In-The-Middle (MITM) interception.
- **Root Cause:** `withoutVerifying()` was added as a local development workaround for missing Windows cURL CA certificate bundles.
- **Recommended Solution:**
  1. Remove `withoutVerifying()` from all HTTP client calls.
  2. Configure the system's `curl.cainfo` in `php.ini` or pass Laravel's default certificate bundle.
- **Testing Requirements:**
  - Execute an external API call and confirm HTTPS handshake succeeds with strict certificate validation.

---

### [SEC-05] Missing Rate Limiting on Public Endpoints
- **Affected File/Page:** `routes/web.php` (lines 69, 70, 167), `app/Http/Controllers/ComplaintController.php`
- **Severity:** **HIGH**
- **Description:** The public endpoints `/api/ai-chat`, `/complaint-box`, and `/api/featured-images/{id}/view` have no throttle middleware attached. Attackers or malicious bots can flood these routes, causing resource exhaustion, database bloat, and API quota depletion.
- **Root Cause:** Rate-limiting middleware (`throttle:15,1`) was applied only to `/appointments`, leaving other public mutation routes unprotected.
- **Recommended Solution:**
  1. Attach `throttle:10,1` to `/api/ai-chat` and `/complaint-box`.
  2. Attach `throttle:60,1` to `/api/featured-images/{id}/view` with IP-based debouncing.
- **Testing Requirements:**
  - Send 15 consecutive requests within 10 seconds to `/api/ai-chat`; verify requests past the limit return HTTP 429 Too Many Requests.

---

### [SEC-06] Unsanitized Rich Content Rendering (Stored XSS Risk)
- **Affected File/Page:** `resources/js/Pages/Home.tsx` (line 1137), `resources/js/Pages/CustomPages/Show.tsx` (line 173)
- **Severity:** **HIGH**
- **Description:** HTML markup stored in `HomeContent.about_text` and `Page.content` is rendered on public pages using `dangerouslySetInnerHTML` without server-side purification. If an account with editor access is compromised, malicious `<script>` tags or phishing frames can be injected into pages viewed by all patients.
- **Root Cause:** Lack of an HTML sanitization pipeline (such as `mews/purifier` or `DOMPurify`) before persisting or rendering rich text.
- **Recommended Solution:**
  1. Sanitize incoming rich HTML in controllers using HTMLPurifier before saving to the database.
  2. Alternatively, sanitize strings in React using `DOMPurify.sanitize()` prior to `dangerouslySetInnerHTML`.
- **Testing Requirements:**
  - Attempt saving an editor block containing `<script>alert('xss')</script>`. Verify the script tag is stripped upon display.

---

### [SEC-07] Session Cookie Missing `Secure` Flag in Production
- **Affected File/Page:** `config/session.php` (line 172), `.env`
- **Severity:** **MEDIUM**
- **Description:** In `config/session.php`, `'secure'` defaults to `env('SESSION_SECURE_COOKIE')`, which is not set in `.env`. Consequently, session cookies do not enforce the `Secure` flag, allowing transmission over plain HTTP connections.
- **Root Cause:** Missing `SESSION_SECURE_COOKIE=true` in `.env`.
- **Recommended Solution:**
  - Set `SESSION_SECURE_COOKIE=true` in `.env` for production environments.
- **Testing Requirements:**
  - Inspect `Set-Cookie` header in browser network tab; verify `Secure; HttpOnly; SameSite=Lax` are present.

---

### [SEC-08] Lack of Role-Based Authorization Checks (RBAC) in User Management
- **Affected File/Page:** `app/Http/Controllers/UserController.php` (lines 18–76)
- **Severity:** **HIGH**
- **Description:** `UserController` contains no authorization checks verifying that the authenticated user is an `Administrator`. Any logged-in user with an `Editor` or `Author` role can access `/users`, create new `Administrator` users, modify passwords of administrative accounts, or delete users.
- **Root Cause:** Controller assumes any authenticated user is an administrator.
- **Recommended Solution:**
  1. Add authorization gate or middleware:
     `abort_if(auth()->user()->role !== 'Administrator', 403);`
  2. Prevent users from editing or escalating their own role.
- **Testing Requirements:**
  - Log in as an `Editor` and attempt accessing `GET /users`; verify HTTP 403 Forbidden is returned.

---

### [FUNC-01] Branch Pre-Selection Ignored on Appointment Booking Page
- **Affected File/Page:** `resources/js/Pages/BookAppointment/PublicIndex.tsx` (lines 65–73), `resources/js/Pages/Branch/PublicShow.tsx` (line 970)
- **Severity:** **HIGH**
- **Description:** When a user on a branch page (e.g. `/branch/uttara`) clicks "Book appointment", they are redirected to `/appointment?branch=uttara`. However, `BookAppointmentPublicIndex` initializes `branch: ''` and never inspects `window.location.search` or route parameters. If the user submits without re-selecting, the booking silently defaults to **Mirpur**, causing appointments to be logged for the wrong clinic.
- **Root Cause:** Missing query parameter parsing in `useState` initialization or `useEffect`.
- **Recommended Solution:**
  - Read query parameter on mount:
    ```ts
    const urlParams = new URLSearchParams(window.location.search);
    const queryBranch = urlParams.get('branch') || '';
    ```
  - Map query parameter to the corresponding branch option during initial state setup.
- **Testing Requirements:**
  - Navigate to `/appointment?branch=uttara`; verify "Uttara" is pre-selected and valid shifts are displayed.
  - Navigate to `/appointment?branch=badda`; verify "Badda" is pre-selected.

---

### [FUNC-02] AI Chatbot Formatting Glitch (`• **WhatsApp:** ****`) & Topic Misalignment
- **Affected File/Page:** `app/Http/Controllers/AiAssistantController.php` (lines 285–293)
- **Severity:** **HIGH**
- **Description:** The regex filter intended to hide the WhatsApp phone number when patients do not explicitly ask for WhatsApp replaces the digits but leaves empty markdown tags: `• **WhatsApp:** ****`. Furthermore, general inquiries (e.g. "ডাক্তার দেখানোর খরচ কত?") frequently trigger this default block without answering the specific clinical question.
- **Root Cause:**
  - `preg_replace` targeted phone number digits rather than the entire `• **WhatsApp:** ...` line.
  - Inappropriate fallback matcher prioritized general contact replies over treatment cost queries.
- **Recommended Solution:**
  1. Update regex to strip the entire WhatsApp bullet line:
     `preg_replace('/^\s*•\s*\*\*WhatsApp:\*\*.*$/um', '', $aiText)`
  2. Clean up consecutive blank lines following removal.
  3. Ensure treatment cost queries match against the fee schedule section of the training data.
- **Testing Requirements:**
  - Send POST request to `/api/ai-chat` with `{"query": "দাঁত স্কেলিং খরচ কত?"}`; verify response contains scaling fees without empty WhatsApp tags.
  - Send POST request with `{"query": "whatsapp number"}`; verify WhatsApp number is provided.

---

### [FUNC-03] AI Assistant 12-Second Hang due to Non-Existent Gemini Model
- **Affected File/Page:** `app/Http/Controllers/AiAssistantController.php` (lines 230–236), database table `ai_chat_settings`
- **Severity:** **HIGH**
- **Description:** In `ai_chat_settings`, `gemini_model` is configured as `gemini-3.6-flash` (a non-existent model name). Each chat inquiry attempts to call the Gemini API, hangs for 12 seconds awaiting cURL response, times out, logs an exception, and only then falls back to local answers, causing a 12-second freeze for end users.
- **Root Cause:** Invalid model identifier saved in database settings combined with a high (12s) timeout.
- **Recommended Solution:**
  1. Update default model in database to an active GA model (e.g. `gemini-1.5-flash` or `gemini-2.0-flash`).
  2. Implement an immediate model validation check in the admin settings dashboard.
  3. Lower the connection/read timeout to 4 seconds to prevent browser hanging during API outages.
- **Testing Requirements:**
  - Test `/api/ai-chat` response latency; confirm response returns within 500ms – 1.5s.
  - Verify `storage/logs/laravel.log` records no cURL timeout exceptions.

---

### [FUNC-04] Non-Existent Service URLs Return HTTP 200 (Soft 404 / Duplicate Content)
- **Affected File/Page:** `app/Http/Controllers/ServiceController.php` (lines 121–124)
- **Severity:** **MEDIUM**
- **Description:** When a user or search engine requests a non-existent service URL (e.g. `/services/non-existent-xyz`), `ServiceController::publicShow` defaults to:
  `$item = Service::where('status', 'Published')->first() ?: Service::firstOrFail();`
  and returns HTTP 200 with the first published service's content.
- **Root Cause:** Intentional "graceful fallback" code overrides standard 404 handling.
- **Recommended Solution:**
  - Replace fallback with standard `abort(404);` when `$item` is not found.
- **Testing Requirements:**
  - Request `GET /services/invalid-service-name`; verify HTTP status is 404 Not Found.
  - Request `GET /services/scaling`; verify HTTP status is 200 OK.

---

### [FUNC-05] Draft and Trashed Blog Articles Publicly Accessible
- **Affected File/Page:** `app/Http/Controllers/BlogController.php` (lines 31–34)
- **Severity:** **MEDIUM**
- **Description:** `BlogController::publicShow` queries `Post::where('slug', $slug)->orWhere('id', $slug)->firstOrFail();` without checking the `status` column. Unpublished drafts and articles moved to trash can be read publicly by anyone who knows or guesses the slug or ID.
- **Root Cause:** Missing `whereIn('status', ['published', 'Published'])` condition in the single post query.
- **Recommended Solution:**
  - Add status check for non-authenticated guests:
    ```php
    $query = Post::where('slug', $slug)->orWhere('id', $slug);
    if (!auth()->check()) {
        $query->whereIn('status', ['published', 'Published']);
    }
    $post = $query->firstOrFail();
    ```
- **Testing Requirements:**
  - Create a draft post in admin; verify visiting `/blog/{draft-slug}` as an unauthenticated guest returns 404.
  - Verify logged-in admin can preview the draft.

---

### [FUNC-06] Inconsistent "Book Appointment" UI/UX Journeys
- **Affected File/Page:** `resources/js/Pages/Doctors/PublicSingle.tsx` (lines 499–538), `resources/js/Pages/Doctors/PublicIndex.tsx` (lines 85–102)
- **Severity:** **MEDIUM**
- **Description:** Across the site, clicking "Book Appointment" produces three conflicting user flows:
  1. On `/doctors/{id}`: Opens a modal with only a "Call Hotline" button and no form.
  2. On `/doctors`: Opens an inline modal containing an appointment booking form.
  3. On `/branch/{slug}`: Redirects to `/appointment?branch=...`.
- **Root Cause:** Multiple developers implemented disconnected appointment triggers across separate templates.
- **Recommended Solution:**
  - Standardize all "Book Appointment" CTA actions to either open the shared `AppointmentModal` with pre-filled doctor/branch data or route consistently to `/appointment`.
- **Testing Requirements:**
  - Click "Book Now" on any doctor profile; verify the user can submit a booking directly or is routed seamlessly.

---

### [FUNC-07] Hardcoded Branch Matching in Doctor Controller Overrides New Branches
- **Affected File/Page:** `app/Http/Controllers/DoctorController.php` (lines 78–84, 116–122)
- **Severity:** **MEDIUM**
- **Description:** In both `store` and `update` methods of `DoctorController`, branch assignment relies on a hardcoded switch:
  ```php
  $clean = 'Mirpur';
  if (str_contains($b, 'uttara')) $clean = 'Uttara';
  elseif (str_contains($b, 'badda')) $clean = 'Badda';
  elseif (str_contains($b, 'jatra')) $clean = 'Jatrabari';
  elseif (str_contains($b, 'mirpur')) $clean = 'Mirpur';
  $validated['branch'] = $clean;
  ```
  If the clinic expands and adds a new branch (e.g. Dhanmondi, Gulshan, Banani), doctors assigned to the new branch are forcibly reassigned to Mirpur.
- **Root Cause:** Branch names are hardcoded instead of being validated dynamically against the `locations` table.
- **Recommended Solution:**
  - Validate branch values against active locations:
    `'branch' => 'required|exists:locations,short_name'`
- **Testing Requirements:**
  - Create a new branch in branch admin; assign a doctor to it; verify the assignment persists without reverting to Mirpur.

---

### [FUNC-08] Team Member Detail Route Fails for Non-Management Staff
- **Affected File/Page:** `app/Http/Controllers/TeamMemberController.php` (lines 94–105)
- **Severity:** **MEDIUM**
- **Description:** In `TeamMemberController::publicShow`, the query strictly enforces:
  `TeamMember::where('section', 'management')->where(...)`
  Any team member belonging to other valid sections (`ceo_assistant`, `digital_marketing`, `call_center`) returns a 404 error if their profile URL `/team/{slug}` is visited.
- **Root Cause:** Hardcoded section filter in public single lookup.
- **Recommended Solution:**
  - Remove the `section = 'management'` constraint from `publicShow` so all active team members have reachable profile pages.
- **Testing Requirements:**
  - Visit `/team/{slug}` for a digital marketing or call center team member; verify page renders successfully.

---

### [ARCH-01] Duplicate Pricing/Services System: Homepage Queries Legacy Table
- **Affected File/Page:** `routes/web.php` (line 39), `app/Http/Controllers/BranchController.php` (line 44), `app/Http/Controllers/ServiceController.php`
- **Severity:** **HIGH**
- **Description:** The system has two separate service/pricing databases:
  1. The legacy `pricing` table managed by `PricingController.php` (`/pricing`).
  2. The modern `services` table managed by `ServiceController.php` (`/services-admin`).
  When administrators update service descriptions, pricing cards, and features in the modern admin module (`/services-admin`), the **Homepage and Branch pages do not reflect any changes** because they query the legacy `pricing` table (`DB::table('pricing')->get()`).
- **Root Cause:** Partial migration from legacy `pricing` to full-featured `services` left legacy queries in `routes/web.php` and `BranchController.php`.
- **Recommended Solution:**
  1. Update `routes/web.php` (line 39) to query `Service::where('status', 'Published')->orderBy('rank_order')->get()`.
  2. Update `BranchController.php` (line 44) to query the `services` table.
  3. Deprecate the legacy `PricingController` and `/pricing` admin route.
- **Testing Requirements:**
  - Edit a service price in `/services-admin`; reload the homepage; verify the updated price displays immediately.

---

### [ARCH-02] Case-Sensitive Component Import Path Conflicts on Linux Deployments
- **Affected File/Page:** Over 15 TSX files including `PatientRights/PublicShow.tsx` (line 3), `About/AdminIndex.tsx` (line 19), `About/PublicIndex.tsx` (line 3), `Blog/PublicIndex.tsx` (line 3), `BookAppointment/PublicIndex.tsx` (line 3), `Medicines/PublicIndex.tsx` (line 4), `Services/PublicIndex.tsx` (line 3), `Team/PublicIndex.tsx` (line 3)
- **Severity:** **HIGH**
- **Description:** Multiple pages import components using lowercase `@/components/...` (e.g. `import { TopHeader } from "@/components/TopHeader"`), while the actual directory on disk is uppercase `resources/js/Components/`. While Windows NTFS is case-insensitive, Linux filesystems (used in production VPS, Docker, Ubuntu, and CI/CD pipelines) are case-sensitive. This will cause fatal module resolution build failures when deploying to production servers.
- **Root Cause:** Inconsistent import capitalization across developer workstations on Windows.
- **Recommended Solution:**
  - Standardize all component imports across all TSX files to strictly match the filesystem: `@/Components/...`.
- **Testing Requirements:**
  - Run Vite production build (`npm run build`) in a case-sensitive environment or Docker container; confirm zero unresolved module errors.

---

### [RESP-01] Tablet (768px – 1024px) Layout Squeeze in Branch Hero & Shift Cards
- **Affected File/Page:** `resources/js/Pages/Branch/PublicShow.tsx` (lines 344–358, 530–541, 718–747)
- **Severity:** **HIGH**
- **Description:** On tablet viewports (768px – 1024px, such as iPad portrait and 800×1280 tablets):
  1. The hero breakpoint is defined at `@media (max-width: 760px)`. Between 761px and 1024px, the desktop two-column flex layout (`.hero-mirpur`) remains active, forcing a 340px thumbnail sidebar alongside a 560px tall hero stage in a narrow 768px width. This severely squishes the hero stage.
  2. The floating 4-button action bar (`.hero-actions`) with negative top margin (`margin: -38px 40px 0`) overflows and clips text labels.
  3. The branch information columns (`.branch-cols`) keep `display: flex; gap: 64px`, compressing address and shift cards into narrow, illegible strips.
- **Root Cause:** Responsive breakpoint set too low (`760px` instead of `1024px` / Tailwind `lg`).
- **Recommended Solution:**
  1. Raise the stacked layout breakpoint to `1024px` (`@media (max-width: 1023px)`).
  2. On viewports below 1024px, stack thumbnails below the hero stage or hide them, allowing the hero stage full width.
  3. Switch `.branch-cols` to `flex-direction: column` below 1024px with appropriate spacing.
- **Testing Requirements:**
  - Inspect `/branch/uttara` and `/branch/mirpur` in browser DevTools at 768px, 820px, and 1024px viewports. Verify no text overflow, no clipped action buttons, and clean vertical stacking.

---

### [RESP-02] Full Page Hard Refreshes Instead of Client-Side SPA Transitions
- **Affected File/Page:** `resources/js/Components/TopHeader.tsx` (lines 57, 427, 532, 562)
- **Severity:** **MEDIUM**
- **Description:** In `TopHeader.tsx`, drawer menu navigation links, the primary logo link, and the branch picker dropdown use standard HTML `<a href="...">` tags and direct `window.location.href = ...` assignment instead of Inertia's `<Link>` component. Clicking these links triggers a full browser reload, discarding in-memory client state, re-downloading stylesheets, and causing noticeable visual flash.
- **Root Cause:** Use of native anchor tags and `window.location` instead of `@inertiajs/react` `<Link>` and `router.visit()`.
- **Recommended Solution:**
  1. Replace native `<a>` tags with Inertia `<Link href="...">` across `TopHeader.tsx`.
  2. Update dropdown selection handlers to utilize `router.visit('/branch/' + slug)`.
- **Testing Requirements:**
  - Open navigation menu; click "Specialist Doctors"; verify page transitions instantly without full browser reload spinner.

---

### [SEO-01] Incorrect Hardcoded Canonical Domain (`techdentalbd.com` vs `techdentalcare.com`)
- **Affected File/Page:** `resources/js/Pages/Branch/PublicShow.tsx` (line 252), `resources/js/Pages/Services/PublicSingle.tsx` (line 120), `resources/js/Pages/CustomPages/Show.tsx` (line 55), `resources/js/Pages/CustomPages/BestDentist.tsx` (line 192), `resources/js/Components/SeoMetaBox.tsx` (line 50)
- **Severity:** **HIGH**
- **Description:** Canonical URLs and Open Graph tags across multiple public pages default to `https://techdentalbd.com` (e.g. `https://techdentalbd.com/branch/mirpur`) instead of the clinic's actual live domain `https://techdentalcare.com`. This misleads search engine indexers into consolidating ranking signals to an unowned or auxiliary domain, damaging SEO performance.
- **Root Cause:** Hardcoded string literals referencing `techdentalbd.com` instead of reading `config('app.url')` or `window.location.origin`.
- **Recommended Solution:**
  1. Pass the resolved canonical URL dynamically from Laravel controllers using `url()->current()`.
  2. Update frontend fallbacks to default to `https://techdentalcare.com`.
- **Testing Requirements:**
  - Inspect HTML source on `/branch/mirpur`, `/services/scaling`, and `/page/terms-of-service`. Verify `<link rel="canonical">` points to `https://techdentalcare.com/...`.

---

### [SEO-02] Missing Database Indexes on Critical Route Slugs & Filter Columns
- **Affected File/Page:** Database schema (`posts`, `locations`, `doctors`, `appointments` tables)
- **Severity:** **MEDIUM**
- **Description:** Database inspection revealed that the `posts` table has **no index on `slug`**, `status`, or `published_at`. The `locations` table has **no index on `slug`**. The `doctors` table has **no index on `rank_order`**. Every public request to `/blog/{slug}`, `/branch/{slug}`, and homepage queries must perform a full table scan.
- **Root Cause:** Early migrations created tables without secondary index definitions on lookup columns.
- **Recommended Solution:**
  - Create a migration to add indexes:
    - `posts`: index on `slug`, index on `[status, published_at]`
    - `locations`: unique index on `slug`
    - `doctors`: index on `rank_order`
- **Testing Requirements:**
  - Run `PRAGMA index_list(posts)` in SQLite; confirm index exists on `slug`.
  - Verify query execution time remains under 2ms.

---

### [SEO-03] Irrelevant Foreign Practice Content Published on Live Blog
- **Affected File/Page:** Database `posts` table (Record ID 6: `best-dental-clinic-in-chennai-best-dentist-in-chennai`)
- **Severity:** **LOW**
- **Description:** The database contains an active, published blog post titled *"Best Dental Clinic in Chennai | Best Dentist in Chennai"*. Tech Dental is a Bangladesh-based clinic operating solely in Dhaka (Mirpur, Uttara, Badda, Jatrabari). Having Chennai-targeted placeholder content indexed dilutes local topical authority.
- **Root Cause:** Sample/template article seeded during development was never removed.
- **Recommended Solution:**
  - Delete or unpublish post ID 6 from the database.
- **Testing Requirements:**
  - Visit `/blog/best-dental-clinic-in-chennai-best-dentist-in-chennai`; verify 404 Not Found.

---

### [PERF-01] Duplicate FontAwesome Loading & Excessive Synchronous Font Requests
- **Affected File/Page:** `resources/views/app.blade.php` (lines 21–22), `resources/css/app.css` (line 1)
- **Severity:** **MEDIUM**
- **Description:**
  1. FontAwesome is loaded **twice**: first via CDN stylesheet `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">` in `app.blade.php`, and second via `@import '@fortawesome/fontawesome-free/css/all.min.css'` in `app.css`. This bundles over 640KB of unused TTF font files into the production build.
  2. `app.blade.php` synchronously requests 6 separate Google Font families with all weight variants in a single render-blocking stylesheet (`Anek Bangla`, `Noto Sans Bengali`, `Hind Siliguri`, `Inter`, `Playfair Display`, `Plus Jakarta Sans`).
- **Root Cause:** Redundant library imports added during iterative development.
- **Recommended Solution:**
  1. Remove `@import '@fortawesome/fontawesome-free/...'` from `app.css` and rely solely on modern Lucide icons (or keep only one lightweight FontAwesome font subset).
  2. Prune Google Fonts to the 2 actual primary typefaces needed (`Plus Jakarta Sans` and `Hind Siliguri`) with only weights 400, 600, 700.
- **Testing Requirements:**
  - Check Network tab in browser DevTools; verify total CSS and font transfer size is reduced by >600KB.

---

## 4. Prioritized Action Plan

To ensure maximum security, operational reliability, and user satisfaction, fixes should be executed in the following four phases:

### Phase 1: Critical Security Remediations (Immediate Priority)
1. **Disable Public Registration (`SEC-01`):** Disable `/register` routes in `routes/auth.php`; protect `/users` with Administrator role check.
2. **Harden File Uploads (`SEC-02`):** Implement strict MIME and extension validation in `MediaController` and `SettingController`.
3. **Remove Database from Git (`SEC-03`):** Add `*.sqlite` to `.gitignore`, run `git rm --cached database/database.sqlite`, and rotate keys.
4. **Enable SSL Verification (`SEC-04`):** Remove all `withoutVerifying()` bypasses.

### Phase 2: Core User Journey & Functional Fixes (High Priority)
5. **Fix Booking Branch Pre-Selection (`FUNC-01`):** Read `?branch=...` query param on `/appointment` so patients book the correct clinic.
6. **Fix AI Chatbot Formatting & Latency (`FUNC-02`, `FUNC-03`):** Clean up the WhatsApp regex strip bug and configure an active Gemini model with a 4s timeout.
7. **Synchronize Services & Homepage (`ARCH-01`):** Update homepage and branch queries to source from the modern `services` table.
8. **Fix Case-Sensitive Imports (`ARCH-02`):** Change all `@/components/...` imports to `@/Components/...` to prevent Linux deployment crashes.

### Phase 3: Responsive Design & SEO Alignment (Medium Priority)
9. **Tablet Breakpoint Overhaul (`RESP-01`):** Upgrade `.hero-mirpur` and `.branch-cols` in `Branch/PublicShow.tsx` to handle 768px – 1024px cleanly.
10. **Correct Canonical Domains (`SEO-01`):** Replace hardcoded `techdentalbd.com` with `techdentalcare.com`.
11. **Fix 404 Statuses on Services & Posts (`FUNC-04`, `FUNC-05`):** Return proper 404s for invalid services and draft articles.
12. **Add Database Indexes (`SEO-02`):** Add indexes on `posts.slug`, `locations.slug`, and `doctors.rank_order`.
13. **Inertia SPA Navigation in Header (`RESP-02`):** Replace native `<a>` tags with `<Link>` in `TopHeader.tsx`.

### Phase 4: Performance & Content Cleanup (Low Priority)
14. **Asset Optimization (`PERF-01`):** Remove duplicate FontAwesome import and prune unused Google Fonts.
15. **Delete Seed Content (`SEO-03`):** Remove the Chennai practice article from the blog database.
16. **Harmonize Doctor Branch Logic (`FUNC-07`, `FUNC-08`):** Validate branch assignments against dynamic `locations` table.

---

*Report compiled and verified against the running application and codebase repository.*

