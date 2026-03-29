# Sistema de Gestión de Finanzas Personales

Aplicación Next.js, Zustand, Bootstrap y Supabase.

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



#Estructura de carpetas de la arquitectura monolito modular para la app
```text
finanzas-app/
│
├── app/                                # Carpeta principal de Next.js
│   │
│   ├── frontend/                        # UI (páginas, layouts, componentes)
│   │   ├── (public)/                   # Rutas públicas
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (protected)/                # Rutas protegidas
│   │   │   ├── dashboard/
│   │   │   ├── presupuestos/
│   │   │   ├── finanzas/
│   │   │   ├── carteras/
│   │   │   ├── categorias/
│   │   │   ├── graficas/
│   │   │   ├── notificaciones/
│   │   │   └── perfil/
│   │   ├── components/                  # Componentes UI reutilizables
│   │   ├── hooks/                       # Custom hooks
│   │   ├── styles/                      # CSS 
│   │   ├── layout.tsx
│   │   └── page.tsx
│
│   └── backend/                    # Backend modular                   
│       │   ├── finanzas/
│       │   ├── presupuestos/
│       │   └── carteras/
│       │       ├── actions.ts
│       │       ├── service.ts
│       │       └── repository.ts
│       ├── middleware/                   # Auth + validaciones Zod
│       ├── integrations/                 # Supabase + Brevo
│       └── shared/                       # Utils y types compartidos
│
├── next.config.js
├── tsconfig.json
└── package.json