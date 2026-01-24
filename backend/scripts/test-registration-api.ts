const API_URL = 'http://localhost:5000/api';

async function testRegistrationAPI() {
  try {
    console.log('🧪 Probando API de registro con promoción gratuita...\n');

    const testData = {
      username: `testapi_${Date.now()}`,
      email: `testapi${Date.now()}@example.com`,
      password: 'testpass123',
      fullName: 'Usuario API Test'
    };

    console.log('📤 Enviando petición de registro...');
    console.log(`   👤 Usuario: ${testData.username}`);
    console.log(`   📧 Email: ${testData.email}`);

    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const responseData = await response.json() as any;

    console.log('\n📥 Respuesta del servidor:');
    console.log(`   ✅ Status: ${response.status}`);
    console.log(`   🎯 Registro exitoso: ${responseData.message}`);

    if (responseData.freePromotionActivated) {
      console.log('   🎉 ¡Promoción gratuita activada!');
      console.log('   📊 Datos de promoción:', responseData.promotion);
    } else {
      console.log('   ❌ Promoción gratuita NO activada');
    }

    console.log('\n👤 Datos del usuario:');
    console.log(`   🆔 ID: ${responseData.user.id}`);
    console.log(`   👤 Usuario: ${responseData.user.username}`);
    console.log(`   📧 Email: ${responseData.user.email}`);
    console.log(`   🎁 En promoción: ${responseData.user.isOnFreePromotion || false}`);

    // Test pricing API
    console.log('\n💰 Probando API de precios...');
    const pricingResponse = await fetch(`${API_URL}/pricing`);
    const pricingData = await pricingResponse.json() as any;

    console.log(`   📊 Planes disponibles: ${pricingData.plans.length}`);
    console.log(`   🎁 Promoción gratuita disponible: ${pricingData.freePromotionAvailable}`);
    console.log(`   📈 Spots restantes: ${pricingData.remainingFreeSpots}`);

    const freePlan = pricingData.plans.find((p: any) => p.type === 'free_trial');
    if (freePlan) {
      console.log('   ✅ Plan gratuito encontrado:', freePlan.name);
    } else {
      console.log('   ❌ Plan gratuito NO encontrado');
    }

    console.log('\n🎉 PRUEBA COMPLETADA');

  } catch (error: any) {
    console.error('\n❌ Error en la prueba:', error.message);
  }
}

testRegistrationAPI();