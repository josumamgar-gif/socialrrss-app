export type SocialNetwork = 'tiktok' | 'youtube' | 'twitch' | 'instagram' | 'facebook' | 'linkedin' | 'x' | 'otros';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  bio?: string;
  age?: number;
  location?: string;
  interests?: string[];
  favoriteSocialNetwork?: string;
}

export interface ProfileData {
  username?: string;
  followers?: number;
  videos?: number;
  channelName?: string;
  subscribers?: number;
  videoCount?: number;
  streamerName?: string;
  game?: string;
  handle?: string;
  posts?: number;
  pageName?: string;
  likes?: number;
  twitterHandle?: string;
  tweets?: number;
  websiteUrl?: string;
  customFields?: Record<string, any>;
  title?: string;
  description?: string;
}

export type PlanType = 'monthly' | 'yearly' | 'lifetime' | 'free_trial';
export type PaymentMethod = 'paypal' | 'card' | 'sepa' | 'stripe';

export interface Profile {
  _id: string;
  userId: string;
  socialNetwork: SocialNetwork;
  isActive: boolean;
  isPaid: boolean;
  autoRenewal?: boolean;
  paidUntil: string | null;
  planType: PlanType | null;
  profileData: ProfileData;
  images: string[];
  link: string;
  createdAt: string;
  updatedAt: string;
}

export interface PricingPlan {
  type: PlanType;
  name: string;
  price: number;
  currency: string;
  durationDays: number;
  description: string;
  features: string[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ProfileStats {
  views: number;
  clicks: number;
  swipesLeft: number;
  swipesRight: number;
  detailsViews: number;
}

