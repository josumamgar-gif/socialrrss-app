/**
 * Utilidades para optimizar y comprimir imágenes antes de subirlas
 */

interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeMB?: number;
}

/**
 * Comprime una imagen usando Canvas API
 */
export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<File> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.85,
    maxSizeMB = 2,
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo la proporción
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }
        
        // Crear canvas y redimensionar
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No se pudo crear el contexto del canvas'));
          return;
        }
        
        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height);
        
        // Determinar el tipo MIME (mantener el original o usar JPEG)
        const outputType = file.type.startsWith('image/') ? file.type : 'image/jpeg';
        
        // Convertir a blob con calidad especificada
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Error al comprimir la imagen'));
              return;
            }
            
            // Verificar tamaño final
            const sizeMB = blob.size / (1024 * 1024);
            
            // Si aún es muy grande, reducir calidad progresivamente
            if (sizeMB > maxSizeMB) {
              let currentQuality = quality;
              const reduceQuality = () => {
                if (currentQuality <= 0.3) {
                  // Si ya está en calidad mínima, aceptar el tamaño
                  const finalFile = new File([blob], file.name, {
                    type: outputType,
                    lastModified: Date.now(),
                  });
                  resolve(finalFile);
                  return;
                }
                
                currentQuality = Math.max(0.3, currentQuality - 0.1);
                canvas.toBlob(
                  (newBlob) => {
                    if (!newBlob) {
                      const finalFile = new File([blob], file.name, {
                        type: outputType,
                        lastModified: Date.now(),
                      });
                      resolve(finalFile);
                      return;
                    }
                    
                    const newSizeMB = newBlob.size / (1024 * 1024);
                    if (newSizeMB <= maxSizeMB) {
                      const finalFile = new File([newBlob], file.name, {
                        type: outputType,
                        lastModified: Date.now(),
                      });
                      resolve(finalFile);
                    } else {
                      reduceQuality();
                    }
                  },
                  outputType,
                  currentQuality
                );
              };
              
              reduceQuality();
            } else {
              // Tamaño aceptable, crear archivo
              const finalFile = new File([blob], file.name, {
                type: outputType,
                lastModified: Date.now(),
              });
              resolve(finalFile);
            }
          },
          outputType,
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Error al cargar la imagen'));
      };
      
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Comprime múltiples imágenes
 */
export async function compressImages(
  files: File[],
  options: CompressOptions = {},
  onProgress?: (current: number, total: number) => void
): Promise<File[]> {
  const compressedFiles: File[] = [];
  
  for (let i = 0; i < files.length; i++) {
    try {
      const compressed = await compressImage(files[i], options);
      compressedFiles.push(compressed);
      
      if (onProgress) {
        onProgress(i + 1, files.length);
      }
    } catch (error) {
      console.error(`Error comprimiendo imagen ${i + 1}:`, error);
      // Si falla la compresión, usar el archivo original
      compressedFiles.push(files[i]);
    }
  }
  
  return compressedFiles;
}

/**
 * Formatea el tamaño de archivo en formato legible
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
