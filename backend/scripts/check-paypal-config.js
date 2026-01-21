// Script para verificar la configuración de PayPal
require('dotenv').config();

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
const mode = process.env.PAYPAL_MODE || 'sandbox';

console.log('\n🔍 Verificando configuración de PayPal...\n');

if (!clientId) {
  console.error('❌ PAYPAL_CLIENT_ID no está definido en .env');
} else {
  console.log('✅ PAYPAL_CLIENT_ID:', clientId.substring(0, 20) + '...' + clientId.substring(clientId.length - 5));
  console.log('   Longitud:', clientId.length);
}

if (!clientSecret) {
  console.error('❌ PAYPAL_CLIENT_SECRET no está definido en .env');
} else {
  console.log('✅ PAYPAL_CLIENT_SECRET:', '***' + clientSecret.substring(clientSecret.length - 5));
  console.log('   Longitud:', clientSecret.length);
}

console.log('📋 PAYPAL_MODE:', mode);

// Verificar espacios o caracteres extraños
if (clientId && (clientId.includes(' ') || clientId.includes('\n') || clientId.includes('\r'))) {
  console.warn('⚠️  ADVERTENCIA: PAYPAL_CLIENT_ID contiene espacios o saltos de línea');
}

if (clientSecret && (clientSecret.includes(' ') || clientSecret.includes('\n') || clientSecret.includes('\r'))) {
  console.warn('⚠️  ADVERTENCIA: PAYPAL_CLIENT_SECRET contiene espacios o saltos de línea');
}

// Verificar formato básico
if (clientId && !clientId.startsWith('A')) {
  console.warn('⚠️  ADVERTENCIA: PAYPAL_CLIENT_ID normalmente comienza con "A"');
}

if (mode !== 'production' && mode !== 'sandbox') {
  console.warn('⚠️  ADVERTENCIA: PAYPAL_MODE debe ser "production" o "sandbox"');
}

console.log('\n✅ Verificación completada\n');


