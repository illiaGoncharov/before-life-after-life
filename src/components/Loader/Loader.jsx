import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
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
  const animationIdRef = useRef(null); // Уникальный ID текущей анимации
  const isAnimatingRef = useRef(false); // Флаг для отслеживания активной анимации

  // Агрессивная остановка всех таймеров
  const stopAllAnimations = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    isAnimatingRef.current = false;
  };

  // Используем useLayoutEffect для синхронной остановки перед началом новой анимации
  useLayoutEffect(() => {
    // Если текст изменился, немедленно останавливаем текущую анимацию
    if (currentTextRef.current !== text && currentTextRef.current !== "") {
      stopAllAnimations();
      setDisplayedText("");
      setIsComplete(false);
    }
  }, [text]);

  useEffect(() => {
    if (!text) {
      stopAllAnimations();
      setDisplayedText("");
      setIsComplete(false);
      currentTextRef.current = "";
      animationIdRef.current = null;
      return;
    }

    // Если текст не изменился и анимация уже запущена, не запускаем снова
    if (currentTextRef.current === text && isAnimatingRef.current) {
      return;
    }

    // Останавливаем все предыдущие анимации
    stopAllAnimations();

    // Генерируем уникальный ID для этой анимации
    const newAnimationId = `${text}-${Date.now()}-${Math.random()}`;
    
    // Сохраняем текущий текст, ID анимации и устанавливаем флаг
    currentTextRef.current = text;
    animationIdRef.current = newAnimationId;
    isAnimatingRef.current = true;

    // Сбрасываем состояние при новом тексте
    mountedRef.current = true;
    setIsComplete(false);
    setDisplayedText("");

    // Сохраняем ID анимации в локальную переменную для проверки в замыкании
    const currentAnimationId = newAnimationId;

    if (showInstantly) {
      // Проверяем, что это все еще актуальная анимация
      if (animationIdRef.current === currentAnimationId && mountedRef.current) {
        setDisplayedText(text);
        setIsComplete(true);
        isAnimatingRef.current = false;
        animationIdRef.current = null;
        currentTextRef.current = ""; // Сбрасываем после завершения
        if (onComplete) onComplete();
      }
      return;
    }

    const startAnimation = () => {
      // Проверяем, что это все еще актуальная анимация и компонент смонтирован
      if (!mountedRef.current || currentTextRef.current !== text || 
          !isAnimatingRef.current || animationIdRef.current !== currentAnimationId) {
        return;
      }
      
      let currentIndex = 0;

      const typeChar = () => {
        // Проверяем актуальность анимации на каждом шаге
        if (!mountedRef.current || currentTextRef.current !== text || 
            !isAnimatingRef.current || animationIdRef.current !== currentAnimationId) {
          return;
        }
        
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex += 1;
          animationRef.current = setTimeout(typeChar, charInterval);
        } else {
          // Проверяем актуальность перед завершением
          if (animationIdRef.current === currentAnimationId && mountedRef.current) {
            setIsComplete(true);
            isAnimatingRef.current = false;
            animationIdRef.current = null;
            currentTextRef.current = ""; // Сбрасываем после завершения
            if (onComplete && mountedRef.current) {
              setTimeout(() => {
                if (mountedRef.current && onComplete && animationIdRef.current === null) {
                  onComplete();
                }
              }, 300);
            }
          }
        }
      };

      typeChar();
    };

    timeoutRef.current = setTimeout(startAnimation, delay);
    
    return () => {
      // Агрессивная остановка при размонтировании или изменении пропсов
      stopAllAnimations();
      mountedRef.current = false;
      animationIdRef.current = null;
    };
  }, [text, delay, charInterval, showInstantly, onComplete]);

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
