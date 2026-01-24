import mongoose from 'mongoose';
import Profile from '../src/models/Profile';

async function createDemoProfiles() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/socialrrss';
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB');

    // Definir perfiles demo simples
    const demoProfiles = [
      {
        _id: 'demo-01',
        userId: '000000000000000000000000',
        socialNetwork: 'instagram',
        isActive: true,
        isPaid: false,
        profileData: {
          username: 'demo_foto',
          followers: 1000,
          posts: 50,
          description: 'Perfil demo de fotografía 📸',
        },
        images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&q=80'],
        link: 'https://instagram.com/demo'
      },
      {
        _id: 'demo-02',
        userId: '000000000000000000000000',
        socialNetwork: 'tiktok',
        isActive: true,
        isPaid: false,
        profileData: {
          username: 'demo_tiktok',
          followers: 500,
          videos: 20,
          description: 'Perfil demo de TikTok 🎵',
        },
        images: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop&q=80'],
        link: 'https://tiktok.com/@demo'
      },
      {
        _id: 'demo-03',
        userId: '000000000000000000000000',
        socialNetwork: 'youtube',
        isActive: true,
        isPaid: false,
        profileData: {
          channelName: 'Demo Channel',
          subscribers: 2000,
          videoCount: 30,
          description: 'Canal demo de YouTube 📺',
        },
        images: ['https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop&q=80'],
        link: 'https://youtube.com/demo'
      }
    ];

    console.log('📝 Creando perfiles demo...');

    for (const profile of demoProfiles) {
      try {
        await Profile.findOneAndUpdate(
          { _id: profile._id },
          profile,
          { upsert: true, new: true }
        );
        console.log(`✅ Creado/actualizado perfil: ${profile._id}`);
      } catch (error) {
        console.error(`❌ Error creando perfil ${profile._id}:`, error);
      }
    }

    // Verificar
    const count = await Profile.countDocuments({
      $or: [
        { _id: { $regex: /^demo-/ } },
        { 'userId': '000000000000000000000000' }
      ]
    });

    console.log(`📊 Total perfiles demo: ${count}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado');
  }
}

createDemoProfiles();