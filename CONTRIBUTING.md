# Contributing

Carbon Twin AI treats quality, accessibility, and security as release requirements.

## Local setup

```bash
npm ci
copy .env.example .env.local
npm run dev
```

Add a server-side `GEMINI_API_KEY` to `.env.local` to enable Gemini. The deterministic
carbon engine and fallback recommendations work without external credentials.

## Required quality gates

Run the same checks enforced by GitHub Actions:

```bash
npm run check
```

The command verifies formatting, strict TypeScript, ESLint and accessibility rules,
unit/integration/accessibility tests with coverage thresholds, dependency security,
and the production build.

## Engineering conventions

- Keep deterministic carbon calculations pure and independent of AI output.
- Bound and validate every API payload at the route boundary.
- Never expose internal exception messages or credentials to clients.
- Add tests for every behavior change and preserve the coverage gates.
- Prefer semantic HTML; interactive controls must work with keyboard and assistive
  technology.
- Charts need a text or table equivalent that does not depend on color or vision.
- Do not commit `.env*`, generated build output, coverage reports, or secrets.

## Pull requests

1. Branch from `main`.
2. Make a focused change with tests.
3. Run `npm run check`.
4. Open a pull request and wait for the Quality Gate and React Doctor workflows.
