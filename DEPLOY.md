# Guía de deploy gratuito

Vamos a usar tres servicios gratuitos:

- **Supabase** → base de datos PostgreSQL
- **Render** → backend (API en Node.js)
- **Vercel** → frontend (React)

Todo sin tarjeta de crédito. Tiempo estimado: 15-20 minutos.

## 0. Sube el proyecto a GitHub

1. Crea un repositorio nuevo en GitHub (puede ser privado), por ejemplo `control-gastos-abuelita`.
2. Desde la carpeta `control-gastos-app` (la que contiene `backend/` y `frontend/`):

```bash
git init
git add .
git commit -m "Primera version de la app de gastos"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/control-gastos-abuelita.git
git push -u origin main
```

## 1. Base de datos en Supabase

1. Entra a [supabase.com](https://supabase.com) y crea una cuenta gratuita (puedes usar tu cuenta de GitHub).
2. Clic en **New Project**. Elige un nombre, una contraseña para la base de datos (guárdala) y la región más cercana.
3. Cuando el proyecto esté listo, ve a **Project Settings → Database → Connection string** y copia la que dice **URI** (modo *Session pooler* o *Transaction pooler* funciona bien para Render).
4. Guarda esa URL, la vas a necesitar en el paso 2. Se ve así:
   `postgresql://postgres.xxxx:[TU-PASSWORD]@aws-0-region.pooler.supabase.com:6543/postgres`

## 2. Backend en Render

1. Entra a [render.com](https://render.com) y crea una cuenta gratuita con GitHub.
2. Clic en **New → Web Service** y selecciona tu repositorio.
3. Configura:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
4. En **Environment Variables**, agrega:
   - `DATABASE_URL` = la URL de Supabase del paso 1
5. Clic en **Create Web Service**. Cuando termine el deploy, copia la URL pública, por ejemplo `https://control-gastos-backend.onrender.com`.
6. Para crear las tablas y cargar los medicamentos del excel, abre la pestaña **Shell** de tu servicio en Render y ejecuta:
   ```bash
   npm run seed
   ```
   (Solo la primera vez. Si ya hay productos, el script no duplica nada.)

> Nota: el plan gratis de Render "duerme" el servicio tras 15 minutos sin uso; la primera petición después de eso tarda unos 30-60 segundos en responder. Es normal.

## 3. Frontend en Vercel

1. Entra a [vercel.com](https://vercel.com) y crea una cuenta gratuita con GitHub.
2. Clic en **Add New → Project** y selecciona el mismo repositorio.
3. Configura:
   - **Root Directory**: `frontend`
   - Framework: Vite (se detecta automático)
4. En **Environment Variables**, agrega:
   - `VITE_API_URL` = `https://control-gastos-backend.onrender.com/api` (la URL de Render del paso anterior + `/api`)
5. Clic en **Deploy**. En un par de minutos tendrás tu link público, por ejemplo `https://control-gastos-abuelita.vercel.app`.

## 4. Listo 🎉

Comparte el link de Vercel con quien necesite ver o editar los gastos. Cada vez que hagas `git push`, Render y Vercel vuelven a desplegar automáticamente.

## Actualizar la app en el futuro

```bash
git add .
git commit -m "cambios"
git push
```

Render y Vercel detectan el push y redeploy solos.

## Límites del plan gratuito (referencia)

- **Supabase**: 500 MB de base de datos, proyecto se pausa tras 7 días sin actividad (con volver a entrar se reactiva).
- **Render**: el servicio duerme tras 15 min de inactividad, 750 horas gratis al mes.
- **Vercel**: pensado para uso personal/no comercial, 100 GB de transferencia al mes — más que suficiente para esta app.
