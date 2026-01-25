# 🎨 Generar Imágenes Promocionales para Redes Sociales

## ⚡ Método Rápido (Recomendado)

### Paso 1: Instalar dependencias
```bash
cd frontend
npm install puppeteer archiver
```

### Paso 2: Generar imágenes y crear ZIP
```bash
node scripts/generate-and-zip-promo.js
```

### Paso 3: Encontrar el ZIP
El archivo `promo-images-carrusel.zip` estará en la **raíz del proyecto** (carpeta CURSOR)

## 📱 Contenido del ZIP

El ZIP contiene 5 imágenes en formato PNG (1080x1080px):
1. `01-portada.png` - Portada con logo y tagline
2. `02-descubre.png` - Características principales
3. `03-swipe.png` - Gestos disponibles
4. `04-promociona.png` - Beneficios de promoción
5. `05-cta.png` - Call to action final

## 🚀 Subir a Redes Sociales

### Instagram:
1. Abre Instagram
2. Crea una nueva publicación
3. Selecciona "Carrusel"
4. Sube las 5 imágenes en orden (01 a 05)
5. Agrega descripción y hashtags

### TikTok:
1. Abre TikTok
2. Crea un nuevo video
3. Usa las imágenes como frames de un video
4. O crea un carrusel de imágenes

## 🎨 Personalizar

Si quieres cambiar los textos o colores, edita:
`frontend/public/promocion-carrusel.html`

Luego vuelve a ejecutar el script para regenerar las imágenes.

## ⚠️ Si no tienes Node.js instalado

Puedes usar herramientas online:
1. Ve a [htmlcsstoimage.com](https://htmlcsstoimage.com)
2. Abre `frontend/public/promocion-carrusel.html` en tu navegador
3. Para cada slide, cambia la clase `active` en el HTML
4. Captura cada slide manualmente
5. Crea un ZIP con las 5 imágenes
