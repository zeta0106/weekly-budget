# WeeklyBudget

A clean, responsive, single-page weekly budget tracker. Everything lives in **one file**: `index.html` (Tailwind CSS + Chart.js via CDN, vanilla JavaScript, `localStorage` persistence).

## Run it

- **Quickest:** double-click `index.html` to open it in any browser.
- **Local server:** `python3 -m http.server 8000` in this folder, then visit `http://localhost:8000`.

No build step, no dependencies to install.

## Views (floating bottom navigation)

A rounded floating nav bar fixed at the bottom switches the main area between four views. The last-used view is remembered.

1. **Dashboard** — Remaining Funds summary, Add New Expense form, and the Expense Log.
2. **Charts** — Weekly Spending Breakdown (Chart.js doughnut by category, with legend + percentages) and Weekly Insights.
3. **Calendar** — Sunday→Saturday month grid. Each date box shows that day's expense total (e.g. `-$420`) and/or income (e.g. `+$1,500`), with month navigation and monthly income/expense/net totals. Selecting a date opens a day panel listing that day's transactions (with delete), an **Add expense for this day** form, and a **Weekly income for this day** form.
4. **Settings** — Add Weekly Income (amount + income date, quick-amount chips, Reset week) and Data & Preferences (theme toggle, CSV/PDF exports, sample data, clear expenses).

## Core behaviour

- **Calculation rule** — `Total Spent = Σ expenses`, `Remaining = Income − Total Spent`. The Remaining Funds figure is green when positive and red when negative, with a status pill, % of income spent bar, safe-to-spend-per-day and days-left indicators.
- **Header** — `WeeklyBudget` logo/title on the left; on the right, only three essentials: the **language selector**, the Light/Dark **theme toggle**, and the **Log in / profile** button.
- **Languages** — English, 繁體中文 (Traditional Chinese), and 简体中文 (Simplified Chinese). The globe button in the header opens a dropdown; selecting a language instantly translates all UI text (headings, buttons, table headers, form placeholders, toasts, calendar and chart labels, and date/currency formatting). The choice is saved in `localStorage` (`weeklyBudget.lang`). Only the interface is translated — your stored data (amounts, dates, descriptions, category keys) is never modified, so budgets are identical in every language.
- Fully responsive (multi-column on desktop → stacked on mobile); all data persists in `localStorage` across refreshes.

## Cloud sync (Firebase Auth + Firestore)

Sync runs **silently in the background** — there is no sync-status button in the header.

- **Not signed in** — everything is stored in `localStorage` only, exactly as before, with no header UI for it.
- **Signed in** — changes are pushed to Firestore (debounced) and remote changes from other devices apply live via a real-time listener. Use **Sync now** in the profile modal to push immediately.

Sign-in options (in the profile modal): **Google** or **email/password** (log in or create account). Each user's budget is a single Firestore document at **`budgets/{user.uid}`** containing `income`, `incomeDate`, `expenses[]` (which also drive the calendar), `lang`, `theme`, and `updatedAt`.

Sync policy:

- **First login on an account with no cloud document** → the current local budget is uploaded.
- **Cloud document exists** → it is loaded and becomes the local copy (cloud wins at login); afterwards, last-write-wins in real time.
- **Signed out / Firebase unreachable** → seamless fallback to `localStorage`; the app works fully offline.

### One-time Firebase console setup (project owner)

The web config for project `weekly-budget-6de26` is embedded in `index.html`. For sign-in to work you must, in the [Firebase console](https://console.firebase.google.com/project/weekly-budget-6de26):

1. **Authentication → Sign-in method:** enable **Google** and **Email/Password**.
2. **Authentication → Settings → Authorized domains:** add every domain you serve the app from (e.g. `localhost`, your preview/hosting domain). Google sign-in requires http(s) — it will not work from `file://`.
3. **Firestore Database → Rules:** restrict each user to their own document:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /budgets/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

## Data model & compatibility

Data is stored under the key `weeklyBudget.v1` as `{ income, incomeDate, expenses[] }`.

- `incomeDate` (ISO date) places the weekly income on the calendar. It can be set in Budget Settings or from a selected calendar day.
- Saves created by the previous version (which had no `incomeDate`) are migrated automatically on load: income is placed on the Monday of the current week, and all existing expenses are untouched.

## Good to know

- On your **first visit** the app loads sample data (income $1,250 dated to Monday + a few expenses) so every view is alive. Use **Reset week** (Settings → income card) to clear it and start fresh.
- **Currency** — Locked to **HKD**, displayed with a clean `$` everywhere (e.g. `$1,250.00`) — cards, inputs, logs, charts, calendar, and toasts. There is no currency selector; any currency preference saved by an earlier version is ignored and removed on load.
- **PDF report** — **Download PDF Report** (Settings → Exports & reports, or the **PDF** button in the Expense Log header) generates an A4 *WeeklyBudget Summary* with the generated date, current week range, currency (HK$), a Budget Overview box (Total Income / Total Spent / Remaining Balance), and a sage-green styled expense table (Date / Category / Description / Amount in HK$). It uses jsPDF + AutoTable for a direct download; for interfaces or descriptions containing Chinese characters it automatically opens the same report in a print-ready layout (choose "Save as PDF") so 繁體/简体 glyphs render perfectly instead of being garbled by jsPDF's built-in fonts.
- If a CDN is unreachable, built-in fallback styles and a vanilla-canvas chart keep the page functional.
