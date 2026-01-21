## Backend env (guía)

Este repo **no incluye** `backend/.env` (está bien: va en `.gitignore`).  
Si falta `MONGODB_URI`, el backend y el seed usarán `mongodb://localhost:27017` y **no verás los perfiles reales**.

### 1) Crear `backend/.env` en este Mac

Crea un archivo `backend/.env` con este contenido y rellena los valores:

```env
# Base
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=

# Frontend (CORS / redirects)
FRONTEND_URL=https://socialrrss.com
CUSTOM_DOMAIN=socialrrss.com

# Auth
JWT_SECRET=
JWT_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=

# PayPal
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_MODE=live

# Soporte (Nodemailer)
SUPPORT_EMAIL=oficialsocialrrss@gmail.com
SUPPORT_EMAIL_PASSWORD=
```

### 2) Ejecutar el seed en tu DB real

Con `backend/.env` ya creado:

```bash
cd backend
npm run seed-demo
```

Deberías ver algo como:
- `Eliminados X perfiles demo existentes`
- `Creando 10 perfiles demo...`
- `Total de perfiles demo en la base de datos: 10`

### 3) Railway/Vercel

En Railway (backend) asegúrate de configurar **las mismas variables** en el panel de Environment.  
Si no están, Railway no conectará a tu Mongo real y no saldrán los perfiles reales.

