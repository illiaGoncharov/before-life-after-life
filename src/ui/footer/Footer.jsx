import React, { useState, useEffect } from "react";
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
  textCameraOn,
  textSoundOn,
  toggleTextCamera,
  toggleTextSound,
}) {
  // Управляем hover-подсказками и "липким" раскрытием меню
  const [hovered, setHovered] = useState(null); // null | 'images' | 'filters'
  const [showHelpOverlay, setShowHelpOverlay] = useState(false);

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
        <>
          {/* Переключатели со стрелками в центре */}
          <div className="footer-playback-controls">
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
          {/* NOW PLAYING и SOUND справа */}
          <div className="footer-playback-info">
            <span className="footer-now-playing">
              NOW PLAYING: {prompts[prompts.length - 1 - promptIndex]}
            </span>
            <button
              className="footer-sound-toggle"
              onClick={toggleSound}
            >
              SOUND: {soundOn ? "ON" : "OFF"}
            </button>
          </div>
        </>
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
      {/* Кнопки управления камерой и звуком на странице Text */}
      {activeButton === "text" && (
        <div className="footer-text-controls">
          <button
            className="footer-button"
            onClick={toggleTextCamera}
            aria-label="Toggle camera"
          >
            CAMERA {textCameraOn ? "ON" : "OFF"}
          </button>
          <span> | </span>
          <button
            className="footer-button"
            onClick={toggleTextSound}
            aria-label="Toggle sound"
          >
            SOUND {textSoundOn ? "ON" : "OFF"}
          </button>
        </div>
      )}
      {/* Кнопка помощи - показывается только на главной странице */}
      {activeButton === "gallery" && (
        <button
          className="footer-help-button"
          onClick={() => setShowHelpOverlay(true)}
          aria-label="Show help"
        >
          <img 
            src={`${process.env.PUBLIC_URL}/ui/footer_q.svg`} 
            alt="Help" 
            className="footer-help-icon"
          />
        </button>
      )}
      {/* Overlay с объяснениями */}
      {showHelpOverlay && activeButton === "gallery" && (
        <HelpOverlay 
          onClose={() => setShowHelpOverlay(false)}
        />
      )}
    </footer>
  );
}

// Компонент overlay с объяснениями
function HelpOverlay({ onClose }) {
  const [positions, setPositions] = useState({
    beforeLife: null,
    images: null,
    all: null,
    afterlife: null,
  });

  useEffect(() => {
    // Получаем позиции кнопок
    const updatePositions = () => {
      const beforeLifeBtn = document.querySelector('.header-button:first-child');
      const imagesBtn = document.querySelector('.footer-label-button');
      const allBtn = document.querySelector('.footer-base .footer-button');
      const afterlifeBtn = document.querySelector('.header-button:last-child');

      const newPositions = {};
      
      if (beforeLifeBtn) {
        const rect = beforeLifeBtn.getBoundingClientRect();
        newPositions.beforeLife = {
          x: rect.left, // От левого края кнопки (должно быть ~25px)
          y: rect.top + rect.height, // От нижнего края кнопки (должно быть ~35px)
        };
      }
      
      if (imagesBtn) {
        const rect = imagesBtn.getBoundingClientRect();
        newPositions.images = {
          x: rect.left + rect.width / 2, // От центра элемента "IMAGES:"
          y: rect.bottom, // От нижнего края
        };
      }
      
      if (allBtn) {
        const rect = allBtn.getBoundingClientRect();
        newPositions.all = {
          x: rect.left + rect.width / 2, // От центра элемента "ALL"
          y: rect.top + rect.height / 2, // От центра по вертикали
        };
      }
      
      if (afterlifeBtn) {
        const rect = afterlifeBtn.getBoundingClientRect();
        newPositions.afterlife = {
          x: rect.right, // От правого края кнопки
          y: rect.top + rect.height, // От нижнего края кнопки
        };
      }

      setPositions(newPositions);
    };

    // Небольшая задержка для правильного расчета позиций после рендера
    const timer = setTimeout(updatePositions, 100);
    updatePositions();
    window.addEventListener('resize', updatePositions);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePositions);
    };
  }, []);

  return (
    <div className="help-overlay" onClick={onClose}>
      <div className="help-overlay-content" onClick={(e) => e.stopPropagation()}>
        {/* BEFORE LIFE */}
        {positions.beforeLife && (
          <div className="help-item help-item-before-life">
            <svg className="help-line" style={{
              position: 'fixed',
              left: '25px',
              top: '35px',
              width: '200px',
              height: '150px',
            }} viewBox="0 0 200 150">
              <path
                d="M 0 0 L 0 100 L 150 100"
                stroke="white"
                strokeWidth="1"
                strokeDasharray="3 3"
                fill="none"
                opacity="0.4"
              />
            </svg>
            <div className="help-text help-text-before-life" style={{
              left: '180px',
              top: '135px',
            }}>
              Press <span className="help-text-highlight">Before life</span> to contribute <br /> your images
            </div>
          </div>
        )}

        {/* IMAGES */}
        {positions.images && (
          <div className="help-item help-item-images">
            <svg className="help-line" style={{
              position: 'fixed',
              left: '25px',
              bottom: '40px',
              width: '200px',
              height: '150px',
            }} viewBox="0 0 200 150">
              <path
                d="M 0 150 L 0 50 L 150 50"
                stroke="white"
                strokeWidth="1"
                strokeDasharray="3 3"
                fill="none"
                opacity="0.4"
              />
            </svg>
            <div className="help-text help-text-images" style={{
              left: '180px',
              bottom: '95px',
            }}>
              Hover <span className="help-text-highlight">IMAGES</span> to switch between <br /> text and visuals
            </div>
          </div>
        )}

        {/* ALL */}
        {positions.all && (
          <div className="help-item help-item-all">
            <svg className="help-line" style={{
              position: 'fixed',
              left: '95px',
              bottom: '25px',
              width: '300px',
              height: '1px',
            }} viewBox="0 0 300 1">
              <path
                d="M 0 0 L 250 0"
                stroke="white"
                strokeWidth="1"
                strokeDasharray="3 3"
                fill="none"
                opacity="0.4"
              />
            </svg>
            <div className="help-text help-text-all" style={{
              left: '350px',
              bottom: '-20px',
            }}>
              Hover <span className="help-text-highlight">ALL
              </span> to filter images 
              <br /> <span className="help-text-highlight">by prompt</span>, <span className="help-text-highlight">by contributor</span>, or to show <span className="help-text-highlight">all</span>
            </div>
          </div>
        )}

        {/* AFTERLIFE */}
        {positions.afterlife && (
          <div className="help-item help-item-afterlife">
            <svg className="help-line" style={{
              position: 'fixed',
              right: '25px',
              top: '35px',
              width: '200px',
              height: '150px',
            }} viewBox="0 0 200 150">
              <path
                d="M 200 0 L 200 100 L 50 100"
                stroke="white"
                strokeWidth="1"
                strokeDasharray="3 3"
                fill="none"
                opacity="0.4"
              />
            </svg>
            <div className="help-text help-text-afterlife" style={{
              right: '180px',
              top: '135px',
            }}>
              Press <span className="help-text-highlight">afterlife</span> to explore <br /> the project's aftermath
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Footer;
