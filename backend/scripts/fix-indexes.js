// Script temporal para eliminar los índices problemáticos de MongoDB
// Ejecutar con: node scripts/fix-indexes.js

require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/promocion-rrss';

async function fixIndexes() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('payments');

    // Verificar índices existentes
    console.log('\n📋 Índices actuales:');
    const indexes = await collection.indexes();
    indexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    // Intentar eliminar los índices problemáticos
    try {
      console.log('\n🗑️  Eliminando índice paypalOrderId_1...');
      await collection.dropIndex('paypalOrderId_1');
      console.log('✅ Índice paypalOrderId_1 eliminado');
    } catch (error) {
      if (error.code === 27 || error.message.includes('index not found')) {
        console.log('ℹ️  Índice paypalOrderId_1 no existe, continuando...');
      } else {
        throw error;
      }
    }

    try {
      console.log('🗑️  Eliminando índice stripePaymentId_1...');
      await collection.dropIndex('stripePaymentId_1');
      console.log('✅ Índice stripePaymentId_1 eliminado');
    } catch (error) {
      if (error.code === 27 || error.message.includes('index not found')) {
        console.log('ℹ️  Índice stripePaymentId_1 no existe, continuando...');
      } else {
        throw error;
      }
    }

    console.log('\n✅ Proceso completado. Los nuevos índices se crearán automáticamente al reiniciar el servidor.');
    console.log('   Los índices corregidos permitirán múltiples valores null.');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

fixIndexes();


