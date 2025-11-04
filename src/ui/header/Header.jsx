import React from "react";
import "./Header.css";

const TOTAL_PROMPTS = 45;

function Header({ setCurrentComponent, currentComponent, promptIndex }) {
  // Обработчик клика между кнопками для возврата на главную
  const handleHeaderClick = (e) => {
    // Если клик был на самом header или на progress-bar, а не на кнопках
    if (e.target === e.currentTarget || 
        e.target.classList.contains('header') ||
        e.target.classList.contains('header-progress-bar') ||
        e.target.classList.contains('header-progress-tick')) {
      setCurrentComponent("gallery");
    }
  };

  return (
    <header className="header" onClick={handleHeaderClick}>
      {/* Before Life navigation */}
      <button
        className={`header-button ${currentComponent === "form" ? "active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          setCurrentComponent("form");
        }}
      >
        Before Life
      </button>
      {/* Progress indicator for ByPrompt: 45 ticks, active highlighted */}
      {currentComponent === "byPrompt" && (
        <div className="header-progress-bar" onClick={(e) => e.stopPropagation()}>
          {Array.from({ length: TOTAL_PROMPTS }, (_, idx) => (
            <div
              key={idx}
              className={`header-progress-tick ${idx === promptIndex ? 'active' : ''}`}
            />
          ))}
        </div>
      )}
      {/* Afterlife navigation */}
      <button
        className={`header-button ${currentComponent === "about" ? "active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          setCurrentComponent("about");
        }}
      >
        Afterlife
      </button>
    </header>
  );
}

export default Header;
