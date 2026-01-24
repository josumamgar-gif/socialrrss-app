// Script para limpiar localStorage del frontend
console.log('🧹 Limpiando localStorage del frontend...');

if (typeof window !== 'undefined') {
  // Limpiar token de autenticación
  localStorage.removeItem('token');

  // Limpiar tutorial completado
  localStorage.removeItem('tutorialCompleted');

  // Limpiar perfiles vistos
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('viewedProfiles_')) {
      localStorage.removeItem(key);
      console.log(`🗑️  Eliminado: ${key}`);
    }
  });

  // Limpiar cualquier otro dato relacionado con usuarios
  localStorage.removeItem('saved_email');
  localStorage.removeItem('user');
  localStorage.removeItem('demoCompleted');
  localStorage.removeItem('demosExhausted');

  console.log('✅ localStorage limpiado completamente');
  console.log('🔄 Recarga la página para ver el tutorial y perfiles demo');
} else {
  console.log('⚠️  Este script debe ejecutarse en el navegador');
}