import { Profile } from '@/types';

// Generar IDs únicos para perfiles demo (mantener prefijo demo- para lógica interna, pero no visible)
const generateId = (index: number) => `demo-${index.toString().padStart(2, '0')}`;

// Perfiles demo SIMPLIFICADOS - SOLO 3 PARA PRUEBA RÁPIDA
const instagramProfiles = [
  { username: 'demo_foto', followers: 1000, posts: 50, desc: 'Fotografía profesional 📸' },
];

const tiktokProfiles = [
  { username: 'demo_tiktok', followers: 500, videos: 20, desc: 'Bailes y tendencias 🎵' },
];

const youtubeProfiles = [
  { channelName: 'Demo Channel', subscribers: 2000, videoCount: 30, desc: 'Contenido variado 📺' },
];

const linkedinProfiles = [];
const facebookProfiles = [];
const xProfiles = [];
const twitchProfiles = [];
const otrosProfiles = [];

// Imágenes de Unsplash para usar
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

const getRandomImages = (count: number = 2) => {
  const shuffled = [...imageUrls].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const demoProfiles: Profile[] = [
  // Instagram (2 perfiles)
  ...instagramProfiles.map((p, i) => ({
    _id: generateId(i + 1),
    userId: 'demo',
    socialNetwork: 'instagram' as const,
    isActive: true,
    isPaid: true,
    paidUntil: null,
    planType: 'lifetime' as const,
    profileData: {
      handle: p.username,
      followers: p.followers,
      posts: p.posts,
      description: p.desc,
    },
    images: getRandomImages(2),
    link: `https://instagram.com/${p.username}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })),

  // TikTok (2 perfiles)
  ...tiktokProfiles.map((p, i) => ({
    _id: generateId(i + 3),
    userId: 'demo',
    socialNetwork: 'tiktok' as const,
    isActive: true,
    isPaid: true,
    paidUntil: null,
    planType: 'lifetime' as const,
    profileData: {
      username: p.username,
      followers: p.followers,
      videos: p.videos,
      description: p.desc,
    },
    images: getRandomImages(2),
    link: `https://tiktok.com/@${p.username}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })),

  // YouTube (2 perfiles)
  ...youtubeProfiles.map((p, i) => ({
    _id: generateId(i + 5),
    userId: 'demo',
    socialNetwork: 'youtube' as const,
    isActive: true,
    isPaid: true,
    paidUntil: null,
    planType: 'lifetime' as const,
    profileData: {
      channelName: p.channelName,
      subscribers: p.subscribers,
      videoCount: p.videoCount,
      description: p.desc,
    },
    images: getRandomImages(2),
    link: `https://youtube.com/@${p.channelName.toLowerCase().replace(/\s+/g, '')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })),

  // LinkedIn (1 perfil)
  ...linkedinProfiles.map((p, i) => ({
    _id: generateId(i + 7),
    userId: 'demo',
    socialNetwork: 'linkedin' as const,
    isActive: true,
    isPaid: true,
    paidUntil: null,
    planType: 'lifetime' as const,
    profileData: {
      fullName: p.name,
      headline: p.title,
      connections: p.connections,
      description: p.desc,
    },
    images: getRandomImages(1),
    link: `https://linkedin.com/in/${p.name.toLowerCase().replace(/\s+/g, '-')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })),

  // Facebook (1 perfil)
  ...facebookProfiles.map((p, i) => ({
    _id: generateId(i + 8),
    userId: 'demo',
    socialNetwork: 'facebook' as const,
    isActive: true,
    isPaid: true,
    paidUntil: null,
    planType: 'lifetime' as const,
    profileData: {
      pageName: p.pageName,
      likes: p.likes,
      description: p.desc,
    },
    images: getRandomImages(2),
    link: `https://facebook.com/${p.pageName.toLowerCase().replace(/\s+/g, '')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })),

  // X/Twitter (1 perfil)
  ...xProfiles.map((p, i) => ({
    _id: generateId(i + 9),
    userId: 'demo',
    socialNetwork: 'x' as const,
    isActive: true,
    isPaid: true,
    paidUntil: null,
    planType: 'lifetime' as const,
    profileData: {
      twitterHandle: p.handle,
      followers: p.followers,
      tweets: p.tweets,
      description: p.desc,
    },
    images: getRandomImages(1),
    link: `https://x.com/${p.handle}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })),

  // Twitch (1 perfil)
  ...twitchProfiles.map((p, i) => ({
    _id: generateId(i + 10),
    userId: 'demo',
    socialNetwork: 'twitch' as const,
    isActive: true,
    isPaid: true,
    paidUntil: null,
    planType: 'lifetime' as const,
    profileData: {
      streamerName: p.streamerName,
      followers: p.followers,
      game: p.game,
      description: p.desc,
    },
    images: getRandomImages(2),
    link: `https://twitch.tv/${p.streamerName.toLowerCase()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })),
];
