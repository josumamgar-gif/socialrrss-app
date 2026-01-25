# Instrucciones para Generar Capturas Promocionales

## Opción 1: Usando el Script Automático (Recomendado)

1. **Instalar dependencias:**
   ```bash
   cd frontend
   npm install puppeteer
   ```

2. **Ejecutar el script:**
   ```bash
   node scripts/generate-promo-images.js
   ```

3. **Las imágenes se guardarán en:**
   `frontend/public/promo-images/`

## Opción 2: Captura Manual

1. **Abrir el archivo HTML:**
   - Abre `frontend/public/promocion-carrusel.html` en tu navegador

2. **Para cada slide:**
   - Edita el HTML y cambia la clase `active` a la slide que quieras capturar
   - O usa las herramientas del navegador para ocultar las demás

3. **Capturar:**
   - Usa herramientas como:
     - **Snipping Tool** (Windows)
     - **Screenshot** (extensión del navegador)
     - **htmlcsstoimage.com** (online)
     - **Canva** (importar HTML)

## Opción 3: Usando Herramientas Online

1. Ve a [htmlcsstoimage.com](https://htmlcsstoimage.com)
2. Sube el archivo `promocion-carrusel.html`
3. Configura el tamaño: 1080x1080px
4. Genera las 5 imágenes

## Tamaño Recomendado

- **Instagram Stories/Carrusel:** 1080x1080px
- **Instagram Post:** 1080x1080px
- **Facebook Post:** 1080x1080px

## Contenido de cada Slide

1. **Slide 1 - Portada:** Logo, tagline y subtítulo
2. **Slide 2 - Descubre:** Características principales
3. **Slide 3 - Swipe:** Gestos disponibles
4. **Slide 4 - Promociona:** Beneficios de promoción
5. **Slide 5 - CTA:** Call to action final

## Personalización

Puedes editar `frontend/public/promocion-carrusel.html` para:
- Cambiar colores
- Modificar textos
- Ajustar tamaños
- Agregar más elementos
