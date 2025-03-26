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

  const nextGroup = () => {
    setCurrentIndex((prev) => (prev + 1 < totalPrompts ? prev + 1 : prev));
  };

  const prevGroup = () => {
    setCurrentIndex((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
  };

  return (
    <div className="by-prompt-container">
      {/* <div className="header-controller">
        {loadingParts.map((loaded, index) => (
          <div
            key={index}
            className={`controller-part ${loaded ? "loaded" : "loading"}`}
          />
        ))}
      </div> */}
      <div className="image-grid">
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
              className="image-item"
            />
          );
        })}
      </div>
      <div className="footer-byprompt-navigation">
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
      </div>
    </div>
  );
}

export default ByPrompt;
