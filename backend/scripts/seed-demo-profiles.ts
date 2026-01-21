import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Profile from '../src/models/Profile';

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../.env') });

// Datos de perfiles demo - REDUCIDO A 10 PERFILES TOTALES
// Distribución: Instagram(2), TikTok(2), YouTube(2), LinkedIn(1), Facebook(1), X(1), Twitch(1)
const demoProfilesData = [
  // Instagram (2 perfiles)
  { username: 'maria_fotografia', followers: 125000, posts: 342, desc: 'Fotógrafa profesional especializada en retratos y paisajes urbanos' },
  { username: 'viajero_aventurero', followers: 234000, posts: 890, desc: 'Descubriendo los rincones más hermosos del mundo' },

  // TikTok (2 perfiles)
  { username: 'bailes_trending', followers: 450000, videos: 234, desc: 'Los bailes más populares de TikTok' },
  { username: 'comedia_rapida', followers: 320000, videos: 567, desc: 'Sketchs cómicos y situaciones divertidas' },

  // YouTube (2 perfiles)
  { channelName: 'Tech Reviews', subscribers: 890000, videoCount: 234, desc: 'Reviews honestas de los últimos gadgets tecnológicos' },
  { channelName: 'Gaming Zone', subscribers: 1230000, videoCount: 890, desc: 'Gameplays, reviews y noticias de videojuegos' },

  // LinkedIn (1 perfil)
  { name: 'Juan Pérez', title: 'CEO Tech Solutions', connections: 5000, desc: 'Emprendedor y líder en tecnología' },

  // Facebook (1 perfil)
  { pageName: 'Noticias Tech', likes: 890000, desc: 'Las últimas noticias de tecnología' },

  // X/Twitter (1 perfil)
  { handle: 'tech_news', followers: 234000, tweets: 5678, desc: 'Noticias de tecnología al instante' },

  // Twitch (1 perfil)
  { streamerName: 'GamerPro', followers: 234000, game: 'Valorant', desc: 'Streams diarios de gaming competitivo' },
];

// Imágenes de Unsplash
const imageUrls = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&h=600&fit=crop&q=80',
];

const getRandomImages = (count: number = 2): string[] => {
  const shuffled = [...imageUrls].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// ID especial para perfiles demo (usaremos un ObjectId fijo)
const DEMO_USER_ID = new mongoose.Types.ObjectId('000000000000000000000000');

const createDemoProfiles = () => {
  const profiles: any[] = [];
  let index = 0;

  // Instagram (2 perfiles) - índices 0-1
  for (let i = 0; i < 2; i++) {
    const p = demoProfilesData[i];
    profiles.push({
      userId: DEMO_USER_ID,
      socialNetwork: 'instagram',
      isActive: true,
      isPaid: true,
      paidUntil: null,
      planType: 'lifetime',
      profileData: {
        handle: p.username,
        followers: p.followers,
        posts: p.posts,
        description: p.desc,
      },
      images: getRandomImages(2),
      link: `https://instagram.com/${p.username}`,
    });
    index++;
  }

  // TikTok (2 perfiles) - índices 2-3
  for (let i = 2; i < 4; i++) {
    const p = demoProfilesData[i];
    profiles.push({
      userId: DEMO_USER_ID,
      socialNetwork: 'tiktok',
      isActive: true,
      isPaid: true,
      paidUntil: null,
      planType: 'lifetime',
      profileData: {
        username: p.username,
        followers: p.followers,
        videos: p.videos,
        description: p.desc,
      },
      images: getRandomImages(2),
      link: `https://tiktok.com/@${p.username}`,
    });
    index++;
  }

  // YouTube (2 perfiles) - índices 4-5
  for (let i = 4; i < 6; i++) {
    const p = demoProfilesData[i] as any;
    if (p.channelName) {
      profiles.push({
        userId: DEMO_USER_ID,
        socialNetwork: 'youtube',
        isActive: true,
        isPaid: true,
        paidUntil: null,
        planType: 'lifetime',
        profileData: {
          channelName: p.channelName,
          subscribers: p.subscribers,
          videoCount: p.videoCount,
          description: p.desc,
        },
        images: getRandomImages(2),
        link: `https://youtube.com/@${p.channelName.toLowerCase().replace(/\s+/g, '')}`,
      });
      index++;
    }
  }

  // LinkedIn (1 perfil) - índice 6
  const linkedinProfile = demoProfilesData[6] as any;
  if (linkedinProfile && linkedinProfile.name) {
    profiles.push({
      userId: DEMO_USER_ID,
      socialNetwork: 'linkedin',
      isActive: true,
      isPaid: true,
      paidUntil: null,
      planType: 'lifetime',
      profileData: {
        fullName: linkedinProfile.name,
        headline: linkedinProfile.title,
        connections: linkedinProfile.connections,
        description: linkedinProfile.desc,
      },
      images: getRandomImages(1),
      link: `https://linkedin.com/in/${linkedinProfile.name.toLowerCase().replace(/\s+/g, '-')}`,
    });
    index++;
  }

  // Facebook (1 perfil) - índice 7
  const facebookProfile = demoProfilesData[7] as any;
  if (facebookProfile && facebookProfile.pageName) {
    profiles.push({
      userId: DEMO_USER_ID,
      socialNetwork: 'facebook',
      isActive: true,
      isPaid: true,
      paidUntil: null,
      planType: 'lifetime',
      profileData: {
        pageName: facebookProfile.pageName,
        likes: facebookProfile.likes,
        description: facebookProfile.desc,
      },
      images: getRandomImages(2),
      link: `https://facebook.com/${facebookProfile.pageName.toLowerCase().replace(/\s+/g, '')}`,
    });
    index++;
  }

  // X/Twitter (1 perfil) - índice 8
  const xProfile = demoProfilesData[8] as any;
  if (xProfile && xProfile.handle) {
    profiles.push({
      userId: DEMO_USER_ID,
      socialNetwork: 'x',
      isActive: true,
      isPaid: true,
      paidUntil: null,
      planType: 'lifetime',
      profileData: {
        twitterHandle: xProfile.handle,
        followers: xProfile.followers,
        tweets: xProfile.tweets,
        description: xProfile.desc,
      },
      images: getRandomImages(1),
      link: `https://x.com/${xProfile.handle}`,
    });
    index++;
  }

  // Twitch (1 perfil) - índice 9
  const twitchProfile = demoProfilesData[9] as any;
  if (twitchProfile && twitchProfile.streamerName) {
    profiles.push({
      userId: DEMO_USER_ID,
      socialNetwork: 'twitch',
      isActive: true,
      isPaid: true,
      paidUntil: null,
      planType: 'lifetime',
      profileData: {
        streamerName: twitchProfile.streamerName,
        followers: twitchProfile.followers,
        game: twitchProfile.game,
        description: twitchProfile.desc,
      },
      images: getRandomImages(2),
      link: `https://twitch.tv/${twitchProfile.streamerName.toLowerCase()}`,
    });
    index++;
  }

  return profiles;
};

const seedDemoProfiles = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/promocion-rrss';
    
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Eliminar perfiles demo existentes (con userId demo)
    console.log('🗑️  Eliminando perfiles demo existentes...');
    const deleteResult = await Profile.deleteMany({ userId: DEMO_USER_ID });
    console.log(`✅ Eliminados ${deleteResult.deletedCount} perfiles demo existentes`);

    // Crear perfiles demo
    const profiles = createDemoProfiles();
    console.log(`📝 Creando ${profiles.length} perfiles demo...`);

    // Insertar perfiles
    await Profile.insertMany(profiles);
    console.log(`✅ ${profiles.length} perfiles demo creados exitosamente`);

    // Verificar
    const count = await Profile.countDocuments({ userId: DEMO_USER_ID });
    console.log(`✅ Total de perfiles demo en la base de datos: ${count}`);

    await mongoose.disconnect();
    console.log('✅ Desconectado de MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDemoProfiles();
