# ⚡ Despliegue Rápido en 3 Pasos

## 🎯 Método MÁS SIMPLE (10 minutos)

### ✅ Paso 1: Backend en Railway (3 min)

1. Ve a **https://railway.app** → Regístrate (Gratis)
2. "New Project" → "Deploy from GitHub repo"
3. Selecciona tu repo → Carpeta: `backend`
4. En "Variables" → Añade TODAS estas (copia de tu `.env`):
   ```
   MONGODB_URI=tu_uri_mongodb
   JWT_SECRET=un_secret_muy_largo
   FRONTEND_URL=https://socialrrss.com
   PAYPAL_CLIENT_ID=tu_paypal_id
   PAYPAL_CLIENT_SECRET=tu_paypal_secret
   PAYPAL_MODE=production
   STRIPE_SECRET_KEY=tu_stripe_secret
   PORT=5000
   NODE_ENV=production
   ```
5. Railway desplegará automáticamente
6. ✅ Obtendrás una URL: `https://xxx.up.railway.app` → **CÓPIALA**

---

### ✅ Paso 2: Frontend en Vercel (3 min)

1. Ve a **https://vercel.com** → Regístrate (Gratis)
2. "Add New" → "Project"
3. Importa tu repo de GitHub
4. **IMPORTANTE**: Root Directory → escribe: `frontend`
5. En "Environment Variables" → Añade:
   ```
   NEXT_PUBLIC_API_URL=https://xxx.up.railway.app/api
   (usa la URL que te dio Railway + /api)
   
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=tu_paypal_id
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=tu_stripe_key
   ```
6. Click "Deploy"
7. ✅ Obtendrás: `https://xxx.vercel.app`

---

### ✅ Paso 3: Probar (2 min)

1. Abre `https://xxx.vercel.app`
2. Prueba login/registro
3. Si funciona ✅ → Continúa al paso 4
4. Si no funciona → Revisa las variables de entorno

---

### ✅ Paso 4: Dominio Personalizado (5 min)

**Solo hazlo cuando todo funcione con las URLs gratis**

#### En Vercel:
1. Settings → Domains → Add
2. Añade: `socialrrss.com`
3. Vercel te mostrará qué registros DNS añadir

#### En Railway:
1. Settings → Domains → Generate Domain
2. Añade: `api.socialrrss.com`
3. Railway te dará el CNAME

#### En tu DNS (Namecheap/GoDaddy):
Añade estos registros (copia exactamente lo que te digan Vercel y Railway):
```
@ → IP de Vercel (te la dan)
www → cname.vercel-dns.com
api → xxx.up.railway.app (el que te dio Railway)
```

**Espera 5-30 minutos** y tu dominio estará listo.

---

## 🎉 ¡Listo!

Ahora tienes:
- ✅ Frontend: https://socialrrss.com
- ✅ Backend: https://api.socialrrss.com

**Total: 15 minutos máximo**

---

## ❓ ¿Problemas?

### No conecta al backend
→ Verifica que `NEXT_PUBLIC_API_URL` tiene la URL correcta de Railway + `/api`

### Error de CORS
→ Añade `FRONTEND_URL=https://socialrrss.com` en Railway (variables de entorno)

### MongoDB no conecta
→ Ve a MongoDB Atlas → Network Access → Añade IP `0.0.0.0/0`

**Eso es todo. Es realmente así de simple.** 🚀


