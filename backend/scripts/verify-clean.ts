import mongoose from 'mongoose';
import User from '../src/models/User';
import Profile from '../src/models/Profile';
import Promotion from '../src/models/Promotion';

async function verifyClean() {
  try {
    // Conectar a MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/socialrrss';
    await mongoose.connect(mongoUri);
    console.log('🔍 Verificando estado de limpieza de MongoDB...');

    // Contar documentos en cada colección
    const userCount = await User.countDocuments({});
    const profileCount = await Profile.countDocuments({});
    const promotionCount = await Promotion.countDocuments({});

    console.log('\n📊 ESTADO ACTUAL DE LA BASE DE DATOS:');
    console.log(`👥 Usuarios: ${userCount}`);
    console.log(`📄 Perfiles: ${profileCount}`);
    console.log(`🎯 Promociones: ${promotionCount}`);

    if (userCount === 0 && profileCount === 0 && promotionCount === 0) {
      console.log('\n🎯 ✅ BASE DE DATOS COMPLETAMENTE LIMPIA');
      console.log('🚀 LISTA PARA PRODUCCIÓN');
      console.log('💡 PRÓXIMOS PASOS:');
      console.log('   1. Ejecutar populate-demo-profiles.ts para añadir perfiles demo');
      console.log('   2. Probar registro de nuevos usuarios');
      console.log('   3. Verificar que todo funciona correctamente');
    } else {
      console.log('\n⚠️  ⚠️  BASE DE DATOS NO ESTÁ LIMPIA ⚠️  ⚠️');
      console.log('🔥 Ejecutar nuke-database.ts nuevamente');
    }

  } catch (error) {
    console.error('❌ Error verificando base de datos:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

// Ejecutar verificación
verifyClean();