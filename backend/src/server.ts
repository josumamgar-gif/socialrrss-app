import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

// Cargar variables de entorno
dotenv.config();

// Importar rutas
import paymentsRoutes from './routes/payments.routes';
import pricingRoutes from './routes/pricing.routes';
import authRoutes from './routes/auth.routes';
import profilesRoutes from './routes/profiles.routes';
import supportRoutes from './routes/support.routes';
import promotionRoutes from './routes/promotion.routes';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/promocion-rrss';

// Middleware CORS - Configurado para producción y previews de Vercel
const getAllowedOrigins = (): (string | RegExp)[] => {
  const origins: (string | RegExp)[] = [];
  
  // Desarrollo local
  origins.push('http://localhost:3000');
  
  // URL de producción (sin barra al final)
  const frontendUrl = process.env.FRONTEND_URL;
  if (frontendUrl) {
    // Remover barra al final si existe
    const cleanUrl = frontendUrl.replace(/\/$/, '');
    origins.push(cleanUrl);
  }
  
  // Permitir cualquier URL de preview de Vercel
  // Las URLs de preview tienen formato: proyecto-hash-usuario.vercel.app
  origins.push(/^https:\/\/.*\.vercel\.app$/);
  
  // Si tienes un dominio personalizado configurado
  if (process.env.CUSTOM_DOMAIN) {
    const cleanDomain = process.env.CUSTOM_DOMAIN.replace(/\/$/, '');
    origins.push(`https://${cleanDomain}`);
    origins.push(`https://www.${cleanDomain}`);
  }
  
  return origins;
};

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void): void => {
    const allowedOrigins = getAllowedOrigins();
    
    // Permitir requests sin origin (Postman, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    // Verificar si el origen está permitido
    const isAllowed = allowedOrigins.some((allowedOrigin) => {
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin;
      }
      return false;
    });
    
    if (isAllowed) {
      return callback(null, true);
    } else {
      console.warn(`⚠️ Origen no permitido: ${origin}`);
      return callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Conectar a MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
  })
  .catch((error) => {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  });

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profilesRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/promotion', promotionRoutes);

// Ruta de prueba
app.get('/api/health', (_req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Manejo de errores
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📡 API disponible en http://localhost:${PORT}/api`);
  console.log(`🌐 CORS configurado para: ${process.env.FRONTEND_URL || 'http://localhost:3000'} y *.vercel.app`);
});

export default app;

