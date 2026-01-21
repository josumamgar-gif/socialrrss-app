# 🚀 Guía de Despliegue COMPLETA - Promoción RRSS
## Para Principiantes Absolutos - Paso a Paso

Guía **súper detallada** para desplegar tu aplicación en **https://socialrrss.com**

**⚠️ IMPORTANTE:** Esta guía está escrita para personas que nunca han desplegado una aplicación web. Si no entiendes algo, **léelo de nuevo** hasta que lo entiendas antes de continuar.

---

## 📚 ¿Qué es esto?

**Desplegar** significa poner tu aplicación en internet para que cualquier persona pueda acceder a ella usando una dirección web (como `https://socialrrss.com`).

Hasta ahora, tu aplicación solo funciona en tu ordenador (`localhost`). Después de seguir esta guía, funcionará en internet para todo el mundo.

---

## 🎯 ¿Qué vamos a hacer?

Vamos a poner tu aplicación en 3 lugares diferentes:

1. **Frontend** (lo que ven los usuarios) → Vercel
2. **Backend** (el servidor que hace todo) → Railway
3. **Base de Datos** (donde se guarda la información) → MongoDB Atlas (ya lo tienes)

**Tiempo estimado:** 1-2 horas si es tu primera vez. No te preocupes, no es difícil, solo hay que seguir los pasos.

---

## 📋 Índice

1. [Conceptos Básicos - ¿Qué necesitas saber?](#1-conceptos-básicos)
2. [Preparación - Tener todo listo](#2-preparación)
3. [Paso 1: Preparar los archivos](#3-paso-1-preparar-los-archivos)
4. [Paso 2: Desplegar el Backend en Railway](#4-paso-2-desplegar-el-backend)
5. [Paso 3: Desplegar el Frontend en Vercel](#5-paso-3-desplegar-el-frontend)
6. [Paso 4: Configurar el Dominio](#6-paso-4-configurar-el-dominio)
7. [Paso 5: Probar que todo funciona](#7-paso-5-probar-que-todo-funciona)
8. [Solución de Problemas](#8-solución-de-problemas)

---

## 1. Conceptos Básicos - ¿Qué necesitas saber?

### ¿Qué es GitHub?

**GitHub** es como "Dropbox" pero para código. Es donde guardas tu código en internet. Necesitas tener tu código subido a GitHub para desplegarlo.

**¿No tienes GitHub?**
1. Ve a https://github.com
2. Click en "Sign up"
3. Crea una cuenta (es gratis)
4. Crea un repositorio nuevo
5. Sube tu código

**Si no sabes cómo subir código a GitHub:** Busca un tutorial en YouTube sobre "cómo subir código a GitHub" - es muy fácil.

### ¿Qué es Railway?

**Railway** es un servicio que ejecuta tu backend (servidor) en internet. Es como alquilar un ordenador en internet que siempre está encendido ejecutando tu código.

**Es gratis** para empezar.

### ¿Qué es Vercel?

**Vercel** es un servicio que muestra tu frontend (la página web) en internet. Es como alquilar un espacio para mostrar tu página.

**Es gratis** para proyectos personales.

### ¿Qué son las Variables de Entorno?

Las **variables de entorno** son como "notas secretas" que guardan información importante (como contraseñas, URLs, etc.). 

Por ejemplo, en lugar de escribir tu contraseña directamente en el código (que es peligroso), la guardas en una variable de entorno.

**Ejemplo:**
```
MONGODB_URI=mongodb+srv://usuario:password@...
PAYPAL_CLIENT_ID=AbUAbgjHgb...
```

### ¿Qué es DNS?

**DNS** es como un "libro de direcciones" de internet. Cuando escribes `socialrrss.com` en tu navegador, el DNS le dice "ese nombre apunta a esta dirección IP".

Tú le dices a tu proveedor de dominio (donde compraste `socialrrss.com`): "cuando alguien escriba `socialrrss.com`, envíalo a esta dirección de Vercel".

---

## 2. Preparación - Tener todo listo

### ✅ Checklist ANTES de empezar

Antes de seguir con la guía, asegúrate de tener:

- [ ] Tu código subido a GitHub (TODO el código, tanto frontend como backend)
- [ ] Una cuenta de GitHub creada
- [ ] Las credenciales de PayPal (Client ID y Secret) de PRODUCCIÓN (no sandbox)
- [ ] Las credenciales de Stripe (Secret Key y Publishable Key) de PRODUCCIÓN
- [ ] Acceso a MongoDB Atlas (la URI de conexión)
- [ ] El dominio `socialrrss.com` comprado y acceso al panel de control donde compraste el dominio

**¿No tienes algo de esto?** Búscalo y consíguelo ANTES de continuar.

### 📝 Tener a mano

Mientras sigues esta guía, ten abiertas estas cosas en pestañas del navegador:

1. Tu repositorio de GitHub
2. https://railway.app (para el backend)
3. https://vercel.com (para el frontend)
4. El panel de control de tu dominio (donde compraste `socialrrss.com`)
5. MongoDB Atlas (https://cloud.mongodb.com)

---

## 3. Paso 1: Preparar los archivos

### ¿Qué vamos a hacer?

Vamos a preparar dos archivos que contienen información secreta (como contraseñas y URLs). Estos archivos NO se suben a GitHub (por seguridad), pero sí necesitas tenerlos localmente para saber qué información poner en Railway y Vercel.

### 3.1 Preparar el archivo del Backend

**Paso 3.1.1:** Abre tu editor de código (Visual Studio Code o el que uses).

**Paso 3.1.2:** Ve a la carpeta `backend`.

**Paso 3.1.3:** Busca el archivo `.env` (si no existe, créalo).

**Paso 3.1.4:** Abre el archivo `.env` y asegúrate de que tiene este contenido (reemplaza los valores con los tuyos):

```env
# Puerto donde corre el servidor (no cambies esto)
PORT=5000

# URL de tu base de datos MongoDB
# Formato: mongodb+srv://usuario:contraseña@cluster.mongodb.net/
MONGODB_URI=mongodb+srv://tu_usuario:tu_contraseña@tu_cluster.mongodb.net/

# Secreto para los tokens JWT (inventa una frase larga y aleatoria)
# Ejemplo: mi_secreto_super_seguro_123456789_abcdefghijk
JWT_SECRET=tu_secreto_muy_largo_y_aleatorio_aqui
JWT_EXPIRES_IN=7d

# PayPal - CREDENCIALES DE PRODUCCIÓN (no sandbox)
PAYPAL_CLIENT_ID=tu_paypal_client_id_produccion
PAYPAL_CLIENT_SECRET=tu_paypal_secret_produccion
PAYPAL_MODE=production

# Stripe - CREDENCIALES DE PRODUCCIÓN
STRIPE_SECRET_KEY=sk_live_tu_stripe_secret_key_aqui

# URL del frontend (cuando esté desplegado)
FRONTEND_URL=https://socialrrss.com

# Indicador de que estamos en producción
NODE_ENV=production

# Configuración de pagos (no cambies estos valores a menos que quieras)
PAYMENT_AMOUNT=1.00
PAYMENT_CURRENCY=EUR
PROFILE_DURATION_DAYS=30
UPLOAD_DIR=./uploads
```

**⚠️ IMPORTANTE:**
- `PAYPAL_MODE` debe ser `production` (no `sandbox`)
- Todas las credenciales deben ser de **PRODUCCIÓN** (empiezan con valores reales, no de prueba)
- `JWT_SECRET` debe ser una frase larga y aleatoria (puedes usar un generador online)

**Paso 3.1.5:** Guarda el archivo (Ctrl+S o Cmd+S).

### 3.2 Preparar el archivo del Frontend

**Paso 3.2.1:** Ve a la carpeta `frontend`.

**Paso 3.2.2:** Busca o crea el archivo `.env.local`.

**Paso 3.2.3:** Abre el archivo `.env.local` y pon este contenido:

```env
# URL del backend cuando esté desplegado
# Por ahora usa api.socialrrss.com (lo cambiaremos después cuando despleguemos)
NEXT_PUBLIC_API_URL=https://api.socialrrss.com/api

# PayPal - Client ID de PRODUCCIÓN
NEXT_PUBLIC_PAYPAL_CLIENT_ID=tu_paypal_client_id_produccion

# Stripe - Publishable Key de PRODUCCIÓN
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_tu_stripe_publishable_key_aqui
```

**⚠️ IMPORTANTE:** 
- `NEXT_PUBLIC_API_URL` por ahora usa `https://api.socialrrss.com/api` - cuando despliegues el backend, Railway te dará una URL temporal que usarás primero, y luego la cambiaremos.
- Todas las variables que empiezan con `NEXT_PUBLIC_` son públicas (se ven en el código del navegador), así que no pongas información muy sensible.

**Paso 3.2.4:** Guarda el archivo.

### ✅ Verificación del Paso 1

- [ ] Tienes `backend/.env` con todas las variables
- [ ] Tienes `frontend/.env.local` con todas las variables
- [ ] Todos los valores están rellenados (no hay "tu_xxx_aqui" sin reemplazar)
- [ ] Las credenciales son de PRODUCCIÓN (no sandbox)

**Si todo está bien, continúa al siguiente paso.** ✅

---

## 4. Paso 2: Desplegar el Backend en Railway

### ¿Qué vamos a hacer?

Vamos a subir tu backend a Railway para que funcione en internet.

### 4.1 Crear cuenta en Railway

**Paso 4.1.1:** Abre tu navegador y ve a https://railway.app

**Paso 4.1.2:** Click en el botón "Login" o "Sign Up" (arriba a la derecha).

**Paso 4.1.3:** Te preguntará cómo quieres registrarte. **Elige "GitHub"** (es la opción más fácil).

**Paso 4.1.4:** Te pedirá autorización para conectar Railway con GitHub. Click en "Authorize Railway" o "Autorizar".

**Paso 4.1.5:** Si todo va bien, entrarás al dashboard de Railway.

**✅ Si ves el dashboard de Railway, este paso está completo.**

### 4.2 Crear un nuevo proyecto

**Paso 4.2.1:** En el dashboard de Railway, busca el botón **"New Project"** o **"Nuevo Proyecto"** (arriba a la izquierda o en el centro de la pantalla).

**Paso 4.2.2:** Click en "New Project".

**Paso 4.2.3:** Te mostrará opciones. Busca y click en **"Deploy from GitHub repo"** o **"Desplegar desde repositorio de GitHub"**.

**Paso 4.2.4:** Railway te mostrará una lista de tus repositorios de GitHub. Si no ves tu repositorio:
- Asegúrate de que Railway tiene acceso (puede que tengas que darle permisos adicionales)
- Busca un botón como "Configure GitHub App" y dale todos los permisos

**Paso 4.2.5:** Busca tu repositorio en la lista y click en él.

**Paso 4.2.6:** Railway te preguntará qué carpeta usar. En el campo "Root Directory" o "Directorio raíz", escribe: **`backend`**

**⚠️ IMPORTANTE:** Debes escribir exactamente `backend` (en minúsculas).

**Paso 4.2.7:** Click en "Deploy" o "Desplegar".

**Paso 4.2.8:** Railway empezará a trabajar. Verás una pantalla con el progreso. **Esto puede tardar 2-5 minutos**. No cierres la página.

**✅ Si ves que Railway está construyendo tu proyecto, este paso está completo.**

### 4.3 Configurar las Variables de Entorno

**Paso 4.3.1:** Mientras Railway construye tu proyecto, ve a la pestaña **"Variables"** o **"Environment Variables"** (puede estar arriba, en un menú, o en la configuración del proyecto).

**Paso 4.3.2:** Verás una lista vacía o con algunas variables por defecto.

**Paso 4.3.3:** Ahora vamos a añadir TODAS las variables de tu archivo `backend/.env`. 

**Para cada variable:**
1. Click en el botón **"New Variable"** o **"Añadir Variable"**
2. En el campo "Key" o "Clave", escribe el nombre (por ejemplo: `MONGODB_URI`)
3. En el campo "Value" o "Valor", escribe el valor (cópialo de tu archivo `.env`)
4. Click en "Add" o "Añadir"

**Variables que DEBES añadir (una por una):**
```
PORT=5000
MONGODB_URI=tu_uri_de_mongodb
JWT_SECRET=tu_secreto
JWT_EXPIRES_IN=7d
PAYPAL_CLIENT_ID=tu_client_id
PAYPAL_CLIENT_SECRET=tu_secret
PAYPAL_MODE=production
STRIPE_SECRET_KEY=tu_stripe_secret
FRONTEND_URL=https://socialrrss.com
NODE_ENV=production
PAYMENT_AMOUNT=1.00
PAYMENT_CURRENCY=EUR
PROFILE_DURATION_DAYS=30
UPLOAD_DIR=./uploads
```

**⚠️ IMPORTANTE:** 
- Copia los valores EXACTAMENTE como están en tu `.env` local
- No incluyas espacios extra
- `FRONTEND_URL` usa `https://socialrrss.com` (aunque aún no esté desplegado, lo necesitamos así)

**Paso 4.3.4:** Después de añadir todas las variables, guarda (si hay un botón de guardar) o simplemente espera a que se guarden automáticamente.

**✅ Si todas las variables están añadidas, este paso está completo.**

### 4.4 Configurar el Build y Start

**Paso 4.4.1:** Ve a la pestaña **"Settings"** o **"Configuración"** del proyecto.

**Paso 4.4.2:** Busca la sección **"Build Command"** o **"Comando de construcción"**.

**Paso 4.4.3:** En ese campo, escribe exactamente:
```
npm install && npm run build
```

**Paso 4.4.4:** Busca la sección **"Start Command"** o **"Comando de inicio"**.

**Paso 4.4.5:** En ese campo, escribe exactamente:
```
npm start
```

**Paso 4.4.6:** Guarda los cambios (si hay un botón de guardar).

**⚠️ NOTA:** Railway puede detectar automáticamente estos comandos, pero es mejor configurarlos manualmente para estar seguro.

**✅ Si los comandos están configurados, este paso está completo.**

### 4.5 Verificar que el Backend está funcionando

**Paso 4.5.1:** Vuelve a la pestaña principal del proyecto (pestaña "Deployments" o "Despliegues").

**Paso 4.5.2:** Espera a que Railway termine de construir y desplegar. Verás un mensaje como "Deployed" o "Desplegado" en verde.

**Paso 4.5.3:** Railway te mostrará una URL. Algo como: `https://tu-proyecto.up.railway.app`

**⚠️ COPIA ESTA URL - LA NECESITARÁS DESPUÉS.**

**Paso 4.5.4:** Abre una nueva pestaña en tu navegador y ve a esa URL + `/api/health`

Por ejemplo, si tu URL es `https://abc123.up.railway.app`, ve a:
```
https://abc123.up.railway.app/api/health
```

**Paso 4.5.5:** Deberías ver algo como:
```json
{"status":"OK","message":"Servidor funcionando correctamente",...}
```

**✅ Si ves ese mensaje, ¡tu backend está funcionando!**

**❌ Si no funciona:**
- Ve a la pestaña "Logs" en Railway y lee los errores
- Verifica que todas las variables de entorno están correctas
- Verifica que MongoDB Atlas permite conexiones desde cualquier IP (whitelist: `0.0.0.0/0`)

### 4.6 Configurar el dominio personalizado (OPCIONAL por ahora)

**Paso 4.6.1:** En Railway, ve a "Settings" → "Domains" o "Configuración" → "Dominios".

**Paso 4.6.2:** Click en "Generate Domain" o "Generar Dominio" (esto crea un dominio temporal).

**Paso 4.6.3:** O click en "Custom Domain" o "Dominio Personalizado" para añadir `api.socialrrss.com`.

**Paso 4.6.4:** Si añades el dominio personalizado, Railway te dará un registro CNAME que necesitarás poner en tu DNS (veremos esto después en el Paso 6).

**✅ Por ahora, solo necesitas la URL que Railway te dio (la temporal).**

---

## 5. Paso 3: Desplegar el Frontend en Vercel

### ¿Qué vamos a hacer?

Ahora vamos a subir tu frontend a Vercel para que los usuarios puedan ver tu página web.

### 5.1 Crear cuenta en Vercel

**Paso 5.1.1:** Abre una nueva pestaña en tu navegador y ve a https://vercel.com

**Paso 5.1.2:** Click en "Sign Up" o "Registrarse" (arriba a la derecha).

**Paso 5.1.3:** Te preguntará cómo quieres registrarte. **Elige "Continue with GitHub"** o "Continuar con GitHub".

**Paso 5.1.4:** Te pedirá autorización para conectar Vercel con GitHub. Click en "Authorize Vercel" o "Autorizar".

**Paso 5.1.5:** Si todo va bien, entrarás al dashboard de Vercel.

**✅ Si ves el dashboard de Vercel, este paso está completo.**

### 5.2 Importar tu proyecto

**Paso 5.2.1:** En el dashboard de Vercel, busca el botón **"Add New..."** o **"Añadir Nuevo..."** y click en **"Project"** o **"Proyecto"**.

**Paso 5.2.2:** Vercel te mostrará una lista de tus repositorios de GitHub. Busca tu repositorio en la lista.

**Paso 5.2.3:** Click en tu repositorio.

**Paso 5.2.4:** Vercel te mostrará una pantalla de configuración. 

**Paso 5.2.5:** En el campo **"Root Directory"** o **"Directorio raíz"**, escribe: **`frontend`**

**⚠️ IMPORTANTE:** Debes escribir exactamente `frontend` (en minúsculas).

**Paso 5.2.6:** Vercel debería detectar automáticamente que es un proyecto Next.js. Si no lo detecta:
- Framework Preset: Selecciona "Next.js"

**✅ Si la configuración se ve correcta, continúa.**

### 5.3 Configurar las Variables de Entorno

**Paso 5.3.1:** En la misma pantalla de configuración, busca la sección **"Environment Variables"** o **"Variables de Entorno"**.

**Paso 5.3.2:** Vamos a añadir las variables. **PERO ATENCIÓN:** Por ahora, usa la URL temporal de Railway para el backend.

**Si ya desplegaste el backend en Railway y tienes su URL temporal** (algo como `https://abc123.up.railway.app`), usa esa URL:

Click en "Add" o "Añadir" y añade:

**Variable 1:**
- Key: `NEXT_PUBLIC_API_URL`
- Value: `https://TU_URL_DE_RAILWAY.up.railway.app/api`
- (Reemplaza `TU_URL_DE_RAILWAY` con la URL real que te dio Railway)

**Variable 2:**
- Key: `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
- Value: `tu_paypal_client_id_produccion`
- (Cópialo de tu `.env.local`)

**Variable 3:**
- Key: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Value: `pk_live_tu_stripe_publishable_key`
- (Cópialo de tu `.env.local`)

**⚠️ IMPORTANTE:**
- `NEXT_PUBLIC_API_URL` por ahora usa la URL temporal de Railway. **Después**, cuando configuremos el dominio, la cambiaremos a `https://api.socialrrss.com/api`.
- Asegúrate de que todos los valores están correctos (sin espacios extra).

**Paso 5.3.3:** Después de añadir las tres variables, verifica que estén todas en la lista.

**✅ Si las tres variables están añadidas, este paso está completo.**

### 5.4 Configurar el Build (Verificar)

**Paso 5.4.1:** En la misma pantalla, verifica estos campos:

- **Framework Preset:** Debería decir "Next.js" (si no, selecciónalo)
- **Build Command:** Debería decir `npm run build` (automático)
- **Output Directory:** Debería decir `.next` (automático)
- **Install Command:** Debería decir `npm install` (automático)

**Si alguno está vacío o incorrecto, corrígelo manualmente.**

**✅ Si todo está correcto, continúa.**

### 5.5 Desplegar

**Paso 5.5.1:** En la parte inferior de la pantalla, busca el botón **"Deploy"** o **"Desplegar"**.

**Paso 5.5.2:** Click en "Deploy".

**Paso 5.5.3:** Vercel empezará a construir y desplegar tu frontend. Verás una pantalla con el progreso. **Esto puede tardar 3-5 minutos**. No cierres la página.

**Paso 5.5.4:** Cuando termine, verás un mensaje como "Deployment successful" o "Despliegue exitoso".

**Paso 5.5.5:** Vercel te mostrará una URL. Algo como: `https://tu-proyecto.vercel.app`

**⚠️ COPIA ESTA URL - LA USARÁS PARA PROBAR.**

**✅ Si ves la URL y el despliegue fue exitoso, este paso está completo.**

### 5.6 Probar el Frontend

**Paso 5.6.1:** Abre una nueva pestaña en tu navegador y ve a la URL que te dio Vercel (la que termina en `.vercel.app`).

**Paso 5.6.2:** Deberías ver tu página de login.

**Paso 5.6.3:** Intenta hacer login o registro (usa una cuenta de prueba).

**✅ Si la página carga y puedes interactuar con ella, el frontend está funcionando.**

**❌ Si no funciona:**
- Ve a la pestaña "Deployments" en Vercel, click en el último deploy, y ve a "Logs" para ver errores
- Verifica que todas las variables de entorno están correctas
- Verifica que la URL del backend (`NEXT_PUBLIC_API_URL`) es correcta

---

## 6. Paso 4: Configurar el Dominio

### ¿Qué vamos a hacer?

Ahora vamos a conectar tu dominio `socialrrss.com` con Vercel y Railway para que cuando alguien escriba `socialrrss.com`, vea tu aplicación.

### 6.1 Configurar el dominio en Vercel (Frontend)

**Paso 6.1.1:** En Vercel, ve a tu proyecto.

**Paso 6.1.2:** Ve a la pestaña **"Settings"** o **"Configuración"** (arriba en el menú).

**Paso 6.1.3:** Busca la sección **"Domains"** o **"Dominios"** en el menú lateral izquierdo.

**Paso 6.1.4:** Click en "Domains".

**Paso 6.1.5:** Verás un campo para añadir un dominio. Escribe: **`socialrrss.com`**

**Paso 6.1.6:** Click en "Add" o "Añadir".

**Paso 6.1.7:** Vercel te mostrará instrucciones sobre qué registros DNS necesitas añadir.

**Vercel te dará dos opciones:**

**Opción A (Recomendada):** Registros A (direcciones IP)
- Vercel te dará 2-4 direcciones IP (algo como `76.76.21.21`)
- Necesitarás crear registros A en tu DNS

**Opción B:** CNAME (más fácil pero menos recomendado)
- Para `www.socialrrss.com` puedes usar CNAME

**⚠️ ANOTA LO QUE VERCEL TE DICE - LO NECESITARÁS EN EL SIGUIENTE PASO.**

### 6.2 Configurar el dominio en Railway (Backend)

**Paso 6.2.1:** En Railway, ve a tu proyecto.

**Paso 6.2.2:** Ve a "Settings" → "Domains" o "Configuración" → "Dominios".

**Paso 6.2.3:** Click en "Custom Domain" o "Dominio Personalizado".

**Paso 6.2.4:** Escribe: **`api.socialrrss.com`**

**Paso 6.2.5:** Click en "Add" o "Añadir".

**Paso 6.2.6:** Railway te dará un registro CNAME. Algo como:
- Nombre: `api`
- Valor: `tu-proyecto.up.railway.app`

**⚠️ ANOTA ESTO TAMBIÉN - LO NECESITARÁS EN EL SIGUIENTE PASO.**

### 6.3 Configurar DNS en tu Proveedor de Dominio

**Paso 6.3.1:** Abre una nueva pestaña y ve al sitio web donde compraste tu dominio `socialrrss.com` (puede ser Namecheap, GoDaddy, Cloudflare, etc.).

**Paso 6.3.2:** Inicia sesión en tu cuenta.

**Paso 6.3.3:** Busca la sección de "DNS" o "Domain Management" o "Gestión de Dominio".

**Paso 6.3.4:** Busca la opción para "Manage DNS Records" o "Gestionar Registros DNS".

**Paso 6.3.5:** Ahora vamos a añadir los registros. **BORRA los registros viejos que no necesites** (excepto los que Vercel y Railway te digan que conserves).

**Registros que DEBES añadir:**

#### Para el Frontend (socialrrss.com):

**Si Vercel te dio registros A (direcciones IP):**
- **Tipo:** A
- **Host/Name:** `@` (o déjalo vacío, o pon `socialrrss.com` - depende de tu proveedor)
- **Value/Points to:** La primera IP que te dio Vercel (ej: `76.76.21.21`)
- **TTL:** `3600` o `Automatic`

- **Tipo:** A
- **Host/Name:** `@` (igual)
- **Value/Points to:** La segunda IP que te dio Vercel (si hay más, repite para cada una)
- **TTL:** `3600` o `Automatic`

**Para www (opcional pero recomendado):**
- **Tipo:** CNAME
- **Host/Name:** `www`
- **Value/Points to:** `cname.vercel-dns.com`
- **TTL:** `3600` o `Automatic`

#### Para el Backend (api.socialrrss.com):

- **Tipo:** CNAME
- **Host/Name:** `api`
- **Value/Points to:** La URL que te dio Railway (ej: `tu-proyecto.up.railway.app`)
- **TTL:** `3600` o `Automatic`

**Paso 6.3.6:** Después de añadir todos los registros, **GUARDA** los cambios (busca un botón "Save" o "Guardar").

**⚠️ IMPORTANTE:**
- Los cambios DNS pueden tardar entre **5 minutos y 48 horas** en propagarse
- Normalmente tardan entre 10-30 minutos
- No te preocupes si no funciona inmediatamente

**✅ Si todos los registros están añadidos y guardados, este paso está completo.**

### 6.4 Verificar que el DNS está funcionando

**Paso 6.4.1:** Espera al menos 10-15 minutos después de guardar los registros DNS.

**Paso 6.4.2:** Ve a https://dnschecker.org (herramienta para verificar DNS).

**Paso 6.4.3:** Escribe `socialrrss.com` en el campo de búsqueda.

**Paso 6.4.4:** Selecciona "A" en el tipo de registro.

**Paso 6.4.5:** Click en "Search".

**Paso 6.4.6:** Deberías ver que muchos servidores alrededor del mundo muestran las IPs que configuraste.

**Paso 6.4.7:** Repite para `api.socialrrss.com` con tipo "CNAME".

**✅ Si los registros DNS aparecen correctos en dnschecker.org, el DNS está bien configurado.**

### 6.5 Actualizar las Variables de Entorno

**Paso 6.5.1:** Una vez que el DNS esté propagado (puede tardar), actualiza las variables de entorno.

**En Vercel:**
1. Ve a tu proyecto → Settings → Environment Variables
2. Busca `NEXT_PUBLIC_API_URL`
3. Cambia el valor a: `https://api.socialrrss.com/api`
4. Guarda

**En Railway:**
1. Ve a tu proyecto → Variables
2. Busca `FRONTEND_URL`
3. Asegúrate de que dice: `https://socialrrss.com`
4. Si no, cámbialo y guarda

**Paso 6.5.2:** Después de cambiar las variables, **necesitas hacer un nuevo despliegue**:

**En Vercel:**
- Ve a "Deployments"
- Click en los tres puntos (...) del último deploy
- Click en "Redeploy" o "Redesplegar"

**En Railway:**
- Railway se redeplega automáticamente cuando cambias variables, pero si no, puedes hacer un "Redeploy" manual.

**✅ Si las variables están actualizadas y los despliegues están corriendo, este paso está completo.**

---

## 7. Paso 5: Probar que todo funciona

### 7.1 Verificar el Backend

**Paso 7.1.1:** Abre una nueva pestaña y ve a:
```
https://api.socialrrss.com/api/health
```

**Paso 7.1.2:** Deberías ver:
```json
{"status":"OK","message":"Servidor funcionando correctamente",...}
```

**✅ Si ves ese mensaje, el backend está funcionando.**

### 7.2 Verificar el Frontend

**Paso 7.2.1:** Abre una nueva pestaña y ve a:
```
https://socialrrss.com
```

**Paso 7.2.2:** Deberías ver tu página de login.

**✅ Si ves la página de login, el frontend está funcionando.**

### 7.3 Probar el Login

**Paso 7.3.1:** En `https://socialrrss.com`, intenta hacer login con una cuenta de prueba.

**Paso 7.3.2:** Si el login funciona y te lleva a la página principal, **¡todo está funcionando!**

**✅ Si puedes hacer login, la conexión entre frontend y backend funciona.**

### 7.4 Probar otras funcionalidades

Prueba estas cosas para asegurarte de que todo funciona:

- [ ] **Registro:** Crea una cuenta nueva
- [ ] **Crear perfil:** Crea un perfil de red social
- [ ] **Subir imágenes:** Sube imágenes a un perfil
- [ ] **Pagos:** Intenta crear una orden de pago (no completes el pago real, solo verifica que la página carga)

**✅ Si todo funciona, ¡tu aplicación está desplegada correctamente!**

---

## 8. Solución de Problemas

### ❌ Problema: "Cannot connect to backend"

**Síntomas:** El frontend no puede conectarse al backend. Ves errores en la consola del navegador (F12).

**Solución paso a paso:**

1. **Verifica que el backend está funcionando:**
   - Ve a `https://api.socialrrss.com/api/health`
   - Si no carga, el backend no está funcionando
   - Ve a Railway → Logs y busca errores

2. **Verifica la variable de entorno:**
   - En Vercel → Settings → Environment Variables
   - Verifica que `NEXT_PUBLIC_API_URL` dice `https://api.socialrrss.com/api`
   - Si no, cámbiala y redespliega

3. **Verifica CORS:**
   - En Railway → Variables
   - Verifica que `FRONTEND_URL` dice `https://socialrrss.com`
   - Si no, cámbiala y espera a que se redespliegue

4. **Verifica el DNS:**
   - Ve a dnschecker.org y verifica que `api.socialrrss.com` está configurado correctamente
   - Si no, espera más tiempo o verifica los registros DNS

### ❌ Problema: "MongoDB connection failed"

**Síntomas:** El backend no puede conectarse a MongoDB. Ves errores en los logs de Railway.

**Solución paso a paso:**

1. **Ve a MongoDB Atlas:** https://cloud.mongodb.com

2. **Ve a "Network Access":**
   - Click en "Network Access" en el menú lateral
   - Verifica que hay una regla que permite todas las IPs: `0.0.0.0/0`
   - Si no, click en "Add IP Address" → "Allow Access from Anywhere" → "Confirm"

3. **Verifica la URI de conexión:**
   - En Railway → Variables
   - Verifica que `MONGODB_URI` es correcta
   - Asegúrate de que tiene el formato: `mongodb+srv://usuario:contraseña@cluster.mongodb.net/`

4. **Verifica el usuario de MongoDB:**
   - En MongoDB Atlas → Database Access
   - Verifica que el usuario existe y tiene permisos de lectura/escritura

### ❌ Problema: "PayPal/Stripe not working"

**Síntomas:** Los pagos no funcionan. Ves errores al intentar pagar.

**Solución paso a paso:**

1. **Verifica las credenciales:**
   - Asegúrate de que estás usando credenciales de **PRODUCCIÓN** (no sandbox)
   - Las credenciales de producción empiezan diferente que las de sandbox

2. **Verifica `PAYPAL_MODE`:**
   - En Railway → Variables
   - Verifica que `PAYPAL_MODE` dice `production` (no `sandbox`)

3. **Revisa los logs:**
   - En Railway → Logs
   - Busca errores relacionados con PayPal o Stripe
   - Los errores te dirán exactamente qué está mal

4. **Verifica las claves:**
   - Asegúrate de que las claves públicas/secretas coinciden
   - En Stripe, verifica que usas la "Publishable Key" en el frontend y la "Secret Key" en el backend

### ❌ Problema: "CORS Policy Error"

**Síntomas:** Ves errores de CORS en la consola del navegador.

**Solución paso a paso:**

1. **En Railway → Variables:**
   - Verifica que `FRONTEND_URL` dice exactamente `https://socialrrss.com` (sin barra al final)
   - Si no, cámbiala y espera a que se redespliegue

2. **Verifica el código:**
   - El código del backend ya está configurado para usar `FRONTEND_URL` en CORS
   - No deberías necesitar cambiar código

3. **Reinicia el backend:**
   - En Railway, haz un "Redeploy" del proyecto

### ❌ Problema: "El dominio no funciona"

**Síntomas:** Cuando escribes `socialrrss.com` en el navegador, no carga o da error.

**Solución paso a paso:**

1. **Espera más tiempo:**
   - Los cambios DNS pueden tardar hasta 48 horas
   - Normalmente tardan 10-30 minutos
   - Sé paciente

2. **Verifica los registros DNS:**
   - Ve a dnschecker.org
   - Busca `socialrrss.com` (tipo A)
   - Verifica que muestra las IPs correctas de Vercel

3. **Verifica en Vercel:**
   - Ve a Vercel → Tu proyecto → Settings → Domains
   - Verifica que `socialrrss.com` está añadido y configurado

4. **Prueba con www:**
   - Intenta `www.socialrrss.com`
   - Si funciona con www pero no sin www, el problema está en el registro DNS del dominio raíz (@)

5. **Usa las URLs temporales:**
   - Mientras esperas, puedes usar las URLs temporales (`.vercel.app` y `.railway.app`)
   - Funcionan igual, solo que no son tu dominio personalizado

### ❌ Problema: "Build failed" en Railway o Vercel

**Síntomas:** El despliegue falla y ves errores de construcción.

**Solución paso a paso:**

1. **Lee los logs:**
   - En Railway/Vercel, ve a la pestaña "Logs"
   - Lee los errores - te dirán exactamente qué está mal

2. **Errores comunes:**
   - **"Module not found"**: Falta una dependencia en `package.json`
   - **"Build command failed"**: El comando de build está mal configurado
   - **"Port already in use"**: Conflicto de puertos (poco común en hosting)

3. **Verifica el código localmente:**
   - Prueba hacer `npm run build` localmente
   - Si falla localmente, también fallará en producción
   - Arregla los errores primero

4. **Verifica las variables de entorno:**
   - Algunos errores pueden ser por variables faltantes
   - Asegúrate de que todas las variables necesarias están configuradas

---

## 🎉 ¡Felicitaciones!

Si llegaste hasta aquí y todo funciona, **¡has desplegado tu aplicación exitosamente!**

Tu aplicación ahora está disponible en:
- **Frontend:** https://socialrrss.com
- **Backend:** https://api.socialrrss.com/api

### 📝 Recordatorios importantes:

1. **Mantén las credenciales seguras:** Nunca subas archivos `.env` a GitHub
2. **Monitorea los logs:** Revisa los logs de Railway y Vercel periódicamente
3. **Haz backups:** Asegúrate de tener backups de tu base de datos
4. **Actualiza regularmente:** Mantén las dependencias actualizadas por seguridad

### 🆘 ¿Necesitas ayuda?

Si tienes problemas que no están en esta guía:
1. Revisa los logs de Railway y Vercel
2. Busca el error específico en Google
3. Consulta la documentación de Railway y Vercel

**¡Buena suerte con tu aplicación!** 🚀
