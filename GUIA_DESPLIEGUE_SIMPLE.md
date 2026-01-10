# 🚀 Despliegue Rápido - Método Simple

Guía **súper fácil** para desplegar en **https://socialrrss.com** sin complicaciones.

---

## 🎯 Opción MÁS FÁCIL: Vercel para Todo

**Usa Vercel para frontend Y backend** (sin necesidad de Railway/Render)

### Paso 1: Preparar Archivos

Crea estos archivos en tu proyecto:

#### `backend/.env` (solo localmente para probar)
```env
MONGODB_URI=tu_mongodb_uri
JWT_SECRET=tu_secret
FRONTEND_URL=https://socialrrss.com
PAYPAL_CLIENT_ID=tu_client_id_produccion
PAYPAL_CLIENT_SECRET=tu_secret_produccion
PAYPAL_MODE=production
STRIPE_SECRET_KEY=tu_stripe_secret_produccion
NODE_ENV=production
PORT=5000
```

#### `frontend/.env.local` (solo localmente)
```env
NEXT_PUBLIC_API_URL=https://socialrrss.com/api
NEXT_PUBLIC_PAYPAL_CLIENT_ID=tu_client_id_produccion
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=tu_stripe_publishable_key
```

### Paso 2: Desplegar en Vercel (TODO en uno)

1. **Ve a https://vercel.com**
   - Regístrate (es gratis)

2. **Importa tu proyecto**
   - "Add New" → "Project"
   - Conecta tu GitHub
   - Selecciona tu repositorio

3. **Configuración del Proyecto:**
   - Framework: Next.js (auto-detectado)
   - Root Directory: `frontend`
   - Build Command: `npm run build` (automático)
   - Output Directory: `.next` (automático)

4. **Variables de Entorno** (añade TODAS estas):
   ```
   # Backend
   MONGODB_URI=tu_mongodb_uri
   JWT_SECRET=tu_secret_muy_largo_y_seguro
   FRONTEND_URL=https://socialrrss.com
   PAYPAL_CLIENT_ID=tu_client_id_produccion
   PAYPAL_CLIENT_SECRET=tu_secret_produccion
   PAYPAL_MODE=production
   STRIPE_SECRET_KEY=tu_stripe_secret_produccion
   
   # Frontend
   NEXT_PUBLIC_API_URL=https://socialrrss.com/api
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=tu_client_id_produccion
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=tu_stripe_publishable_key
   
   # Otros
   PORT=5000
   NODE_ENV=production
   ```

5. **Click en "Deploy"**
   - Espera 2-3 minutos
   - ¡Listo! Ya tienes una URL temporal

6. **Configurar Dominio:**
   - Ve a "Settings" → "Domains"
   - Añade: `socialrrss.com`
   - Vercel te dará instrucciones DNS (súper simple)

**🎉 LISTO - Solo necesitas configurar el DNS una vez y ya está todo funcionando.**

---

## 🎯 Opción SIMPLE Alternativa: Netlify + MongoDB Atlas

Si Vercel no te convence, esta es aún más simple:

### Netlify (Frontend + Backend con Serverless Functions)

1. **Ve a https://netlify.com**
2. **"Add new site" → "Import an existing project"**
3. Conecta GitHub
4. Configura:
   - Base directory: `frontend`
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/.next`
5. Añade variables de entorno (igual que arriba)
6. Click "Deploy"

---

## ⚡ Método SÚPER RÁPIDO: Solo Frontend en Vercel + Backend en Railway (5 minutos)

Si quieres separar frontend y backend pero rápido:

### Backend (Railway) - 2 minutos

1. Ve a https://railway.app
2. "New Project" → "Deploy from GitHub"
3. Selecciona carpeta `backend`
4. Añade variables de entorno (copia de tu `.env`)
5. ¡Listo! Railway te da una URL tipo `https://xxx.railway.app`

### Frontend (Vercel) - 2 minutos

1. Ve a https://vercel.com
2. "Add New" → "Project"
3. Selecciona `frontend` como root
4. Añade variables de entorno:
   - `NEXT_PUBLIC_API_URL` = URL que te dio Railway + `/api`
5. Click "Deploy"

### Dominio - 1 minuto

1. En Vercel: "Settings" → "Domains" → añade `socialrrss.com`
2. Sigue las instrucciones DNS simples
3. En Railway: "Settings" → "Domains" → añade `api.socialrrss.com`
4. Añade CNAME `api` → URL de Railway en tu DNS

---

## 🔥 Método MÁS SIMPLE: Usar las URLs gratuitas primero

**NO configures dominio todavía**, usa las URLs que te dan gratis:

1. Despliega backend en Railway → Obtienes: `https://xxx.railway.app`
2. Despliega frontend en Vercel → Obtienes: `https://xxx.vercel.app`
3. Actualiza `NEXT_PUBLIC_API_URL` en Vercel con la URL de Railway
4. **Prueba todo** y cuando funcione, luego añades el dominio personalizado

**Ventaja:** Puedes probar TODO sin tocar DNS. Luego solo cambias las URLs.

---

## 📱 ¿Cuál método elijo?

| Método | Facilidad | Tiempo | Recomendado |
|--------|-----------|--------|-------------|
| **Vercel solo** | ⭐⭐⭐⭐⭐ | 5 min | ✅ Si quieres lo más fácil |
| **Netlify** | ⭐⭐⭐⭐ | 5 min | ✅ Alternativa a Vercel |
| **Railway + Vercel** | ⭐⭐⭐ | 10 min | ✅ Más control |
| **URLs gratuitas primero** | ⭐⭐⭐⭐⭐ | 5 min | ✅ Para probar rápido |

**Mi recomendación:** Empieza con URLs gratuitas (Railway + Vercel), prueba todo, y luego añades el dominio.

---

## 🎯 Pasos Mínimos (Lo esencial)

### Si tienes prisa, haz solo esto:

1. **Backend en Railway** (3 min)
   - Railway.app → New Project → GitHub → backend folder
   - Copia variables de `.env`
   - Deploy

2. **Frontend en Vercel** (3 min)
   - Vercel.com → New Project → GitHub → frontend folder
   - `NEXT_PUBLIC_API_URL` = URL de Railway + `/api`
   - Deploy

3. **Prueba las URLs gratis** (2 min)
   - Funciona? ✅
   - No funciona? Revisa variables de entorno

4. **Añade dominio después** (cuando todo funcione)
   - Vercel → Settings → Domains → `socialrrss.com`
   - Railway → Settings → Domains → `api.socialrrss.com`
   - Configura DNS (copia/pega lo que te digan)

**Total: ~10 minutos para tenerlo funcionando**

¿Cuál método prefieres? Te ayudo paso a paso con el que elijas.


