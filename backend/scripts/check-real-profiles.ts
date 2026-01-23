import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Profile from '../src/models/Profile';
import Payment from '../src/models/Payment';
// Importar User para que el populate funcione
import '../src/models/User';

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../.env') });

const DEMO_USER_ID = new mongoose.Types.ObjectId('000000000000000000000000');

const checkRealProfiles = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/promocion-rrss';
    
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');

    // Obtener todos los perfiles reales
    const realProfiles = await Profile.find({ 
      userId: { $ne: DEMO_USER_ID } 
    }).populate('userId', 'username email').lean();
    
    console.log(`📊 Total perfiles REALES: ${realProfiles.length}\n`);

    // Verificar pagos completados
    const completedPayments = await Payment.find({ 
      status: 'completed' 
    }).lean();
    
    console.log(`💳 Pagos completados: ${completedPayments.length}`);
    
    if (completedPayments.length > 0) {
      console.log('\n📋 Perfiles con pagos completados:');
      for (const payment of completedPayments) {
        const profile = await Profile.findById(payment.profileId).lean();
        if (profile) {
          const userIdObj = profile.userId as any;
          const isDemo = userIdObj?.username === 'demo' || userIdObj?._id?.toString() === '000000000000000000000000';
          
          if (!isDemo) {
            console.log(`  - Perfil ID: ${profile._id}`);
            console.log(`    Red social: ${profile.socialNetwork}`);
            console.log(`    Activo: ${profile.isActive}`);
            console.log(`    Pagado: ${profile.isPaid}`);
            console.log(`    Plan: ${profile.planType || 'N/A'}`);
            console.log(`    Pago ID: ${payment._id}`);
            console.log(`    Estado pago: ${payment.status}`);
            console.log('');
          }
        }
      }
    }

    // Contar perfiles reales activos
    const realActiveCount = await Profile.countDocuments({ 
      userId: { $ne: DEMO_USER_ID },
      isActive: true 
    });
    console.log(`✅ Perfiles REALES ACTIVOS: ${realActiveCount}`);

    // Mostrar detalles de perfiles reales activos
    if (realActiveCount > 0) {
      const activeRealProfiles = await Profile.find({ 
        userId: { $ne: DEMO_USER_ID },
        isActive: true 
      }).populate('userId', 'username email').lean();
      
      console.log('\n📋 Detalles de perfiles reales ACTIVOS:');
      activeRealProfiles.forEach((p: any, i: number) => {
        const userIdObj = p.userId as any;
        console.log(`  ${i + 1}. ${p.socialNetwork.toUpperCase()}`);
        console.log(`     - ID: ${p._id}`);
        console.log(`     - Usuario: ${userIdObj?.username || 'N/A'}`);
        console.log(`     - Email: ${userIdObj?.email || 'N/A'}`);
        console.log(`     - Pagado: ${p.isPaid}`);
        console.log(`     - Plan: ${p.planType || 'N/A'}`);
        console.log(`     - Link: ${p.link}`);
        console.log('');
      });
    }

    await mongoose.disconnect();
    console.log('✅ Desconectado de MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

checkRealProfiles();
