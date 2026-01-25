/**
 * Script mejorado para generar imágenes promocionales y crear ZIP
 * 
 * Instrucciones:
 * 1. npm install puppeteer archiver (en frontend)
 * 2. node scripts/generate-and-zip-promo.js
 */

const puppeteer = require('puppeteer');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

const SLIDES = [
    { name: '01-portada', selector: '.slide-1', title: 'Portada' },
    { name: '02-descubre', selector: '.slide-2', title: 'Descubre Perfiles' },
    { name: '03-swipe', selector: '.slide-3', title: 'Swipe y Explora' },
    { name: '04-promociona', selector: '.slide-4', title: 'Promociona tu Perfil' },
    { name: '05-cta', selector: '.slide-5', title: '¡Empieza Ahora!' },
    { name: '06-promocion', selector: '.slide-6', title: 'Oferta Especial' },
];

async function generateImages() {
    console.log('🚀 Iniciando generación de imágenes...\n');

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
    const absolutePath = path.resolve(htmlPath);
    
    console.log(`📄 Cargando: ${absolutePath}`);
    await page.goto(`file://${absolutePath}`, { waitUntil: 'networkidle0' });

    // Crear directorio de salida
    const outputDir = path.join(__dirname, '../../promo-images');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        console.log(`📁 Directorio creado: ${outputDir}`);
    }

    // Generar cada slide
    const imagePaths = [];
    for (const slide of SLIDES) {
        console.log(`\n📸 Generando ${slide.name} (${slide.title})...`);
        
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
        await new Promise(resolve => setTimeout(resolve, 1000));

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

        imagePaths.push({ path: outputPath, name: `${slide.name}.png` });
        console.log(`✅ ${slide.name}.png guardado`);
    }

    await browser.close();
    console.log('\n✅ Todas las imágenes generadas correctamente');

    // Crear ZIP
    console.log('\n📦 Creando archivo ZIP...');
    const zipPath = path.join(__dirname, '../../promo-images-carrusel.zip');
    await createZip(imagePaths, zipPath, outputDir);
    
    console.log(`\n🎉 ¡Completado!`);
    console.log(`📁 Imágenes: ${outputDir}`);
    console.log(`📦 ZIP: ${zipPath}`);
    console.log(`\n💡 Puedes subir el ZIP a TikTok e Instagram`);
}

function createZip(imagePaths, zipPath, baseDir) {
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', {
            zlib: { level: 9 } // Máxima compresión
        });

        output.on('close', () => {
            console.log(`✅ ZIP creado: ${archive.pointer()} bytes`);
            resolve();
        });

        archive.on('error', (err) => {
            reject(err);
        });

        archive.pipe(output);

        // Agregar cada imagen al ZIP
        imagePaths.forEach(({ path: imagePath, name }) => {
            archive.file(imagePath, { name });
        });

        archive.finalize();
    });
}

// Ejecutar
if (require.main === module) {
    generateImages().catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
}

module.exports = { generateImages };
