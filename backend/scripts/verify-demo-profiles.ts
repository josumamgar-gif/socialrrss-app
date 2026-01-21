import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Profile from '../src/models/Profile';

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../.env') });

const DEMO_USER_ID = new mongoose.Types.ObjectId('000000000000000000000000');

const verifyDemoProfiles = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/promocion-rrss';
    
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');

    // Obtener todos los perfiles demo
    const demoProfiles = await Profile.find({ userId: DEMO_USER_ID }).lean();

    console.log(`📊 Total perfiles DEMO encontrados: ${demoProfiles.length}\n`);

    if (demoProfiles.length === 0) {
      console.log('⚠️  No hay perfiles demo en la base de datos!');
      console.log('💡 Ejecuta: npm run seed-demo\n');
    } else {
      console.log('✅ Perfiles DEMO encontrados:\n');
      demoProfiles.forEach((p: any, i: number) => {
        const userIdObj = p.userId as any;
        const isDemo = userIdObj?.username === 'demo' || userIdObj?._id?.toString() === '000000000000000000000000';
        
        console.log(`${i + 1}. ${p.socialNetwork.toUpperCase()}`);
        console.log(`   - ID: ${p._id}`);
        console.log(`   - userId: ${p.userId?._id || p.userId}`);
        console.log(`   - Es demo detectado: ${isDemo}`);
        console.log(`   - isActive: ${p.isActive}`);
        console.log(`   - isPaid: ${p.isPaid}`);
        console.log(`   - Link: ${p.link}`);
        console.log(`   - Username/Handle: ${p.profileData?.username || p.profileData?.channelName || p.profileData?.handle || p.profileData?.twitterHandle || 'N/A'}`);
        console.log('');
      });

      // Verificar que todos están activos
      const activeCount = demoProfiles.filter((p: any) => p.isActive === true).length;
      console.log(`✅ Perfiles activos: ${activeCount}/${demoProfiles.length}`);
      
      if (activeCount !== demoProfiles.length) {
        console.log('⚠️  Algunos perfiles demo NO están activos!');
      }
    }

    // Verificar perfiles que el backend devolvería (isActive: true)
    const activeProfiles = await Profile.find({ isActive: true }).lean();

    console.log(`\n📊 Total perfiles ACTIVOS que el backend devolvería: ${activeProfiles.length}`);
    
    const activeDemoCount = activeProfiles.filter((p: any) => {
      const userIdObj = p.userId as any;
      return userIdObj?.username === 'demo' || userIdObj?._id?.toString() === '000000000000000000000000';
    }).length;
    
    console.log(`   - De los cuales son DEMO: ${activeDemoCount}`);
    console.log(`   - De los cuales son REALES: ${activeProfiles.length - activeDemoCount}`);

    await mongoose.disconnect();
    console.log('\n✅ Desconectado de MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

verifyDemoProfiles();
