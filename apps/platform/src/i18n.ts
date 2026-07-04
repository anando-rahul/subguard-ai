import { createFrontendI18n, type Resource } from "@repo/i18n";

const resources = {
  en: {
    common: {
      language: {
        label: "Language",
        options: {
          en: "English",
          id: "Bahasa Indonesia",
        },
      },
      accessibility: {
        skipToContent: "Skip to main content",
      },
      nav: {
        brand: "SubGuardAI",
        primaryLabel: "Primary navigation",
        dashboard: "Dashboard",
        subscriptions: "Subscriptions",
        openDashboard: "Open Dashboard",
        login: "Login",
        register: "Register Free",
      },
      auth: {
        login: {
          title: "Welcome back",
          description: "Log in to review your subscriptions and recurring costs.",
          email: "Email",
          password: "Password",
          submit: "Login",
          pending: "Logging in...",
          createAccount: "Create an account",
          fallbackError: "Authentication failed.",
        },
        register: {
          title: "Create your account",
          description: "Start organizing your recurring costs in one place.",
          name: "Name",
          email: "Email",
          password: "Password",
          passwordHint: "Use at least 8 characters.",
          submit: "Register Free",
          pending: "Creating account...",
          loginLink: "Already have an account? Login",
          fallbackError: "Registration failed.",
        },
      },
      landing: {
        hero: {
          eyebrow: "Personal subscription tracker",
          title: "Stop losing money on forgotten subscriptions",
          description:
            "Track your subscriptions, see your real monthly cost, get billing reminders, and let AI highlight what may be worth reviewing.",
          imageAlt:
            "An organized ring of subscription cards and calendar reminders around a green personal ledger",
        },
        trust: {
          label: "SubGuardAI product principles",
          manual: {
            title: "Manual by design",
            description: "You decide which subscription details to enter and review.",
          },
          currency: {
            title: "Focused on IDR",
            description: "Recurring costs stay grounded in one clear currency.",
          },
          privacy: {
            title: "Private to your account",
            description: "Your subscription records remain separated from other users.",
          },
        },
        benefits: {
          eyebrow: "Clear costs, fewer surprises",
          title: "Know what you pay for before the next renewal",
          visibility: {
            label: "Your complete view",
            title: "Track recurring costs",
            description: "See all monthly and yearly subscription spending in one place.",
          },
          imageAlt:
            "Blank subscription sheets beside calendar reminders and a circular renewal marker",
          reminders: {
            label: "Before the charge",
            title: "Get billing reminders",
            description: "Know what will renew soon before the payment happens.",
          },
          review: {
            label: "When you want a second look",
            title: "Find possible savings with AI",
            description: "Review rarely used or expensive subscriptions before renewal.",
          },
        },
        process: {
          eyebrow: "A simple review loop",
          title: "Turn scattered renewals into clear decisions",
          description:
            "Enter the subscriptions you already pay for, then use one consistent view to understand costs and decide what deserves another month.",
          add: {
            title: "Add subscriptions",
            description:
              "Enter each recurring service manually so you stay in control of the data.",
          },
          cost: {
            title: "See your cost",
            description: "Compare estimated monthly and yearly recurring costs in one place.",
          },
          review: {
            title: "Review suggestions",
            description:
              "Ask for an AI-assisted review when you are ready to check possible savings.",
          },
          mark: {
            title: "Mark candidates",
            description:
              "Flag subscriptions you may downgrade or cancel before their next renewal.",
          },
        },
        audience: {
          eyebrow: "Built around real routines",
          title: "A focused view for every recurring budget",
          problemLabel: "The problem",
          outcomeLabel: "With SubGuardAI",
          professionals: {
            label: "Young professionals",
            problem: "Work tools, streaming, and mobile plans renew across different accounts.",
            outcome:
              "Keep personal recurring costs visible without building a full finance system.",
          },
          families: {
            label: "Families",
            problem:
              "Shared entertainment and education services are easy to forget between bills.",
            outcome: "Review household subscriptions together before another renewal is charged.",
          },
          freelancers: {
            label: "Freelancers and remote workers",
            problem:
              "Client tools and productivity services can quietly outlive the projects that needed them.",
            outcome: "Spot services worth reviewing as your workload and toolkit change.",
          },
        },
        premium: {
          label: "Coming soon",
          title: "Premium AI Review and smarter reminders are coming soon.",
          description:
            "We are testing clearer review suggestions and earlier renewal signals. No payment is needed now.",
        },
        footer: {
          disclaimer: "For MVP validation, only manually entered subscription data is used.",
        },
      },
      dashboard: {
        eyebrow: "Subscription workspace",
        title: "Welcome, {{name}}",
        description:
          "Your dashboard will bring recurring costs, renewal timing, and review decisions into one focused workspace.",
        loadingLabel: "Loading account dashboard",
        logout: "Logout",
        logoutPending: "Logging out...",
        logoutFallbackError: "Failed to log out.",
        session: {
          title: "Account session",
          name: "Name",
          email: "Email",
          role: "Access",
        },
        empty: {
          title: "Your subscription list is empty",
          description:
            "Add your first subscription to start calculating recurring costs and billing reminders.",
        },
        actions: {
          addFirst: "Add your first subscription",
          addSubscription: "Add Subscription",
          retry: "Try again",
          reviewBillingDates: "Review billing dates",
          viewAll: "View all",
          viewSubscriptions: "View Subscriptions",
        },
        subscriptionsError: {
          title: "Subscription data unavailable",
          description: "We could not determine whether this workspace has subscriptions.",
        },
        summary: {
          title: "Recurring cost summary",
          monthlySpend: "Estimated monthly spend",
          monthlySaving: "Potential monthly saving",
          yearlySpend: "Estimated yearly spend",
          activeCount: "Active subscriptions",
          trialCount: "Trials",
          candidateCount: "Cancellation candidates",
          errorTitle: "Summary unavailable",
          error: "Your subscriptions are safe, but the current totals could not be calculated.",
        },
        reminder: {
          badge: "{{count}} due soon",
          title: "{{count}} billing dates need attention",
          description: "Due within seven days: {{names}}.",
        },
        upcoming: {
          eyebrow: "Next on your calendar",
          title: "Upcoming billing",
          errorTitle: "Upcoming billing unavailable",
          error: "We could not load upcoming billing dates.",
          emptyTitle: "No upcoming billing",
          emptyDescription: "Cancelled and past billing dates are excluded from this view.",
          today: "Due today",
          tomorrow: "Due tomorrow",
          inDays: "Due in {{count}} days",
        },
        error: {
          title: "Dashboard unavailable",
          description: "We could not load your account session. Please try again.",
          retry: "Try again",
        },
      },
      subscriptions: {
        list: {
          eyebrow: "Your recurring commitments",
          title: "Subscriptions",
          description:
            "Review costs, renewal dates, usage, and cancellation decisions in one place.",
          errorTitle: "Subscriptions unavailable",
          error: "We could not load your subscriptions. Please try again.",
          pastDue: "Billing date has passed",
          paymentMethodFallback: "Not provided",
        },
        new: {
          title: "Add a subscription",
          description: "Enter the recurring charge and the next date you expect to be billed.",
        },
        edit: {
          title: "Edit {{name}}",
          description:
            "Update the details used for totals, billing reminders, and saving estimates.",
          notFoundTitle: "Subscription not found",
          notFound: "This subscription does not exist or is not available to your account.",
          errorTitle: "Subscription unavailable",
          error: "We could not load this subscription.",
        },
        fields: {
          actions: "Actions",
          billingCycle: "Billing cycle",
          candidate: "Cancellation candidate",
          category: "Category",
          name: "Service name",
          nextBillingDate: "Next billing date",
          notes: "Notes",
          paymentMethod: "Payment method",
          price: "Price",
          status: "Status",
          usageFrequency: "Usage frequency",
        },
        form: {
          eyebrow: "Manual subscription record",
          priceHint: "Enter the amount in IDR.",
          pastDateWarning: "This billing date has passed. Please update it if needed.",
          candidateHint: "Include this subscription in your potential saving estimate.",
          notesCount: "{{count}} of 500 characters",
          submitErrorTitle: "Subscription not saved",
          submitErrorFallback: "Please try again.",
        },
        filters: {
          status: "Status",
          category: "Category",
          sort: "Billing date order",
          allStatuses: "All statuses",
          allCategories: "All categories",
          nearestFirst: "Nearest first",
          latestFirst: "Latest first",
        },
        empty: {
          title: "No subscriptions yet",
          description: "Add your first recurring service to start seeing real totals.",
          filteredTitle: "No matching subscriptions",
          filteredDescription: "Change or clear the current filters to see more results.",
        },
        actions: {
          add: "Add Subscription",
          addFirst: "Add your first subscription",
          backToList: "Back to subscriptions",
          cancel: "Cancel",
          cancelLabel: "Cancel {{name}}",
          cancelSubscription: "Cancel Subscription",
          clearFilters: "Clear filters",
          confirmDelete: "Delete subscription",
          confirmCancellation: "Cancel subscription",
          delete: "Delete",
          deleteLabel: "Delete {{name}}",
          edit: "Edit",
          editLabel: "Edit {{name}}",
          markCandidate: "Mark candidate",
          markCandidateLabel: "Mark {{name}} as a cancellation candidate",
          retry: "Try again",
          renewSubscription: "Renew Subscription",
          renewLabel: "Renew {{name}}",
          save: "Save Subscription",
          saving: "Saving...",
          unmarkCandidate: "Unmark candidate",
          unmarkCandidateLabel: "Remove {{name}} from cancellation candidates",
        },
        delete: {
          title: "Delete this subscription?",
          description: "{{name}} will be permanently removed from totals and billing reminders.",
        },
        cancel: {
          title: "Cancel this subscription?",
          description:
            "{{name}} will be marked as cancelled and excluded from active totals and billing reminders.",
        },
        toast: {
          cancelled: "Subscription cancelled.",
          candidateUpdated: "Cancellation candidate updated.",
          created: "Subscription added.",
          deleted: "Subscription deleted.",
          mutationError: "The subscription could not be updated.",
          renewed: "Subscription renewed and its next billing date was updated.",
          updated: "Subscription updated.",
        },
        validation: {
          name: "Enter a service name between 2 and 80 characters.",
          price: "Enter a price greater than zero.",
          nextBillingDate: "Enter a valid billing date.",
          paymentMethod: "Payment method must be 80 characters or fewer.",
          notes: "Notes must be 500 characters or fewer.",
        },
        billingCycles: {
          MONTHLY: "Monthly",
          YEARLY: "Yearly",
        },
        categories: {
          ENTERTAINMENT: "Entertainment",
          WORK_TOOLS: "Work tools",
          FAMILY: "Family",
          EDUCATION: "Education",
          CLOUD: "Cloud",
          TELCO: "Telco",
          AI_TOOLS: "AI tools",
          OTHER: "Other",
        },
        statuses: {
          ACTIVE: "Active",
          TRIAL: "Trial",
          PENDING_CANCELLATION: "Pending cancellation",
          CANCELLED: "Cancelled",
        },
        usageFrequencies: {
          OFTEN: "Often",
          SOMETIMES: "Sometimes",
          RARELY: "Rarely",
          NOT_SURE: "Not sure",
        },
      },
    },
  },
  id: {
    common: {
      language: {
        label: "Bahasa",
        options: {
          en: "English",
          id: "Bahasa Indonesia",
        },
      },
      accessibility: {
        skipToContent: "Lewati ke konten utama",
      },
      nav: {
        brand: "SubGuardAI",
        primaryLabel: "Navigasi utama",
        dashboard: "Dasbor",
        subscriptions: "Langganan",
        openDashboard: "Buka Dasbor",
        login: "Masuk",
        register: "Daftar Gratis",
      },
      auth: {
        login: {
          title: "Selamat datang kembali",
          description: "Masuk untuk meninjau langganan dan biaya rutin Anda.",
          email: "Email",
          password: "Kata sandi",
          submit: "Masuk",
          pending: "Sedang masuk...",
          createAccount: "Buat akun",
          fallbackError: "Autentikasi gagal.",
        },
        register: {
          title: "Buat akun Anda",
          description: "Mulai atur biaya rutin Anda dalam satu tempat.",
          name: "Nama",
          email: "Email",
          password: "Kata sandi",
          passwordHint: "Gunakan minimal 8 karakter.",
          submit: "Daftar Gratis",
          pending: "Sedang membuat akun...",
          loginLink: "Sudah punya akun? Masuk",
          fallbackError: "Pendaftaran gagal.",
        },
      },
      landing: {
        hero: {
          eyebrow: "Pelacak langganan pribadi",
          title: "Berhenti kehilangan uang karena langganan yang terlupakan",
          description:
            "Lacak langganan, lihat biaya bulanan sebenarnya, dapatkan pengingat tagihan, dan biarkan AI menyoroti layanan yang perlu ditinjau.",
          imageAlt:
            "Susunan kartu langganan dan pengingat kalender yang teratur mengelilingi buku catatan hijau",
        },
        trust: {
          label: "Prinsip produk SubGuardAI",
          manual: {
            title: "Manual sesuai kendali Anda",
            description: "Anda menentukan detail langganan yang ingin dimasukkan dan ditinjau.",
          },
          currency: {
            title: "Berfokus pada IDR",
            description: "Biaya rutin tetap jelas dalam satu mata uang.",
          },
          privacy: {
            title: "Privat untuk akun Anda",
            description: "Catatan langganan Anda tetap terpisah dari pengguna lain.",
          },
        },
        benefits: {
          eyebrow: "Biaya jelas, lebih sedikit kejutan",
          title: "Ketahui pengeluaran sebelum perpanjangan berikutnya",
          visibility: {
            label: "Tampilan lengkap Anda",
            title: "Lacak biaya rutin",
            description:
              "Lihat seluruh pengeluaran langganan bulanan dan tahunan dalam satu tempat.",
          },
          imageAlt:
            "Lembar langganan kosong di samping pengingat kalender dan penanda perpanjangan berbentuk lingkaran",
          reminders: {
            label: "Sebelum ditagihkan",
            title: "Dapatkan pengingat tagihan",
            description: "Ketahui layanan yang segera diperpanjang sebelum pembayaran terjadi.",
          },
          review: {
            label: "Saat Anda ingin meninjau lagi",
            title: "Temukan potensi penghematan dengan AI",
            description: "Tinjau langganan yang jarang digunakan atau mahal sebelum diperpanjang.",
          },
        },
        process: {
          eyebrow: "Alur tinjauan yang sederhana",
          title: "Ubah perpanjangan yang tersebar menjadi keputusan yang jelas",
          description:
            "Masukkan langganan yang sudah Anda bayar, lalu gunakan satu tampilan untuk memahami biaya dan menentukan layanan yang masih layak.",
          add: {
            title: "Tambahkan langganan",
            description:
              "Masukkan setiap layanan rutin secara manual agar Anda tetap mengendalikan data.",
          },
          cost: {
            title: "Lihat biaya Anda",
            description: "Bandingkan estimasi biaya rutin bulanan dan tahunan dalam satu tempat.",
          },
          review: {
            title: "Tinjau saran",
            description:
              "Minta tinjauan berbantuan AI saat Anda siap memeriksa potensi penghematan.",
          },
          mark: {
            title: "Tandai kandidat",
            description:
              "Tandai langganan yang mungkin diturunkan atau dibatalkan sebelum diperpanjang.",
          },
        },
        audience: {
          eyebrow: "Dibuat untuk rutinitas nyata",
          title: "Tampilan terfokus untuk setiap anggaran rutin",
          problemLabel: "Masalah",
          outcomeLabel: "Dengan SubGuardAI",
          professionals: {
            label: "Profesional muda",
            problem:
              "Alat kerja, streaming, dan paket seluler diperpanjang lewat akun yang berbeda.",
            outcome: "Pantau biaya rutin pribadi tanpa harus membuat sistem keuangan yang rumit.",
          },
          families: {
            label: "Keluarga",
            problem:
              "Layanan hiburan dan pendidikan bersama mudah terlupakan di antara tagihan lain.",
            outcome: "Tinjau langganan rumah tangga bersama sebelum biaya perpanjangan ditagihkan.",
          },
          freelancers: {
            label: "Pekerja lepas dan jarak jauh",
            problem: "Alat klien dan produktivitas dapat tetap aktif setelah proyeknya selesai.",
            outcome:
              "Temukan layanan yang perlu ditinjau saat beban kerja dan perangkat Anda berubah.",
          },
        },
        premium: {
          label: "Segera hadir",
          title: "Tinjauan AI Premium dan pengingat yang lebih cerdas akan segera hadir.",
          description:
            "Kami sedang menguji saran tinjauan yang lebih jelas dan sinyal perpanjangan lebih awal. Belum diperlukan pembayaran.",
        },
        footer: {
          disclaimer:
            "Untuk validasi MVP, hanya data langganan yang dimasukkan manual yang digunakan.",
        },
      },
      dashboard: {
        eyebrow: "Ruang kerja langganan",
        title: "Selamat datang, {{name}}",
        description:
          "Dasbor Anda akan menyatukan biaya rutin, waktu perpanjangan, dan keputusan tinjauan dalam satu ruang kerja terfokus.",
        loadingLabel: "Memuat dasbor akun",
        logout: "Keluar",
        logoutPending: "Sedang keluar...",
        logoutFallbackError: "Gagal keluar.",
        session: {
          title: "Sesi akun",
          name: "Nama",
          email: "Email",
          role: "Akses",
        },
        empty: {
          title: "Daftar langganan Anda masih kosong",
          description:
            "Tambahkan langganan pertama untuk mulai menghitung biaya rutin dan pengingat tagihan.",
        },
        actions: {
          addFirst: "Tambahkan langganan pertama",
          addSubscription: "Tambah Langganan",
          retry: "Coba lagi",
          reviewBillingDates: "Tinjau tanggal tagihan",
          viewAll: "Lihat semua",
          viewSubscriptions: "Lihat Langganan",
        },
        subscriptionsError: {
          title: "Data langganan tidak tersedia",
          description: "Kami tidak dapat menentukan apakah ruang kerja ini memiliki langganan.",
        },
        summary: {
          title: "Ringkasan biaya rutin",
          monthlySpend: "Estimasi pengeluaran bulanan",
          monthlySaving: "Potensi penghematan bulanan",
          yearlySpend: "Estimasi pengeluaran tahunan",
          activeCount: "Langganan aktif",
          trialCount: "Uji coba",
          candidateCount: "Kandidat pembatalan",
          errorTitle: "Ringkasan tidak tersedia",
          error: "Data langganan Anda aman, tetapi total saat ini tidak dapat dihitung.",
        },
        reminder: {
          badge: "{{count}} segera jatuh tempo",
          title: "{{count}} tanggal tagihan perlu diperhatikan",
          description: "Jatuh tempo dalam tujuh hari: {{names}}.",
        },
        upcoming: {
          eyebrow: "Berikutnya di kalender Anda",
          title: "Tagihan mendatang",
          errorTitle: "Tagihan mendatang tidak tersedia",
          error: "Kami tidak dapat memuat tanggal tagihan mendatang.",
          emptyTitle: "Tidak ada tagihan mendatang",
          emptyDescription: "Tanggal yang dibatalkan dan telah lewat tidak ditampilkan.",
          today: "Jatuh tempo hari ini",
          tomorrow: "Jatuh tempo besok",
          inDays: "Jatuh tempo dalam {{count}} hari",
        },
        error: {
          title: "Dasbor tidak tersedia",
          description: "Kami tidak dapat memuat sesi akun Anda. Silakan coba lagi.",
          retry: "Coba lagi",
        },
      },
      subscriptions: {
        list: {
          eyebrow: "Komitmen rutin Anda",
          title: "Langganan",
          description:
            "Tinjau biaya, tanggal perpanjangan, penggunaan, dan keputusan pembatalan dalam satu tempat.",
          errorTitle: "Langganan tidak tersedia",
          error: "Kami tidak dapat memuat langganan Anda. Silakan coba lagi.",
          pastDue: "Tanggal tagihan telah lewat",
          paymentMethodFallback: "Belum diisi",
        },
        new: {
          title: "Tambah langganan",
          description: "Masukkan biaya rutin dan tanggal berikutnya Anda akan ditagih.",
        },
        edit: {
          title: "Edit {{name}}",
          description:
            "Perbarui detail yang digunakan untuk total, pengingat, dan estimasi penghematan.",
          notFoundTitle: "Langganan tidak ditemukan",
          notFound: "Langganan ini tidak ada atau tidak tersedia untuk akun Anda.",
          errorTitle: "Langganan tidak tersedia",
          error: "Kami tidak dapat memuat langganan ini.",
        },
        fields: {
          actions: "Tindakan",
          billingCycle: "Siklus tagihan",
          candidate: "Kandidat pembatalan",
          category: "Kategori",
          name: "Nama layanan",
          nextBillingDate: "Tanggal tagihan berikutnya",
          notes: "Catatan",
          paymentMethod: "Metode pembayaran",
          price: "Harga",
          status: "Status",
          usageFrequency: "Frekuensi penggunaan",
        },
        form: {
          eyebrow: "Catatan langganan manual",
          priceHint: "Masukkan jumlah dalam IDR.",
          pastDateWarning: "Tanggal tagihan ini telah lewat. Perbarui jika diperlukan.",
          candidateHint: "Sertakan langganan ini dalam estimasi potensi penghematan.",
          notesCount: "{{count}} dari 500 karakter",
          submitErrorTitle: "Langganan belum tersimpan",
          submitErrorFallback: "Silakan coba lagi.",
        },
        filters: {
          status: "Status",
          category: "Kategori",
          sort: "Urutan tanggal tagihan",
          allStatuses: "Semua status",
          allCategories: "Semua kategori",
          nearestFirst: "Terdekat dahulu",
          latestFirst: "Terjauh dahulu",
        },
        empty: {
          title: "Belum ada langganan",
          description: "Tambahkan layanan rutin pertama untuk mulai melihat total sebenarnya.",
          filteredTitle: "Tidak ada langganan yang cocok",
          filteredDescription: "Ubah atau hapus filter saat ini untuk melihat hasil lainnya.",
        },
        actions: {
          add: "Tambah Langganan",
          addFirst: "Tambahkan langganan pertama",
          backToList: "Kembali ke langganan",
          cancel: "Batal",
          cancelLabel: "Batalkan {{name}}",
          cancelSubscription: "Batalkan Langganan",
          clearFilters: "Hapus filter",
          confirmDelete: "Hapus langganan",
          confirmCancellation: "Batalkan langganan",
          delete: "Hapus",
          deleteLabel: "Hapus {{name}}",
          edit: "Edit",
          editLabel: "Edit {{name}}",
          markCandidate: "Tandai kandidat",
          markCandidateLabel: "Tandai {{name}} sebagai kandidat pembatalan",
          retry: "Coba lagi",
          renewSubscription: "Perpanjang Langganan",
          renewLabel: "Perpanjang {{name}}",
          save: "Simpan Langganan",
          saving: "Menyimpan...",
          unmarkCandidate: "Hapus tanda kandidat",
          unmarkCandidateLabel: "Hapus {{name}} dari kandidat pembatalan",
        },
        delete: {
          title: "Hapus langganan ini?",
          description: "{{name}} akan dihapus permanen dari total dan pengingat tagihan.",
        },
        cancel: {
          title: "Batalkan langganan ini?",
          description:
            "{{name}} akan ditandai dibatalkan dan dikeluarkan dari total aktif serta pengingat tagihan.",
        },
        toast: {
          cancelled: "Langganan dibatalkan.",
          candidateUpdated: "Kandidat pembatalan diperbarui.",
          created: "Langganan ditambahkan.",
          deleted: "Langganan dihapus.",
          mutationError: "Langganan tidak dapat diperbarui.",
          renewed: "Langganan diperpanjang dan tanggal tagihan berikutnya diperbarui.",
          updated: "Langganan diperbarui.",
        },
        validation: {
          name: "Masukkan nama layanan antara 2 dan 80 karakter.",
          price: "Masukkan harga lebih dari nol.",
          nextBillingDate: "Masukkan tanggal tagihan yang valid.",
          paymentMethod: "Metode pembayaran maksimal 80 karakter.",
          notes: "Catatan maksimal 500 karakter.",
        },
        billingCycles: {
          MONTHLY: "Bulanan",
          YEARLY: "Tahunan",
        },
        categories: {
          ENTERTAINMENT: "Hiburan",
          WORK_TOOLS: "Alat kerja",
          FAMILY: "Keluarga",
          EDUCATION: "Pendidikan",
          CLOUD: "Cloud",
          TELCO: "Telekomunikasi",
          AI_TOOLS: "Alat AI",
          OTHER: "Lainnya",
        },
        statuses: {
          ACTIVE: "Aktif",
          TRIAL: "Uji coba",
          PENDING_CANCELLATION: "Menunggu pembatalan",
          CANCELLED: "Dibatalkan",
        },
        usageFrequencies: {
          OFTEN: "Sering",
          SOMETIMES: "Kadang-kadang",
          RARELY: "Jarang",
          NOT_SURE: "Belum yakin",
        },
      },
    },
  },
} satisfies Resource;

export const i18n = createFrontendI18n({
  appName: "platform",
  defaultNamespace: "common",
  resources,
});
