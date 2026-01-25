import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Profile from '../src/models/Profile';

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../.env') });

const DEMO_USER_ID = new mongoose.Types.ObjectId('000000000000000000000000');

const deleteInactiveProfiles = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/promocion-rrss';
    
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');

    // Contar perfiles inactivos antes de borrar
    const inactiveCount = await Profile.countDocuments({ 
      isActive: false,
      userId: { $ne: DEMO_USER_ID } // No borrar perfiles demo
    });
    
    console.log(`📊 Perfiles inactivos encontrados: ${inactiveCount}`);

    if (inactiveCount === 0) {
      console.log('✅ No hay perfiles inactivos para borrar');
      await mongoose.disconnect();
      process.exit(0);
      return;
    }

    // Mostrar detalles de los perfiles que se van a borrar
    const inactiveProfiles = await Profile.find({ 
      isActive: false,
      userId: { $ne: DEMO_USER_ID }
    }).select('socialNetwork isPaid createdAt link').lean();
    
    console.log('\n📋 Perfiles que se van a borrar:');
    inactiveProfiles.forEach((p: any, i: number) => {
      console.log(`  ${i + 1}. ${p.socialNetwork} - Pagado: ${p.isPaid} - Creado: ${p.createdAt} - Link: ${p.link}`);
    });

    // Borrar perfiles inactivos
    console.log('\n🗑️  Borrando perfiles inactivos...');
    const result = await Profile.deleteMany({ 
      isActive: false,
      userId: { $ne: DEMO_USER_ID }
    });
    
    console.log(`✅ Perfiles inactivos borrados: ${result.deletedCount}`);

    // Verificar perfiles restantes
    const remainingRealCount = await Profile.countDocuments({ 
      userId: { $ne: DEMO_USER_ID } 
    });
    const remainingDemoCount = await Profile.countDocuments({ 
      userId: DEMO_USER_ID 
    });
    const remainingActiveCount = await Profile.countDocuments({ 
      isActive: true 
    });
    const remainingPaidCount = await Profile.countDocuments({ 
      isPaid: true 
    });

    console.log('\n📊 Resumen de perfiles restantes:');
    console.log(`   Perfiles DEMO: ${remainingDemoCount}`);
    console.log(`   Perfiles REALES (total): ${remainingRealCount}`);
    console.log(`   Perfiles ACTIVOS: ${remainingActiveCount}`);
    console.log(`   Perfiles PAGADOS: ${remainingPaidCount}`);

    await mongoose.disconnect();
    console.log('\n✅ Desconectado de MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

deleteInactiveProfiles();
