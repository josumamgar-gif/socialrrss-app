# ✅ Checklist de Despliegue

Usa esta lista para asegurarte de que todo está listo antes de desplegar.

## 📦 Pre-Despliegue

### Backend
- [ ] Crear archivo `backend/.env` con todas las variables de producción
- [ ] Verificar que `PAYPAL_MODE=production`
- [ ] Verificar que todas las credenciales son de PRODUCCIÓN (no sandbox)
- [ ] MongoDB Atlas configurado con whitelist `0.0.0.0/0/0` (permite todas las IPs)
- [ ] Verificar que `FRONTEND_URL=https://socialrrss.com` en `.env`
- [ ] Probar build local: `cd backend && npm run build`

### Frontend
- [ ] Crear archivo `frontend/.env.local` con variables de producción
- [ ] Verificar que `NEXT_PUBLIC_API_URL=https://api.socialrrss.com/api`
- [ ] Verificar credenciales de PayPal y Stripe (producción)
- [ ] Probar build local: `cd frontend && npm run build`
- [ ] Verificar que no hay errores de compilación

### Código
- [ ] Eliminar `console.log` innecesarios
- [ ] Verificar que no hay credenciales hardcodeadas
- [ ] Verificar que `.gitignore` está configurado correctamente
- [ ] Commitear todos los cambios a Git

## 🚀 Despliegue

### Backend
- [ ] Crear proyecto en Railway/Render
- [ ] Conectar repositorio GitHub
- [ ] Configurar todas las variables de entorno
- [ ] Configurar dominio `api.socialrrss.com`
- [ ] Verificar que el build funciona
- [ ] Verificar que el servidor inicia correctamente

### Frontend
- [ ] Crear proyecto en Vercel
- [ ] Conectar repositorio GitHub
- [ ] Configurar root directory: `frontend`
- [ ] Configurar todas las variables de entorno
- [ ] Configurar dominio `socialrrss.com` y `www.socialrrss.com`
- [ ] Verificar que el build funciona

### DNS
- [ ] Configurar registros CNAME/A en tu proveedor de dominio
- [ ] Para `socialrrss.com` → apuntar a Vercel
- [ ] Para `api.socialrrss.com` → apuntar a Railway/Render
- [ ] Esperar propagación DNS (puede tardar hasta 48h)

## ✅ Post-Despliegue

### Verificación
- [ ] Acceder a `https://socialrrss.com` - funciona ✅
- [ ] Acceder a `https://api.socialrrss.com/api/health` - responde OK ✅
- [ ] SSL/HTTPS funcionando (candado verde) ✅
- [ ] Login funciona ✅
- [ ] Registro funciona ✅
- [ ] Crear perfil funciona ✅
- [ ] Subir imágenes funciona ✅
- [ ] PayPal funciona (pago de prueba) ✅
- [ ] Stripe funciona (tarjeta de prueba) ✅
- [ ] Ajustes funciona ✅

### Optimización
- [ ] Activar Analytics en Vercel (opcional)
- [ ] Configurar monitoreo de errores (opcional)
- [ ] Revisar logs para verificar que no hay errores
- [ ] Verificar rendimiento de carga

## 🎯 URLs Finales

Una vez desplegado, verifica:

- Frontend: https://socialrrss.com
- Backend API: https://api.socialrrss.com/api
- Health Check: https://api.socialrrss.com/api/health


