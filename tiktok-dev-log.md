# 🛒 TiendaPOS — Sistema de Ventas POS Multi-País

**Stack:** Laravel 12 API REST + Neon Tech (PostgreSQL) + Next.js 14 + Tailwind CSS

---

## 🔐 Auth (Login / Register)
- Registro con nombre, email, contraseña y selección de país
- Validación en tiempo real con React Hook Form + Zod
- Contraseñas en columnas apiladas con toggle show/hide
- Login con token Sanctum, sesión persistente con Zustand + localStorage
- Redirección inteligente: si onboarding incompleto → /onboarding, si completo → /dashboard

## 🚀 Onboarding (7 pasos)
1. **País** — Selección de país LATAM con bandera y placeholder fiscal dinámico
2. **Datos fiscales** — RIF/NIT/RFC, razón social, dirección, teléfono
3. **Monedas** — Moneda base + tasas de cambio
4. **Impuestos** — IVA, IGTF, INC, IEPS según país
5. **Almacén y Caja** — Depósito principal + punto de cobro
6. **Configuración POS** — Impresora, plantilla de ticket
7. **Primer producto** — Nombre, SKU, precio, categoría, stock inicial

Al completar → resumen con todos los datos fiscales, negocio, producto, suscripción y usuario. Toast de éxito "¡Todo listo!" y redirect al dashboard.

## 📊 Dashboard
- Sidebar con logo TiendaPOS + nombre de tienda
- 4 cards principales: Ventas hoy, Total productos, Cajas abiertas, Plan
- Alertas de inventario: productos sin stock + stock bajo
- Top 5 productos más vendidos del día (tabla con ranking)
- Últimos 5 productos ingresados
- Sesiones de caja activas
- Resumen de suscripción con días restantes

## 🧠 Backend (Laravel 12 + Neon Tech)
- API RESTful con Sanctum auth
- Base de datos PostgreSQL en Neon Tech (serverless)
- Dashboard endpoint con KPIs: ventas del día, stock, top productos, total productos, últimos productos
- Onboarding service con transacciones, seeders de catálogo por país
- Modelos con BelongsToTienda (multi-tenancy automático)
- Middleware: auth, activo, suscripción, roles
- Desplegado en Render

## 🎨 Frontend (Next.js 14)
- Dark theme (#090909) con acentos amber (#f59e0b)
- Inputs con borde white/20 → hover white/35 → focus amber
- Toast notifications con Sonner (amber border, icons personalizados)
- Sidebar fija w-48 con avatar + rol + logout
- Dashboard responsivo con tarjetas bg-dark-tertiary
- Desplegado en Vercel (auto-deploy desde GitHub)
