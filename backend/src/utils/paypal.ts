import paypal from '@paypal/checkout-server-sdk';
import dotenv from 'dotenv';

// Asegurar que dotenv esté cargado
dotenv.config();

const clientId = process.env.PAYPAL_CLIENT_ID || '';
const clientSecret = process.env.PAYPAL_CLIENT_SECRET || '';
const mode = process.env.PAYPAL_MODE || 'sandbox';

// Validar credenciales al cargar el módulo
if (!clientId || !clientSecret) {
  console.error('❌ ERROR: Credenciales de PayPal no encontradas en .env');
  console.error('   Asegúrate de tener PAYPAL_CLIENT_ID y PAYPAL_CLIENT_SECRET definidas');
} else {
  console.log('✅ Credenciales de PayPal cargadas:', {
    clientId: clientId.substring(0, 10) + '...',
    mode: mode,
    hasSecret: !!clientSecret
  });
}

function environment() {
  // Validar que tengamos credenciales antes de crear el environment
  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured. Check your .env file for PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET');
  }

  // Limpiar espacios en blanco por si acaso
  const cleanClientId = clientId.trim();
  const cleanClientSecret = clientSecret.trim();

  if (mode === 'production') {
    console.log('🌐 Usando PayPal en modo PRODUCCIÓN');
    return new paypal.core.LiveEnvironment(cleanClientId, cleanClientSecret);
  } else {
    console.log('🧪 Usando PayPal en modo SANDBOX');
    return new paypal.core.SandboxEnvironment(cleanClientId, cleanClientSecret);
  }
}

function client() {
  try {
    const env = environment();
    return new paypal.core.PayPalHttpClient(env);
  } catch (error: any) {
    console.error('❌ Error creando cliente PayPal:', error.message);
    throw error;
  }
}

export async function createOrder(amount: number, currency: string = 'EUR', returnUrl?: string, cancelUrl?: string) {
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const return_url = returnUrl || `${baseUrl}/promocion?paypal_success=true`;
  const cancel_url = cancelUrl || `${baseUrl}/promocion?paypal_cancel=true`;
  
  const requestBody: any = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: amount.toFixed(2),
        },
      },
    ],
  };

  // Añadir application_context solo si se proporcionan URLs
  if (returnUrl && cancelUrl) {
    requestBody.application_context = {
      brand_name: 'Promoción RRSS',
      landing_page: 'BILLING',
      user_action: 'PAY_NOW',
      return_url: return_url,
      cancel_url: cancel_url,
    };
  }

  request.requestBody(requestBody);

  try {
    // Verificar credenciales antes de intentar crear la orden
    if (!clientId || !clientSecret) {
      throw new Error('PayPal credentials are missing. Please check your .env file.');
    }

    const paypalClient = client();
    const order = await paypalClient.execute(request);
    console.log('✅ PayPal Order Created:', {
      id: order.result.id,
      status: order.result.status,
      links: order.result.links?.map((link: any) => ({ rel: link.rel, href: link.href })),
    });
    return order.result;
  } catch (error: any) {
    console.error('❌ Error creando orden PayPal:', error);
    
    if (error.statusCode) {
      console.error('   Status Code:', error.statusCode);
    }
    if (error.message) {
      console.error('   Error Message:', error.message);
    }
    if (error.response) {
      console.error('   Error Response:', JSON.stringify(error.response, null, 2));
    }

    // Mensajes de error más descriptivos
    if (error.statusCode === 401) {
      const errorMsg = `
❌ Error de autenticación PayPal (401):
   
Posibles causas:
1. Las credenciales en .env no coinciden con el modo (${mode})
   - Si usas credenciales de SANDBOX, asegúrate de que PAYPAL_MODE=sandbox
   - Si usas credenciales de PRODUCCIÓN, asegúrate de que PAYPAL_MODE=production
   
2. Las credenciales están incorrectas o han expirado
   - Verifica en el panel de PayPal Developer que las credenciales sean correctas
   
3. Las credenciales tienen espacios o caracteres extraños
   - Asegúrate de que no haya espacios antes o después de las credenciales en .env
      `;
      console.error(errorMsg);
      throw new Error('Error de autenticación PayPal. Verifica que tus credenciales coincidan con el modo (sandbox/production) en .env');
    }

    throw new Error(error.message || 'Error al crear orden de pago');
  }
}

export async function captureOrder(orderId: string) {
  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  try {
    const capture = await client().execute(request);
    return capture.result;
  } catch (error: any) {
    console.error('Error capturando orden PayPal:', error);
    throw new Error('Error al capturar orden de pago');
  }
}

