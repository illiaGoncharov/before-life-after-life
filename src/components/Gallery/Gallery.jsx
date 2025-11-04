import React, { useState, useEffect } from "react";
import "./Gallery.css";

const imageFolders = ["andrey", "anna", "clara", "dexter", "jeff"];
const images = imageFolders.flatMap((folder) =>
  Array.from({ length: 45 }, (_, i) => {
    const fileName = `${folder}_${String(i + 1).padStart(2, "0")}.jpg`;
    return `${process.env.PUBLIC_URL}/images/${folder}/${fileName}`;
  })
);

const MAX_DELAY = 500; // Максимальная задержка появления изображения в мс (скорректировано для ускорения загрузки)

// Символы для мобильной версии (как в макете)
const MOBILE_SYMBOLS = ['¶', '•', 'ª', '∞', '¢', '°', '#', '€', '¡', '©', '§', '£', '¥', '®', '™', '±', '×', '÷', '≈', '≠', '≤', '≥', '∑', '∏', '∆', '∇', '∂', '∫', '√', '∴', '∵', '→', '←', '↑', '↓', '↔'];

export default function Gallery({ onAllHidden }) {
  const [loadedImages, setLoadedImages] = useState([]);
  const [hiddenImages, setHiddenImages] = useState(new Set()); // Используем Set для хранения скрытых изображений
  const [isMobile, setIsMobile] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mobileSymbols, setMobileSymbols] = useState([]);

  // Определение мобильного устройства
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Инициализация символов для мобильной версии
  useEffect(() => {
    if (isMobile) {
      // Генерируем достаточно символов для одной линии
      const initialSymbols = Array.from({ length: 25 }, () => 
        MOBILE_SYMBOLS[Math.floor(Math.random() * MOBILE_SYMBOLS.length)]
      );
      setMobileSymbols(initialSymbols);
    }
  }, [isMobile]);

  // Медленная смена фотографий для мобильной версии
  useEffect(() => {
    if (!isMobile || loadedImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const nextIndex = (prev + 1) % loadedImages.length;
        return nextIndex;
      });
    }, 3000); // Медленная смена каждые 3 секунды

    return () => clearInterval(interval);
  }, [isMobile, loadedImages.length]);

  // Хаотичное изменение символов для мобильной версии
  useEffect(() => {
    if (!isMobile) return;

    const interval = setInterval(() => {
      setMobileSymbols((prev) => {
        const newSymbols = [...prev];
        // Меняем случайные символы
        const symbolsToChange = Math.floor(Math.random() * 5) + 3; // 3-7 символов за раз
        for (let i = 0; i < symbolsToChange; i++) {
          const randomIndex = Math.floor(Math.random() * newSymbols.length);
          newSymbols[randomIndex] = MOBILE_SYMBOLS[Math.floor(Math.random() * MOBILE_SYMBOLS.length)];
        }
        return newSymbols;
      });
    }, 800); // Частое изменение символов

    return () => clearInterval(interval);
  }, [isMobile]);

  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const delay = Math.random() * MAX_DELAY;
        setTimeout(() => {
          setLoadedImages((prev) => [...prev, src]);
        }, delay);
      };
      img.onerror = (error) => {
        console.error(`Error loading image: ${src}`, error);
      };
    });
  }, []);

  // Если пользователь скрыл все изображения, переходим к следующему компоненту
  useEffect(() => {
    if (!isMobile && hiddenImages.size === images.length && onAllHidden) {
      onAllHidden();
    }
  }, [hiddenImages, onAllHidden, isMobile]);

  // Функция для скрытия изображения при наведении (только для десктопа)
  const handleMouseEnter = (src) => {
    if (!isMobile) {
      setHiddenImages((prev) => new Set(prev).add(src));
    }
  };

  // Мобильная версия
  if (isMobile) {
    const currentImage = loadedImages[currentImageIndex] || null;
    
    return (
      <div className="gallery-container gallery-mobile">
        {currentImage && (
          <div className="gallery-mobile-image-container">
            <img
              src={currentImage}
              alt="Gallery image"
              className="gallery-mobile-image"
            />
          </div>
        )}
        <div className="gallery-mobile-symbols">
          {mobileSymbols.map((symbol, index) => (
            <span key={index} className="gallery-mobile-symbol">
              {symbol}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Десктоп версия
  return (
    <div className="gallery-container">
      <div className="gallery">
        {images.map((src, index) => (
          <div
            key={index}
            className={`image-container ${
              hiddenImages.has(src) ? "hidden" : ""
            }`}
            onMouseEnter={() => handleMouseEnter(src)}
          >
            <img
              src={src}
              alt={`Image ${index + 1}`}
              loading="lazy"
              className={loadedImages.includes(src) ? "loaded" : ""}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
