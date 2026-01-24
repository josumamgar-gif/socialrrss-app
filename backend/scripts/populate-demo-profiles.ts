import mongoose from 'mongoose';
import Profile from '../src/models/Profile';

const DEMO_USER_ID = '000000000000000000000000';

// Perfiles demo hardcodeados
const demoProfiles = [
  {
    _id: 'demo-01',
    userId: DEMO_USER_ID,
    socialNetwork: 'instagram',
    isActive: true,
    isPaid: false,
    profileData: {
      username: 'maria_fotografia',
      followers: 125000,
      posts: 342,
      description: 'Fotógrafa profesional especializada en retratos y paisajes urbanos. 📸✨',
      images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&q=80']
    },
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&q=80'],
    link: 'https://instagram.com/maria_fotografia'
  },
  {
    _id: 'demo-02',
    userId: DEMO_USER_ID,
    socialNetwork: 'instagram',
    isActive: true,
    isPaid: false,
    profileData: {
      username: 'viajero_aventurero',
      followers: 234000,
      posts: 890,
      description: 'Descubriendo los rincones más hermosos del mundo 🌍✈️',
      images: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&q=80']
    },
    images: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&q=80'],
    link: 'https://instagram.com/viajero_aventurero'
  },
  {
    _id: 'demo-03',
    userId: DEMO_USER_ID,
    socialNetwork: 'tiktok',
    isActive: true,
    isPaid: false,
    profileData: {
      username: 'bailes_trending',
      followers: 450000,
      videos: 234,
      description: 'Los bailes más populares de TikTok 💃🕺',
      images: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop&q=80']
    },
    images: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop&q=80'],
    link: 'https://tiktok.com/@bailes_trending'
  },
  {
    _id: 'demo-04',
    userId: DEMO_USER_ID,
    socialNetwork: 'tiktok',
    isActive: true,
    isPaid: false,
    profileData: {
      username: 'comedia_rapida',
      followers: 320000,
      videos: 567,
      description: 'Sketchs cómicos y situaciones divertidas 😂',
      images: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&q=80']
    },
    images: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&q=80'],
    link: 'https://tiktok.com/@comedia_rapida'
  },
  {
    _id: 'demo-05',
    userId: DEMO_USER_ID,
    socialNetwork: 'youtube',
    isActive: true,
    isPaid: false,
    profileData: {
      channelName: 'Tech Reviews',
      subscribers: 890000,
      videoCount: 234,
      description: 'Reviews honestas de los últimos gadgets tecnológicos 🔧📱',
      images: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=600&fit=crop&q=80']
    },
    images: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=600&fit=crop&q=80'],
    link: 'https://youtube.com/c/techreviews'
  },
  {
    _id: 'demo-06',
    userId: DEMO_USER_ID,
    socialNetwork: 'youtube',
    isActive: true,
    isPaid: false,
    profileData: {
      channelName: 'Gaming Zone',
      subscribers: 1230000,
      videoCount: 890,
      description: 'Gameplays, reviews y noticias de videojuegos 🎮',
      images: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop&q=80']
    },
    images: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop&q=80'],
    link: 'https://youtube.com/c/gamingzone'
  },
  {
    _id: 'demo-07',
    userId: DEMO_USER_ID,
    socialNetwork: 'linkedin',
    isActive: true,
    isPaid: false,
    profileData: {
      title: 'Juan Pérez - CEO Tech Solutions',
      connections: 5000,
      description: 'Emprendedor y líder en tecnología 💼🚀',
      images: ['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&q=80']
    },
    images: ['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&q=80'],
    link: 'https://linkedin.com/in/juanperez'
  },
  {
    _id: 'demo-08',
    userId: DEMO_USER_ID,
    socialNetwork: 'facebook',
    isActive: true,
    isPaid: false,
    profileData: {
      pageName: 'Noticias Tech',
      likes: 890000,
      description: 'Las últimas noticias de tecnología 📰💻',
      images: ['https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop&q=80']
    },
    images: ['https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop&q=80'],
    link: 'https://facebook.com/noticiastech'
  },
  {
    _id: 'demo-09',
    userId: DEMO_USER_ID,
    socialNetwork: 'x',
    isActive: true,
    isPaid: false,
    profileData: {
      handle: 'tech_news',
      followers: 234000,
      tweets: 5678,
      description: 'Noticias de tecnología al instante 🐦⚡',
      images: ['https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=400&h=600&fit=crop&q=80']
    },
    images: ['https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=400&h=600&fit=crop&q=80'],
    link: 'https://x.com/tech_news'
  },
  {
    _id: 'demo-10',
    userId: DEMO_USER_ID,
    socialNetwork: 'twitch',
    isActive: true,
    isPaid: false,
    profileData: {
      streamerName: 'GamerPro',
      followers: 234000,
      game: 'Valorant',
      description: 'Streams diarios de gaming competitivo 🎯',
      images: ['https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&h=600&fit=crop&q=80']
    },
    images: ['https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&h=600&fit=crop&q=80'],
    link: 'https://twitch.tv/gamerpro'
  }
];

async function populateDemoProfiles() {
  try {
    // Conectar a MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/socialrrss';
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB');

    // Verificar si ya existen perfiles demo
    const existingDemos = await Profile.find({
      $or: [
        { _id: { $regex: /^demo-/ } },
        { 'userId._id': DEMO_USER_ID }
      ]
    });

    if (existingDemos.length > 0) {
      console.log(`⚠️  Ya existen ${existingDemos.length} perfiles demo.`);
      console.log('Para recrearlos, ejecutar primero: nuke-database.ts');
      return;
    }

    // Insertar perfiles demo
    console.log('📝 Creando perfiles demo...');
    const createdProfiles = await Profile.insertMany(demoProfiles);
    console.log(`✅ ${createdProfiles.length} perfiles demo creados exitosamente`);

    // Verificar creación
    const totalDemos = await Profile.find({
      $or: [
        { _id: { $regex: /^demo-/ } },
        { 'userId._id': DEMO_USER_ID }
      ]
    });

    console.log(`📊 Total de perfiles demo ahora: ${totalDemos.length}`);

  } catch (error) {
    console.error('❌ Error poblando perfiles demo:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

// Ejecutar script
populateDemoProfiles();