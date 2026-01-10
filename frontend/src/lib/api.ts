import axios from 'axios';
import { User, Profile, ProfileStats, AuthResponse, PricingPlan } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir token a las peticiones
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// API de autenticación
export const authAPI = {
  register: async (userData: {
    username: string;
    email: string;
    password: string;
    fullName?: string;
    bio?: string;
    age?: number;
    location?: string;
    interests?: string[];
    favoriteSocialNetwork?: string;
  }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  getMe: async (): Promise<{ user: User }> => {
    const response = await api.get<{ user: User }>('/auth/me');
    return response.data;
  },

  updateProfile: async (username?: string, email?: string): Promise<{ message: string; user: User }> => {
    const response = await api.put<{ message: string; user: User }>('/auth/profile', {
      username,
      email,
    });
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    const response = await api.put<{ message: string }>('/auth/password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

// API de perfiles
export const profilesAPI = {
  getAll: async (): Promise<{ profiles: Profile[] }> => {
    const response = await api.get<{ profiles: Profile[] }>('/profiles');
    return response.data;
  },

  getMyProfiles: async (): Promise<{ profiles: Profile[] }> => {
    const response = await api.get<{ profiles: Profile[] }>('/profiles/my-profiles');
    return response.data;
  },

  create: async (data: FormData): Promise<{ message: string; profile: Profile }> => {
    const response = await api.post<{ message: string; profile: Profile }>('/profiles', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// API de planes de pago
export const pricingAPI = {
  getPlans: async (): Promise<{ plans: PricingPlan[] }> => {
    const response = await api.get<{ plans: PricingPlan[] }>('/pricing');
    return response.data;
  },
};

// API de pagos
export const paymentsAPI = {
  createOrder: async (
    profileId: string,
    planType: string,
    paymentMethod: string = 'paypal'
  ): Promise<{
    orderId?: string;
    paymentId: string;
    approvalUrl?: string;
    clientSecret?: string;
    stripePaymentId?: string;
    plan: any;
  }> => {
    const response = await api.post<{
      orderId?: string;
      paymentId: string;
      approvalUrl?: string;
      clientSecret?: string;
      stripePaymentId?: string;
      plan: any;
    }>('/payments/create-order', {
      profileId,
      planType,
      paymentMethod,
    });
    return response.data;
  },

  captureOrder: async (
    orderId?: string,
    paymentId?: string,
    paymentMethodId?: string
  ): Promise<{ message: string; requiresAction?: boolean }> => {
    const response = await api.post<{ message: string; requiresAction?: boolean }>('/payments/capture-order', {
      orderId,
      paymentId,
      paymentMethodId,
    });
    return response.data;
  },

  checkPaymentStatus: async (paymentId: string): Promise<{ status: string; stripeStatus?: string }> => {
    const response = await api.get<{ status: string; stripeStatus?: string }>(`/payments/status/${paymentId}`);
    return response.data;
  },

  getHistory: async (): Promise<{ payments: any[] }> => {
    const response = await api.get<{ payments: any[] }>('/payments/history');
    return response.data;
  },

  getPendingPayments: async (): Promise<{ payments: any[] }> => {
    const response = await api.get<{ payments: any[] }>('/payments/pending');
    return response.data;
  },

  deletePayment: async (paymentId: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/payments/${paymentId}`);
    return response.data;
  },
};

export default api;

