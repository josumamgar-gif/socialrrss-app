/**
 * Utilidad para construir URLs completas de imágenes del backend
 */
export const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '';
  
  // Si ya es una URL completa, usarla directamente
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Construir URL completa desde el backend
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const baseUrl = apiUrl.replace('/api', '');
  
  // Asegurar que la ruta empiece con /
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseUrl}${cleanPath}`;
};

/**
 * Placeholder image como base64 SVG
 */
export const placeholderImage = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='600' viewBox='0 0 400 600'%3E%3Crect width='400' height='600' fill='%23f3f4f6'/%3E%3Ctext x='200' y='300' text-anchor='middle' fill='%239ca3af' font-family='Arial' font-size='20'%3EImagen no disponible%3C/text%3E%3C/svg%3E";

/**
 * Opciones para compresión de imágenes
 */
interface CompressionOptions {
  maxWidth: number;
  maxHeight: number;
  quality: number;
  maxSizeMB: number;
}

/**
 * Comprime imágenes usando Canvas API
 */
export const compressImages = async (
  files: File[],
  options: CompressionOptions,
  onProgress?: (current: number, total: number) => void
): Promise<File[]> => {
  const compressedFiles: File[] = [];
  const total = files.length;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (onProgress) {
      onProgress(i + 1, total);
    }

    try {
      const compressedFile = await compressImage(file, options);
      compressedFiles.push(compressedFile);
    } catch (error) {
      console.error('Error comprimiendo imagen:', error);
      // Si falla la compresión, usar el archivo original
      compressedFiles.push(file);
    }
  }

  return compressedFiles;
};

/**
 * Comprime una sola imagen
 */
const compressImage = async (
  file: File,
  options: CompressionOptions
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calcular nuevas dimensiones manteniendo aspect ratio
        if (width > options.maxWidth || height > options.maxHeight) {
          const ratio = Math.min(
            options.maxWidth / width,
            options.maxHeight / height
          );
          width = width * ratio;
          height = height * ratio;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No se pudo obtener contexto del canvas'));
          return;
        }

        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir a blob y verificar tamaño
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Error al comprimir imagen'));
              return;
            }

            const maxSizeBytes = options.maxSizeMB * 1024 * 1024;
            if (blob.size <= maxSizeBytes) {
              // Si ya está dentro del límite, crear File
              const compressedFile = new File([blob], file.name, {
                type: blob.type || 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              // Si aún es muy grande, reducir calidad progresivamente
              let quality = options.quality;
              const reduceQuality = (): void => {
                canvas.toBlob(
                  (newBlob) => {
                    if (!newBlob) {
                      reject(new Error('Error al comprimir imagen'));
                      return;
                    }

                    if (newBlob.size <= maxSizeBytes || quality <= 0.1) {
                      const compressedFile = new File([newBlob], file.name, {
                        type: newBlob.type || 'image/jpeg',
                        lastModified: Date.now(),
                      });
                      resolve(compressedFile);
                    } else {
                      quality -= 0.1;
                      reduceQuality();
                    }
                  },
                  'image/jpeg',
                  quality
                );
              };
              reduceQuality();
            }
          },
          'image/jpeg',
          options.quality
        );
      };
      img.onerror = () => reject(new Error('Error al cargar imagen'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Error al leer archivo'));
    reader.readAsDataURL(file);
  });
};

/**
 * Formatea el tamaño de un archivo en bytes a una representación legible
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
