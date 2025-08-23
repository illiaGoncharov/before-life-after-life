import React, { useState, useEffect } from "react";
import "./Form.css";
import Typewriter from "../Typewriter/Typewriter";
import { STEP1_ITEMS, STEP3_ITEMS, STEP4_ITEMS } from "./formSteps";

/**
 * Основной компонент формы для проекта Before Life After Life
 * Обрабатывает многоступенчатый процесс заполнения формы, включая:
 * - Анимацию текста с эффектом печатной машинки
 * - Интерфейс загрузки изображений
 * - Сбор пользовательских данных
 */

const totalPrompts = 45;

function Form({ onNavigate, onStepChange }) {
  // Основное управление состоянием
  const [step, setStep] = useState(1);
  const [images, setImages] = useState(Array(totalPrompts).fill(null));
  const [completed, setCompleted] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  
  // Состояния для управления анимацией печатной машинки
  const [typedStep1Count, setTypedStep1Count] = useState(0);
  const [typedStep3Count, setTypedStep3Count] = useState(0);
  const [typedStep4Count, setTypedStep4Count] = useState(0);
  
  // Настройки анимации
  const CHAR_INTERVAL = 15; // Увеличиваем интервал для более плавной анимации
  
  // Управление мгновенным отображением текста для разработки
  // Установите в true чтобы отключить анимацию при разработке
  const isInstantText = false;

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
    if (onStepChange) onStepChange(step);
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
  const handleSubmit = (e) => {
    e.preventDefault();
    setCompleted(true);
    setTypedStep4Count(0);
  };

  return (
    <div className="form-container">
      {!completed ? (
        <>
          {/* Секция отображения текста с эффектом печатной машинки */}
          <div className={`form-text-view ${step > 1 ? "dimmed" : ""}`}>
            <ul className="form-text-list">
              {STEP1_ITEMS.map((item, idx) => {
                const isComplete = idx < typedStep1Count;
                const isTyping = idx === typedStep1Count;
                
                return (
                  <li key={idx} className="form-text-list-element">
                    {(isComplete || isTyping) && (
                      <>
                        <span>{item.prefix}</span>
                        {isComplete ? (
                          <p>{item.text}</p>
                        ) : (
                          <Typewriter
                            key={`typewriter-${idx}`}
                            text={item.text}
                            charInterval={CHAR_INTERVAL}
                            onComplete={handleStep1Complete}
                            isInstant={isInstantText}
                          />
                        )}
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
            {step === 1 && typedStep1Count >= STEP1_ITEMS.length && (
              <button
                className="form-text-next-button"
                onClick={() => setStep(2)}
              >
                [Next]
              </button>
            )}
          </div>

          {/* Секция сетки для загрузки изображений */}
          {step > 1 && (
            <div className={`form-upload-view ${step === 3 ? "dimmed" : ""}`}>
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
                  onClick={() => setStep(3)}
                  disabled={!images.some((img) => img !== null)}
                >
                  [UPLOAD]
                </button>
              )}
            </div>
          )}

          {/* Форма для имени и данных */}
          {step === 3 && (
            <div className="form-data-view">
              <form className="form-data-view-form" onSubmit={handleSubmit}>
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
                                isInstant={isInstantText}
                              />
                            ) : null}

                            {isComplete && (
                              <>
                                {item.prefix === "[2.1]" && (
                                  <input type="text" name="name" required />
                                )}
                                {item.prefix === "[2.2]" && (
                                  <input type="email" name="email" required />
                                )}
                                {item.prefix === "[2.3]" && (
                                  <input type="text" name="origin" />
                                )}
                                {item.prefix === "[2.4]" && (
                                  <input
                                    type="text"
                                    placeholder="Suggest your own prompt"
                                    value={customPrompt}
                                    onChange={(e) => setCustomPrompt(e.target.value)}
                                    required
                                  />
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
                                  <div className="radio-group">
                                    <label>
                                      <input type="radio" name="train_ai" value="yes" required /> [YES]
                                    </label>
                                    <label>
                                      <input type="radio" name="train_ai" value="no" required /> [NO]
                                    </label>
                                  </div>
                                )}
                                {item.prefix === "[2.7*]" && (
                                  <div className="radio-group">
                                    <label>
                                      <input type="radio" name="publicly" value="yes" required /> [YES]
                                    </label>
                                    <label>
                                      <input type="radio" name="publicly" value="no" required /> [NO]
                                    </label>
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
                  <button type="submit" className="form-data-view-submit">
                    [COMPLETE]
                  </button>
                )}
              </form>
            </div>
          )}
        </>
      ) : (
        <div className="form-completed-view">
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
                      instant={true}
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
