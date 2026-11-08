# WeeklyBudget Tracker

A responsive, multilingual web app for managing weekly and monthly budgets, income, expenses, savings goals, and rollover settlements. It combines period-aware analytics, an interactive calendar, optional Firebase sync, custom expense categories, and downloadable reports.

**Live demo:** [weekly-budget-two.vercel.app](https://weekly-budget-two.vercel.app/)

---

## Features

- **Weekly and monthly budgets** — Switch between the Monday–Sunday week containing today and the current calendar month. Configure each budget period independently; budget settings are planning values and do not replace transaction-based income totals.
- **Period-aware Dashboard and Charts** — Review actual income, spending, remaining funds, progress, category breakdowns, and comparisons for the selected period.
- **Expense categories** — Use predefined categories, add reusable custom categories, or fall back to **Other** when the custom-category field is blank.
- **Interactive Calendar** — Browse a month, inspect daily income and expenses, add transactions for a selected date, and delete transactions from the date’s transaction list.
- **Savings goals** — Create goals with optional targets, deposit or withdraw funds, review recent activity, and reorder goals with Up/Down controls. Goal ordering is saved locally and synchronized to Firestore.
- **Current-period savings action** — Save the current remaining funds to a selected goal. The deposit is recorded as a linked **Savings Transfer** expense in the active period, so current-period remaining funds update accordingly.
- **Previous-period rollover settlement** — Save unused funds from the previous week or month to a selected goal. The amount is calculated from the previous period’s dated income transactions minus dated expenses, clamped at zero. Confirming a settlement creates a linked **Savings Transfer** expense dated at the end of that previous period. This brings the previous period’s remaining amount to zero without deducting from the current period.
- **Linked Calendar deletion** — Deleting a Savings Transfer in the Calendar removes its linked Savings movement too, adjusts the goal balance, and refreshes period totals. Removing the linked rollover record or goal clears its settled state so a still-positive previous-period balance can become available again.
- **Rollover preferences** — Choose a default Savings goal and use either a confirmation prompt or automatic rollover when a weekly or monthly period changes.
- **Light and Dark themes** — Theme preference is retained across sessions and synchronized when signed in.
- **English, Traditional Chinese, and Simplified Chinese** — Localize the app interface, including Savings actions and Calendar transactions.
- **Responsive design and motion** — Mobile-friendly layouts and navigation, sliding period-toggle indicators, animated progress bars, button press feedback, and subtle view transitions. Reduced-motion preferences are respected.
- **Reports and currency** — HKD formatting throughout; export expense data as CSV or a formatted PDF report.

---

## App Views

| View | Description |
| --- | --- |
| **Dashboard** | See current-period remaining funds, income, spending, progress, and the expense log. Add expenses using predefined or custom categories. |
| **Charts** | Explore period-aware spending charts, category breakdowns, and insights. |
| **Calendar** | Inspect income and expenses by date, add transactions, and delete regular or linked Savings transactions. |
| **Savings** | Manage goals, reorder them, deposit or withdraw funds, review activity, and save current or previous-period funds. |
| **Settings** | Configure weekly/monthly budgets and rollover preferences, change appearance or language, manage sample/expense data, and export reports. |

---

## Period Calculations

- **Weekly** means Monday through Sunday; **Monthly** means the first through last day of the current calendar month.
- **Remaining Funds = income transactions dated in the period − expense transactions dated in the period.** Dashboard and Calendar use the same transaction-based income totals.
- Weekly and monthly budget settings remain separate planning values; they do not override those income totals.
- Previous-period rollover uses that period’s actual dated transactions. A confirmed rollover is recorded as a Savings Transfer expense on the previous period’s final date, not as a current-period expense.
- Deleting the linked Calendar transfer removes its linked Savings movement as well. Totals and rollover availability are recalculated from the remaining records.
- Month-over-month comparisons use the current and immediately previous calendar months.

---

## Data and Persistence

- Budgets, dated income and expense transactions, Savings goals and movements, rollover preferences and settlement markers, custom categories, and goal order are stored in browser `localStorage`.
- When signed in, local data is merged with Firestore data and synchronized in real time. The app uses the authenticated user’s UID and writes to `users/{uid}/data/main`.
- Savings transfers retain links to their Savings movements. Deletion markers and rollover period metadata help keep linked records and settlement state consistent during cloud merges.
- Firebase Authentication supports Google and email/password sign-in. When signed out, offline, or unable to reach Firebase, the app continues using local storage.

---

## Technology

- **Frontend:** HTML5, CSS3, and vanilla JavaScript in a single-page app
- **Styling:** Tailwind CSS utilities with custom CSS for responsive components, motion, and offline/preview fallbacks
- **Charts and reports:** Chart.js, jsPDF, and jsPDF-AutoTable
- **Authentication and sync:** Firebase Authentication and Cloud Firestore
- **Local persistence:** Browser `localStorage`
- **Deployment:** Vercel with continuous deployment from GitHub
