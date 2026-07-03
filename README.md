# Microfrontends Unlocked

A complete, production-pattern microfrontend application built as a companion to the book *Microfrontends Unlocked*. Four independent apps — built with React and Vue across Webpack and Vite — are composed at runtime using **Module Federation** inside an **NX monorepo**.

Each chapter branch (`Chapter1` → `Chapter8`) is a working snapshot of the codebase at the end of that chapter. This `main` branch contains the final, complete implementation.

---

## What's Inside

A working e-commerce shell that loads three remote microfrontends:

| Page | MFE | What it does |
|------|-----|-------------|
| `/products` | product-catalog | Browse products, filter by category, search, view detail |
| `/cart` | cart-module | View cart contents, adjust quantities, proceed to checkout |
| `/checkout` | checkout | Fill shipping details, place order |

The shell header tracks the cart item count in real time via a custom event bus — no shared state library required.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│              ecommerce-shell  :3000                  │
│              React 19 · Webpack 5 · Host             │
│                                                      │
│   /products        /cart          /checkout          │
│       ↓               ↓               ↓              │
│  product-catalog  cart-module      checkout          │
│  Vue 3 · WP5      Vue 3 · Vite    React 19 · WP5    │
│  :3001            :3002            :3003             │
└─────────────────────────────────────────────────────┘
          ↑ shared at build time ↑
┌──────────────────────────────────────┐
│  packages/                           │
│  ├── shared-styles  (SCSS tokens)    │
│  ├── vue-ui         (@shop/vue-ui)   │
│  └── react-ui       (@shop/react-ui) │
└──────────────────────────────────────┘
```

### Cross-MFE Event Bus

Communication between apps uses native DOM custom events — no shared runtime required:

| Event | Fired by | Handled by | Payload |
|-------|----------|-----------|---------|
| `mfe:cart:add` | product-catalog | cart-module | `{ id, title, price, image }` |
| `mfe:cart:updated` | cart-module | shell (header badge) | `{ count }` |
| `mfe:navigate` | any MFE | shell (React Router) | `{ path }` |
| `mfe:order:placed` | checkout | cart-module | `{ name, email, street, city, zip }` |

---

## Tech Stack

| Concern | Technology |
|---------|-----------|
| Monorepo | NX 20 |
| Shell framework | React 19 |
| Catalog framework | Vue 3 |
| Cart framework | Vue 3 |
| Checkout framework | React 19 |
| Shell / Catalog / Checkout bundler | Webpack 5 + Module Federation |
| Cart bundler | Vite 7 + `@originjs/vite-plugin-federation` |
| Shared styles | SCSS design tokens (`@shop/shared-styles`) |
| Vue component library | `@shop/vue-ui` |
| React component library | `@shop/react-ui` |
| Language | TypeScript |
| Unit / contract tests | Vitest + jsdom |
| Vue test utils | `@vue/test-utils` |
| React test utils | `@testing-library/react` |
| E2E tests | Playwright |

---

## Getting Started

### Prerequisites

- **Node.js** 18 or later
- **npm** 9 or later

### 1. Install dependencies

```bash
npm install
```

### 2. Start all apps

```bash
npm run dev
```

This starts all four apps in parallel. Once ready, open [http://localhost:3000](http://localhost:3000).

> **Note:** The cart module (`vite build && vite preview`) takes a few seconds longer to start than the Webpack apps — the shell will show a loading state until it's ready.

### Start individual apps

```bash
npm run dev:shell     # Shell only      → http://localhost:3000
npm run dev:catalog   # Catalog only    → http://localhost:3001
npm run dev:cart      # Cart only       → http://localhost:3002
npm run dev:checkout  # Checkout only   → http://localhost:3003
```

---

## Available Scripts

### Development & Build

| Script | Description |
|--------|-------------|
| `npm run dev` | Start all four apps in parallel |
| `npm run dev:shell` | Start the shell (port 3000) |
| `npm run dev:catalog` | Start the product catalog (port 3001) |
| `npm run dev:cart` | Start the cart module (port 3002) |
| `npm run dev:checkout` | Start the checkout app (port 3003) |
| `npm run build` | Build all apps for production |

### Testing

| Script | Description |
|--------|-------------|
| `npm test` | Run all unit and contract tests across product-catalog, cart-module, and checkout |
| `npm run test:e2e` | Run Playwright end-to-end tests for the product catalog |

#### Run tests for a specific app

```bash
cd apps/product-catalog && npm test           # unit + contract tests
cd apps/product-catalog && npm run test:watch # watch mode
cd apps/product-catalog && npm run test:e2e   # Playwright e2e

cd apps/cart-module && npm test
cd apps/checkout && npm test
```

> For Playwright e2e, install the browser first:
> ```bash
> npx playwright install chromium
> ```

---

## Project Structure

```
microfrontends-unlocked/
├── apps/
│   ├── ecommerce-shell/   # React host app (Webpack)
│   ├── product-catalog/   # Vue 3 remote (Webpack)
│   ├── cart-module/       # Vue 3 remote (Vite)
│   └── checkout/          # React remote (Webpack)
├── packages/
│   ├── shared-styles/     # SCSS design tokens and base styles
│   ├── vue-ui/            # Shared Vue 3 components
│   └── react-ui/          # Shared React components
├── nx.json
└── package.json
```

---

## Chapter Branches

Each branch is a self-contained checkpoint — check out any branch to see the codebase at that stage:

| Branch | What's introduced |
|--------|------------------|
| `Chapter1` | Standalone React shell (Vite) |
| `Chapter2` | Standalone Vue product catalog (Vite) |
| `Chapter3` | Webpack 5 + Module Federation: shell loads catalog |
| `Chapter4` | Cart MFE (Vue 3 + Vite), cross-bundler federation bridge |
| `Chapter5` | NX monorepo, unified `npm run dev` |
| `Chapter6` | React Checkout MFE, full cross-MFE event bus |
| `Chapter7` | Shared SCSS tokens, Vue UI + React UI component libraries |
| `Chapter8` | Vitest unit/contract tests + Playwright e2e |
| `main` | Final complete implementation |
