import emailjs from '@emailjs/browser';

/**
 * Конфигурация EmailJS
 * Эти значения нужно будет настроить в EmailJS dashboard
 */
const EMAILJS_CONFIG = {
  serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID || 'your_service_id',
  templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'your_template_id',
  publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'your_public_key',
};

/**
 * Подготовка данных формы для отправки
 * @param {Object} formData - Данные формы
 * @param {Array} images - Массив изображений (File objects или URLs)
 * @returns {Object} Подготовленные данные
 */
const prepareFormData = (formData, images) => {
  const uploadedImagesCount = images.filter(img => img !== null).length;
  
  return {
    name: formData.name || '',
    email: formData.email || '',
    origin: formData.origin || '',
    customPrompt: formData.customPrompt || '',
    payment: formData.payment || '',
    trainAi: formData.train_ai || '',
    publicly: formData.publicly || '',
    imagesCount: uploadedImagesCount,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Отправка данных формы через EmailJS
 * @param {Object} formData - Данные формы
 * @param {Array} images - Массив изображений
 * @returns {Promise} Promise с результатом отправки
 */
export const submitFormData = async (formData, images) => {
  try {
    const preparedData = prepareFormData(formData, images);
    
    // Преобразуем данные в формат для EmailJS
    const templateParams = {
      from_name: preparedData.name || 'Anonymous',
      from_email: preparedData.email || 'no-email@provided.com',
      origin: preparedData.origin || 'Not specified',
      custom_prompt: preparedData.customPrompt || 'Not provided',
      payment: preparedData.payment || 'Not specified',
      train_ai: preparedData.trainAi || 'Not specified',
      publicly: preparedData.publicly || 'Not specified',
      images_count: preparedData.imagesCount.toString(),
      timestamp: preparedData.timestamp,
      message: JSON.stringify(preparedData, null, 2), // Полные данные в JSON формате
    };

    // Отправка через EmailJS
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams,
      EMAILJS_CONFIG.publicKey
    );

    return {
      success: true,
      message: 'Form submitted successfully',
      response,
    };
  } catch (error) {
    console.error('Error submitting form:', error);
    return {
      success: false,
      message: 'Failed to submit form. Please try again.',
      error: error.message || 'Unknown error',
    };
  }
};

/**
 * Сохранение прогресса формы в localStorage
 * @param {Object} formState - Состояние формы
 */
export const saveFormProgress = (formState) => {
  try {
    localStorage.setItem('formProgress', JSON.stringify(formState));
  } catch (error) {
    console.error('Error saving form progress:', error);
  }
};

/**
 * Загрузка прогресса формы из localStorage
 * @returns {Object|null} Сохраненное состояние или null
 */
export const loadFormProgress = () => {
  try {
    const saved = localStorage.getItem('formProgress');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Error loading form progress:', error);
    return null;
  }
};

/**
 * Очистка сохраненного прогресса формы
 */
export const clearFormProgress = () => {
  try {
    localStorage.removeItem('formProgress');
  } catch (error) {
    console.error('Error clearing form progress:', error);
  }
};

