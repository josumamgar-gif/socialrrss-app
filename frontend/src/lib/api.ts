import axios from 'axios';
import { User, Profile, ProfileStats, AuthResponse, PricingPlan } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Log para debugging (solo en desarrollo)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔗 API URL configurada:', API_URL);
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // El servidor respondió con un error
      console.error('❌ Error de API:', error.response.status, error.response.data);
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      console.error('❌ No se pudo conectar al servidor. Verifica que el backend esté funcionando.');
      console.error('🔗 URL intentada:', error.config?.url);
      console.error('🔗 Base URL:', API_URL);
    } else {
      // Algo más causó el error
      console.error('❌ Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Interceptor para añadir token a las peticiones
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Log para debugging (solo en desarrollo)
      if (process.env.NODE_ENV === 'development') {
        console.log('🔑 Token añadido a la petición:', config.url, 'Token:', token.substring(0, 20) + '...');
      }
    } else {
      // Log de advertencia si no hay token
      console.warn('⚠️ No se encontró token en localStorage para la petición:', config.url);
    }
  }
  // Si es FormData, eliminar Content-Type para que axios lo establezca automáticamente con el boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
    // Asegurar que el header Authorization se mantenga incluso con FormData
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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

  updateProfile: async (data: {
    username?: string;
    email?: string;
    fullName?: string;
    bio?: string;
    age?: number;
    location?: string;
    interests?: string[];
    favoriteSocialNetwork?: string;
  }): Promise<{ message: string; user: User }> => {
    const response = await api.put<{ message: string; user: User }>('/auth/profile', data);
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

// API de soporte
export const supportAPI = {
  sendMessage: async (data: {
    subject: string;
    message: string;
    email?: string;
  }): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/support', data);
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
    // Para FormData, axios establece automáticamente el Content-Type con el boundary correcto
    // El interceptor elimina el Content-Type cuando detecta FormData
    const response = await api.post<{ message: string; profile: Profile }>('/profiles', data);
    return response.data;
  },

  updateAutoRenewal: async (
    profileId: string,
    autoRenewal: boolean
  ): Promise<{ profile: Profile }> => {
    const response = await api.put<{ profile: Profile }>(`/profiles/${profileId}/auto-renewal`, {
      autoRenewal,
    });
    return response.data;
  },

  update: async (profileId: string, data: FormData): Promise<{ message: string; profile: Profile }> => {
    const response = await api.put<{ message: string; profile: Profile }>(`/profiles/${profileId}`, data);
    return response.data;
  },
};

// API de planes de pago
export const pricingAPI = {
  getPlans: async (): Promise<{
    plans: PricingPlan[];
    freePromotionAvailable?: boolean;
    remainingFreeSpots?: number;
  }> => {
    const response = await api.get<{
      plans: PricingPlan[];
      freePromotionAvailable?: boolean;
      remainingFreeSpots?: number;
    }>('/pricing');
    return response.data;
  },
};

// API de pagos
// API de promociones
export const promotionAPI = {
  checkAvailability: async (): Promise<{
    isAvailable: boolean;
    remainingSpots: number;
    totalSpots: number;
    usedSpots: number;
  }> => {
    const response = await api.get<{
      isAvailable: boolean;
      remainingSpots: number;
      totalSpots: number;
      usedSpots: number;
    }>('/promotion/availability');
    return response.data;
  },

  activateFreePromotion: async (): Promise<{
    message: string;
    promotion: {
      type: string;
      status: string;
      startDate: string;
      endDate: string;
      remainingDays: number;
    };
  }> => {
    const response = await api.post<{
      message: string;
      promotion: {
        type: string;
        status: string;
        startDate: string;
        endDate: string;
        remainingDays: number;
      };
    }>('/promotion/activate');
    return response.data;
  },

  getUserStatus: async (): Promise<{
    hasPromotion: boolean;
    promotion?: {
      type: string;
      status: string;
      startDate: string;
      endDate: string;
      remainingDays: number;
      isExpired: boolean;
    };
  }> => {
    const response = await api.get<{
      hasPromotion: boolean;
      promotion?: {
        type: string;
        status: string;
        startDate: string;
        endDate: string;
        remainingDays: number;
        isExpired: boolean;
      };
    }>('/promotion/status');
    return response.data;
  },
};

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

  resumePayment: async (paymentId: string): Promise<{ resumeUrl?: string | null; message?: string }> => {
    const response = await api.get<{ resumeUrl?: string | null; message?: string }>(`/payments/resume/${paymentId}`);
    return response.data;
  },

  deletePayment: async (paymentId: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/payments/${paymentId}`);
    return response.data;
  },

  sendReceipt: async (paymentId: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(`/payments/${paymentId}/send-receipt`);
    return response.data;
  },
};

export default api;

