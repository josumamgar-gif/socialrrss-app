# 📱 Ver la Web en el Móvil (Local)

## ✅ Paso 1: Asegúrate de que los servidores están corriendo

Abre dos terminales:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Debería decir: `🚀 Servidor corriendo en http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Debería decir: `Ready on http://localhost:3000`

---

## ✅ Paso 2: Asegúrate de que están en la misma WiFi

- Tu ordenador y tu móvil deben estar conectados a la **misma red WiFi**
- Ejemplo: Ambos conectados a "Mi_WiFi_Casa"

---

## ✅ Paso 3: Accede desde el móvil

### Tu IP local es: `192.168.1.60`

Abre el navegador en tu móvil y escribe:

```
http://192.168.1.60:3000
```

**¡Eso es todo!** Ya deberías ver tu aplicación.

---

## 🔧 Si NO funciona:

### Problema 1: "No se puede conectar"

**Solución:**
- Verifica que ambos están en la misma WiFi
- Verifica que el firewall de Windows no está bloqueando
- Prueba desactivar temporalmente el firewall

### Problema 2: "Se conecta pero no carga nada"

**Solución:**
- El backend también debe ser accesible desde el móvil
- En tu móvil, abre: `http://192.168.1.60:5000/api/health`
- Si no carga, el backend no es accesible externamente

### Problema 3: El frontend se conecta pero no puede hablar con el backend

**Solución rápida (temporal):**
1. En el móvil, abre la consola del navegador (si es posible)
2. O mejor: modifica temporalmente el código para usar la IP

Pero como dijiste "sin tocar código", la mejor opción es:

---

## 🎯 Método Recomendado: Usar ngrok (Túnel Gratuito)

Si no funciona con la IP local, usa **ngrok** (crea un túnel público):

1. **Descarga ngrok**: https://ngrok.com/download
2. **Instálalo**
3. **Ejecuta DOS túneles** (uno para frontend, otro para backend):
   ```bash
   # Terminal 1: Frontend
   ngrok http 3000
   
   # Terminal 2: Backend  
   ngrok http 5000
   ```
4. **Obtendrás dos URLs públicas:**
   - Frontend: `https://abc123.ngrok.io`
   - Backend: `https://xyz789.ngrok.io`
5. **Actualiza `.env.local`** en frontend:
   ```
   NEXT_PUBLIC_API_URL=https://xyz789.ngrok.io/api
   ```
6. **Reinicia el frontend** (`npm run dev`)
7. **Abre la URL del frontend en tu móvil**

**Ventajas:**
- ✅ Funciona desde cualquier red
- ✅ Es HTTPS (más seguro)
- ✅ No necesitas estar en la misma WiFi
- ✅ Es gratis

---

## 📝 Resumen Rápido:

**Método 1 (Misma WiFi):**
```
http://192.168.1.60:3000
```

**Método 2 (ngrok - Cualquier red):**
```
1. Instala ngrok
2. ngrok http 3000
3. Usa la URL que te da
```

