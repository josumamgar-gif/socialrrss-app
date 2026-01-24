// Script rápido para probar la funcionalidad
console.log('🧪 TEST RÁPIDO - Perfiles Demo');

// Limpiar perfiles vistos para testing
if (typeof window !== 'undefined') {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('viewedProfiles_')) {
      console.log('🗑️ Limpiando:', key);
      localStorage.removeItem(key);
    }
  });

  console.log('✅ Listo para testear perfiles demo');
  console.log('📝 Instrucciones:');
  console.log('   1. Regístrate o inicia sesión');
  console.log('   2. Ve a Principal');
  console.log('   3. Haz swipe en todos los perfiles demo');
  console.log('   4. Debería aparecer el mensaje de perfiles agotados');
  console.log('   5. Solo debería verse el selector de redes');
} else {
  console.log('⚠️ Ejecutar en navegador');
}