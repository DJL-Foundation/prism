# Agent Development Guidelines

## Build Commands

- `next dev --turbo` - Start development server with Turbo
- `next build --turbo` - Build for production with Turbo
- `next lint` - Run ESLint
- `next lint --fix` - Fix linting issues
- `tsc --noEmit` - TypeScript type checking
- `next lint && tsc --noEmit` - Combined lint + typecheck
- `prettier --check "**/*.{ts,tsx,js,jsx,mdx}" --cache` - Check Prettier formatting
- `prettier --write "**/*.{ts,tsx,js,jsx,mdx}" --cache` - Fix formatting

## Code Style

- **TypeScript**: Strict mode enabled, prefer type imports with `import { type Foo }`
- **Imports**: Use `~/*` for src paths, `@/*` for root, `#env` for env, `#flags` for flags, `#db` for database, `#auth` for auth, `#utility` for server utilities
- **Formatting**: 2 spaces, no tabs, Prettier with Tailwind plugin
- **Components**: React.forwardRef pattern, export interfaces, use `cn()` for className merging
- **File naming**: camelCase for components, kebab-case for routes
- **Error handling**: Use neverthrow library for Result types
- **Package manager**: Use Bun (packageManager: "bun@1.2.17")

## Testing

- No test framework currently configured

## Database

- `prisma db push` - Push schema changes
- `prisma migrate dev` - Create/apply migrations in dev
- `prisma studio` - Open Prisma Studio
