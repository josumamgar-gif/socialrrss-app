export type PasswordStrengthResult = { valid: boolean; message?: string };

/** Misma lógica que el backend: mínimo 8 caracteres, al menos una letra y un número. */
export function validatePasswordStrength(password: string): PasswordStrengthResult {
  if (password.length < 8) {
    return { valid: false, message: 'La contraseña debe tener al menos 8 caracteres.' };
  }
  if (!/[a-zA-Z]/.test(password)) {
    return { valid: false, message: 'La contraseña debe incluir al menos una letra.' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'La contraseña debe incluir al menos un número.' };
  }
  return { valid: true };
}

export function passwordRequirementsMet(password: string) {
  return {
    length: password.length >= 8,
    letter: /[a-zA-Z]/.test(password),
    number: /[0-9]/.test(password),
  };
}
