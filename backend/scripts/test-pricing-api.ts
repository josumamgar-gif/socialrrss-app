const API_URL = 'http://localhost:5000/api';

async function testPricingAPI() {
  try {
    console.log('🧪 Probando API de precios...\n');

    const response = await fetch(`${API_URL}/pricing`);
    const data = await response.json() as any;

    console.log('📊 Respuesta completa de la API:');
    console.log(JSON.stringify(data, null, 2));

    console.log('\n📋 Resumen:');
    console.log(`   📊 Total de planes: ${data.plans?.length || 0}`);
    console.log(`   🎁 Promoción gratuita disponible: ${data.freePromotionAvailable}`);
    console.log(`   📈 Spots restantes: ${data.remainingFreeSpots}`);

    console.log('\n📋 Lista de planes:');
    data.plans?.forEach((plan: any, index: number) => {
      console.log(`   ${index + 1}. ${plan.name} - ${plan.price}€ (${plan.type})`);
      if (plan.type === 'free_trial') {
        console.log(`      🎁 ¡Plan gratis encontrado!`);
      }
    });

    console.log('\n🎯 Verificación:');
    const freePlan = data.plans?.find((p: any) => p.type === 'free_trial');
    if (freePlan) {
      console.log('   ✅ Plan gratis incluido en la respuesta');
    } else {
      console.log('   ❌ Plan gratis NO encontrado');
    }

    if (data.freePromotionAvailable && data.remainingFreeSpots > 0) {
      console.log('   ✅ Sistema funcionando correctamente');
    } else {
      console.log('   ❌ Sistema no funcionando');
    }

  } catch (error: any) {
    console.error('\n❌ Error en la prueba:', error.message);
  }
}

testPricingAPI();