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

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/promocion-rrss';

// Middleware CORS - Configurado para producción
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
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
});

export default app;

