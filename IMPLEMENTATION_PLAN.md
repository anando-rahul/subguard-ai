# Implementation Plan: AI Subscription Review Assistant

Fitur ini akan memberikan analisis dan saran cerdas terkait daftar langganan user dengan memanfaatkan kalkulasi rule-based (deterministic score) yang dikombinasikan dengan kemampuan analisis LLM dari OpenRouter.

Mengingat fitur ini melibatkan perubahan *full-stack* (Database, Backend LLM integration, dan Frontend UI), implementasi dibagi menjadi **2 Fase**.

---

## Technical Decisions
> [!NOTE]
> - **Provider LLM**: Menggunakan **OpenRouter** dengan model `google/gemma-4-31b-it:free` sesuai dengan konfigurasi `.env`.
> - **Library AI**: Menggunakan Vercel AI SDK (`ai` dan `@ai-sdk/openai`) untuk memaksa LLM mengembalikan format **Structured JSON**, tervalidasi oleh *Zod Schema*, agar hasilnya deterministik saat dirender oleh Frontend. Library ini akan ditambahkan ke `apps/api`.
> - **Penyimpanan Riwayat**: Hasil generate output dari LLM (serta input yang dikirim) akan **disimpan di database (tabel `AIReviewLog`)** sebagai riwayat analisis user.

---

## Proposed Changes

### Phase 1: Database & Backend (API)
Fokus pada penyiapan skema database, aturan *scoring* deterministik, interaksi dengan LLM, dan pencatatan riwayat.

#### 1. Database Schema
#### [MODIFY] [schema.prisma](file:///d:/DevScale/Final%20Assignment/subguard-ai/apps/api/prisma/schema.prisma)
- Menambahkan enum `LogStatus`.
- Menambahkan model `AIReviewLog` (id, userId, inputSummary, outputSummary, status, errorMessage) untuk **menyimpan riwayat hasil generate LLM**.
- Menambahkan field `aiReviewLogs` pada relasi model `User`.
- Generate Prisma Client dan jalankan push/migrate.

#### 2. AI Module (Backend)
#### [NEW] [apps/api/src/modules/ai/router.ts](file:///d:/DevScale/Final%20Assignment/subguard-ai/apps/api/src/modules/ai/router.ts)
- Membuat route `POST /` untuk endpoint proses review.

#### [NEW] [apps/api/src/modules/ai/services.ts](file:///d:/DevScale/Final%20Assignment/subguard-ai/apps/api/src/modules/ai/services.ts)
- Memastikan user memiliki minimal 3 langganan (jika tidak, return 400).
- **Rule-based Scoring Calculation**: Kalkulasi `usageFrequency`, `status`, rentang tanggal tagihan (`nextBillingDate`), harga, dan jumlah dalam kategori yang sama.
- Menyusun **Anonymized Payload** (hanya nama, harga, siklus, kategori, skor).
- Integrasi Vercel AI SDK (`generateObject`) ke OpenRouter dengan Zod Schema untuk memaksa LLM mengembalikan `overallSummary` dan `recommendations` array.
- **Save History**: Menyimpan input yang dikirim dan hasil JSON `recommendations` ke tabel `AIReviewLog` agar riwayatnya tersimpan secara permanen.

#### [MODIFY] [apps/api/src/app.ts](file:///d:/DevScale/Final%20Assignment/subguard-ai/apps/api/src/app.ts)
- Me-mount route AI ke `/ai`.

---

### Phase 2: Frontend (UI/UX)
Fokus pada pembuatan antarmuka hasil analisis dan interaksi tombol aksi.

#### 1. AI API Client & Hooks
#### [NEW] [apps/platform/src/modules/ai/services.ts](file:///d:/DevScale/Final%20Assignment/subguard-ai/apps/platform/src/modules/ai/services.ts)
#### [NEW] [apps/platform/src/modules/ai/hooks/use-ai.ts](file:///d:/DevScale/Final%20Assignment/subguard-ai/apps/platform/src/modules/ai/hooks/use-ai.ts)
- Menambahkan fungsi call ke Hono RPC `@repo/api-client`.
- Menambahkan *mutation hook* TanStack Query untuk `useReviewSubscription()`.

#### 2. Halaman AI Review
#### [NEW] [apps/platform/src/routes/ai-review.tsx](file:///d:/DevScale/Final%20Assignment/subguard-ai/apps/platform/src/routes/ai-review.tsx)
- Menampilkan halaman asisten dengan tombol **"Start Analysis"**.
- Menangani *Empty State* jika subscription kurang dari 3.
- Menangani *Loading State* dengan Skeleton ketika menunggu respon dari OpenRouter.
- Merender hasil analisis dalam komponen `Card` terpisah untuk:
  - **Overall Summary**: Penjelasan tingkat tinggi dari LLM.
  - **Recommendations**: Daftar tagihan yang perlu ditinjau, dilengkapi dengan Badge Urgensi (merah, kuning, hijau) dan alasan serta saran tindakannya.

#### 3. Navigasi & Translasi
#### [MODIFY] [apps/platform/src/routes/__root.tsx](file:///d:/DevScale/Final%20Assignment/subguard-ai/apps/platform/src/routes/__root.tsx)
- Menambahkan tab navigasi untuk halaman "AI Assistant".
#### [MODIFY] [apps/platform/src/i18n.ts](file:///d:/DevScale/Final%20Assignment/subguard-ai/apps/platform/src/i18n.ts)
- Menambahkan kunci translasi Bahasa Indonesia dan Inggris untuk seluruh antarmuka AI.

---

## Verification Plan

### Automated Tests
- Menjalankan `pnpm typecheck` untuk validasi tipe data (Zod dan Prisma).

### Manual Verification
1. **Aturan 3 Langganan**: Mencoba start analisis saat user hanya punya 1-2 langganan, memastikan error yang muncul jelas.
2. **Kalkulasi & OpenRouter**: Memastikan Hono API berhasil mengirim instruksi ke OpenRouter dan mendapatkan kembalian dalam format JSON yang tepat.
3. **Penyimpanan Log (Database)**: Mengecek database untuk melihat apakah histori review tersimpan di `AIReviewLog` dengan format JSON yang benar pada field `outputSummary`.
4. **UI Response**: Memeriksa tampilan di halaman `/ai-review` (badge urgensi berwarna, layout tidak pecah).
