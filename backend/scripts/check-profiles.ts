import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Profile from '../src/models/Profile';

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../.env') });

const DEMO_USER_ID = new mongoose.Types.ObjectId('000000000000000000000000');

const checkProfiles = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/promocion-rrss';
    
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');

    // Contar perfiles demo
    const demoCount = await Profile.countDocuments({ userId: DEMO_USER_ID });
    console.log(`📊 Perfiles DEMO: ${demoCount}`);

    // Contar perfiles reales (no demo)
    const realCount = await Profile.countDocuments({ 
      userId: { $ne: DEMO_USER_ID } 
    });
    console.log(`📊 Perfiles REALES (total): ${realCount}`);

    // Contar perfiles reales activos
    const realActiveCount = await Profile.countDocuments({ 
      userId: { $ne: DEMO_USER_ID },
      isActive: true 
    });
    console.log(`✅ Perfiles REALES ACTIVOS: ${realActiveCount}`);

    // Contar perfiles reales inactivos
    const realInactiveCount = await Profile.countDocuments({ 
      userId: { $ne: DEMO_USER_ID },
      isActive: false 
    });
    console.log(`⏸️  Perfiles REALES INACTIVOS: ${realInactiveCount}\n`);

    // Mostrar detalles de perfiles reales
    if (realCount > 0) {
      const realProfiles = await Profile.find({ 
        userId: { $ne: DEMO_USER_ID } 
      }).select('socialNetwork isActive isPaid createdAt').lean();
      
      console.log('📋 Detalles de perfiles reales:');
      realProfiles.forEach((p: any, i: number) => {
        console.log(`  ${i + 1}. ${p.socialNetwork} - Activo: ${p.isActive} - Pagado: ${p.isPaid} - Creado: ${p.createdAt}`);
      });
    }

    // Contar total activos (demo + reales)
    const totalActive = await Profile.countDocuments({ isActive: true });
    console.log(`\n📊 TOTAL PERFILES ACTIVOS (demo + reales): ${totalActive}`);

    await mongoose.disconnect();
    console.log('\n✅ Desconectado de MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

checkProfiles();
