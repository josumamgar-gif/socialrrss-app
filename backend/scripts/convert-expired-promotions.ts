import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Promotion from '../src/models/Promotion';
import User from '../src/models/User';
import Profile from '../src/models/Profile';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/promocion-rrss';

async function convertExpiredPromotions() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    const now = new Date();
    console.log(`🔍 Buscando promociones expiradas antes de: ${now.toISOString()}`);

    // Find expired promotions that haven't been converted yet
    const expiredPromotions = await Promotion.find({
      status: 'active',
      endDate: { $lt: now }
    }).populate('userId', 'username email');

    console.log(`📊 Encontradas ${expiredPromotions.length} promociones expiradas`);

    const convertedUsers = [];
    const errors = [];

    for (const promotion of expiredPromotions) {
      try {
        console.log(`🔄 Convirtiendo promoción para usuario: ${(promotion.userId as any).username} (${promotion.userId})`);

        // Update promotion status to expired
        promotion.status = 'expired';
        await promotion.save();

        // Update user status
        await User.findByIdAndUpdate(promotion.userId, {
          isOnFreePromotion: false,
          freePromotionStartDate: null,
          freePromotionEndDate: null,
        });

        // Find and deactivate user's profiles
        const updateResult = await Profile.updateMany(
          { userId: promotion.userId, isActive: true },
          { isActive: false }
        );

        console.log(`✅ Usuario ${(promotion.userId as any).username} convertido. Perfiles desactivados: ${updateResult.modifiedCount}`);

        convertedUsers.push({
          userId: promotion.userId,
          username: (promotion.userId as any).username,
          email: (promotion.userId as any).email,
          profilesDeactivated: updateResult.modifiedCount,
        });

      } catch (error) {
        console.error(`❌ Error convirtiendo promoción para usuario ${promotion.userId}:`, error);
        errors.push({
          userId: promotion.userId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    console.log(`\n📈 Resumen:`);
    console.log(`✅ Usuarios convertidos exitosamente: ${convertedUsers.length}`);
    console.log(`❌ Errores: ${errors.length}`);

    if (convertedUsers.length > 0) {
      console.log(`\n👥 Usuarios convertidos:`);
      convertedUsers.forEach(user => {
        console.log(`  - ${user.username} (${user.email}): ${user.profilesDeactivated} perfiles desactivados`);
      });
    }

    if (errors.length > 0) {
      console.log(`\n⚠️ Errores:`);
      errors.forEach(err => {
        console.log(`  - Usuario ${err.userId}: ${err.error}`);
      });
    }

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');

    // Exit with appropriate code
    process.exit(errors.length > 0 ? 1 : 0);

  } catch (error) {
    console.error('❌ Error general:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the script
convertExpiredPromotions();