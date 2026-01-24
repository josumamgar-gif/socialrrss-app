import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/promocion-rrss';

async function resetUserDemoState() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    console.log('\n🔄 RESETANDO ESTADO DE DEMOS PARA USUARIOS\n');

    // Reset demo state for all users (clear localStorage flags)
    console.log('📋 INSTRUCCIONES PARA EL USUARIO:');
    console.log('');
    console.log('Para resetear el estado de demos en el navegador, ejecuta en la consola del navegador:');
    console.log('');
    console.log('```javascript');
    console.log('// Limpiar flags de demo');
    console.log('localStorage.removeItem("tutorialCompleted");');
    console.log('localStorage.removeItem("demoCompleted");');
    console.log('localStorage.removeItem("demosExhausted");');
    console.log('');
    console.log('// Limpiar perfiles vistos (opcional)');
    console.log('Object.keys(localStorage).forEach(key => {');
    console.log('  if (key.startsWith("viewedProfiles_")) {');
    console.log('    localStorage.removeItem(key);');
    console.log('  }');
    console.log('});');
    console.log('');
    console.log('// Limpiar selección de red social');
    console.log('localStorage.removeItem("lastSelectedNetwork");');
    console.log('localStorage.removeItem("hasSelectedNetwork");');
    console.log('');
    console.log('// Recargar la página');
    console.log('window.location.reload();');
    console.log('```');

    console.log('\n📊 ESTADO ACTUAL DEL SISTEMA:');

    // Check current promotion state
    const Promotion = require('../src/models/Promotion').default;

    const totalPromotions = await Promotion.countDocuments({ type: 'free_trial_30_days' });
    const activePromotions = await Promotion.countDocuments({
      type: 'free_trial_30_days',
      status: 'active'
    });

    console.log(`🎁 Promociones totales: ${totalPromotions}/100`);
    console.log(`✅ Promociones activas: ${activePromotions}`);
    console.log(`🎯 Promoción gratuita disponible: ${totalPromotions < 100}`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');

    console.log('\n✅ SCRIPT EJECUTADO CORRECTAMENTE');
    console.log('💡 Pídele al usuario que ejecute los comandos JavaScript en la consola del navegador');

  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the script
resetUserDemoState();