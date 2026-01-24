import mongoose from 'mongoose';
import User from '../src/models/User';
import Profile from '../src/models/Profile';
import Promotion from '../src/models/Promotion';

async function checkCleanDatabase() {
  try {
    // Conectar a MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/socialrrss';
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB');

    // Verificar usuarios
    const users = await User.find({});
    console.log(`👥 Usuarios en la base de datos: ${users.length}`);
    users.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.username} (${user.email})`);
    });

    // Verificar perfiles
    const profiles = await Profile.find({});
    console.log(`📄 Perfiles en la base de datos: ${profiles.length}`);
    profiles.forEach((profile, index) => {
      const username = profile.profileData?.username || 'Sin nombre';
      console.log(`  ${index + 1}. ${profile._id} - ${profile.socialNetwork} - ${username}`);
    });

    // Verificar promociones
    const promotions = await Promotion.find({});
    console.log(`🎯 Promociones en la base de datos: ${promotions.length}`);

    if (users.length === 0 && profiles.length <= 10 && promotions.length === 0) {
      console.log('\n🎉 ¡Base de datos completamente limpia y lista para producción!');
      console.log('✅ No hay usuarios registrados');
      console.log('✅ Solo perfiles demo (máximo 10)');
      console.log('✅ Sin promociones activas');
    } else {
      console.log('\n⚠️  La base de datos no está completamente limpia:');
      if (users.length > 0) console.log(`  - ${users.length} usuarios restantes`);
      if (profiles.length > 10) console.log(`  - ${profiles.length} perfiles (deberían ser máximo 10)`);
      if (promotions.length > 0) console.log(`  - ${promotions.length} promociones activas`);
    }

  } catch (error) {
    console.error('❌ Error verificando la base de datos:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
  }
}

// Ejecutar el script
checkCleanDatabase();