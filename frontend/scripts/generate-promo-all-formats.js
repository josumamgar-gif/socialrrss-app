/**
 * Script para generar imágenes promocionales en múltiples formatos
 * - Formato TikTok (vertical 9:16) - 1080x1920px
 * - Formato Instagram (cuadrado 1:1) - 1080x1080px
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

const FORMATS = [
    { name: 'tiktok', width: 1080, height: 1920, folder: 'tiktok' },
    { name: 'instagram', width: 1080, height: 1080, folder: 'instagram' },
];

async function generateImages() {
    console.log('🚀 Iniciando generación de imágenes en múltiples formatos...\n');

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const htmlPath = path.join(__dirname, '../public/promocion-carrusel.html');
    const absolutePath = path.resolve(htmlPath);
    
    console.log(`📄 Cargando: ${absolutePath}\n`);

    const allImagePaths = [];

    // Generar para cada formato
    for (const format of FORMATS) {
        console.log(`\n📐 Generando formato ${format.name.toUpperCase()} (${format.width}x${format.height})...`);
        console.log('='.repeat(60));

        const page = await browser.newPage();
        
        await page.setViewport({
            width: format.width,
            height: format.height,
            deviceScaleFactor: 2
        });

        await page.goto(`file://${absolutePath}`, { waitUntil: 'networkidle0' });

        // Ajustar el contenedor al formato
        await page.evaluate((width, height) => {
            const container = document.querySelector('.carousel-container');
            if (container) {
                container.style.width = `${width}px`;
                container.style.height = `${height}px`;
            }
        }, format.width, format.height);

        // Crear directorio de salida
        const outputDir = path.join(__dirname, '../../promo-images', format.folder);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Generar cada slide
        for (const slide of SLIDES) {
            console.log(`  📸 ${slide.name} (${slide.title})...`);
            
            await page.evaluate((selector) => {
                document.querySelectorAll('.slide').forEach(s => {
                    s.classList.remove('active');
                });
                const slide = document.querySelector(selector);
                if (slide) {
                    slide.classList.add('active');
                }
            }, slide.selector);

            await new Promise(resolve => setTimeout(resolve, 1000));

            const outputPath = path.join(outputDir, `${slide.name}.png`);
            await page.screenshot({
                path: outputPath,
                width: format.width,
                height: format.height,
                clip: {
                    x: 0,
                    y: 0,
                    width: format.width,
                    height: format.height
                }
            });

            allImagePaths.push({ 
                path: outputPath, 
                name: `${format.folder}/${slide.name}.png`,
                format: format.name
            });
            console.log(`    ✅ ${slide.name}.png`);
        }

        await page.close();
        console.log(`\n✅ Formato ${format.name} completado\n`);
    }

    await browser.close();

    // Crear ZIPs separados para cada formato
    console.log('\n📦 Creando archivos ZIP...');
    console.log('='.repeat(60));

    for (const format of FORMATS) {
        const formatImages = allImagePaths.filter(img => img.format === format.name);
        const zipPath = path.join(__dirname, `../../promo-images-${format.name}.zip`);
        
        await createZip(formatImages, zipPath);
        console.log(`✅ ${format.name.toUpperCase()}: promo-images-${format.name}.zip`);
    }

    // Crear ZIP combinado
    const combinedZipPath = path.join(__dirname, '../../promo-images-todos.zip');
    await createZip(allImagePaths, combinedZipPath);
    console.log(`✅ COMBINADO: promo-images-todos.zip\n`);

    console.log('🎉 ¡Completado!');
    console.log(`📁 Imágenes: ${path.join(__dirname, '../../promo-images')}`);
    console.log(`\n📦 Archivos ZIP generados:`);
    console.log(`   - promo-images-tiktok.zip (formato vertical)`);
    console.log(`   - promo-images-instagram.zip (formato cuadrado)`);
    console.log(`   - promo-images-todos.zip (ambos formatos)`);
}

function createZip(imagePaths, zipPath) {
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        output.on('close', () => {
            resolve();
        });

        archive.on('error', (err) => {
            reject(err);
        });

        archive.pipe(output);

        imagePaths.forEach(({ path: imagePath, name }) => {
            archive.file(imagePath, { name });
        });

        archive.finalize();
    });
}

if (require.main === module) {
    generateImages().catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
}

module.exports = { generateImages };
