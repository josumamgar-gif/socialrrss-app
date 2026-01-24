import mongoose from 'mongoose';
import User from '../src/models/User';
import Profile from '../src/models/Profile';
import Promotion from '../src/models/Promotion';

async function nukeDatabase() {
  try {
    // Conectar a MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/socialrrss';
    await mongoose.connect(mongoUri);
    console.log('🔥 Conectado a MongoDB - INICIANDO NUCLEARIZACIÓN TOTAL');

    // 1. BORRAR TODOS LOS USUARIOS SIN EXCEPCIÓN
    console.log('💥 Eliminando TODOS los usuarios...');
    const usersDeleted = await User.deleteMany({});
    console.log(`💀 Usuarios eliminados: ${usersDeleted.deletedCount}`);

    // 2. BORRAR TODOS LOS PERFILES SIN EXCEPCIÓN
    console.log('💥 Eliminando TODOS los perfiles...');
    const profilesDeleted = await Profile.deleteMany({});
    console.log(`💀 Perfiles eliminados: ${profilesDeleted.deletedCount}`);

    // 3. BORRAR TODAS LAS PROMOCIONES SIN EXCEPCIÓN
    console.log('💥 Eliminando TODAS las promociones...');
    const promotionsDeleted = await Promotion.deleteMany({});
    console.log(`💀 Promociones eliminadas: ${promotionsDeleted.deletedCount}`);

    // 4. Verificar que todo esté vacío
    const remainingUsers = await User.countDocuments({});
    const remainingProfiles = await Profile.countDocuments({});
    const remainingPromotions = await Promotion.countDocuments({});

    console.log('\n📊 ESTADO FINAL DE LA BASE DE DATOS:');
    console.log(`👥 Usuarios restantes: ${remainingUsers}`);
    console.log(`📄 Perfiles restantes: ${remainingProfiles}`);
    console.log(`🎯 Promociones restantes: ${remainingPromotions}`);

    if (remainingUsers === 0 && remainingProfiles === 0 && remainingPromotions === 0) {
      console.log('\n🎯 ¡BASE DE DATOS COMPLETAMENTE NUCLEARIZADA!');
      console.log('✅ CERO usuarios');
      console.log('✅ CERO perfiles');
      console.log('✅ CERO promociones');
      console.log('🚀 LISTA PARA PRODUCCIÓN DESDE CERO');
    } else {
      console.log('\n⚠️  ALGO QUEDÓ - VERIFICAR:');
      if (remainingUsers > 0) console.log(`  - ${remainingUsers} usuarios restantes`);
      if (remainingProfiles > 0) console.log(`  - ${remainingProfiles} perfiles restantes`);
      if (remainingPromotions > 0) console.log(`  - ${remainingPromotions} promociones restantes`);
    }

  } catch (error) {
    console.error('❌ Error nuclearizando la base de datos:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

// Ejecutar el script
nukeDatabase();