import React, { useState, useEffect, useRef } from "react";
import "./Loader.css";

/**
 * Универсальный компонент Loader для отображения текста с анимацией
 * Используется для визитки, формы и страницы "О проекте"
 * @param {string} text - Текст для отображения
 * @param {function} onComplete - Callback при завершении анимации
 * @param {number} delay - Задержка перед началом анимации в мс
 * @param {number} charInterval - Интервал между символами в мс
 * @param {boolean} showInstantly - Показать текст мгновенно без анимации
 */
const Loader = ({ 
  text = "", 
  onComplete,
  delay = 0,
  charInterval = 50,
  showInstantly = false
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRef = useRef(null);
  const animationRef = useRef(null);
  const mountedRef = useRef(true);
  const currentTextRef = useRef(""); // Отслеживаем текущий текст для предотвращения дублирования

  useEffect(() => {
    if (!text) {
      setDisplayedText("");
      setIsComplete(false);
      return;
    }

    // Если текст не изменился и анимация уже запущена для этого текста, не запускаем снова
    if (currentTextRef.current === text && (timeoutRef.current || animationRef.current)) {
      return;
    }

    // Сохраняем текущий текст
    currentTextRef.current = text;

    // Очищаем предыдущие таймеры
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }

    // Сбрасываем состояние при новом тексте
    mountedRef.current = true;
    setIsComplete(false);
    setDisplayedText("");

    if (showInstantly) {
      setDisplayedText(text);
      setIsComplete(true);
      currentTextRef.current = ""; // Сбрасываем после завершения
      if (onComplete) onComplete();
      return;
    }

    const startAnimation = () => {
      if (!mountedRef.current || currentTextRef.current !== text) return;
      
      let currentIndex = 0;

      const typeChar = () => {
        if (!mountedRef.current || currentTextRef.current !== text) return;
        
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex += 1;
          animationRef.current = setTimeout(typeChar, charInterval);
        } else {
          setIsComplete(true);
          currentTextRef.current = ""; // Сбрасываем после завершения
          if (onComplete && mountedRef.current) {
            setTimeout(() => {
              if (mountedRef.current && onComplete) {
                onComplete();
              }
            }, 300);
          }
        }
      };

      typeChar();
    };

    timeoutRef.current = setTimeout(startAnimation, delay);
    
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (animationRef.current) {
        clearTimeout(animationRef.current);
        animationRef.current = null;
      }
      // Не сбрасываем currentTextRef здесь, чтобы предотвратить повторный запуск
    };
  }, [text, delay, charInterval, showInstantly]);

  return (
    <div className="loader-container">
      <div className="loader-text">
        {displayedText}
        {!isComplete && !showInstantly && (
          <span className="loader-cursor">|</span>
        )}
      </div>
    </div>
  );
};

export default Loader;
