# SubGuard AI

**SubGuard AI** is a smart subscription management platform that helps users track, manage, and optimize their recurring expenses. Featuring an AI-powered Review Assistant, SubGuard AI analyzes your subscription habits, identifies overlapping services, and provides actionable recommendations to save you money.

---

## 🌟 Key Features

- **Subscription Tracking**: Easily manage all your subscriptions in one place (Cost, Billing Cycle, Category).
- **Smart Dashboard**: Visual insights into your monthly/yearly spendings, potential savings, and upcoming billings.
- **AI Review Assistant**: Get personalized, LLM-powered recommendations on which subscriptions to keep, downgrade, or cancel.
- **Alerts & Reminders**: Visual indicators for subscriptions nearing their billing dates.
- **Responsive Design**: Fully mobile-friendly UI crafted with Tailwind CSS and Radix UI.
- **Secure Authentication**: Built with Better Auth for robust, session-based user authentication.

---

## 🛠️ Tech Stack

This project is built as a **Monorepo** using [pnpm workspaces](https://pnpm.io/workspaces).

### Frontend (Platform & Admin)
- **Framework**: React 19, Vite
- **Routing**: TanStack Router
- **Data Fetching**: TanStack Query (React Query)
- **Styling**: Tailwind CSS v4, Radix UI Primitives, Lucide Icons

### Backend (API)
- **Server**: Hono (Node.js Adapter)
- **API Communication**: tRPC
- **Database**: PostgreSQL
- **Caching & Sessions**: Redis
- **ORM**: Prisma
- **Auth**: Better Auth

### Infrastructure & Tooling
- **Containerization**: Docker & Docker Compose
- **Linting & Formatting**: Biome
- **Testing**: Vitest
- **Package Manager**: pnpm

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
Make sure you have the following installed on your machine:
- **Node.js** (v20 or higher)
- **pnpm** (v10+ recommended)
- **Docker** & **Docker Compose** (for PostgreSQL and Redis)

### 1. Clone the Repository
```sh
git clone <your-repo-url>
cd subguard-ai
```

### 2. Install Dependencies
```sh
pnpm install
```

### 3. Setup Environment Variables
Copy the example environment file and configure it.
```sh
cp .env.example .env
```
*Note: The default values in `.env.example` are pre-configured to work seamlessly with the provided local Docker setup. To use the AI Review feature, make sure to add your actual `OPENROUTER_API_KEY` (or other supported LLM API keys) to the `.env` file.*

### 4. Start Local Infrastructure
Spin up the local PostgreSQL and Redis containers in detached mode:
```sh
docker compose -f docker-compose.dev.yaml up -d
```
*(Wait a few seconds for the database to fully initialize).*

### 5. Setup the Database
Run Prisma migrations to create the tables, and then generate the Prisma Client:
```sh
pnpm db:migrate
pnpm db:generate
```

*(Optional) Seed the database with dummy subscription data:*
```sh
pnpm seed
```

### 6. Start the Development Servers
Launch all applications (API, Platform, and Admin) simultaneously:
```sh
pnpm dev
```

The applications will be available at:
- **Platform (User App)**: `http://localhost:3000`
- **Admin Dashboard**: `http://localhost:4000`
- **API Server**: `http://localhost:8000`

---

## 📂 Project Structure

```text
subguard-ai/
├── apps/
│   ├── api/            # Hono backend + tRPC router + Prisma schema
│   ├── platform/       # Main user-facing React application
│   └── admin/          # Admin dashboard application
├── packages/
│   ├── api-client/     # Shared tRPC client and types
│   ├── i18n/           # Internationalization setup
│   └── ui/             # Shared Tailwind UI components (Radix + Custom)
├── scripts/            # Utility scripts (seeding, superuser creation)
├── docker-compose.yaml # Production docker setup
└── docker-compose.dev.yaml # Local development infrastructure
```

---

## 📜 Available Commands

From the root directory, you can run:

- `pnpm dev`: Starts the development servers for all apps.
- `pnpm build`: Builds all applications for production.
- `pnpm check`: Runs Biome linter across the workspace.
- `pnpm format`: Formats code using Biome.
- `pnpm typecheck`: Runs TypeScript compiler checks without emitting files.
- `pnpm test`: Runs Vitest test suites.
- `pnpm db:studio`: Opens Prisma Studio to view and edit database records.
- `pnpm createsuperuser`: Creates an admin user account.

---

## 🤖 AI Configuration
The AI Review Assistant uses OpenRouter by default to access various LLMs (like OpenAI, Anthropic, or open-source models).
To enable AI recommendations:
1. Get an API key from [OpenRouter](https://openrouter.ai/).
2. Add it to your `.env` file under `OPENROUTER_API_KEY`.
3. (Optional) Change the model by modifying `OPENROUTER_MODEL` (e.g., `openai/gpt-4o-mini`).
