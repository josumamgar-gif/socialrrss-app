import { Response } from 'express';
import nodemailer from 'nodemailer';
import { OptionalAuthRequest } from '../middleware/optionalAuth.middleware';

// Configurar transporter de nodemailer
const createTransporter = () => {
  // Usar Gmail SMTP
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SUPPORT_EMAIL || 'oficialsocialrrss@gmail.com',
      pass: process.env.SUPPORT_EMAIL_PASSWORD || '', // Contraseña de aplicación de Gmail
    },
  });
};

export const sendSupportEmail = async (req: OptionalAuthRequest, res: Response): Promise<void> => {
  try {
    const { subject, message, email: userEmail } = req.body;

    if (!subject || !message) {
      res.status(400).json({ error: 'Asunto y mensaje son requeridos' });
      return;
    }

    const supportEmail = process.env.SUPPORT_EMAIL || 'oficialsocialrrss@gmail.com';
    const transporter = createTransporter();

    // Obtener información del usuario si está autenticado
    const userInfo = req.user
      ? `\n\n--- Información del Usuario ---\nUsuario: ${req.user.username}\nEmail: ${req.user.email}\nID: ${req.user.userId}`
      : '';

    const userEmailInfo = userEmail ? `\nEmail proporcionado: ${userEmail}` : '';

    // Contenido del email
    const mailOptions = {
      from: supportEmail,
      to: supportEmail, // Enviar a sí mismo (oficialsocialrrss@gmail.com)
      replyTo: userEmail || req.user?.email || supportEmail,
      subject: `[Soporte] ${subject}`,
      text: `${message}${userInfo}${userEmailInfo}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
            Nueva Solicitud de Soporte
          </h2>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #4F46E5; margin-top: 0;">Asunto:</h3>
            <p style="font-size: 16px; color: #333;">${subject}</p>
          </div>
          <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0;">
            <h3 style="color: #4F46E5; margin-top: 0;">Mensaje:</h3>
            <p style="font-size: 14px; color: #333; white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          ${req.user || userEmail ? `
          <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4F46E5;">
            <h4 style="color: #4F46E5; margin-top: 0;">Información del Usuario:</h4>
            ${req.user ? `<p style="margin: 5px 0;"><strong>Usuario:</strong> ${req.user.username}</p>` : ''}
            ${req.user ? `<p style="margin: 5px 0;"><strong>Email registrado:</strong> ${req.user.email}</p>` : ''}
            ${userEmail ? `<p style="margin: 5px 0;"><strong>Email proporcionado:</strong> ${userEmail}</p>` : ''}
            ${req.user ? `<p style="margin: 5px 0;"><strong>ID de Usuario:</strong> ${req.user.userId}</p>` : ''}
          </div>
          ` : ''}
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
            <p>Este email fue enviado desde el formulario de soporte de Promoción RRSS.</p>
            <p>Para responder, utiliza el email de respuesta: ${userEmail || req.user?.email || supportEmail}</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      message: 'Mensaje enviado exitosamente. Nos pondremos en contacto contigo pronto.',
    });
  } catch (error: any) {
    console.error('Error enviando email de soporte:', error);
    res.status(500).json({
      error: 'Error al enviar el mensaje. Por favor, intenta de nuevo más tarde.',
    });
  }
};
