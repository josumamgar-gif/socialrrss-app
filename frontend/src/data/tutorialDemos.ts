/**
 * Única fuente de perfiles demo en la app (tutorial / exploración).
 * No se mezclan con la API: hasta lanzamiento solo existen estos 3 en el feed.
 */
import { Profile, SocialNetwork } from '@/types';

export const TUTORIAL_DEMO_PROFILES: Profile[] = [
  {
    _id: 'demo-001',
    userId: 'demo',
    socialNetwork: 'instagram' as SocialNetwork,
    isActive: true,
    isPaid: true,
    profileData: {
      handle: '@lauraexplora',
      followers: 24800,
      following: 512,
      posts: 143,
      engagementRate: 4.2,
      category: 'viajes',
      language: 'es',
      country: 'España',
      accountType: 'creator',
      acceptsSponsorships: true,
      priceRange: '150 € – 400 € / post',
      description:
        '✈️ Viajera empedernida, fotógrafa amateur y adicta al café. Comparto rincones secretos de España y el mundo cada semana.',
    },
    images: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop&q=80'],
    link: 'https://instagram.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    paidUntil: null,
    planType: 'monthly',
  },
  {
    _id: 'demo-002',
    userId: 'demo',
    socialNetwork: 'tiktok' as SocialNetwork,
    isActive: true,
    isPaid: true,
    profileData: {
      username: '@migueldance_es',
      followers: 183500,
      videos: 278,
      totalLikes: 3200000,
      engagementRate: 8.7,
      category: 'entretenimiento',
      language: 'es',
      country: 'España',
      acceptsSponsorships: true,
      priceRange: '300 € – 900 € / vídeo',
      description:
        '🕺 Coreógrafo y creador de contenido. Mis challenges virales llegan a millones. Colaboro con marcas de moda y lifestyle.',
    },
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&q=80'],
    link: 'https://tiktok.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    paidUntil: null,
    planType: 'yearly',
  },
  {
    _id: 'demo-003',
    userId: 'demo',
    socialNetwork: 'youtube' as SocialNetwork,
    isActive: true,
    isPaid: true,
    profileData: {
      channelName: 'TechReviews ES',
      subscribers: 95400,
      videoCount: 312,
      totalViews: 8200000,
      avgViews: 26000,
      category: 'tecnologia',
      language: 'es',
      country: 'España',
      acceptsSponsorships: true,
      priceRange: '500 € – 2000 € / integración',
      description:
        '💻 Reviews de tecnología sin filtros. Análisis en profundidad de smartphones, portátiles y gadgets. Más de 8M de visualizaciones acumuladas.',
    },
    images: ['https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop&q=80'],
    link: 'https://youtube.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    paidUntil: null,
    planType: 'lifetime',
  },
];

export function getTutorialDemoById(id: string): Profile | undefined {
  return TUTORIAL_DEMO_PROFILES.find((p) => p._id === id);
}
