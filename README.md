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
