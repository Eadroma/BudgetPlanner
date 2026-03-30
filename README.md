# BudgetPlanner

> Application de gestion budgétaire personnelle — Next.js 14, Supabase, next-intl (FR/EN)

## Stack

- **Framework** : Next.js 14 (App Router, TypeScript)
- **Auth & BDD** : Supabase
- **i18n** : next-intl (Français / English)
- **CSS** : Vanilla CSS (design system Manrope + Inter)

## Démarrage

### 1. Variables d'environnement

```bash
cp .env.local.example .env.local
```

Remplis `.env.local` avec tes clés Supabase (Dashboard → Settings → API).

### 2. Installation

```bash
npm install
```

### 3. Lancement

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Architecture

```
src/
├── app/[locale]/        # Pages (route groupée par langue)
├── components/
│   ├── auth/            # Formulaires d'authentification
│   ├── layout/          # Navbar, LanguageSwitch
│   └── ui/              # Composants atomiques (Button, Input…)
├── contexts/            # AuthContext (session Supabase)
├── hooks/               # useAuth
├── lib/supabase/        # Clients Supabase (browser + server)
├── messages/            # Traductions FR / EN
├── services/            # auth.service.ts (logique pure)
└── types/               # Types TypeScript globaux
```

> **Sécurité** : `.env.local` est exclu du dépôt (`.gitignore`). Ne commite jamais tes clés.
