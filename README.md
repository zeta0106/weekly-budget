# 🪙 WeeklyBudget Tracker v1.1.0

A clean, responsive web application for managing weekly and monthly budgets, income, and expenses. WeeklyBudget combines a polished sage-green interface with period-based analytics, an interactive calendar, multilingual support, optional Firebase cloud sync, custom expense categories, and downloadable reports.

**Live demo:** [weekly-budget-two.vercel.app](https://weekly-budget-two.vercel.app/)

---

## ✨ Features

- **📆 Weekly & Monthly Budget Modes** — Switch between the current Monday–Sunday week and the current calendar month. Configure weekly and monthly budget amounts independently in Budget Settings, with period-specific date fields and quick amount presets.

- **🔁 Month-over-Month Comparisons** — Review current-month and previous-month income/budget and spending totals, with signed dollar and percentage changes.

- **📊 Period-Aware Analytics** — Category breakdowns, spending charts, top categories, largest expenses, averages, and transaction counts update for the selected week or month.

- **🏷️ Custom Expense Categories** — Choose **Other** or **Add Custom Category…** to reveal a category-name field. New categories can be reused in the Dashboard expense form and Calendar transaction modal. If the custom name is left blank, the expense is saved as **Other**.

- **📅 Interactive Calendar View** — Browse daily income and expense totals in a monthly calendar, select a date to review its transactions, and add entries for that day.

- **💰 HKD Currency Formatting** — Hong Kong dollar formatting is applied across dashboards, forms, calendars, logs, analytics, and reports.

- **🔒 Firebase Authentication & Cloud Sync** — Sign in with Google or email/password to synchronize budgets, transactions, and custom categories through Cloud Firestore. Local storage remains the fallback when signed out or offline.

- **🌐 Multi-Language Support** — Switch the interface between English, Traditional Chinese (繁體中文), and Simplified Chinese (简体中文).

- **🎨 Sage-Green UI with Dark/Light Mode** — A modern, card-based design with smooth visual feedback and light and dark themes.

- **📄 PDF & CSV Reports** — Export transaction data as CSV or generate a formatted **WeeklyBudget Summary** PDF.

- **📱 Mobile-First Responsive Layout** — Touch-friendly controls, safe-area-aware floating navigation, adaptive cards and tables, and toast notifications positioned clear of the bottom navigation.

---

## 🧭 App Views

| View | Description |
| --- | --- |
| **Dashboard** | View the selected period’s remaining balance, budget, spending, progress, expense form, and expense log. Add expenses with predefined or custom categories. |
| **Charts** | Explore period-aware category breakdowns and spending insights, including custom categories. |
| **Calendar** | Review daily income and expenses and manage transactions for a selected date. |
| **Settings** | Configure weekly/monthly budgets, adjust appearance and language, load sample data, clear expenses, and export reports. |

---

## 🔢 How Period Calculations Work

- **Weekly View** uses the Monday–Sunday week containing today.
- **Monthly View** uses the first through last day of the current calendar month.
- **Remaining Balance = Selected Period Budget − Spending in the Selected Period**.
- Weekly and monthly budget amounts are stored independently. The Dashboard uses the amount for the selected mode.
- If a period has no explicitly configured budget, income transactions dated within that period are used as a fallback, so existing calendar income remains reflected in the Dashboard.
- Month-over-month comparisons use the current and previous calendar months.
- Spending less or earning more is shown in **green**; spending more or earning less is shown in **red**.
- The Expense Log remains a complete transaction history, while Dashboard summaries and charts are filtered by the selected period.

---

## 🗃️ Data & Persistence

- Budgets, transactions, preferences, and user-created expense categories are saved in browser `localStorage`.
- When signed in, the same budget and transaction data—including custom categories—is synchronized to the user’s Firestore document.
- Custom category names are stored with each expense and retained in the reusable category list, even if the original expense is later removed.
- When cloud sync is unavailable, the app continues to use local browser storage.

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, and Vanilla JavaScript in a single-page application
- **Styling:** Tailwind CSS with custom responsive design tokens and component styles
- **Charts & Reports:** Chart.js, jsPDF, and jsPDF-AutoTable
- **Authentication:** Firebase Authentication
- **Database:** Cloud Firestore
- **Offline/Signed-Out Storage:** Browser local storage
- **Deployment:** Vercel with continuous deployment from GitHub
