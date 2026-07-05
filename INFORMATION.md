# SubGuard AI — Project Information

> Dokumen ini berisi hasil analisis dari prototype website yang sudah berjalan dan kondisi repository saat ini (termasuk update dari branch `reza`).
> Terakhir diperbarui: 4 Juli 2026

---

## Bagian 1: Hasil Analisis Prototype

**URL Prototype:** https://sub-guard-ai--ramurez.replit.app/  
**Kredensial Test:** `debug@test.com` / `test1234`

### Checklist Fitur Prototype

| # | Fitur | Status | Catatan |
|---|-------|--------|---------|
| 1 | Homepage General + Login/Register | ✅ Tersedia | Halaman login & register berfungsi dengan baik. Validasi error tampil saat kredensial salah. Register otomatis login setelah berhasil. |
| 2 | Subscription CRUD | ✅ Tersedia | Add, Edit, Delete subscription berjalan real-time. Metrik dashboard otomatis diperbarui. |
| 3 | Category and Status | ✅ Tersedia | Kategori dan Status berfungsi. Filter by status dan category berfungsi. Sorting (Price, Billing Date) juga tersedia. |
| 4 | Spending Summary | ✅ Tersedia | Dashboard menampilkan card metrics: Estimated Monthly Spend, Active Subscriptions, dan Potential Monthly Savings. |
| 5 | Upcoming Billing List | ✅ Tersedia | Daftar subscription dapat diurutkan berdasarkan Billing Date. |
| 6 | Simple Reminder | ✅ Tersedia | Konfigurasi pengingat via email (email reminder) di halaman Settings/Profile. |
| 7 | Usage Frequency Field | ❌ Tidak Ditemukan | Tidak ada di form prototype. |
| 8 | Cancellation Candidate | ✅ Tersedia | Subscription bisa ditandai "Candidate to Cancel". |
| 9 | Estimated Saving | ✅ Tersedia | Mengkalkulasi total biaya subscription cancellation candidate. |
| 10 | AI Subscription Review | ⚠️ Parsial | UI halaman AI Financial Review ada, tapi "Analysis Failed" (belum ada API key di prototype). |
| 11 | Mock Premium Interest | ✅ Tersedia | Tombol "Upgrade to Premium" → modal → Join Waitlist. |

---

## Bagian 2: Analisis Kondisi Repository Saat Ini (Update branch `reza`)

Repository telah mengalami pembaruan signifikan pada branch `reza` (Phase 1 & 2 telah diimplementasikan).

### Arsitektur & Tech Stack
Pnpm monorepo (Hono, React + TanStack Router, Prisma, PostgreSQL, Redis, BetterAuth, dll). Fondasi tooling, UI (shadcn/ui), i18n, Docker, dan Worker semuanya siap.

### Database Schema — Kondisi Saat Ini (`apps/api/prisma/schema.prisma`)

**Sudah diimplementasikan:**
- Model autentikasi bawaan (`User`, `Session`, `Account`, `Verification`).
- Enum Bisnis: `Currency`, `BillingCycle`, `SubscriptionCategory`, `SubscriptionStatus`, `UsageFrequency`.
- Model Bisnis: `Subscription` dengan relasi ke `User`.

**Yang belum ada (Ditunda ke fase berikutnya):**
- Enum: `ReminderType`, `LogStatus`
- Model: `ReminderPreference`, `ReminderLog`, `AIReviewLog`, `PremiumInterest`

### API Modules — Kondisi Saat Ini (`apps/api/src/modules/`)

| Module | Status | Keterangan |
|--------|--------|------------|
| `auth/` | ✅ Ada | Auth config & middleware. |
| `users/` | ✅ Ada | Endpoint admin users. |
| `subscriptions/` | ✅ Ada | CRUD endpoints (GET, POST, PATCH, DELETE, status update). Kalkulasi cost normalization. |
| `dashboard/` | ✅ Ada | Endpoint kalkulasi summary dan upcoming billing. |
| `ai/` | ❌ Belum ada | Blueprint: POST /api/ai/subscription-review (LLM integration) |
| `premium/` | ❌ Belum ada | Blueprint: POST /api/premium/interest (tracking waitlist) |
| `reminders/` | ❌ Belum ada | Blueprint: Reminder preferences & logs |

### Platform Frontend — Kondisi Saat Ini (`apps/platform/src/routes/`)

| Route | Status | Keterangan |
|-------|--------|------------|
| `__root.tsx` | ✅ Ada | Layout utama dengan header dan navigasi (Dashboard/Subscriptions). |
| `/login` | ✅ Ada | Halaman sign-in dengan layout yang sudah diperbarui. |
| `/register` | ✅ Ada | Halaman registrasi. |
| `/` (index) | ✅ Ada | Landing page publik yang responsif. |
| `/dashboard` | ✅ Ada | Dashboard menampilkan metrics summary, upcoming billing, dan in-app reminders. |
| `/subscriptions/*` | ✅ Ada | List subscription lengkap dengan filtering, sorting, dan form Create/Edit/Delete. |
| `/ai-review` | ❌ Belum ada | Halaman analisis AI belum diimplementasikan. |
| `/settings` | ❌ Belum ada | Pengaturan reminder belum diimplementasikan. |

---

## Bagian 3: Gap Analysis — Prototype vs Repository (Update)

Setelah branch `reza` di-merge, sebagian besar fitur inti telah tersedia.

| # | Fitur | Prototype | Repository | Status |
|---|-------|-----------|-----------|--------|
| 1 | Homepage General + Login/Register | ✅ Lengkap | ✅ Lengkap | Selesai |
| 2 | Subscription CRUD | ✅ Berfungsi penuh | ✅ Berfungsi penuh | Selesai |
| 3 | Category and Status | ✅ Filter & dropdown | ✅ Filter & dropdown | Selesai |
| 4 | Spending Summary | ✅ Card metrics real-time | ✅ Card metrics real-time | Selesai |
| 5 | Upcoming Billing List | ✅ Sorted by billing date | ✅ Tampil di dashboard | Selesai |
| 6 | Simple Reminder | ✅ Settings konfigurasi | ❌ Belum ada | Perlu model + API + settings UI |
| 7 | Usage Frequency Field | ❌ Tidak ada | ✅ Ada di form CRUD | Selesai (Repository lebih maju) |
| 8 | Cancellation Candidate | ✅ Toggle berfungsi | ✅ Toggle berfungsi | Selesai |
| 9 | Estimated Saving | ✅ Kalkulasi otomatis | ✅ Kalkulasi otomatis | Selesai |
| 10 | AI Subscription Review | ⚠️ UI ada, backend gagal | ❌ Belum ada | Perlu scoring engine + LLM + UI |
| 11 | Mock Premium Interest Button | ✅ Modal + Waitlist | ❌ Belum ada | Perlu API tracking + modal UI |

### Langkah Implementasi Selanjutnya
Berdasarkan kondisi saat ini, fokus selanjutnya adalah:
1. **AI Subscription Review**: Membuat endpoint backend yang mengkalkulasi skor prioritas dan berinteraksi dengan LLM, serta membangun UI halamannya.
2. **Mock Premium Interest Button**: Menambahkan API endpoint untuk mencatat ketertarikan fitur premium dan UI Modal Waitlist.
3. **Simple Reminder (Settings)**: Menyelesaikan sisa model database untuk pengingat (`ReminderPreference`, `ReminderLog`), dan halaman Settings untuk mengaturnya.
