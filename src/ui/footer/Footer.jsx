import React, { useState } from "react";
import "./Footer.css";
import { prompts } from "../../data/prompts";

function Footer({
  handleButtonClick,
  activeButton,
  formStep,
  promptIndex,
  soundOn,
  isPaused,
  togglePause,
  toggleSound,
  prevPrompt,
  nextPrompt,
  selectedContributorIndex,
  onSelectContributor,
  contributors,
}) {
  // Управляем hover-подсказками и "липким" раскрытием меню
  const [hovered, setHovered] = useState(null); // null | 'images' | 'filters'

  const isForm = activeButton === "form";
  const isText = activeButton === "text";
  const isImagesMode = ["gallery", "byPrompt", "byContributor"].includes(activeButton);

  // Показывать блок режимов (IMAGES | TEXT), если наведён IMAGES или выбран TEXT
  const showModes = hovered === "images" || isText;
  // Показывать фильтры (ALL | BY PROMPT | BY CONTRIBUTOR), если наведён ALL/filters или выбран один из фильтров
  const showFilters = hovered === "filters" || activeButton === "byPrompt" || activeButton === "byContributor";

  const handleFooterLeave = () => {
    // Если пользователь в gallery и ничего не выбрано — сворачиваем к базовому состоянию
    if (activeButton === "gallery") setHovered(null);
  };

  const showBase = !isForm && isImagesMode && !showModes && !showFilters;

  return (
    <footer className="footer" onMouseLeave={handleFooterLeave}>
      {/* БАЗОВОЕ СОСТОЯНИЕ: IMAGES:  ALL */}
      <div className="footer-base footer-section" data-visible={showBase}>
          <button
            className="footer-label-button"
            onMouseEnter={() => setHovered("images")}
            onFocus={() => setHovered("images")}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setHovered("images")}
            aria-label="Open images/text switch"
          >
            IMAGES:
          </button>
          <button
            className="footer-button"
            onMouseEnter={() => setHovered("filters")}
            onFocus={() => setHovered("filters")}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setHovered("filters")}
            onClick={() => handleButtonClick("gallery")}
            aria-label="Open image filters"
          >
            ALL
          </button>
        </div>

      {/* МОДЫ: IMAGES | TEXT (липко, если выбран TEXT) */}
      <div
        className="footer-main-toggler footer-section"
        data-visible={!isForm && showModes}
        onMouseEnter={() => setHovered("images")}
      >
          <button
            onClick={() => handleButtonClick("gallery")}
            className={`footer-button ${isImagesMode ? "active" : ""}`}
          >
            IMAGES
          </button>
          <span> | </span>
          <button
            onClick={() => handleButtonClick("text")}
            className={`footer-button ${isText ? "active" : ""}`}
          >
            TEXT
          </button>
        </div>

      {/* ФИЛЬТРЫ: ALL | BY PROMPT | BY CONTRIBUTOR (липко, если выбран byPrompt/byContributor) */}
      <div
        className="footer-filter footer-section"
        data-visible={!isForm && showFilters}
        onMouseEnter={() => setHovered("filters")}
      >
          <p className="footer-filter-label">IMAGES:</p>
          <button
            onClick={() => handleButtonClick("gallery")}
            className={`footer-button ${activeButton === "gallery" ? "active" : ""}`}
          >
            ALL
          </button>
          <span>|</span>
          <button
            onClick={() => handleButtonClick("byPrompt")}
            className={`footer-button ${activeButton === "byPrompt" ? "active" : ""}`}
          >
            BY PROMPT
          </button>
          <span>|</span>
          <button
            onClick={() => handleButtonClick("byContributor")}
            className={`footer-button ${activeButton === "byContributor" ? "active" : ""}`}
          >
            BY CONTRIBUTOR
          </button>
        </div>
      {/* Now Playing and playback controls for ByPrompt */}
      {activeButton === "byPrompt" && (
        <div className="footer-playback">
          <span className="footer-now-playing">
            NOW PLAYING: {prompts[prompts.length - 1 - promptIndex]}
          </span>
          <button
            className="footer-sound-toggle"
            onClick={toggleSound}
          >
            SOUND: {soundOn ? "ON" : "OFF"}
          </button>
          <button
            className="footer-ctrl-button"
            onClick={prevPrompt}
          >
            &lt;
          </button>
          <button
            className="footer-ctrl-button"
            onClick={togglePause}
          >
            {isPaused ? "PLAY" : "PAUSE"}
          </button>
          <button
            className="footer-ctrl-button"
            onClick={nextPrompt}
          >
            &gt;
          </button>
        </div>
      )}
      {/* Contributor navigation buttons in footer */}
      {activeButton === "byContributor" && contributors && (
        <div className="footer-contributor-nav">
          {contributors.map((_, idx) => (
            <React.Fragment key={idx}>
              <button
                className={`footer-button ${idx === selectedContributorIndex ? 'active' : ''}`}
                onClick={() => onSelectContributor(idx)}
              >
                {idx + 1}
              </button>
              {idx < contributors.length - 1 && <span>|</span>}
            </React.Fragment>
          ))}
        </div>
      )}
    </footer>
  );
}

export default Footer;
