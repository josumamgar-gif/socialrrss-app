// Utilidades para manejar cookies

export const setCookie = (name: string, value: string, days: number = 30) => {
  if (typeof window === 'undefined') return;
  
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
};

export const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;
  
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const deleteCookie = (name: string) => {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

// Guardar credenciales de login
export const saveLoginCredentials = (email: string, remember: boolean) => {
  if (remember) {
    setCookie('saved_email', email, 365); // Guardar por 1 año
  } else {
    deleteCookie('saved_email');
  }
};

// Obtener email guardado
export const getSavedEmail = (): string | null => {
  return getCookie('saved_email');
};


