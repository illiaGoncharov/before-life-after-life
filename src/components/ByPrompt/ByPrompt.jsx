import React, { useState, useEffect } from "react";
import "./ByPrompt.css";

const contributors = ["andrey", "anna", "clara", "dexter", "jeff"];
const totalPrompts = 45;
const imagesPerPage = 5;

function ByPrompt() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadingParts, setLoadingParts] = useState(
    Array(totalPrompts).fill(false)
  );
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());

  useEffect(() => {
    // Симуляция загрузки контроллера
    const interval = setInterval(() => {
      setLoadingParts((prev) => {
        const next = [...prev];
        const index = next.findIndex((part) => part === false);
        if (index !== -1) next[index] = true;
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        prevGroup();
      } else if (event.key === "ArrowRight") {
        nextGroup();

        setLastInteractionTime(Date.now());
      }
    };

    // Добавляем слушатель события на нажатие клавиш
    document.addEventListener("keydown", handleKeyDown);

    // Убираем слушатель при размонтировании компонента
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex]);

  useEffect(() => {
    // Функция для автоматического перехода вправо через 5 секунды без взаимодействия
    const autoMoveTimeout = setInterval(() => {
      if (Date.now() - lastInteractionTime >= 5000) {
        nextGroup();
      }
    }, 5000);

    // Убираем таймер при размонтировании
    return () => clearInterval(autoMoveTimeout);
  }, [lastInteractionTime]);

  const nextGroup = () => {
    setCurrentIndex((prev) => (prev + 1 < totalPrompts ? prev + 1 : prev));
  };

  const prevGroup = () => {
    setCurrentIndex((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
  };

  return (
    <div className="by-prompt-container">
      <div className="image-byprompt-grid">
        {contributors.map((contributor) => {
          const imageNumber = (currentIndex % totalPrompts) + 1;
          return (
            <img
              key={contributor}
              src={`${
                process.env.PUBLIC_URL
              }/images/${contributor}/${contributor}_${String(
                imageNumber
              ).padStart(2, "0")}.png`}
              alt={`${contributor} ${imageNumber}`}
              className="image-byprompt-item"
            />
          );
        })}
      </div>
      {/* <div className="footer-byprompt-navigation">
        <button
          className="footer-byprompt-button"
          onClick={prevGroup}
          disabled={currentIndex === 0}
        >
          &lt;
        </button>
        <span> | </span>
        <button
          className="footer-byprompt-button"
          onClick={nextGroup}
          disabled={currentIndex + 1 >= totalPrompts}
        >
          &gt;
        </button>
      </div> */}
    </div>
  );
}

export default ByPrompt;
