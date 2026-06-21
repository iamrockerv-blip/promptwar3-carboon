# Architecture

Carbon Twin AI is a Next.js application with a deterministic domain core and optional
Gemini narration. Numeric climate results never depend on generative AI.

## Request and data flow

```text
Browser quiz
   │
   ▼
Zustand store ──► deterministic carbon engine ──► score, aura, projections
   │
   ├────────────► /api/generate-twin ──► Gemini narrative
   │                                      └─ deterministic fallback on failure
   │
   └────────────► /api/carbon-coach ───► contextual advice
                                          └─ deterministic fallback on failure
```

## Layers

| Layer        | Location                                           | Responsibility                                          |
| ------------ | -------------------------------------------------- | ------------------------------------------------------- |
| Domain       | `src/lib/carbon-engine.ts`                         | Pure, deterministic footprint calculations              |
| Derivation   | `src/lib/twin-derivation.ts`                       | Composes projections and simulator metrics              |
| Validation   | `src/lib/validators.ts`                            | Strict bounded API and AI response schemas              |
| Security     | `src/lib/api-security.ts`, `src/lib/rate-limit.ts` | Body limits, safe errors, abuse controls                |
| Services     | `src/services/`                                    | Typed client calls to application routes                |
| State        | `src/store/carbon-store.ts`                        | User journey, fallback orchestration, local persistence |
| Presentation | `src/components/`                                  | Accessible UI, charts, simulator, coach, and sharing    |
| Transport    | `src/app/api/`                                     | Thin route handlers around validation and services      |

## Design rules

- The carbon engine is deterministic and testable without network access.
- Gemini narrates calculated values; it does not invent or alter footprint numbers.
- API inputs and structured AI outputs are bounded and validated with Zod.
- Client storage contains lifestyle state only; the app has no account database,
  analytics tracker, or advertising identifier.
- AI and network failures degrade to useful deterministic content.
- Visual charts expose equivalent semantic tables for assistive technology.

## Operational model

Vercel is the simplest deployment target. A multi-stage `Dockerfile` also builds the
Next.js standalone output, runs as an unprivileged user, and probes `/api/health`.

Every push and pull request runs:

1. Prettier format check.
2. Strict TypeScript type check.
3. ESLint, Next.js Core Web Vitals, React Hooks, and JSX accessibility rules.
4. Unit, integration, API security, and axe accessibility tests with coverage gates.
5. Dependency audit.
6. Production build.
7. React Doctor regression scan.
