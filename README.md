# SubGuard AI

## Phase 1: local registration

The platform registration form stores users in PostgreSQL through Better Auth and Prisma.

1. Create the local environment file:

   ```sh
   cp .env.example .env
   ```

2. Start PostgreSQL and Redis:

   ```sh
   docker compose -f docker-compose.dev.yaml up -d
   ```

3. Create the database tables and start the applications:

   ```sh
   pnpm db:migrate
   pnpm dev
   ```

The local PostgreSQL connection is `localhost:5432`, database `subguard_ai`, username
`subguardai`, and password `sub1234`. The registration page is available at
`http://localhost:3000/register`.
