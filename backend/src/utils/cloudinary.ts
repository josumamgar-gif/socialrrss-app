import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Sube una imagen a Cloudinary desde un buffer
 * @param buffer Buffer de la imagen
 * @param folder Carpeta en Cloudinary (opcional)
 * @returns URL pública de la imagen
 */
export const uploadImageToCloudinary = async (
  buffer: Buffer,
  folder: string = 'profiles'
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          {
            quality: 'auto',
            fetch_format: 'auto',
          },
        ],
      },
      (error, result) => {
        if (error) {
          console.error('Error subiendo imagen a Cloudinary:', error);
          reject(error);
        } else if (result) {
          console.log('✅ Imagen subida a Cloudinary:', result.secure_url);
          resolve(result.secure_url);
        } else {
          reject(new Error('No se recibió resultado de Cloudinary'));
        }
      }
    );

    // Convertir buffer a stream
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

/**
 * Sube múltiples imágenes a Cloudinary
 * @param buffers Array de buffers de imágenes
 * @param folder Carpeta en Cloudinary (opcional)
 * @returns Array de URLs públicas
 */
export const uploadMultipleImagesToCloudinary = async (
  buffers: Buffer[],
  folder: string = 'profiles'
): Promise<string[]> => {
  const uploadPromises = buffers.map((buffer) =>
    uploadImageToCloudinary(buffer, folder)
  );
  return Promise.all(uploadPromises);
};

/**
 * Elimina una imagen de Cloudinary usando su URL pública
 * @param imageUrl URL pública de la imagen
 */
export const deleteImageFromCloudinary = async (
  imageUrl: string
): Promise<void> => {
  try {
    // Extraer el public_id de la URL
    const urlParts = imageUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    const publicId = filename.split('.')[0];
    const folder = urlParts[urlParts.length - 2];
    const fullPublicId = folder ? `${folder}/${publicId}` : publicId;

    const result = await cloudinary.uploader.destroy(fullPublicId);
    console.log('🗑️ Imagen eliminada de Cloudinary:', result);
  } catch (error) {
    console.error('Error eliminando imagen de Cloudinary:', error);
    throw error;
  }
};

export default cloudinary;
