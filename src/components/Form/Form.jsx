import React, { useState, useEffect, useRef } from "react";
import "./Form.css";
import Typewriter from "../Typewriter/Typewriter";
import Loader from "../Loader/Loader";
import { STEP1_ITEMS, STEP3_ITEMS, STEP4_ITEMS } from "./formSteps";
import { submitFormData, saveFormProgress, loadFormProgress, clearFormProgress } from "../../utils/formSubmission";

/**
 * Основной компонент формы для проекта Before Life After Life
 * Обрабатывает многоступенчатый процесс заполнения формы, включая:
 * - Анимацию текста с эффектом печатной машинки
 * - Интерфейс загрузки изображений
 * - Сбор пользовательских данных
 */

const totalPrompts = 45;

// Подсказки для полей формы
const FIELD_HINTS = {
  "[2.2]": "We'll only use this for very rare updates about the project.",
  "[2.4]": "This prompt will influence how AI generates images from your archive.",
  "[2.6*]": "Your images will be used to train custom AI models for this project.",
  "[2.7*]": "Selected results may be displayed on this website and in exhibitions."
};

function Form({ onNavigate, onStepChange }) {
  // Основное управление состоянием
  const [step, setStep] = useState(0); // 0 = loader, 1-4 = шаги формы
  const [loaderComplete, setLoaderComplete] = useState(false);
  const [images, setImages] = useState(Array(totalPrompts).fill(null));
  const [completed, setCompleted] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showHints, setShowHints] = useState({}); // Управление видимостью подсказок
  const [isMobile, setIsMobile] = useState(false); // Определение мобильного устройства
  
  // Refs для элементов формы - для проверки кликов
  const formTextViewRef = useRef(null);
  const formDataViewRef = useRef(null);
  const formUploadViewRef = useRef(null);
  const formCompletedViewRef = useRef(null);
  const nextButtonRef = useRef(null);
  
  // Состояния для управления анимацией печатной машинки
  const [typedStep1Count, setTypedStep1Count] = useState(0);
  const [typedStep3Count, setTypedStep3Count] = useState(0);
  const [typedStep4Count, setTypedStep4Count] = useState(0);
  const [skipAnimations, setSkipAnimations] = useState(false); // Флаг для пропуска анимаций
  
  // Настройки анимации
  const CHAR_INTERVAL = 15; // Увеличиваем интервал для более плавной анимации
  
  // Управление мгновенным отображением текста для разработки
  // Установите в true чтобы отключить анимацию при разработке
  const isInstantText = false;

  // Обработчик клика для пропуска анимации
  const handleSkipAnimation = () => {
    // Пропускаем все текущие анимации независимо от флага skipAnimations
    if (step === 1 && typedStep1Count < STEP1_ITEMS.length) {
      setSkipAnimations(true);
      setTypedStep1Count(STEP1_ITEMS.length);
    } else if (step === 3 && typedStep3Count < STEP3_ITEMS.length) {
      setSkipAnimations(true);
      setTypedStep3Count(STEP3_ITEMS.length);
    } else if (completed && typedStep4Count < STEP4_ITEMS.length) {
      setSkipAnimations(true);
      setTypedStep4Count(STEP4_ITEMS.length);
    }
  };

  // Определение мобильного устройства
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Загрузка сохраненного прогресса при монтировании
  useEffect(() => {
    const savedProgress = loadFormProgress();
    if (savedProgress) {
      // Можно восстановить состояние формы если нужно
      // Пока оставляем как есть, чтобы не усложнять
    }
  }, []);

  // Обработчик завершения loader
  const handleLoaderComplete = () => {
    setLoaderComplete(true);
    setTimeout(() => setStep(1), 300); // Переход к первому шагу после loader
  };

  // Показать/скрыть подсказку для поля
  const handleFieldFocus = (fieldPrefix) => {
    if (FIELD_HINTS[fieldPrefix]) {
      setShowHints(prev => ({ ...prev, [fieldPrefix]: true }));
    }
  };

  const handleFieldBlur = (fieldPrefix) => {
    // Подсказка остается видимой после потери фокуса
    // Можно добавить задержку если нужно
  };

  // Обработчик завершения печати для шага 1
  const handleStep1Complete = () => {
    setTypedStep1Count(prev => {
      // Проверяем, не превышает ли следующее значение длину массива
      if (prev < STEP1_ITEMS.length) {
        return prev + 1;
      }
      return prev;
    });
  };

  // Сброс счетчиков печати при смене шага
  useEffect(() => {
    if (step === 1) setTypedStep1Count(0);
    if (step === 3) setTypedStep3Count(0);
  }, [step]);


  // Уведомление родительского компонента об изменении шага
  useEffect(() => {
    if (onStepChange && step > 0) {
      onStepChange(step);
    }
  }, [step, onStepChange]);

  // Обработка загрузки изображений от пользователя
  const handleImageUpload = (event, startIndex) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const newImages = [...images];
    
    // Загружаем файлы начиная с выбранной ячейки
    files.forEach((file, idx) => {
      const currentIndex = startIndex + idx;
      // Проверяем, что не выходим за пределы массива
      if (currentIndex < totalPrompts) {
        newImages[currentIndex] = URL.createObjectURL(file);
      }
    });

    setImages(newImages);
  };

  // Обработка отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // Собираем данные формы
    const formData = new FormData(e.target);
    const formValues = {
      name: formData.get('name') || '',
      email: formData.get('email') || '',
      origin: formData.get('origin') || '',
      customPrompt: customPrompt,
      payment: formData.get('payment') || '',
      train_ai: formData.get('train_ai') || '',
      publicly: formData.get('publicly') || '',
    };

    // Сохраняем прогресс перед отправкой
    saveFormProgress({
      step,
      formValues,
      imagesCount: images.filter(img => img !== null).length,
    });

    // Отправляем данные через EmailJS
    const result = await submitFormData(formValues, images);

    if (result.success) {
      // Очищаем сохраненный прогресс после успешной отправки
      clearFormProgress();
      setCompleted(true);
      setTypedStep4Count(0);
    } else {
      setSubmitError(result.message || 'Ошибка при отправке формы');
      console.error('Form submission error:', result.error);
    }

    setIsSubmitting(false);
  };

  // Если loader не завершен, показываем loader
  if (step === 0 || !loaderComplete) {
    return (
      <Loader 
        text="before life" 
        onComplete={handleLoaderComplete}
        charInterval={50}
      />
    );
  }

  // Обработчик клика в пустоте для возврата на главную
  const handleContainerClick = (e) => {
    const clickedElement = e.target;
    
    // Проверяем через классы в первую очередь - это работает даже если элементы еще не полностью загружены
    // Включаем кнопки в список элементов формы, чтобы они работали
    const isFormElementByClass = clickedElement.closest('.form-text-view, .form-data-view, .form-upload-view, .form-completed-view, .form-text-list, .form-text-list-element, .form-data-view-form, .form-data-field, .form-image-grid, .form-grid-cell') || clickedElement.closest('button');
    
    // Также проверяем через refs если они доступны
    const isFormElementByRef = 
      (formTextViewRef.current && formTextViewRef.current.contains(clickedElement)) ||
      (formDataViewRef.current && formDataViewRef.current.contains(clickedElement)) ||
      (formUploadViewRef.current && formUploadViewRef.current.contains(clickedElement)) ||
      (formCompletedViewRef.current && formCompletedViewRef.current.contains(clickedElement));
    
    // Если клик на элементе формы - не обрабатываем и останавливаем всплытие
    if (isFormElementByClass || isFormElementByRef) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    
    // Проверяем, идет ли анимация - если да, не переходим на главную
    const isAnimationInProgress = 
      (step === 1 && typedStep1Count < STEP1_ITEMS.length) ||
      (step === 3 && typedStep3Count < STEP3_ITEMS.length) ||
      (completed && typedStep4Count < STEP4_ITEMS.length);
    
    // Переход на главную только если клик точно на контейнере (пустое место) И анимация не идет
    if (clickedElement === e.currentTarget && !isAnimationInProgress) {
      if (onNavigate) {
        onNavigate("gallery");
      }
    }
  };

  return (
    <div 
      className="form-container" 
      onClickCapture={(e) => {
        // Перехватываем событие в фазе capture
        const clickedElement = e.target;
        
        // НЕ блокируем кнопки формы - они должны работать
        const isFormButton = clickedElement.classList.contains('form-text-next-button') || 
                             clickedElement.closest('.form-text-next-button') ||
                             clickedElement.classList.contains('form-upload-button') ||
                             clickedElement.closest('.form-upload-button');
        if (isFormButton) {
          console.log('Form button detected in container onClickCapture, allowing it');
          return; // Не блокируем кнопку
        }
        
        // Проверяем через классы - это работает даже если элементы еще не полностью загружены
        const isFormElementByClass = clickedElement.closest('.form-text-view, .form-data-view, .form-upload-view, .form-completed-view, .form-text-list, .form-text-list-element, .form-data-view-form, .form-data-field, .form-image-grid, .form-grid-cell');
        
        // Также проверяем через refs если они доступны
        const isFormElementByRef = 
          (formTextViewRef.current && formTextViewRef.current.contains(clickedElement)) ||
          (formDataViewRef.current && formDataViewRef.current.contains(clickedElement)) ||
          (formUploadViewRef.current && formUploadViewRef.current.contains(clickedElement)) ||
          (formCompletedViewRef.current && formCompletedViewRef.current.contains(clickedElement));
        
        // Если клик на элементе формы - останавливаем всплытие до контейнера
        if (isFormElementByClass || isFormElementByRef) {
          e.stopPropagation();
        }
      }}
      onClick={(e) => {
        // Дублируем проверку в onClick для надежности
        const clickedElement = e.target;
        
        // НЕ блокируем кнопки формы - они должны работать
        const isFormButton = clickedElement.classList.contains('form-text-next-button') || 
                             clickedElement.closest('.form-text-next-button') ||
                             clickedElement.classList.contains('form-upload-button') ||
                             clickedElement.closest('.form-upload-button');
        if (isFormButton) {
          console.log('Form button detected in container onClick, allowing it');
          return; // Не блокируем кнопку
        }
        
        // Проверяем через классы в первую очередь
        const isFormElementByClass = clickedElement.closest('.form-text-view, .form-data-view, .form-upload-view, .form-completed-view, .form-text-list, .form-text-list-element, .form-data-view-form, .form-data-field, .form-image-grid, .form-grid-cell');
        
        // Также проверяем через refs если они доступны
        const isFormElementByRef = 
          (formTextViewRef.current && formTextViewRef.current.contains(clickedElement)) ||
          (formDataViewRef.current && formDataViewRef.current.contains(clickedElement)) ||
          (formUploadViewRef.current && formUploadViewRef.current.contains(clickedElement)) ||
          (formCompletedViewRef.current && formCompletedViewRef.current.contains(clickedElement));
        
        // Если клик на элементе формы - останавливаем всплытие, но НЕ вызываем handleContainerClick
        if (isFormElementByClass || isFormElementByRef) {
          e.stopPropagation();
          return;
        }
        
        // Вызываем оригинальный обработчик только если клик не на форме (пустое место)
        handleContainerClick(e);
      }}
    >
      {!completed ? (
        <>
          {/* Секция отображения текста с эффектом печатной машинки */}
          {/* На мобильных скрываем если шаг > 1, на десктопе показываем всегда с dimmed */}
          <div 
            ref={formTextViewRef}
            className={`form-text-view ${step > 1 ? "dimmed" : ""} ${isMobile && step > 1 ? "form-step-hidden" : ""}`} 
            onClick={(e) => {
              // Если клик на кнопке Next - НЕ обрабатываем и НЕ блокируем
              const isNextButton = e.target.classList.contains('form-text-next-button') || 
                                   e.target.closest('.form-text-next-button') ||
                                   e.target === nextButtonRef.current;
              if (isNextButton) {
                console.log('Click on Next button detected in form-text-view onClick, allowing it');
                // НЕ вызываем stopPropagation для кнопки!
                return;
              }
              // Останавливаем всплытие, чтобы не переходить на главную
              e.stopPropagation();
              // Пропускаем анимацию при клике на область текста
              if (step === 1 && typedStep1Count < STEP1_ITEMS.length) {
                handleSkipAnimation();
              }
            }}
            onMouseDown={(e) => {
              // Если клик на кнопке Next - НЕ обрабатываем
              if (e.target.classList.contains('form-text-next-button') || 
                  e.target.closest('.form-text-next-button')) {
                return;
              }
              // Останавливаем всплытие для пропуска анимации
              e.stopPropagation();
              // Пропускаем анимацию при клике на область текста
              if (step === 1 && typedStep1Count < STEP1_ITEMS.length) {
                handleSkipAnimation();
              }
            }}
            style={{ cursor: step === 1 && typedStep1Count < STEP1_ITEMS.length ? 'pointer' : 'default' }}
            title={step === 1 && typedStep1Count < STEP1_ITEMS.length ? 'Кликните, чтобы пропустить анимацию' : ''}
          >
            <ul className="form-text-list">
              {STEP1_ITEMS.map((item, idx) => {
                const isComplete = idx < typedStep1Count;
                const isTyping = idx === typedStep1Count;
                
                return (
                    <li 
                      key={idx} 
                      className="form-text-list-element"
                    >
                    {(isComplete || isTyping) && (
                      <>
                          <span>
                            {item.prefix}
                          </span>
                        {isComplete ? (
                            <p>
                              {item.text}
                            </p>
                        ) : (
                            <div>
                          <Typewriter
                            key={`typewriter-${idx}`}
                            text={item.text}
                            charInterval={CHAR_INTERVAL}
                            onComplete={handleStep1Complete}
                                isInstant={isInstantText || skipAnimations}
                          />
                            </div>
                        )}
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
            {step === 1 && typedStep1Count >= STEP1_ITEMS.length && (
              <button
                ref={nextButtonRef}
                className="form-text-next-button"
                type="button"
                onClick={(e) => {
                  console.log('DIRECT onClick on Next button!');
                  e.stopPropagation();
                  e.preventDefault();
                  console.log('Calling setStep(2), current step:', step);
                  setStep(2);
                  console.log('setStep(2) called');
                }}
                style={{ pointerEvents: 'auto', zIndex: 1000, position: 'relative' }}
              >
                [Next]
              </button>
            )}
          </div>

          {/* Секция сетки для загрузки изображений */}
          {/* На мобильных показываем только на шаге 2, на десктопе показываем всегда с dimmed */}
          {step > 1 && (
            <div 
              ref={formUploadViewRef}
              className={`form-upload-view ${step === 3 ? "dimmed" : ""} ${isMobile && step !== 2 ? "form-step-hidden" : ""}`} 
              onClickCapture={(e) => {
                // НЕ блокируем кнопку upload - она должна работать
                const isUploadButton = e.target.classList.contains('form-upload-button') || 
                                      e.target.closest('.form-upload-button');
                if (!isUploadButton) {
                  e.stopPropagation();
                }
              }}
              onClick={(e) => {
                // НЕ блокируем кнопку upload - она должна работать
                const isUploadButton = e.target.classList.contains('form-upload-button') || 
                                      e.target.closest('.form-upload-button');
                if (!isUploadButton) {
                  e.stopPropagation();
                }
              }}
            >
              <div className="form-upload-header">
                <span>[1]</span>
                <p>Drag and drop between 13 and 42 images below</p>
              </div>
              <div className="form-image-grid">
                {Array.from({ length: 42 }, (_, i) => (
                  <div key={i} className="form-grid-cell">
                    {images[i] ? (
                      <img loading="lazy" src={images[i]} alt={`Upload ${i + 1}`} />
                    ) : (
                      <label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleImageUpload(e, i)}
                          style={{ display: "none" }}
                        />
                      </label>
                    )}
                  </div>
                ))}
              </div>
              {step === 2 && (
                <button
                  className="form-upload-button"
                  onClick={(e) => {
                    console.log('Upload button clicked!');
                    e.stopPropagation();
                    e.preventDefault();
                    console.log('Calling setStep(3), current step:', step);
                    setStep(3);
                    console.log('setStep(3) called');
                  }}
                  disabled={!images.some((img) => img !== null)}
                  type="button"
                >
                  [UPLOAD]
                </button>
              )}
            </div>
          )}

          {/* Форма для имени и данных */}
          {/* На мобильных показываем только на шаге 3 */}
          {step === 3 && (
            <div 
              ref={formDataViewRef}
              className={`form-data-view ${isMobile && step !== 3 ? "form-step-hidden" : ""}`} 
              onClickCapture={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                // Пропускаем анимацию при клике на область формы
                if (typedStep3Count < STEP3_ITEMS.length) {
                  handleSkipAnimation();
                }
              }}
              style={{ cursor: typedStep3Count < STEP3_ITEMS.length ? 'pointer' : 'default' }}
              title={typedStep3Count < STEP3_ITEMS.length ? 'Кликните, чтобы пропустить анимацию' : ''}
            >
              <form className="form-data-view-form" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
                {STEP3_ITEMS.map((item, idx) => {
                  const isComplete = idx < typedStep3Count;
                  const isTyping = idx === typedStep3Count;

                  return (
                    <div key={idx} className="form-data-field">
                      {(isComplete || isTyping) && (
                        <>
                          {item.prefix && <span>{item.prefix}</span>}
                          <div className="form-data-field-content">
                            {isComplete ? (
                              <p className={item.isItalic ? "italic" : ""}>{item.text}</p>
                            ) : isTyping ? (
                              <Typewriter
                                text={item.text}
                                charInterval={CHAR_INTERVAL}
                                onComplete={() => setTypedStep3Count(prev => prev + 1)}
                                isInstant={isInstantText || skipAnimations}
                              />
                            ) : null}

                            {isComplete && (
                              <>
                                {item.prefix === "[2.1]" && (
                                  <input type="text" name="name" required />
                                )}
                                {item.prefix === "[2.2]" && (
                                  <div className="form-field-wrapper">
                                    <input 
                                      type="email" 
                                      name="email" 
                                      required
                                      onFocus={() => handleFieldFocus("[2.2]")}
                                      onBlur={() => handleFieldBlur("[2.2]")}
                                    />
                                    {showHints["[2.2]"] && (
                                      <div className="form-field-hint">
                                        {FIELD_HINTS["[2.2]"]}
                                      </div>
                                    )}
                                  </div>
                                )}
                                {item.prefix === "[2.3]" && (
                                  <input type="text" name="origin" />
                                )}
                                {item.prefix === "[2.4]" && (
                                  <div className="form-field-wrapper">
                                    <input
                                      type="text"
                                      placeholder="Suggest your own prompt"
                                      value={customPrompt}
                                      onChange={(e) => setCustomPrompt(e.target.value)}
                                      required
                                      onFocus={() => handleFieldFocus("[2.4]")}
                                      onBlur={() => handleFieldBlur("[2.4]")}
                                    />
                                    {showHints["[2.4]"] && (
                                      <div className="form-field-hint">
                                        {FIELD_HINTS["[2.4]"]}
                                      </div>
                                    )}
                                  </div>
                                )}
                                {item.prefix === "[2.5]" && (
                                  <div className="radio-group">
                                    <label>
                                      <input type="radio" name="payment" value="yes" required /> [YES]
                                    </label>
                                    <label>
                                      <input type="radio" name="payment" value="no" required /> [NO], I participate voluntarily.
                                    </label>
                                  </div>
                                )}
                                {item.prefix === "[2.6*]" && (
                                  <div className="form-field-wrapper">
                                    <div className="radio-group">
                                      <label>
                                        <input 
                                          type="radio" 
                                          name="train_ai" 
                                          value="yes" 
                                          required
                                          onFocus={() => handleFieldFocus("[2.6*]")}
                                        /> [YES]
                                      </label>
                                      <label>
                                        <input 
                                          type="radio" 
                                          name="train_ai" 
                                          value="no" 
                                          required
                                          onFocus={() => handleFieldFocus("[2.6*]")}
                                        /> [NO]
                                      </label>
                                    </div>
                                    {showHints["[2.6*]"] && (
                                      <div className="form-field-hint">
                                        {FIELD_HINTS["[2.6*]"]}
                                      </div>
                                    )}
                                  </div>
                                )}
                                {item.prefix === "[2.7*]" && (
                                  <div className="form-field-wrapper">
                                    <div className="radio-group">
                                      <label>
                                        <input 
                                          type="radio" 
                                          name="publicly" 
                                          value="yes" 
                                          required
                                          onFocus={() => handleFieldFocus("[2.7*]")}
                                        /> [YES]
                                      </label>
                                      <label>
                                        <input 
                                          type="radio" 
                                          name="publicly" 
                                          value="no" 
                                          required
                                          onFocus={() => handleFieldFocus("[2.7*]")}
                                        /> [NO]
                                      </label>
                                    </div>
                                    {showHints["[2.7*]"] && (
                                      <div className="form-field-hint">
                                        {FIELD_HINTS["[2.7*]"]}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}

                {typedStep3Count >= STEP3_ITEMS.length && (
                  <div>
                    {submitError && (
                      <div className="form-error-message">
                        {submitError}
                      </div>
                    )}
                    <button 
                      type="submit" 
                      className="form-data-view-submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? '[SUBMITTING...]' : '[COMPLETE]'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}
        </>
      ) : (
        <div 
          ref={formCompletedViewRef}
          className="form-completed-view" 
          onClickCapture={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            // Пропускаем анимацию при клике на область завершения
            if (typedStep4Count < STEP4_ITEMS.length) {
              handleSkipAnimation();
            }
          }}
          style={{ cursor: typedStep4Count < STEP4_ITEMS.length ? 'pointer' : 'default' }}
          title={typedStep4Count < STEP4_ITEMS.length ? 'Кликните, чтобы пропустить анимацию' : ''}
        >
          <div className="form-completed-text">
            {STEP4_ITEMS.map((item, idx) => {
              const isComplete = idx < typedStep4Count;
              const isTyping = idx === typedStep4Count;
              if (!isComplete && !isTyping) return null;
              return (
                <div key={idx} className="form-completed-list-element">
                  <span>{item.prefix}</span>
                  {isComplete ? (
                    <p>{item.text}</p>
                  ) : (
                    <Typewriter
                      text={item.text}
                      charInterval={CHAR_INTERVAL}
                      onComplete={() => setTypedStep4Count((c) => c + 1)}
                      isInstant={skipAnimations}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <button
            className="learn-more-button"
            onClick={() => onNavigate("text")}
          >
            [learn more]
          </button>
        </div>
      )}
    </div>
  );
}

export default Form;
