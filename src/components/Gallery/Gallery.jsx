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

export default function Gallery({ onAllHidden }) {
  const [loadedImages, setLoadedImages] = useState([]);
  const [hiddenImages, setHiddenImages] = useState(new Set()); // Используем Set для хранения скрытых изображений

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
    if (hiddenImages.size === images.length && onAllHidden) {
      onAllHidden();
    }
  }, [hiddenImages, onAllHidden]);

  // Функция для скрытия изображения при наведении
  const handleMouseEnter = (src) => {
    setHiddenImages((prev) => new Set(prev).add(src)); // Добавляем изображение в Set
  };

  return (
    <div className="gallery-container">
      <div className="gallery">
        {images.map((src, index) => (
          <div
            key={index}
            className={`image-container ${
              hiddenImages.has(src) ? "hidden" : ""
            }`} // Проверяем, скрыто ли изображение
            onMouseEnter={() => handleMouseEnter(src)} // Обработчик наведения
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
