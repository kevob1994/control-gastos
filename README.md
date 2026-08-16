# Gastos de la Abuelita 👵🏻💛

App para llevar el control de gastos mensuales (medicinas, mercado y otros gastos generales): producto, precio (USD), duración en días y mes de inicio del ciclo de compra. Calcula el gasto mensual promedio y un calendario de próximas compras, con conversión a bolívares según la tasa del día.

## Estructura

```
control-gastos-app/
  backend/    API en Node.js + Express + PostgreSQL
  frontend/   App en React + Vite
```

## Cómo funciona el cálculo

- **Gasto mensual promedio**: `precio USD ÷ (duración en días / 30)`, sumado entre todos los productos activos.
- **Calendario de próximas compras**: usando el *mes de inicio* de cada producto, calcula cuándo vuelve a tocar comprarlo (cada *duración en días*, redondeada a meses completos) y agrupa el total por mes.
- **Bolívares**: se calculan multiplicando el precio en USD por la tasa que configures en la barra superior (no se guarda historial, es la tasa "del día").

## Desarrollo local

### 1. Base de datos
Necesitas una URL de conexión a PostgreSQL (puede ser local o de Supabase, ver `DEPLOY.md`).

### 2. Backend

```bash
cd backend
cp .env.example .env   # y coloca tu DATABASE_URL
npm install
npm run seed            # crea las tablas e importa los 12 medicamentos del excel
npm run dev              # http://localhost:4000
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env.development   # VITE_API_URL=http://localhost:4000/api
npm install
npm run dev              # http://localhost:5173
```

## Deploy gratuito

Ver [`DEPLOY.md`](./DEPLOY.md) para el paso a paso con Supabase + Render + Vercel (100% gratis).
