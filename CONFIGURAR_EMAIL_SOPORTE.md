# 📧 Configuración del Sistema de Email de Soporte

## ✅ Pasos para Configurar

### 1. Instalar nodemailer

En la carpeta `backend`, ejecuta:

```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

### 2. Configurar Contraseña de Aplicación de Gmail

Para que el sistema pueda enviar emails desde `oficialsocialrrss@gmail.com`, necesitas crear una **Contraseña de Aplicación** de Gmail:

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. Activa la **Verificación en 2 pasos** si no la tienes activada
3. Ve a **Seguridad** → **Contraseñas de aplicaciones**
4. Selecciona "Correo" y "Otro (nombre personalizado)"
5. Escribe "Promoción RRSS Backend"
6. Google te dará una contraseña de 16 caracteres (ejemplo: `abcd efgh ijkl mnop`)
7. **Copia esta contraseña** (sin espacios)

### 3. Añadir Variables de Entorno

En tu archivo `.env` del backend (o en Railway/Vercel), añade:

```env
SUPPORT_EMAIL=oficialsocialrrss@gmail.com
SUPPORT_EMAIL_PASSWORD=tu_contraseña_de_aplicación_de_16_caracteres
```

**⚠️ IMPORTANTE**: 
- NO uses tu contraseña normal de Gmail
- Usa SOLO la contraseña de aplicación que Google te generó
- Mantén esta contraseña segura y no la compartas

### 4. Probar el Sistema

1. Inicia el servidor backend
2. Ve a Ajustes → Soporte en la aplicación
3. Envía un mensaje de prueba
4. Revisa la bandeja de entrada de `oficialsocialrrss@gmail.com`

## 🔧 Solución de Problemas

### Error: "Invalid login"
- Verifica que la contraseña de aplicación sea correcta (sin espacios)
- Asegúrate de que la verificación en 2 pasos esté activada

### Error: "Connection timeout"
- Verifica tu conexión a internet
- Asegúrate de que el puerto 587 (SMTP) no esté bloqueado

### Los emails no llegan
- Revisa la carpeta de spam
- Verifica que `SUPPORT_EMAIL` y `SUPPORT_EMAIL_PASSWORD` estén correctamente configurados
- Revisa los logs del servidor para ver errores específicos

## 📝 Notas

- Los emails se envían a `oficialsocialrrss@gmail.com`
- El sistema incluye información del usuario si está autenticado
- El email de respuesta se configura automáticamente con el email del usuario
