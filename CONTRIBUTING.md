# Contributing

## Commit convention (semantic / Conventional Commits)

Use the Conventional Commits format:

- `feat:` new feature
- `fix:` bug fix
- `chore:` tooling/maintenance
- `docs:` documentation
- `refactor:` code change that neither fixes a bug nor adds a feature
- `test:` tests only

Examples:
- `feat(api): add per-month rate limiting`
- `fix(web): handle empty dashboard state`
- `docs: improve deploy instructions`

> Tip: After `pnpm install`, run `pnpm prepare` to enable the Husky commit hook + commitlint.
