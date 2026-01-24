import mongoose from 'mongoose';
import Profile from '../src/models/Profile';

async function checkDemoProfiles() {
  try {
    // Conectar a MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/socialrrss';
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB');

    // Buscar perfiles demo
    const demoProfiles = await Profile.find({
      $or: [
        { _id: { $regex: /^demo-/ } },
        { 'userId.username': 'demo' },
        { 'userId._id': '000000000000000000000000' }
      ]
    });

    console.log(`📄 Perfiles demo encontrados: ${demoProfiles.length}`);

    if (demoProfiles.length === 0) {
      console.log('⚠️  No hay perfiles demo. Ejecutar populate-demo-profiles.ts');
    } else {
      console.log('Perfiles demo disponibles:');
      demoProfiles.forEach((profile, index) => {
        const username = profile.profileData?.username || profile.profileData?.channelName || 'Sin nombre';
        console.log(`  ${index + 1}. ${profile._id} - ${profile.socialNetwork} - ${username}`);
      });
    }

    // También verificar perfiles reales
    const realProfiles = await Profile.find({
      $and: [
        { _id: { $not: { $regex: /^demo-/ } } },
        { 'userId.username': { $ne: 'demo' } },
        { 'userId._id': { $ne: '000000000000000000000000' } }
      ]
    });

    console.log(`👥 Perfiles reales encontrados: ${realProfiles.length}`);

  } catch (error) {
    console.error('❌ Error verificando perfiles:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

// Ejecutar verificación
checkDemoProfiles();