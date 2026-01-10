# 🔗 Cómo Encontrar la URL de tu Backend en Railway

## 📍 Ubicación de la URL

### Paso 1: Ir a tu proyecto en Railway

1. Abre tu navegador y ve a **https://railway.app**
2. Inicia sesión con tu cuenta
3. Click en el proyecto que acabas de desplegar (el que tiene tu backend)

### Paso 2: Encontrar la URL

Tienes **dos formas** de ver la URL:

#### **Opción A: En la página principal del proyecto**

1. En la página principal de tu proyecto, verás una sección con el nombre de tu servicio (algo como "backend" o el nombre de tu carpeta)
2. Debajo del nombre del servicio, verás un **enlace** que dice algo como:
   ```
   https://tu-proyecto.up.railway.app
   ```
3. **Esa es tu URL del backend**

#### **Opción B: En la pestaña "Settings"**

1. En tu proyecto, ve a la pestaña **"Settings"** o **"Configuración"** (arriba en el menú)
2. Busca la sección **"Domains"** o **"Dominios"**
3. Ahí verás:
   - **Railway Domain:** (URL temporal que Railway te da automáticamente)
   - Ejemplo: `https://tu-proyecto.up.railway.app`

### Paso 3: Verificar que funciona

1. Copia la URL que encontraste
2. Añádele `/api/health` al final
3. Ejemplo: `https://tu-proyecto.up.railway.app/api/health`
4. Abre esa URL en tu navegador
5. Deberías ver algo como:
   ```json
   {
     "status": "OK",
     "message": "Servidor funcionando correctamente",
     "timestamp": "2026-01-10T12:06:00.000Z"
   }
   ```

## ✅ Si NO ves ninguna URL

### Posible razón 1: El servicio no tiene dominio asignado

1. Ve a **Settings** → **Domains**
2. Busca un botón que diga **"Generate Domain"** o **"Generar Dominio"**
3. Click en ese botón
4. Railway generará una URL automáticamente
5. Espera unos segundos y aparecerá la URL

### Posible razón 2: El despliegue aún está en progreso

1. Ve a la pestaña **"Deployments"** o **"Despliegues"**
2. Verifica que el último despliegue dice **"Active"** o **"Activo"** (en verde)
3. Si dice "Building" o "Building..." espera a que termine

### Posible razón 3: Estás en la página incorrecta

1. Asegúrate de estar en la página del **proyecto** (no en el dashboard principal)
2. Click en el nombre del proyecto en la lista de proyectos
3. Luego deberías ver el servicio dentro del proyecto

## 🎯 Ejemplo Visual

```
Railway Dashboard
  └── Mi Proyecto (click aquí)
      └── backend (servicio)
          └── Settings → Domains
              └── Railway Domain: https://abc123.up.railway.app ← ESTA ES TU URL
```

## 📝 Nota Importante

- La URL temporal de Railway tiene este formato: `https://[nombre-random].up.railway.app`
- Esta URL es **permanente** (no cambia a menos que elimines el servicio)
- Puedes usarla para conectar tu frontend
- Más adelante, cuando configures tu dominio personalizado (`api.socialrrss.com`), esta URL seguirá funcionando también

## ❓ ¿Aún no la encuentras?

Si después de seguir estos pasos no encuentras la URL, dime qué ves exactamente en tu pantalla y te ayudo a encontrarla.

