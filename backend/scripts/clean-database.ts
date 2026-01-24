import mongoose from 'mongoose';
import User from '../src/models/User';
import Profile from '../src/models/Profile';
import Promotion from '../src/models/Promotion';

async function cleanDatabase() {
  try {
    // Conectar a MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/socialrrss';
    await mongoose.connect(mongoUri);
    console.log('Conectado a MongoDB');

    // 1. Borrar todos los usuarios (excepto el de demo si existe)
    console.log('Borrando todos los usuarios...');
    const usersDeleted = await User.deleteMany({ username: { $ne: 'demo' } });
    console.log(`Usuarios borrados: ${usersDeleted.deletedCount}`);

    // 2. Borrar todas las promociones
    console.log('Borrando todas las promociones...');
    const promotionsDeleted = await Promotion.deleteMany({});
    console.log(`Promociones borradas: ${promotionsDeleted.deletedCount}`);

    // 3. Borrar todos los perfiles que NO sean demo
    console.log('Borrando perfiles no demo...');
    const profilesDeleted = await Profile.deleteMany({
      $or: [
        { _id: { $not: /^demo-/ } },
        { 'userId.username': { $ne: 'demo' } },
        { 'userId._id': { $ne: '000000000000000000000000' } }
      ]
    });
    console.log(`Perfiles borrados: ${profilesDeleted.deletedCount}`);

    // 4. Verificar que queden solo 10 perfiles demo
    const remainingProfiles = await Profile.find({});
    console.log(`Perfiles restantes: ${remainingProfiles.length}`);

    // Mostrar detalle de perfiles restantes
    remainingProfiles.forEach((profile, index) => {
      console.log(`${index + 1}. ${profile._id} - ${profile.socialNetwork} - ${profile.profileData.username || 'Sin nombre'}`);
    });

    console.log('\n✅ Base de datos limpiada exitosamente!');
    console.log('✅ Solo quedan perfiles demo y la base de datos está lista para producción.');

  } catch (error) {
    console.error('❌ Error limpiando la base de datos:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
  }
}

// Ejecutar el script
cleanDatabase();