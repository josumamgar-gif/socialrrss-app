import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User';
import Promotion from '../src/models/Promotion';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/promocion-rrss';

async function testPromotionFlow() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    console.log('\n🧪 PRUEBA DEL FLUJO DE PROMOCIÓN GRATUITA\n');

    // Test 1: Check promotion availability
    console.log('1️⃣ Verificando disponibilidad de promoción...');
    const usedPromotionsCount = await Promotion.countDocuments({
      type: 'free_trial_30_days',
      status: { $in: ['active', 'expired', 'converted'] }
    });
    const isAvailable = usedPromotionsCount < 100;
    console.log(`   📊 Promociones usadas: ${usedPromotionsCount}/100`);
    console.log(`   ✅ Disponible: ${isAvailable}`);

    // Test 2: Create test user (simulate registration)
    console.log('\n2️⃣ Creando usuario de prueba...');
    const testUser = new User({
      username: `testuser_${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      password: 'testpassword123',
      fullName: 'Usuario de Prueba',
    });

    await testUser.save();
    console.log(`   ✅ Usuario creado: ${testUser.username} (${testUser._id})`);

    // Test 3: Check if promotion was automatically applied
    console.log('\n3️⃣ Verificando aplicación automática de promoción...');
    const userAfterSave = await User.findById(testUser._id);
    const promotion = await Promotion.findOne({ userId: testUser._id });

    if (userAfterSave?.isOnFreePromotion && promotion) {
      console.log('   ✅ Promoción aplicada automáticamente');
      console.log(`   📅 Fecha inicio: ${promotion.startDate}`);
      console.log(`   📅 Fecha fin: ${promotion.endDate}`);
      console.log(`   ⏰ Estado: ${promotion.status}`);
      console.log(`   📊 Uso: ${promotion.usageCount}/100`);
    } else {
      console.log('   ❌ No se aplicó la promoción automáticamente');
    }

    // Test 4: Check pricing plans response
    console.log('\n4️⃣ Verificando respuesta de planes de precio...');
    // This would be tested via API call, but we can check the logic
    const totalPromotions = await Promotion.countDocuments({ type: 'free_trial_30_days' });
    console.log(`   📊 Total promociones en BD: ${totalPromotions}`);
    console.log(`   🎯 Plan gratuito debería estar disponible: ${totalPromotions < 100}`);

    // Test 5: Clean up test data
    console.log('\n5️⃣ Limpiando datos de prueba...');
    await Promotion.deleteMany({ userId: testUser._id });
    await User.deleteMany({ _id: testUser._id });
    console.log('   ✅ Datos de prueba eliminados');

    console.log('\n🎉 PRUEBA COMPLETADA EXITOSAMENTE\n');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the test
testPromotionFlow();