# Sistema de Gestión de Finanzas Personales

Aplicación Next.js con React, Zustand y Tailwind CSS.

## Instrucciones

1. Instalar dependencias:

```bash
npm install
```

2. Ejecutar en desarrollo:

```bash
npm run dev
```

3. Abrir http://localhost:3000

## Estructura

- `pages/` - Páginas Next.js (transacciones, carteras, presupuestos, login, etc.)
- `components/Layout.js` - Layout principal con sidebar
- `store/useStore.js` - Estado global con Zustand
- `styles/globals.css` - Estilos globales con Tailwind CSS

## Características

- Diseño moderno con Tailwind CSS
- Iconos Material Symbols
- Fuente Inter
- Sidebar de navegación
- Páginas: Transacciones, Carteras, Presupuestos, Login, Crear Cuenta

## Notas

- El proyecto salta el login al iniciar (redirige a /transacciones)
- La página de login está lista para conectar con Supabase en el futuro














monolito/
├── backend/ (Next.js - API)
│   ├── src/
│   │   ├── app/api/             # Endpoints (wallets, budgets, transactions)
│   │   ├── modules/             # Lógica de Negocio Modular
│   │   │   ├── wallets/         # CRUD de carteras + lógica de saldo
│   │   │   ├── budgets/         # CRUD de presupuestos + cálculo de límites
│   │   │   └── transactions/    # Lógica de ingresos/gastos
│   │   ├── lib/
│   │   │   └── supabase.ts      # Cliente Supabase Admin
│   │   └── middlewares/         # Validación de JWT de Supabase
├── frontend/ (Next.js - UI)
│   ├── src/
│   │   ├── app/                 # Dashboard, Wallets, Transactions (Pages)
│   │   ├── modules/
│   │   │   ├── wallets/         # Gráficos de carteras, formularios
│   │   │   ├── transactions/    # Historial de movimientos, filtros
│   │   │   └── budgets/         # Barras de progreso de presupuesto
│   │   ├── services/
│   │   │   └── api.ts           # Cliente Axios/Fetch
│   │   └── components/          # Botones, Modales, Inputs (Shared)
└── types/                       # Tipos compartidos (Opcional si usas Monorepo)










src/
├── app/                        # Capa de Entrega (Routing)
│   ├── (dashboard)/            # Rutas protegidas
│   │   ├── wallets/page.tsx    # Llama a modules/wallets/components
│   │   ├── budgets/page.tsx    # Llama a modules/budgets/components
│   │   └── transactions/page.tsx
│   └── api/                    # Endpoints (opcionales si usas Server Actions)
├── modules/                    # EL NÚCLEO (Domain-Driven)
│   ├── wallets/                # --- Módulo de Carteras ---
│   │   ├── components/         # UI: WalletCard, WalletList
│   │   ├── actions/            # Server Actions (Mutaciones)
│   │   ├── services/           # Lógica de Negocio (Saldos)
│   │   ├── repository/         # Consultas a Supabase
│   │   └── index.ts            # Public API del módulo
│   ├── budgets/                # --- Módulo de Presupuestos ---
│   │   ├── components/         # UI: BudgetProgress, BudgetForm
│   │   ├── services/           # Lógica: ¿Se pasó del límite?
│   │   ├── alerts/             # Notificaciones internas
│   │   └── index.ts
│   └── transactions/           # --- Módulo de Transacciones ---
│       ├── components/         # UI: TransactionTable, AddExpenseModal
│       ├── actions/            # Server Actions
│       ├── services/           # Lógica: Orquestar gasto + saldo
│       └── index.ts
├── lib/                        # Compartido (Supabase Client, Utils)
└── components/ui/              # Design System (Botones, Inputs de Shadcn)