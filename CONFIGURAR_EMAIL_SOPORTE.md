# Configuración del Email de Soporte

Este documento explica cómo configurar el sistema de email de soporte para que funcione correctamente.

## Requisitos

1. Una cuenta de Gmail: `oficialsocialrrss@gmail.com`
2. Una contraseña de aplicación de Gmail (no la contraseña normal de la cuenta)

## Pasos para Configurar

### 1. Habilitar la verificación en dos pasos en Gmail

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. Navega a **Seguridad**
3. Activa la **Verificación en dos pasos** si no está activada

### 2. Generar una contraseña de aplicación

1. Ve a: https://myaccount.google.com/apppasswords
2. O navega a: **Seguridad** > **Verificación en dos pasos** > **Contraseñas de aplicaciones**
3. Selecciona **Aplicación**: "Correo"
4. Selecciona **Dispositivo**: "Otro (nombre personalizado)"
5. Escribe: "Promoción RRSS Backend"
6. Haz clic en **Generar**
7. **Copia la contraseña de 16 caracteres** que aparece (ejemplo: `abcd efgh ijkl mnop`)

### 3. Configurar las variables de entorno

#### En desarrollo local (backend/.env):

```env
SUPPORT_EMAIL=oficialsocialrrss@gmail.com
SUPPORT_EMAIL_PASSWORD=abcdefghijklmnop
```

**IMPORTANTE**: 
- Usa la contraseña de aplicación de 16 caracteres (sin espacios)
- NO uses la contraseña normal de tu cuenta de Gmail
- NO compartas esta contraseña públicamente

#### En producción (Railway/Vercel):

1. Ve a tu proyecto en Railway o Vercel
2. Navega a **Variables de Entorno** o **Environment Variables**
3. Agrega:
   - `SUPPORT_EMAIL` = `oficialsocialrrss@gmail.com`
   - `SUPPORT_EMAIL_PASSWORD` = `[tu contraseña de aplicación de 16 caracteres]`

### 4. Reiniciar el servidor

Después de configurar las variables de entorno:
- **Desarrollo local**: Reinicia el servidor backend (`npm run dev`)
- **Producción**: El servidor se reiniciará automáticamente al hacer deploy

## Verificación

Para verificar que funciona:

1. Ve a la pestaña **Ajustes** > **Soporte**
2. Completa el formulario de soporte
3. Envía el mensaje
4. Deberías recibir un email en `oficialsocialrrss@gmail.com`

## Solución de Problemas

### Error: "El servicio de email no está configurado"
- **Causa**: La variable `SUPPORT_EMAIL_PASSWORD` no está configurada
- **Solución**: Agrega la variable de entorno con la contraseña de aplicación

### Error: "Error de autenticación"
- **Causa**: La contraseña de aplicación es incorrecta o expiró
- **Solución**: Genera una nueva contraseña de aplicación y actualiza `SUPPORT_EMAIL_PASSWORD`

### Error: "Error de conexión"
- **Causa**: Problemas de red o el servidor de Gmail está temporalmente no disponible
- **Solución**: Intenta de nuevo más tarde

## Notas Importantes

- La contraseña de aplicación es diferente a tu contraseña de Gmail
- Las contraseñas de aplicación son específicas por aplicación
- Si cambias la contraseña de tu cuenta de Gmail, las contraseñas de aplicación siguen funcionando
- Puedes tener múltiples contraseñas de aplicación para diferentes servicios
