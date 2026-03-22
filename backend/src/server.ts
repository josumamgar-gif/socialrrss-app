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
import userRoutes from './routes/user.routes';

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
    const cleanUrl = frontendUrl.replace(/\/$/, '');
    origins.push(cleanUrl);
  }

  origins.push(/^https:\/\/.*\.vercel\.app$/);

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

    if (!origin) {
      return callback(null, true);
    }

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
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profilesRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/promotion', promotionRoutes);
app.use('/api/user', userRoutes);

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'OK',
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
  });
});

async function start(): Promise<void> {
  const opts = {
    serverSelectionTimeoutMS: 10_000,
  } as const;

  await mongoose.connect(MONGODB_URI, opts);
  console.log('✅ Conectado a MongoDB');

  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📡 API disponible en http://localhost:${PORT}/api`);
    console.log(`🌐 CORS configurado para: ${process.env.FRONTEND_URL || 'http://localhost:3000'} y *.vercel.app`);
  });
}

start().catch((error) => {
  console.error('❌ No se pudo conectar a MongoDB:', error);
  process.exit(1);
});

export default app;
