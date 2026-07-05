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
          badge: "{{count}} need attention",
          title: "{{count}} billing dates need attention",
          description: "Past due or due within seven days: {{names}}.",
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
          billingSource: "Billing Source",
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
          billingSourceHint:
            "Optional. This helps SubGuardAI show the most relevant cancellation steps.",
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
          howToCancel: "How To Cancel",
          howToCancelLabel: "How to cancel {{name}}",
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
        cancellation: {
          sourceQuestion: {
            title: "Where did you subscribe to this service?",
            description:
              "Choose the billing source for {{name}}. We will save it and show the relevant cancellation steps.",
            options: {
              APPLE_APP_STORE: "Apple App Store",
              GOOGLE_PLAY: "Google Play",
              MERCHANT_WEBSITE: "Service website",
              IN_APP_DIRECT: "Inside the service app",
              RECURRING_PAYMENT: "E-wallet / bank / card recurring payment",
              TELCO_BUNDLE: "Telco bundle",
              INVOICE_MANUAL: "Invoice/manual renewal",
              UNKNOWN: "I'm not sure",
            },
          },
          recurringPayment: {
            title: "Which recurring payment method did you use?",
            description:
              "Choose one so the saved billing source and cancellation steps stay accurate.",
            options: {
              E_WALLET: "E-wallet",
              CARD_OR_BANK: "Bank or card",
            },
          },
          guide: {
            title: "How to cancel {{name}}",
            description: "Suggested steps for subscriptions billed through {{source}}.",
            note: "Exact menu names may vary. Keep the provider's confirmation and verify that automatic renewal is turned off.",
          },
          actions: {
            back: "Back",
            changeSource: "Change billing source",
            close: "Close",
          },
          saveError: {
            title: "Billing source not saved",
            description: "We could not save this billing source. Please try again.",
          },
          guides: {
            APPLE_APP_STORE: {
              steps: {
                1: "Open device Settings and select your Apple Account.",
                2: "Open Subscriptions and select the service.",
                3: "Choose Cancel Subscription and confirm.",
                4: "If it is not listed, check another Apple Account or the service's own billing settings.",
              },
            },
            GOOGLE_PLAY: {
              steps: {
                1: "Open Google Play and select the profile used to subscribe.",
                2: "Open Payments & subscriptions, then Subscriptions.",
                3: "Select the service, choose Cancel subscription, and confirm.",
                4: "If it is not listed, check another Google account or the service's own billing settings.",
              },
            },
            MERCHANT_WEBSITE: {
              steps: {
                1: "Sign in on the service's official website.",
                2: "Open account, plan, membership, or billing settings.",
                3: "Choose cancel or turn off auto-renewal, then complete the confirmation.",
                4: "Keep the confirmation email or screenshot and verify the access-end date.",
              },
            },
            IN_APP_DIRECT: {
              steps: {
                1: "Open the service app and sign in to the account that owns the subscription.",
                2: "Open account, settings, plan, or subscription management.",
                3: "Choose cancel or turn off auto-renewal, then confirm.",
                4: "If there is no cancellation control, use the app's official support channel.",
              },
            },
            E_WALLET: {
              steps: {
                1: "Open the e-wallet used for payment.",
                2: "Find automatic payments, recurring payments, or linked merchants.",
                3: "Select the service and stop or revoke the recurring authorization.",
                4: "Confirm in the service account that renewal is also disabled.",
              },
            },
            CARD_OR_BANK: {
              steps: {
                1: "First cancel from the service's account or billing settings.",
                2: "Review recurring payments, auto-debits, or standing instructions in the bank or card app.",
                3: "Stop the relevant instruction if supported, or contact the card issuer or bank.",
                4: "Verify future statements; replacing or blocking a card is not the normal first step.",
              },
            },
            TELCO_BUNDLE: {
              steps: {
                1: "Open the mobile operator's app, website, or subscription-management channel.",
                2: "Find active add-ons, content services, or bundles.",
                3: "Select the service and unsubscribe or disable renewal.",
                4: "Check the next mobile bill or prepaid balance for confirmation.",
              },
            },
            INVOICE_MANUAL: {
              steps: {
                1: "Check the invoice or agreement for renewal and notice terms.",
                2: "Contact the provider before the renewal deadline and request non-renewal.",
                3: "Ask for written confirmation.",
                4: "Do not assume that ignoring an invoice automatically cancels a contract.",
              },
            },
            UNKNOWN: {
              steps: {
                1: "Check the purchase receipt or renewal email.",
                2: "Check your Apple and Google subscription lists.",
                3: "Review the service's account and billing settings.",
                4: "Review e-wallet, bank, card, and telco recurring-payment records.",
                5: "Contact the service's official support if you still cannot identify the billing source.",
              },
            },
          },
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
        billingSources: {
          APPLE_APP_STORE: "Apple App Store",
          GOOGLE_PLAY: "Google Play",
          MERCHANT_WEBSITE: "Service Website",
          IN_APP_DIRECT: "Inside the Service App",
          E_WALLET: "E-Wallet Recurring Payment",
          CARD_OR_BANK: "Card/Bank Auto-Charge",
          TELCO_BUNDLE: "Telco/Mobile Bundle",
          INVOICE_MANUAL: "Invoice/Manual Renewal",
          UNKNOWN: "I Am Not Sure",
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
          badge: "{{count}} perlu diperhatikan",
          title: "{{count}} tanggal tagihan perlu diperhatikan",
          description: "Sudah lewat atau jatuh tempo dalam tujuh hari: {{names}}.",
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
          billingSource: "Sumber Tagihan",
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
          billingSourceHint:
            "Opsional. Informasi ini membantu SubGuardAI menampilkan langkah pembatalan yang paling sesuai.",
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
          howToCancel: "Cara Membatalkan",
          howToCancelLabel: "Cara membatalkan {{name}}",
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
        cancellation: {
          sourceQuestion: {
            title: "Di mana Anda berlangganan layanan ini?",
            description:
              "Pilih sumber tagihan untuk {{name}}. Kami akan menyimpannya dan menampilkan langkah pembatalan yang sesuai.",
            options: {
              APPLE_APP_STORE: "Apple App Store",
              GOOGLE_PLAY: "Google Play",
              MERCHANT_WEBSITE: "Situs web layanan",
              IN_APP_DIRECT: "Di dalam aplikasi layanan",
              RECURRING_PAYMENT: "Pembayaran berulang e-wallet / bank / kartu",
              TELCO_BUNDLE: "Paket operator seluler",
              INVOICE_MANUAL: "Tagihan/perpanjangan manual",
              UNKNOWN: "Saya tidak yakin",
            },
          },
          recurringPayment: {
            title: "Metode pembayaran berulang mana yang Anda gunakan?",
            description:
              "Pilih salah satu agar sumber tagihan dan langkah pembatalan yang tersimpan tetap akurat.",
            options: {
              E_WALLET: "E-wallet",
              CARD_OR_BANK: "Bank atau kartu",
            },
          },
          guide: {
            title: "Cara membatalkan {{name}}",
            description: "Saran langkah untuk langganan yang ditagihkan melalui {{source}}.",
            note: "Nama menu dapat berbeda. Simpan konfirmasi dari penyedia dan pastikan perpanjangan otomatis telah dinonaktifkan.",
          },
          actions: {
            back: "Kembali",
            changeSource: "Ubah sumber tagihan",
            close: "Tutup",
          },
          saveError: {
            title: "Sumber tagihan belum tersimpan",
            description: "Kami tidak dapat menyimpan sumber tagihan ini. Silakan coba lagi.",
          },
          guides: {
            APPLE_APP_STORE: {
              steps: {
                1: "Buka Pengaturan perangkat dan pilih Akun Apple Anda.",
                2: "Buka Langganan lalu pilih layanannya.",
                3: "Pilih Batalkan Langganan lalu konfirmasi.",
                4: "Jika tidak tercantum, periksa Akun Apple lain atau pengaturan tagihan layanan tersebut.",
              },
            },
            GOOGLE_PLAY: {
              steps: {
                1: "Buka Google Play dan pilih profil yang digunakan untuk berlangganan.",
                2: "Buka Pembayaran & langganan, lalu Langganan.",
                3: "Pilih layanan, pilih Batalkan langganan, lalu konfirmasi.",
                4: "Jika tidak tercantum, periksa akun Google lain atau pengaturan tagihan layanan tersebut.",
              },
            },
            MERCHANT_WEBSITE: {
              steps: {
                1: "Masuk ke situs web resmi layanan.",
                2: "Buka pengaturan akun, paket, keanggotaan, atau tagihan.",
                3: "Pilih pembatalan atau nonaktifkan perpanjangan otomatis, lalu selesaikan konfirmasi.",
                4: "Simpan email atau tangkapan layar konfirmasi dan periksa tanggal berakhirnya akses.",
              },
            },
            IN_APP_DIRECT: {
              steps: {
                1: "Buka aplikasi layanan dan masuk ke akun pemilik langganan.",
                2: "Buka pengelolaan akun, pengaturan, paket, atau langganan.",
                3: "Pilih pembatalan atau nonaktifkan perpanjangan otomatis, lalu konfirmasi.",
                4: "Jika tidak ada kontrol pembatalan, gunakan saluran dukungan resmi aplikasi.",
              },
            },
            E_WALLET: {
              steps: {
                1: "Buka e-wallet yang digunakan untuk membayar.",
                2: "Cari pembayaran otomatis, pembayaran berulang, atau merchant tertaut.",
                3: "Pilih layanan lalu hentikan atau cabut otorisasi pembayaran berulang.",
                4: "Pastikan perpanjangan juga dinonaktifkan di akun layanan.",
              },
            },
            CARD_OR_BANK: {
              steps: {
                1: "Batalkan terlebih dahulu melalui pengaturan akun atau tagihan layanan.",
                2: "Periksa pembayaran berulang, debit otomatis, atau instruksi berkala di aplikasi bank atau kartu.",
                3: "Hentikan instruksi terkait jika didukung, atau hubungi penerbit kartu maupun bank.",
                4: "Periksa laporan transaksi berikutnya; mengganti atau memblokir kartu bukan langkah pertama yang umum.",
              },
            },
            TELCO_BUNDLE: {
              steps: {
                1: "Buka aplikasi, situs web, atau saluran pengelolaan langganan operator seluler.",
                2: "Cari add-on, layanan konten, atau paket yang aktif.",
                3: "Pilih layanan lalu berhenti berlangganan atau nonaktifkan perpanjangan.",
                4: "Periksa tagihan seluler berikutnya atau saldo prabayar untuk konfirmasi.",
              },
            },
            INVOICE_MANUAL: {
              steps: {
                1: "Periksa syarat perpanjangan dan pemberitahuan pada tagihan atau perjanjian.",
                2: "Hubungi penyedia sebelum tenggat perpanjangan dan minta agar tidak diperpanjang.",
                3: "Minta konfirmasi tertulis.",
                4: "Jangan berasumsi bahwa mengabaikan tagihan otomatis membatalkan kontrak.",
              },
            },
            UNKNOWN: {
              steps: {
                1: "Periksa bukti pembelian atau email perpanjangan.",
                2: "Periksa daftar langganan Apple dan Google Anda.",
                3: "Tinjau pengaturan akun dan tagihan layanan.",
                4: "Tinjau catatan pembayaran berulang e-wallet, bank, kartu, dan operator seluler.",
                5: "Hubungi dukungan resmi layanan jika sumber tagihan masih belum ditemukan.",
              },
            },
          },
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
        billingSources: {
          APPLE_APP_STORE: "Apple App Store",
          GOOGLE_PLAY: "Google Play",
          MERCHANT_WEBSITE: "Situs Web Layanan",
          IN_APP_DIRECT: "Di Dalam Aplikasi Layanan",
          E_WALLET: "Pembayaran Berulang E-Wallet",
          CARD_OR_BANK: "Debit Otomatis Kartu/Bank",
          TELCO_BUNDLE: "Paket Operator Seluler",
          INVOICE_MANUAL: "Tagihan/Perpanjangan Manual",
          UNKNOWN: "Saya Tidak Yakin",
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
