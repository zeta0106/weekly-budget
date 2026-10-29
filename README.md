# 🪙 WeeklyBudget Tracker

A clean, responsive web application for tracking weekly and monthly income and expenses. WeeklyBudget combines a polished sage-green interface with period-based analytics, an interactive calendar, multilingual support, optional Firebase cloud sync, and downloadable budget reports.

**Live demo:** [https://weekly-budget-two.vercel.app/](https://weekly-budget-two.vercel.app/)

---

## ✨ Features

- **📆 Weekly & Monthly Budget Views** — Switch instantly between the current Monday–Sunday week and the current calendar month using a clean segmented toggle.
- **🔁 Month-over-Month Comparisons** — Compare the current month with the previous month, such as **Oct 2026 vs Sep 2026**, with signed dollar and percentage changes for both income and spending.
- **📊 Period-Aware Analytics** — Category breakdowns, spending charts, top categories, largest expenses, averages, and transaction counts update automatically for the selected week or month.
- **📅 Interactive Calendar View** — Browse daily income and expense totals in a monthly calendar, select any date to review its transactions, and quickly add entries for that day.
- **💰 HKD Currency Formatting** — Hong Kong dollar formatting is applied consistently across dashboards, forms, calendars, logs, analytics, and reports.
- **🔒 Firebase Authentication & Cloud Sync** — Sign in with Google or email/password to synchronize budget data through Cloud Firestore, with automatic local-storage fallback when signed out or offline.
- **🌐 Multi-Language Support** — Instantly switch the interface between English, Traditional Chinese (繁體中文), and Simplified Chinese (简体中文).
- **🎨 Sage-Green UI with Dark/Light Mode** — A soft, modern card-based design with smooth visual feedback and full light and dark theme support.
- **📄 PDF & CSV Reports** — Export structured CSV data or generate a formatted **WeeklyBudget Summary** PDF with budget totals and an expense table.
- **📱 Mobile-First Responsive Layout** — Comfortable touch targets, safe-area-aware floating navigation, adaptive cards and tables, and top-positioned toast notifications that never block the bottom navigation.

---

## 🧭 App Views

| View | Description |
| --- | --- |
| **Dashboard** | View the selected period’s remaining balance, income, spending, progress, expense form, and complete expense log. |
| **Charts** | Explore period-aware category breakdowns and spending insights. |
| **Calendar** | Review daily income and expenses and manage transactions for a selected date. |
| **Settings** | Set dated income, switch themes, load sample data, clear expenses, and export reports. |

---

## 🔢 How Period Calculations Work

- **Weekly View** uses the Monday–Sunday week containing today.
- **Monthly View** uses the first through last day of the current calendar month.
- **Remaining Balance = Period Income − Period Spending**.
- Income is counted in the period containing its saved **Income Date**.
- Month-over-month percentages are calculated against the previous month’s total.
- Spending less or earning more is shown in **green**; spending more or earning less is shown in **red**.
- The Expense Log remains a complete transaction history, while summaries and analytics are filtered by the selected period.

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, and Vanilla JavaScript in a single-page application
- **Styling:** Tailwind CSS with custom responsive design tokens and component styles
- **Charts & Reports:** Chart.js, jsPDF, and jsPDF-AutoTable
- **Authentication:** Firebase Authentication
- **Database:** Cloud Firestore
- **Offline/Signed-Out Storage:** Browser local storage
- **Deployment:** Vercel with continuous deployment from GitHub

---


