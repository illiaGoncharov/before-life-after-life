import React from "react";
import "./Header.css";

const TOTAL_PROMPTS = 45;

function Header({ setCurrentComponent, currentComponent, promptIndex }) {
  return (
    <header className="header">
      {/* Before Life navigation */}
      <button
        className={`header-button ${currentComponent === "form" ? "active" : ""}`}
        onClick={() => setCurrentComponent("form")}
      >
        Before Life
      </button>
      {/* Progress indicator for ByPrompt: 45 ticks, active highlighted */}
      {currentComponent === "byPrompt" && (
        <div className="header-progress-bar">
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
        onClick={() => setCurrentComponent("about")}
      >
        Afterlife
      </button>
    </header>
  );
}

export default Header;
