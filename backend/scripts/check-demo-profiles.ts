import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Profile from '../src/models/Profile';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/promocion-rrss';

async function checkDemoProfiles() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    console.log('\n🔍 Perfiles DEMO en base de datos:');

    // Find demo profiles
    const DEMO_USER_ID = '000000000000000000000000';

    const demoProfiles = await Profile.find({
      userId: DEMO_USER_ID
    }).select('_id socialNetwork profileData.username profileData.channelName isActive createdAt');

    demoProfiles.forEach((p, i) => {
      console.log(`${i+1}. ${p.socialNetwork} - ${p.profileData.username || p.profileData.channelName} (ID: ${p._id}) - Activo: ${p.isActive}`);
    });

    console.log(`\n📊 Total perfiles demo encontrados: ${demoProfiles.length}`);

    // Group by social network
    const byNetwork = demoProfiles.reduce((acc, p) => {
      acc[p.socialNetwork] = (acc[p.socialNetwork] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('\n📈 Distribución por red social:');
    Object.entries(byNetwork).forEach(([network, count]) => {
      console.log(`   ${network}: ${count} perfiles`);
    });

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');

  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the check
checkDemoProfiles();