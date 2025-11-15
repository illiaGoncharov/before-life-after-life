/**
 * Утилита для загрузки изображений в Cloudinary
 * 
 * Cloudinary предоставляет бесплатный тариф:
 * - 25GB хранилища
 * - 25GB трафика в месяц
 * - Автоматическая оптимизация изображений
 * - CDN для быстрой загрузки
 * 
 * Настройка:
 * 1. Зарегистрируйтесь на https://cloudinary.com/
 * 2. Получите Cloud Name, API Key и API Secret из Dashboard
 * 3. Добавьте в .env:
 *    REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
 *    REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_upload_preset (опционально, для unsigned uploads)
 */

const CLOUDINARY_CONFIG = {
  cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || '',
  uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'ml_default', // Для unsigned uploads
};

/**
 * Загрузка одного изображения в Cloudinary
 * @param {File} file - Файл изображения
 * @param {number} index - Индекс изображения (для уникального имени)
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export const uploadImageToCloudinary = async (file, index = 0) => {
  if (!CLOUDINARY_CONFIG.cloudName) {
    console.error('Cloudinary cloud name not configured');
    return {
      success: false,
      error: 'Cloudinary не настроен. Пожалуйста, добавьте REACT_APP_CLOUDINARY_CLOUD_NAME в .env',
    };
  }

  try {
    // Создаем FormData для загрузки
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('folder', 'before-life-after-life'); // Папка для организации файлов
    formData.append('public_id', `image_${Date.now()}_${index}`); // Уникальное имя файла

    // Загружаем в Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      url: data.secure_url, // HTTPS URL изображения
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      bytes: data.bytes,
    };
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    return {
      success: false,
      error: error.message || 'Ошибка при загрузке изображения',
    };
  }
};

/**
 * Загрузка массива изображений в Cloudinary
 * @param {Array<File>} files - Массив файлов изображений
 * @returns {Promise<Array<{success: boolean, url?: string, error?: string}>>}
 */
export const uploadImagesToCloudinary = async (files) => {
  if (!files || files.length === 0) {
    return [];
  }

  // Фильтруем только валидные файлы
  const validFiles = files.filter(file => file instanceof File);
  
  if (validFiles.length === 0) {
    return [];
  }

  // Загружаем все изображения параллельно
  const uploadPromises = validFiles.map((file, index) => 
    uploadImageToCloudinary(file, index)
  );

  try {
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Error uploading images batch:', error);
    return files.map(() => ({
      success: false,
      error: 'Ошибка при загрузке изображений',
    }));
  }
};

