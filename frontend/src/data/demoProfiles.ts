import { Profile } from '@/types';

// Generar IDs únicos para perfiles demo (mantener prefijo demo- para lógica interna, pero no visible)
const generateId = (index: number) => `demo-${index.toString().padStart(2, '0')}`;

// Nombres y datos realistas para cada red social
const instagramProfiles = [
  { username: 'maria_fotografia', followers: 125000, posts: 342, desc: 'Fotógrafa profesional especializada en retratos y paisajes urbanos' },
  { username: 'chef_casero', followers: 89000, posts: 567, desc: 'Recetas caseras fáciles y deliciosas para el día a día' },
  { username: 'viajero_aventurero', followers: 234000, posts: 890, desc: 'Descubriendo los rincones más hermosos del mundo' },
  { username: 'fitness_life', followers: 156000, posts: 445, desc: 'Transforma tu cuerpo y mente con entrenamientos efectivos' },
  { username: 'moda_estilo', followers: 198000, posts: 678, desc: 'Tendencias de moda y estilo para todos los días' },
  { username: 'arte_creativo', followers: 67000, posts: 234, desc: 'Arte digital y tradicional. Inspiración visual diaria' },
  { username: 'mascotas_lindas', followers: 312000, posts: 1234, desc: 'Las mascotas más adorables del mundo' },
  { username: 'cocina_gourmet', followers: 145000, posts: 456, desc: 'Recetas gourmet y técnicas culinarias profesionales' },
];

const tiktokProfiles = [
  { username: 'bailes_trending', followers: 450000, videos: 234, desc: 'Los bailes más populares de TikTok' },
  { username: 'comedia_rapida', followers: 320000, videos: 567, desc: 'Sketchs cómicos y situaciones divertidas' },
  { username: 'tips_vida', followers: 189000, videos: 345, desc: 'Consejos útiles para mejorar tu vida diaria' },
  { username: 'cocina_rapida', followers: 278000, videos: 678, desc: 'Recetas rápidas y fáciles en menos de 60 segundos' },
  { username: 'fitness_rapido', followers: 234000, videos: 456, desc: 'Ejercicios rápidos para mantenerte en forma' },
  { username: 'mascotas_divertidas', followers: 567000, videos: 890, desc: 'Videos graciosos de mascotas' },
  { username: 'diy_proyectos', followers: 145000, videos: 234, desc: 'Proyectos DIY fáciles y creativos' },
  { username: 'musica_covers', followers: 389000, videos: 567, desc: 'Covers de las canciones más populares' },
];

const youtubeProfiles = [
  { channelName: 'Tech Reviews', subscribers: 890000, videoCount: 234, desc: 'Reviews honestas de los últimos gadgets tecnológicos' },
  { channelName: 'Cocina Fácil', subscribers: 456000, videoCount: 567, desc: 'Recetas paso a paso para cocinar en casa' },
  { channelName: 'Gaming Zone', subscribers: 1230000, videoCount: 890, desc: 'Gameplays, reviews y noticias de videojuegos' },
  { channelName: 'Fitness Total', subscribers: 678000, videoCount: 345, desc: 'Rutinas de ejercicio y consejos de nutrición' },
  { channelName: 'Viajes y Aventuras', subscribers: 345000, videoCount: 234, desc: 'Descubre destinos increíbles alrededor del mundo' },
  { channelName: 'Educación Online', subscribers: 567000, videoCount: 456, desc: 'Aprende nuevas habilidades desde casa' },
  { channelName: 'Música y Covers', subscribers: 789000, videoCount: 678, desc: 'Covers y música original' },
  { channelName: 'Lifestyle Diario', subscribers: 234000, videoCount: 345, desc: 'Vlogs y contenido de estilo de vida' },
];

const linkedinProfiles = [
  { name: 'Juan Pérez', title: 'CEO Tech Solutions', connections: 5000, desc: 'Emprendedor y líder en tecnología' },
  { name: 'María García', title: 'Directora de Marketing', connections: 3500, desc: 'Especialista en marketing digital y estrategia' },
  { name: 'Carlos López', title: 'Ingeniero de Software', connections: 2800, desc: 'Desarrollador full-stack con 10 años de experiencia' },
  { name: 'Ana Martínez', title: 'Consultora de Negocios', connections: 4200, desc: 'Ayudando empresas a crecer y mejorar' },
  { name: 'Roberto Sánchez', title: 'Diseñador UX/UI', connections: 1900, desc: 'Diseñando experiencias digitales excepcionales' },
  { name: 'Laura Fernández', title: 'Recursos Humanos', connections: 3100, desc: 'Especialista en talento y desarrollo organizacional' },
  { name: 'David Ruiz', title: 'Analista de Datos', connections: 2400, desc: 'Transformando datos en decisiones estratégicas' },
  { name: 'Sofía Torres', title: 'Product Manager', connections: 3600, desc: 'Gestionando productos digitales exitosos' },
];

const facebookProfiles = [
  { pageName: 'Noticias Tech', likes: 890000, desc: 'Las últimas noticias de tecnología' },
  { pageName: 'Cocina Casera', likes: 456000, desc: 'Recetas y tips de cocina para todos' },
  { pageName: 'Fitness y Salud', likes: 678000, desc: 'Consejos de salud y ejercicio' },
  { pageName: 'Viajes Baratos', likes: 345000, desc: 'Descubre destinos increíbles' },
  { pageName: 'Música Actual', likes: 1230000, desc: 'La mejor música del momento' },
  { pageName: 'Entretenimiento', likes: 567000, desc: 'Contenido divertido y entretenido' },
];

const xProfiles = [
  { handle: 'tech_news', followers: 234000, tweets: 5678, desc: 'Noticias de tecnología al instante' },
  { handle: 'deportes_live', followers: 456000, tweets: 8901, desc: 'Cobertura deportiva en tiempo real' },
  { handle: 'humor_diario', followers: 678000, tweets: 12345, desc: 'El mejor humor de internet' },
  { handle: 'ciencia_actual', followers: 189000, tweets: 2345, desc: 'Descubrimientos científicos y curiosidades' },
  { handle: 'economia_mundo', followers: 345000, tweets: 4567, desc: 'Análisis económico y financiero' },
  { handle: 'cultura_pop', followers: 567000, tweets: 6789, desc: 'Tendencias culturales y entretenimiento' },
];

const twitchProfiles = [
  { streamerName: 'GamerPro', followers: 234000, game: 'Valorant', desc: 'Streams diarios de gaming competitivo' },
  { streamerName: 'JustChatting', followers: 189000, game: 'Just Chatting', desc: 'Charla y comunidad todos los días' },
  { streamerName: 'SpeedRunner', followers: 145000, game: 'Mario', desc: 'Speedruns y retos de videojuegos' },
  { streamerName: 'MusicStream', followers: 278000, game: 'Music', desc: 'Música en vivo y DJ sets' },
  { streamerName: 'ArtStream', followers: 89000, game: 'Art', desc: 'Creación artística en directo' },
  { streamerName: 'CookingLive', followers: 156000, game: 'Cooking', desc: 'Cocina en vivo y recetas' },
];

const otrosProfiles = [
  { name: 'Blog Personal', desc: 'Mi blog personal sobre diversos temas' },
  { name: 'Portfolio Creativo', desc: 'Showcase de trabajos creativos' },
  { name: 'Tienda Online', desc: 'Productos únicos y exclusivos' },
];

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
  // Instagram (8 perfiles)
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

  // TikTok (8 perfiles)
  ...tiktokProfiles.map((p, i) => ({
    _id: generateId(i + 9),
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

  // YouTube (8 perfiles)
  ...youtubeProfiles.map((p, i) => ({
    _id: generateId(i + 17),
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

  // LinkedIn (8 perfiles)
  ...linkedinProfiles.map((p, i) => ({
    _id: generateId(i + 25),
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

  // Facebook (6 perfiles)
  ...facebookProfiles.map((p, i) => ({
    _id: generateId(i + 33),
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

  // X/Twitter (6 perfiles)
  ...xProfiles.map((p, i) => ({
    _id: generateId(i + 39),
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

  // Twitch (6 perfiles)
  ...twitchProfiles.map((p, i) => ({
    _id: generateId(i + 45),
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
