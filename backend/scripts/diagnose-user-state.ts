import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/promocion-rrss';

async function diagnoseUserState() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Check promotion availability
    const Promotion = require('../src/models/Promotion').default;
    const User = require('../src/models/User').default;

    console.log('\n🔍 DIAGNÓSTICO DE ESTADO DEL SISTEMA\n');

    // 1. Check promotion usage
    console.log('1️⃣ Estado de promociones:');
    const totalPromotions = await Promotion.countDocuments({ type: 'free_trial_30_days' });
    const activePromotions = await Promotion.countDocuments({
      type: 'free_trial_30_days',
      status: 'active'
    });
    const expiredPromotions = await Promotion.countDocuments({
      type: 'free_trial_30_days',
      status: 'expired'
    });
    const convertedPromotions = await Promotion.countDocuments({
      type: 'free_trial_30_days',
      status: 'converted'
    });

    console.log(`   📊 Total promociones usadas: ${totalPromotions}/100`);
    console.log(`   ✅ Activas: ${activePromotions}`);
    console.log(`   ⏰ Expiradas: ${expiredPromotions}`);
    console.log(`   🔄 Convertidas: ${convertedPromotions}`);
    console.log(`   🎯 Disponibles: ${Math.max(0, 100 - totalPromotions)}`);

    // 2. Check users on promotion
    console.log('\n2️⃣ Usuarios con promoción activa:');
    const usersOnPromotion = await User.countDocuments({ isOnFreePromotion: true });
    console.log(`   👥 Usuarios en promoción: ${usersOnPromotion}`);

    // 3. Check recent promotions
    console.log('\n3️⃣ Promociones recientes:');
    const recentPromotions = await Promotion.find({ type: 'free_trial_30_days' })
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .limit(5);

    recentPromotions.forEach((promo: any, index: number) => {
      console.log(`   ${index + 1}. ${(promo.userId as any)?.username || 'Unknown'} - ${promo.status} (${promo.createdAt.toISOString().split('T')[0]})`);
    });

    // 4. Check pricing API logic
    console.log('\n4️⃣ Lógica de precios:');
    const isFreeAvailable = totalPromotions < 100;
    console.log(`   🎁 Plan gratuito disponible: ${isFreeAvailable}`);
    console.log(`   📈 Spots restantes: ${Math.max(0, 100 - totalPromotions)}`);

    // 5. Check expired promotions that need conversion
    console.log('\n5️⃣ Promociones expiradas pendientes de conversión:');
    const now = new Date();
    const expiredPending = await Promotion.countDocuments({
      status: 'active',
      endDate: { $lt: now }
    });
    console.log(`   ⚠️ Promociones expiradas activas: ${expiredPending}`);

    if (expiredPending > 0) {
      console.log('   🚨 ¡ATENCIÓN! Hay promociones expiradas que necesitan conversión');
      console.log('   💡 Ejecutar: npx ts-node scripts/convert-expired-promotions.ts');
    }

    // 6. Recommendations
    console.log('\n📋 RECOMENDACIONES:');

    if (!isFreeAvailable) {
      console.log('   ❌ La promoción gratuita ya no está disponible (100 usuarios alcanzados)');
    }

    if (expiredPending > 0) {
      console.log('   ⚠️ Ejecutar conversión de promociones expiradas');
    }

    if (usersOnPromotion > 0) {
      console.log(`   ℹ️ ${usersOnPromotion} usuarios tienen promoción activa`);
    }

    console.log('\n🎯 CONCLUSIÓN:');
    if (isFreeAvailable) {
      console.log('   ✅ El sistema funciona correctamente - promoción gratuita disponible');
    } else {
      console.log('   ❌ La promoción gratuita se agotó');
    }

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');

  } catch (error) {
    console.error('❌ Error en diagnóstico:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the diagnostic
diagnoseUserState();