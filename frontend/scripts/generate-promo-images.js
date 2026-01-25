/**
 * Script para generar imágenes promocionales del carrusel
 * 
 * Instrucciones:
 * 1. Instala puppeteer: npm install puppeteer
 * 2. Ejecuta: node scripts/generate-promo-images.js
 * 3. Las imágenes se guardarán en frontend/public/promo-images/
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const SLIDES = [
    { name: 'slide-1-portada', selector: '.slide-1' },
    { name: 'slide-2-descubre', selector: '.slide-2' },
    { name: 'slide-3-swipe', selector: '.slide-3' },
    { name: 'slide-4-promociona', selector: '.slide-4' },
    { name: 'slide-5-cta', selector: '.slide-5' },
];

async function generateImages() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Establecer tamaño de viewport para Instagram (1080x1080)
    await page.setViewport({
        width: 1080,
        height: 1080,
        deviceScaleFactor: 2 // Para mejor calidad
    });

    // Cargar el archivo HTML
    const htmlPath = path.join(__dirname, '../public/promocion-carrusel.html');
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

    // Crear directorio de salida
    const outputDir = path.join(__dirname, '../public/promo-images');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generar cada slide
    for (const slide of SLIDES) {
        console.log(`Generando ${slide.name}...`);
        
        // Activar solo este slide
        await page.evaluate((selector) => {
            document.querySelectorAll('.slide').forEach(s => {
                s.classList.remove('active');
            });
            const slide = document.querySelector(selector);
            if (slide) {
                slide.classList.add('active');
            }
        }, slide.selector);

        // Esperar a que se renderice
        await page.waitForTimeout(500);

        // Capturar screenshot
        const outputPath = path.join(outputDir, `${slide.name}.png`);
        await page.screenshot({
            path: outputPath,
            width: 1080,
            height: 1080,
            clip: {
                x: 0,
                y: 0,
                width: 1080,
                height: 1080
            }
        });

        console.log(`✅ ${slide.name} guardado en ${outputPath}`);
    }

    await browser.close();
    console.log('\n🎉 ¡Todas las imágenes han sido generadas!');
    console.log(`📁 Ubicación: ${outputDir}`);
}

// Ejecutar
generateImages().catch(console.error);
