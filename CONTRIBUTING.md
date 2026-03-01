# Contributing to Guate Explorer

Thank you for your interest in contributing! This document covers everything you need to know to make a quality contribution.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Project Conventions](#project-conventions)
- [Adding a New Place](#adding-a-new-place)
- [Adding a Translation](#adding-a-translation)
- [Creating a New Component](#creating-a-new-component)
- [Creating a Custom Hook](#creating-a-custom-hook)
- [Commit Message Format](#commit-message-format)
- [Pull Request Process](#pull-request-process)
- [CI Checks](#ci-checks)

---

## Getting Started

```bash
# 1. Fork the repository on GitHub, then clone your fork
git clone https://github.com/<your-username>/guate-explorer.git
cd guate-explorer

# 2. Install dependencies
npm install

# 3. Copy the environment template
cp .env.example .env
# (Optional) Add your free Groq API key to enable AI chat locally

# 4. Start the dev server
npm run dev
```

Before opening a PR, make sure all checks pass locally:

```bash
npm run lint      # ESLint
npm run build     # TypeScript type-check + Vite build
```

---

## Project Conventions

### TypeScript

- **Strict mode is on** — `noUnusedLocals`, `noUnusedParameters`, `strict: true`. Every change must compile cleanly.
- Use `type` imports (`import type { Place } from '...'`) for types that are only used as types.
- Prefer explicit return types on custom hooks; let TypeScript infer for simple components.

### React

- **Functional components only** — no class components.
- State that belongs to a single component stays local (`useState`). State shared between siblings goes to the nearest common ancestor.
- Side effects with external resources (fetch, intervals, event listeners) live in **custom hooks** with proper cleanup.
- Never update state on an unmounted component — use `AbortController` for fetch and `clearInterval`/`removeEventListener` in `useEffect` cleanup.

### CSS

- Each component owns its stylesheet: `ComponentName/ComponentName.tsx` + `ComponentName/ComponentName.css`.
- Theming is done through **CSS custom properties** defined in `src/index.css`. Do not hardcode colors — use `var(--token-name)`.
- Animations use `@keyframes` in the component's CSS file. Prefer `transform` and `opacity` for GPU-composited animations.

### File & folder naming

| Item | Convention | Example |
|------|-----------|---------|
| Components | `PascalCase/` directory + `PascalCase.tsx` + `PascalCase.css` | `PlaceChat/PlaceChat.tsx` |
| Hooks | `camelCase.ts`, prefixed with `use` | `useGroqChat.ts` |
| Utilities | `camelCase.ts` | `icons.ts` |
| Types | Defined in `src/types/index.ts` |  |
| i18n keys | Nested `"section.key"` format | `"chat.title"` |

---

## Adding a New Place

All places live in [`src/data/places.json`](src/data/places.json). To add one:

1. **Find coordinates** — use [geojson.io](https://geojson.io) or Google Maps to get lat/lng.

2. **Choose a Wikimedia query** — test your query at [commons.wikimedia.org](https://commons.wikimedia.org/w/index.php?search=tikal+archaeological+site+guatemala&ns6=1) to make sure good images appear.

3. **Add the entry** following this schema exactly:

```jsonc
{
  "id": "unique-kebab-id",          // URL-safe, kebab-case, never change after publish
  "name": "Display Name",           // Shown in UI — use the most recognized local name
  "description": "One or two sentence description in English.",
  "category": "nature",             // Must be a valid Category (see below)
  "department": "Alta Verapaz",     // Must match the Department union type exactly
  "wikimediaQuery": "Semuc Champey Alta Verapaz Guatemala",
  "coordinates": {
    "lat": 15.529,
    "lng": -89.955
  }
}
```

**Valid categories** (`src/types/index.ts`):

```
archaeological  volcano  lake  nature  colonial  beach  cave
```

**Valid departments** — all 22 Guatemalan departments are in the `Department` union type in `src/types/index.ts`. TypeScript will catch any typos at build time.

4. Run `npm run build` to verify there are no type errors.

---

## Adding a Translation

Translation files are in `src/i18n/locales/`. Both `en.json` and `es.json` must always be in sync.

**Adding a key:**

1. Add the key to `en.json` in the appropriate section.
2. Add the same key (translated) to `es.json`.
3. Use it in a component with `const { t } = useTranslation(); t('section.key')`.

**Adding a new language:**

1. Create `src/i18n/locales/<code>.json` (copy `en.json` as a template, translate all values).
2. In `src/i18n/index.ts`, add the locale to the `resources` object and the `supportedLngs` array.
3. Update the language-toggle button in `Sidebar.tsx` to cycle through the new code.

**i18n key naming convention:**

```
"<component-section>.<descriptive-key>"

Examples:
  "sidebar.searchPlaceholder"
  "chat.noKey"
  "gallery.prevImage"
```

Interpolation uses double-brace syntax: `"chat.welcome": "Ask me about {{name}}."`.

---

## Creating a New Component

Follow the existing pattern:

```
src/components/
└── MyComponent/
    ├── MyComponent.tsx
    └── MyComponent.css
```

**Checklist for a new component:**

- [ ] Component is a default export from `MyComponent.tsx`
- [ ] Props interface is defined in the same file with the suffix `Props`
- [ ] CSS variables are used for all colors (`var(--accent)`, `var(--bg-card)`, etc.)
- [ ] Animations use `@keyframes` — prefer `opacity` + `transform`
- [ ] Any `useEffect` that registers a listener or starts an async operation returns a cleanup function
- [ ] All user-visible strings go through `t()` from `useTranslation()` and have entries in both locale files

**Minimal component template:**

```tsx
import { useTranslation } from 'react-i18next';
import './MyComponent.css';

interface MyComponentProps {
  value: string;
}

export default function MyComponent({ value }: MyComponentProps) {
  const { t } = useTranslation();
  return <div className="my-component">{t('section.key', { value })}</div>;
}
```

---

## Creating a Custom Hook

Hooks live in `src/hooks/`. They should:

- Be named `use<Something>.ts`
- Own all side-effect cleanup (intervals, listeners, fetch aborts)
- Return a stable interface — avoid returning objects with new references on every render when possible
- Not contain JSX

**Pattern for hooks with async fetching:**

```ts
import { useState, useEffect, useRef } from 'react';

export function useMyData(query: string) {
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);

    fetch(`/api?q=${query}`, { signal: controller.signal })
      .then(res => res.json())
      .then(setData)
      .catch(err => { if (err.name !== 'AbortError') console.error(err); })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [query]);

  return { data, loading };
}
```

---

## Commit Message Format

We follow a simplified [Conventional Commits](https://www.conventionalcommits.org/) style:

```
<type>: <short imperative summary>

[optional body — what and why, not how]
```

**Types:**

| Type | When to use |
|------|------------|
| `feat` | New feature or user-visible enhancement |
| `fix` | Bug fix |
| `refactor` | Code change that neither adds a feature nor fixes a bug |
| `style` | CSS/formatting changes only |
| `docs` | Documentation changes |
| `chore` | Tooling, deps, config (no production code change) |
| `test` | Adding or updating tests |

**Examples:**

```
feat: add keyboard shortcut to open guided tour

fix: prevent pushState loop when popstate fires

docs: add new-place schema to CONTRIBUTING.md

chore: upgrade Vite to 7.x
```

- Use the **imperative mood** ("add", not "added" or "adds").
- Keep the summary under 72 characters.
- Reference issues with `Closes #42` or `Fixes #13` in the body.

---

## Pull Request Process

1. **Branch naming:** `feat/<short-description>`, `fix/<short-description>`, `docs/<short-description>`, etc.

2. **Before opening the PR:**
   ```bash
   npm run lint
   npm run build
   ```
   Both must pass with zero errors.

3. **PR description should include:**
   - What the change does and why
   - Screenshots or recordings for UI changes
   - Any breaking changes or migration steps

4. **Review:** At least one review approval is required before merging. Address all review comments before requesting re-review.

5. **Merge strategy:** Squash-and-merge to keep the main branch history clean.

---

## CI Checks

Every push and pull request runs the CI pipeline defined in [`.github/workflows/ci.yml`](.github/workflows/ci.yml):

| Step | Command | What it verifies |
|------|---------|-----------------|
| **Type-check** | `npx tsc -b` | No TypeScript errors |
| **Lint** | `npm run lint` | No ESLint violations |
| **Build** | `vite build` | Production bundle compiles without errors |

All three checks must be green before a PR can be merged.

---

Thank you for helping make Guate Explorer better! 🇬🇹
