# Shopverse

A full-featured e-commerce storefront and admin dashboard built with React. Browse products with rich filtering, manage carts and orders, and run the entire UI against a real API or optional **demo data** when no backend is available.

## Features

- **Storefront**: product listing, detail pages, categories, brands, sale highlights, reviews, cart, and checkout flow.
- **Customer area**: authentication, profile, order history, and order confirmation.
- **Admin**: dashboard metrics, users, orders, categories, and product management (CRUD, stock, and status).
- **Demo mode**: flip one environment variable to serve in-memory catalog, cart, and orders—ideal for previews, Vercel demos, and UI development without a live API.

## Tech stack

| Layer | Choice |
|--------|--------|
| UI | React 19, TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS 4, Radix UI, shadcn-style primitives |
| Data & forms | TanStack Query, Axios, React Hook Form, Zod |
| Routing | React Router 7 |

## Prerequisites

- **Node.js** 20 or newer (LTS recommended)
- **npm** (or pnpm / yarn, if you prefer)

## Getting started

```bash
git clone <your-repository-url>
cd shopverse--front-end
npm install
```

Copy the environment template and adjust values:

```bash
cp .env.example .env
```

Start the development server:

```bash
npm run dev
```

Open the URL shown in the terminal (by default `http://localhost:5173`).

## Environment variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Base URL for the REST API (for example `https://api.example.com/api`). Used by Axios clients when demo mode is off. |
| `VITE_USE_DEMO_DATA` | Set to `true` to use the built-in mock API (no backend required). Set to `false` in production when a real API is deployed. |

Values prefixed with `VITE_` are exposed to the client bundle. Do not put secrets in these variables.

## npm scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start Vite in development mode with HMR. |
| `npm run build` | Type-check (`tsc -b`) then production build to `dist/`. |
| `npm run preview` | Serve the production build locally for smoke testing. |
| `npm run lint` | Run ESLint across the project. |

## Deploying on Vercel

1. Import the repository in the [Vercel](https://vercel.com) dashboard.
2. Use the default settings: **Framework Preset** Vite, **Build Command** `npm run build`, **Output Directory** `dist`.
3. Under **Environment Variables**, add at least:
   - `VITE_API_URL` — your production API base URL.
   - `VITE_USE_DEMO_DATA` — set to `false` when the real backend is live; use `true` only for a static demo deployment.

Redeploy after changing environment variables so the new values are baked into the client build.

## Demo mode (optional)

When `VITE_USE_DEMO_DATA=true`:

- Axios traffic for the main app and admin is handled by in-memory handlers (`src/mocks/`).
- Use any email and a password of at least six characters to sign in; include **`admin`** in the email (for example `admin@demo.local`) to access admin routes.

When you connect a real backend, set `VITE_USE_DEMO_DATA=false` and point `VITE_API_URL` at your API.

## Project structure (high level)

```
src/
├── components/     # Shared UI, layout, admin tables, cart, etc.
├── context/          # React context (auth, filters)
├── hooks/            # Custom hooks (cart, products, orders)
├── lib/              # Axios instances, auth helpers, query client
├── mocks/            # Demo seed data and API adapter (optional)
├── pages/            # Route-level pages (client + admin)
├── routes/           # Composite route views (e.g. homepage, product grid)
├── services/         # API modules (products, orders, admin, …)
└── types/            # TypeScript models
```

## Contributing

1. Create a branch from `main`.
2. Make focused changes with clear commit messages.
3. Run `npm run lint` before opening a pull request.

## License

This project is **private** unless you add an explicit license file.

