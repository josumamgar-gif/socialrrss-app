// Script de debug para verificar estado de la aplicación
console.log('🔍 DEBUG - Estado de la aplicación');
console.log('=====================================');

// Verificar localStorage
console.log('\n📦 LOCALSTORAGE:');
if (typeof window !== 'undefined') {
  console.log('Token:', !!localStorage.getItem('token'));
  console.log('Tutorial completado:', localStorage.getItem('tutorialCompleted'));
  console.log('Demo completado:', localStorage.getItem('demoCompleted'));
  console.log('Demos agotados:', localStorage.getItem('demosExhausted'));

  // Verificar perfiles vistos
  const keys = Object.keys(localStorage);
  const viewedKeys = keys.filter(key => key.startsWith('viewedProfiles_'));
  console.log('Perfiles vistos:', viewedKeys.length, 'usuarios');

  viewedKeys.forEach(key => {
    const data = localStorage.getItem(key);
    try {
      const viewed = JSON.parse(data || '[]');
      console.log(`  ${key}: ${viewed.length} perfiles`);
    } catch (e) {
      console.log(`  ${key}: ERROR parsing`);
    }
  });
}

// Verificar si estamos en la página correcta
console.log('\n🌐 NAVEGACIÓN:');
console.log('URL actual:', window.location.href);
console.log('Pathname:', window.location.pathname);

// Verificar Zustand store (si existe)
console.log('\n🏪 ZUSTAND STORE:');
try {
  // Esto requiere acceso al store, pero podemos verificar si existe
  console.log('Store disponible: verificar manualmente en dev tools');
} catch (e) {
  console.log('Error accediendo al store:', e.message);
}

console.log('\n✅ Debug completado - Copia esta información para diagnosticar');