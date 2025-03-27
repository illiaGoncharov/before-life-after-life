import React, { useState, useEffect } from "react";
import "./Gallery.css";

const imageFolders = ["andrey", "anna", "clara", "dexter", "jeff"];
const images = imageFolders.flatMap((folder) =>
  Array.from({ length: 45 }, (_, i) => {
    const fileName = `${folder}_${String(i + 1).padStart(2, "0")}.png`;
    return `${process.env.PUBLIC_URL}/images/${folder}/${fileName}`;
  })
);

const BATCH_SIZE = 10; // Загружаем по 10 изображений за раз

export default function Gallery() {
  const [loadedImages, setLoadedImages] = useState([]);
  const [hiddenImages, setHiddenImages] = useState(new Set()); // Используем Set для хранения скрытых изображений

  useEffect(() => {
    const preloadImages = async () => {
      for (let i = 0; i < images.length; i += BATCH_SIZE) {
        const batch = images.slice(i, i + BATCH_SIZE); // Берем текущую пачку изображений
        const promises = batch.map((src) => {
          const img = new Image();
          img.src = src;
          return img
            .decode()
            .then(() => src)
            .catch((error) => {
              console.error(`Error loading image: ${src}`, error);
              return null;
            });
        });

        const results = await Promise.all(promises);
        const successfulImages = results.filter((src) => src); // Фильтруем успешно загруженные изображения
        setLoadedImages((prev) => [...prev, ...successfulImages]);
      }
    };

    preloadImages();
  }, []);

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
              key={index}
              src={loadedImages.includes(src) ? src : undefined}
              alt={`Image ${index + 1}`}
              loading="lazy"
              className={loadedImages.includes(src) ? "loaded" : "loading"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
