import nodemailer from 'nodemailer';

const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'oficialsocialrrss@gmail.com';

/**
 * Crea y verifica un transporter de Gmail usando las credenciales de soporte.
 * Lanza error si SUPPORT_EMAIL_PASSWORD no está configurado o falla la autenticación.
 */
export const createTransporter = async () => {
  if (!process.env.SUPPORT_EMAIL_PASSWORD) {
    throw new Error('SUPPORT_EMAIL_PASSWORD no está configurado en las variables de entorno.');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: SUPPORT_EMAIL,
      pass: process.env.SUPPORT_EMAIL_PASSWORD,
    },
  });

  // Verificar la conexión antes de devolver
  await transporter.verify();
  return transporter;
};

export const getSupportEmail = () => SUPPORT_EMAIL;

/* ─── Templates ─── */

const PLAN_NAMES: Record<string, string> = {
  monthly: 'Plan Mensual',
  yearly: 'Plan Anual',
  lifetime: 'Plan Permanente',
  free_trial: 'Prueba Gratuita',
};

const METHOD_NAMES: Record<string, string> = {
  paypal: 'PayPal',
  card: 'Tarjeta de crédito',
  sepa: 'Débito SEPA',
  stripe: 'Stripe',
};

export interface ReceiptData {
  paymentId: string;
  amount: number;
  planType: string;
  paymentMethod: string;
  createdAt: Date;
  profileName: string;
  socialNetwork: string;
  userEmail: string;
  username: string;
}

export const buildReceiptHtml = (data: ReceiptData): string => {
  const date = new Date(data.createdAt).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const networkCap = data.socialNetwork.charAt(0).toUpperCase() + data.socialNetwork.slice(1);
  const planName = PLAN_NAMES[data.planType] || data.planType;
  const methodName = METHOD_NAMES[data.paymentMethod] || data.paymentMethod;
  const shortId = data.paymentId.slice(-8).toUpperCase();

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recibo de Pago - SocialRRSS</title>
</head>
<body style="margin:0;padding:0;background-color:#f9f5f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f5f0;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

          <!-- Logo / Header -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#d97706;border-radius:16px;padding:14px;text-align:center;">
                    <span style="font-size:22px;color:#ffffff;">◎</span>
                  </td>
                </tr>
              </table>
              <p style="margin:10px 0 0;font-size:22px;font-weight:800;color:#1c1917;letter-spacing:-0.5px;">
                Social<span style="color:#d97706;">RRSS</span>
              </p>
              <p style="margin:4px 0 0;font-size:13px;color:#78716c;">Tu pago ha sido procesado correctamente</p>
            </td>
          </tr>

          <!-- Success banner -->
          <tr>
            <td style="background-color:#ecfdf5;border-radius:16px;padding:20px;text-align:center;margin-bottom:20px;border:1px solid #d1fae5;">
              <p style="margin:0;font-size:28px;">✅</p>
              <p style="margin:8px 0 0;font-size:18px;font-weight:700;color:#065f46;">¡Pago completado!</p>
              <p style="margin:4px 0 0;font-size:13px;color:#059669;">Tu perfil ya está activo en SocialRRSS</p>
            </td>
          </tr>

          <tr><td style="height:16px;"></td></tr>

          <!-- Receipt card -->
          <tr>
            <td style="background-color:#ffffff;border-radius:16px;border:1px solid #e7e5e4;overflow:hidden;">

              <!-- Card header -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #f5f5f4;">
                    <p style="margin:0;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#a8a29e;">Recibo de pago</p>
                    <p style="margin:4px 0 0;font-size:12px;color:#a8a29e;">Referencia: #${shortId}</p>
                  </td>
                </tr>
              </table>

              <!-- Rows -->
              ${receiptRow('Hola', data.username)}
              ${receiptRow('Perfil', data.profileName)}
              ${receiptRow('Red social', networkCap)}
              ${receiptRow('Plan', planName)}
              ${receiptRow('Método de pago', methodName)}
              ${receiptRow('Fecha', date)}

              <!-- Total -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#1c1917;padding:20px;text-align:center;">
                    <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:1px;">Total pagado</p>
                    <p style="margin:6px 0 0;font-size:36px;font-weight:800;color:#ffffff;">${data.amount.toFixed(2)} €</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <tr><td style="height:24px;"></td></tr>

          <!-- Info box -->
          <tr>
            <td style="background-color:#fef3c7;border-radius:12px;padding:16px 20px;border:1px solid #fde68a;">
              <p style="margin:0;font-size:13px;color:#92400e;line-height:1.5;">
                <strong>¿Preguntas sobre tu pago?</strong><br>
                Responde a este email o escríbenos a <a href="mailto:${SUPPORT_EMAIL}" style="color:#d97706;">${SUPPORT_EMAIL}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 8px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#a8a29e;">Este recibo se genera automáticamente. Guárdalo para tu historial.</p>
              <p style="margin:6px 0 0;font-size:12px;color:#a8a29e;">© ${new Date().getFullYear()} SocialRRSS. Todos los derechos reservados.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

const receiptRow = (label: string, value: string) => `
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="padding:13px 20px;border-bottom:1px solid #f5f5f4;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:13px;color:#78716c;">${label}</td>
            <td align="right" style="font-size:13px;font-weight:600;color:#1c1917;">${value}</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
`;
