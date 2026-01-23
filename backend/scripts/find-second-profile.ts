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

const findSecondProfile = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/promocion-rrss';
    
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');

    // Obtener todos los pagos
    const allPayments = await Payment.find({}).lean();
    console.log(`💳 Total pagos: ${allPayments.length}\n`);
    
    if (allPayments.length > 0) {
      console.log('📋 Todos los pagos:');
      for (const payment of allPayments) {
        const profile = await Profile.findById(payment.profileId).populate('userId', 'username email').lean();
        if (profile) {
          const userIdObj = profile.userId as any;
          const isDemo = userIdObj?.username === 'demo' || userIdObj?._id?.toString() === '000000000000000000000000';
          
          if (!isDemo) {
            console.log(`  - Pago ID: ${payment._id}`);
            console.log(`    Estado: ${payment.status}`);
            console.log(`    Método: ${payment.paymentMethod}`);
            console.log(`    Plan: ${payment.planType}`);
            console.log(`    Perfil ID: ${profile._id}`);
            console.log(`    Red social: ${profile.socialNetwork}`);
            console.log(`    Activo: ${profile.isActive}`);
            console.log(`    Pagado: ${profile.isPaid}`);
            console.log(`    Usuario: ${userIdObj?.username || 'N/A'}`);
            console.log(`    Link: ${profile.link}`);
            console.log('');
          }
        }
      }
    }

    // Buscar perfiles reales que tienen isPaid=true pero isActive=false
    const paidButInactive = await Profile.find({ 
      userId: { $ne: DEMO_USER_ID },
      isPaid: true,
      isActive: false
    }).populate('userId', 'username email').lean();
    
    if (paidButInactive.length > 0) {
      console.log(`\n⚠️  Perfiles PAGADOS pero INACTIVOS: ${paidButInactive.length}`);
      paidButInactive.forEach((p: any, i: number) => {
        const userIdObj = p.userId as any;
        console.log(`  ${i + 1}. ${p.socialNetwork.toUpperCase()}`);
        console.log(`     - ID: ${p._id}`);
        console.log(`     - Usuario: ${userIdObj?.username || 'N/A'}`);
        console.log(`     - Plan: ${p.planType || 'N/A'}`);
        console.log(`     - Link: ${p.link}`);
        console.log('');
      });
    }

    // Buscar perfiles reales que deberían estar activos (tienen pagos completados pero no están activos)
    const completedPayments = await Payment.find({ status: 'completed' }).lean();
    console.log(`\n✅ Pagos completados: ${completedPayments.length}`);
    
    for (const payment of completedPayments) {
      const profile = await Profile.findById(payment.profileId).populate('userId', 'username email').lean();
      if (profile) {
        const userIdObj = profile.userId as any;
        const isDemo = userIdObj?.username === 'demo' || userIdObj?._id?.toString() === '000000000000000000000000';
        
        if (!isDemo && !profile.isActive) {
          console.log(`\n⚠️  PERFIL CON PAGO COMPLETADO PERO INACTIVO:`);
          console.log(`  - Perfil ID: ${profile._id}`);
          console.log(`  - Red social: ${profile.socialNetwork}`);
          console.log(`  - Usuario: ${userIdObj?.username || 'N/A'}`);
          console.log(`  - Link: ${profile.link}`);
          console.log(`  - Pago ID: ${payment._id}`);
        }
      }
    }

    await mongoose.disconnect();
    console.log('\n✅ Desconectado de MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

findSecondProfile();
