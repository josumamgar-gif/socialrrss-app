# Guía de Configuración de Cloudinary

## Paso 1: Crear Cuenta en Cloudinary

1. Ve a [https://cloudinary.com](https://cloudinary.com)
2. Haz clic en **"Sign Up for Free"**
3. Completa el formulario de registro
4. Verifica tu email si es necesario

## Paso 2: Obtener Credenciales

Una vez dentro del Dashboard de Cloudinary:

1. Ve a **Dashboard** (deberías verlo automáticamente al iniciar sesión)
2. En la parte superior verás tu **Cloud Name** (ejemplo: `d123456789`)
3. Haz clic en **"Account Details"** o busca la sección de credenciales
4. Copia las siguientes credenciales:
   - **Cloud Name** (ejemplo: `d123456789`)
   - **API Key** (ejemplo: `123456789012345`)
   - **API Secret** (ejemplo: `abcdefghijklmnopqrstuvwxyz123456`)

⚠️ **IMPORTANTE**: Mantén el **API Secret** seguro y nunca lo compartas públicamente.

## Paso 3: Configurar Variables de Entorno en Railway

1. Ve a tu proyecto en [Railway](https://railway.app)
2. Selecciona tu servicio de backend
3. Ve a la pestaña **"Variables"**
4. Haz clic en **"New Variable"** y añade las siguientes variables:

```
CLOUDINARY_CLOUD_NAME=tu_cloud_name_aqui
CLOUDINARY_API_KEY=tu_api_key_aqui
CLOUDINARY_API_SECRET=tu_api_secret_aqui
```

**Ejemplo:**
```
CLOUDINARY_CLOUD_NAME=d123456789
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

5. Guarda los cambios. Railway reiniciará automáticamente tu servicio.

## Paso 4: Configurar Variables de Entorno Localmente (Opcional)

Si quieres probar localmente, crea o actualiza el archivo `.env` en la carpeta `backend/`:

```env
CLOUDINARY_CLOUD_NAME=tu_cloud_name_aqui
CLOUDINARY_API_KEY=tu_api_key_aqui
CLOUDINARY_API_SECRET=tu_api_secret_aqui
```

## Paso 5: Verificar la Configuración

1. Despliega los cambios en Railway
2. Intenta crear un perfil con imágenes
3. Verifica en el Dashboard de Cloudinary que las imágenes se suban correctamente
4. Las imágenes deberían aparecer en la carpeta `profiles/` en Cloudinary

## Características de Cloudinary

✅ **Optimización automática**: Las imágenes se optimizan automáticamente
✅ **CDN global**: Las imágenes se sirven desde servidores cercanos al usuario
✅ **Transformaciones**: Puedes redimensionar, recortar y cambiar formato automáticamente
✅ **Formato automático**: Cloudinary detecta el mejor formato (WebP, AVIF, etc.) para cada navegador

## Límites del Plan Gratuito

- ✅ **25 GB** de almacenamiento
- ✅ **25 GB** de ancho de banda/mes
- ✅ Transformaciones ilimitadas
- ✅ CDN incluido

## Solución de Problemas

### Error: "Invalid API Key"
- Verifica que las variables de entorno estén correctamente escritas
- Asegúrate de que no haya espacios extra al inicio o final
- Reinicia el servicio en Railway después de añadir las variables

### Error: "Cloud name not found"
- Verifica que el Cloud Name sea correcto (sin espacios ni caracteres especiales)
- Asegúrate de que la variable se llame exactamente `CLOUDINARY_CLOUD_NAME`

### Las imágenes no se suben
- Revisa los logs de Railway para ver errores específicos
- Verifica que las credenciales sean correctas en el Dashboard de Cloudinary
- Asegúrate de que el servicio se haya reiniciado después de añadir las variables

## Próximos Pasos

Una vez configurado Cloudinary:
1. ✅ Las imágenes se almacenarán permanentemente
2. ✅ No se perderán al reiniciar el servidor
3. ✅ Se optimizarán automáticamente
4. ✅ Se servirán desde una CDN rápida

¡Listo! Tu aplicación ahora usa Cloudinary para almacenar imágenes de forma persistente.
