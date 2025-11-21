# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a real-time contacts management application demonstrating TanStack DB with ElectricSQL sync and Neon Postgres. It showcases optimistic updates, real-time UI synchronization, and user-scoped data access behind Better Auth.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run typecheck` - Run TypeScript type checking
- `npm run fmt` - Format code with Prettier
- `npm run db:generate` - Generate Drizzle migrations from schema
- `npm run db:migrate` - Apply migrations to database
- `npm run db:studio` - Open Drizzle Studio for database management

## Architecture

### Data Flow & Sync Architecture

The application uses a multi-layered sync architecture:

1. **Postgres (Neon)** - Source of truth with logical replication enabled
2. **ElectricSQL** - Sync engine that streams changes via HTTP Shape API
3. **TanStack DB Collections** - Client-side reactive collections with optimistic updates
4. **Server Actions** - Mutations that write back to Postgres

### Key Files & Structure

- `src/schema.ts` - Drizzle schema definitions with Zod validation schemas
  - Exports type-safe schemas for insert/select/update operations

- `src/lib/auth.ts` - Better Auth server configuration
  - Uses Drizzle adapter with PostgreSQL
  - Email/password authentication enabled
  - Session configuration with cookie caching

- `src/lib/auth-client.ts` - Better Auth client for React
  - Exports `signIn`, `signUp`, `signOut`, `useSession`, `getSession`

- `src/lib/auth-schema.ts` - Better Auth database schema (auto-generated)
  - Contains `user`, `session`, `account`, `verification` tables

- `src/collections.ts` - TanStack DB collection configuration
  - Defines `contactCollection` with Electric sync options
  - Implements `onInsert`, `onUpdate`, `onDelete` handlers that call server actions
  - Shape syncs from `/api/contacts` endpoint with user-scoped filtering

- `src/actions/contacts.ts` - Server actions for CRUD operations
  - All operations validate user auth via `auth.api.getSession()`
  - Enforces row-level security by checking `userId` on updates/deletes
  - Returns `{ success, contact/error }` response format

- `src/app/api/auth/[...all]/route.ts` - Better Auth API route handler

- `src/app/api/contacts/route.ts` - Electric Shape proxy endpoint
  - Proxies Electric SQL requests with user-scoped `where` filter
  - Injects Electric credentials from environment variables
  - Strips problematic headers (`content-encoding`, `content-length`)

- `src/db.ts` - Drizzle database client using Neon HTTP driver

### Authentication Flow

1. Better Auth handles user authentication with email/password
2. Server actions call `auth.api.getSession()` to verify auth
3. Shape proxy filters data by `user_id` before streaming to client
4. All mutations verify user ownership before modifying data

### Auth Pages

- `/sign-in` - Sign in page with email/password
- `/sign-up` - Sign up page with email/password

### Client-Side Patterns

Components use `useLiveQuery` from `@tanstack/react-db` to subscribe to collection changes:

```tsx
const { data: contacts } = useLiveQuery(
  (q) => q.from({ contacts: contactCollection }),
  [],
);
```

Mutations are called directly on the collection for optimistic updates, which trigger server actions defined in `collections.ts`.

Use `useSession` from `@/lib/auth-client` to get the current user session on the client.

### Database Migrations

- Contact schema defined in `src/schema.ts`
- Auth schema defined in `src/lib/auth-schema.ts`
- Migrations generated via `drizzle-kit generate` into `migrations/` directory
- Applied using `drizzle-kit migrate`
- Drizzle config in `drizzle.config.ts` points to `DATABASE_URL`

## Environment Setup

Required variables (see `.example.env`):

- `BETTER_AUTH_SECRET` - Secret for Better Auth (generate with: `openssl rand -base64 32`)
- `NEXT_PUBLIC_APP_URL` - App URL (default: http://localhost:3000)
- `DATABASE_URL` - Neon database connection string
- `ELECTRIC_SQL_CLOUD_SOURCE_ID`, `ELECTRIC_SQL_CLOUD_SOURCE_SECRET` - ElectricSQL sync engine credentials

## Important Notes

- Logical replication must be enabled in Neon project settings for ElectricSQL to work
- Use unpooled connection string when configuring ElectricSQL sync engine
- All database operations enforce user-scoped access through `userId` filtering
- Path alias `@/*` maps to `src/*`
- Run `npx @better-auth/cli migrate` to create Better Auth tables in database
