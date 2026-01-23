import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Profile from '../src/models/Profile';
// Importar User para que el populate funcione
import '../src/models/User';

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../.env') });

const DEMO_USER_ID = new mongoose.Types.ObjectId('000000000000000000000000');

const activateSecondProfile = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/promocion-rrss';
    
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');

    // Obtener el perfil que ya está activo
    const activeProfile = await Profile.findOne({ 
      userId: { $ne: DEMO_USER_ID },
      isActive: true 
    }).lean();
    
    if (activeProfile) {
      console.log('✅ Perfil ya activo:');
      console.log(`  - ID: ${activeProfile._id}`);
      console.log(`  - Red social: ${activeProfile.socialNetwork}`);
      console.log(`  - Link: ${activeProfile.link}\n`);
    }

    // Buscar el segundo perfil real más reciente que no esté activo
    const secondProfile = await Profile.findOne({ 
      userId: { $ne: DEMO_USER_ID },
      isActive: false,
      _id: { $ne: activeProfile?._id }
    })
    .populate('userId', 'username email')
    .sort({ createdAt: -1 })
    .lean();
    
    if (!secondProfile) {
      console.log('❌ No se encontró un segundo perfil para activar');
      await mongoose.disconnect();
      process.exit(1);
    }

    const userIdObj = secondProfile.userId as any;
    console.log('📋 Segundo perfil encontrado:');
    console.log(`  - ID: ${secondProfile._id}`);
    console.log(`  - Red social: ${secondProfile.socialNetwork}`);
    console.log(`  - Usuario: ${userIdObj?.username || 'N/A'}`);
    console.log(`  - Email: ${userIdObj?.email || 'N/A'}`);
    console.log(`  - Link: ${secondProfile.link}`);
    console.log(`  - Creado: ${secondProfile.createdAt}`);
    console.log(`  - Actualmente activo: ${secondProfile.isActive}`);
    console.log(`  - Actualmente pagado: ${secondProfile.isPaid}\n`);

    // Activar el perfil
    const profileToUpdate = await Profile.findById(secondProfile._id);
    if (profileToUpdate) {
      profileToUpdate.isActive = true;
      profileToUpdate.isPaid = true;
      profileToUpdate.planType = 'lifetime'; // Asignar plan lifetime para que esté activo permanentemente
      profileToUpdate.paidUntil = null;
      await profileToUpdate.save();
      
      console.log('✅ Perfil activado exitosamente:');
      console.log(`  - ID: ${profileToUpdate._id}`);
      console.log(`  - Activo: ${profileToUpdate.isActive}`);
      console.log(`  - Pagado: ${profileToUpdate.isPaid}`);
      console.log(`  - Plan: ${profileToUpdate.planType}`);
    }

    // Verificar que ahora hay 2 perfiles activos
    const activeCount = await Profile.countDocuments({ 
      userId: { $ne: DEMO_USER_ID },
      isActive: true 
    });
    console.log(`\n✅ Total perfiles REALES ACTIVOS: ${activeCount}`);

    await mongoose.disconnect();
    console.log('\n✅ Desconectado de MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

activateSecondProfile();
