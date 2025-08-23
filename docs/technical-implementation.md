# Техническая реализация — Before Life | After Life

Этот документ содержит конкретные примеры кода для реализации плана модернизации UI/UX.

## 📱 Mobile-First подход

```css
/* Mobile First */
@media (max-width: 768px) { ... }          /* Mobile */
@media (min-width: 768px) and (max-width: 1024px) { ... } /* Tablet */
@media (min-width: 1024px) { ... }         /* Desktop */
```

## 🔍 Компоненты

### 1. Форма (Before Life)

#### Form.jsx структура:
```jsx
// Полноэкранный контейнер
<div className="form-fullscreen">
  <h1 className="form-title-large">BEFORE LIFE</h1>
  
  {/* Основной контент формы */}
  <div className="form-content">
    {renderCurrentStep()}
  </div>
  
  {/* Step индикаторы в футере */}
  <div className="form-steps">
    <span className={step === 1 ? 'active' : ''}>0</span>
    <span>|</span>
    <span className={step === 2 ? 'active' : ''}>1</span>
    <span>|</span>
    <span className={step === 3 ? 'active' : ''}>2</span>
  </div>
</div>
```

#### Form.css ключевые стили:
```css
.form-fullscreen {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: #000;
  z-index: 1000;
  overflow-y: auto;
  padding: 20px;
}

.form-title-large {
  font-family: "Hershey-Noailles-Times";
  font-size: clamp(28px, 8vw, 42px);
  text-align: center;
  color: white;
  letter-spacing: -1px;
  margin-bottom: 40px;
}

.form-steps {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  font-size: 16px;
  color: white;
}

.form-steps .active {
  background: #0066FF;
  padding: 8px 12px;
  border-radius: 4px;
}

/* Mobile drag&drop */
.upload-zone {
  border: 3px dashed rgba(255,255,255,0.3);
  border-radius: 12px;
  padding: 60px 20px;
  text-align: center;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.upload-zone:hover,
.upload-zone.drag-over {
  border-color: #0066FF;
}

/* Desktop версия */
@media (min-width: 1024px) {
  .form-fullscreen {
    display: grid;
    grid-template-columns: 1fr 400px;
    padding: 60px;
  }
  
  .form-steps {
    position: static;
    transform: none;
  }
}
```

### 2. Header компонент

#### Header.jsx структура:
```jsx
// Mobile версия
<header className="header-mobile">
  <div className="header-nav-mobile">
    <button className={`nav-btn ${currentComponent === "form" ? "active" : ""}`}>
      BEFORE
    </button>
    <button className={`nav-btn ${currentComponent === "about" ? "active" : ""}`}>
      AFTER
    </button>
  </div>
  
  {/* Прогресс только в byPrompt */}
  {currentComponent === "byPrompt" && (
    <div className="progress-mobile">
      <div className="progress-text">{promptIndex + 1} / {TOTAL_PROMPTS}</div>
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${(promptIndex / TOTAL_PROMPTS) * 100}%` }}
        />
      </div>
    </div>
  )}
  
  <button className="header-menu-mobile">⋮</button>
</header>

// Desktop версия
<header className="header-desktop">
  <div className="header-left">
    <button className="nav-btn-desktop">BEFORE LIFE</button>
  </div>
  
  <div className="header-center">
    {currentComponent === "byPrompt" && (
      <div className="progress-bar-desktop">
        <span>Progress:</span>
        <div className="progress-track">
          <div className="progress-fill-desktop" style={{ width: `${progress}%` }} />
        </div>
        <span>{promptIndex + 1}/{TOTAL_PROMPTS}</span>
      </div>
    )}
  </div>
  
  <div className="header-right">
    <button className="nav-btn-desktop">AFTERLIFE</button>
  </div>
</header>
```

#### Header.css стили:
```css
/* Mobile header */
.header-mobile {
  position: fixed;
  top: 0; left: 0; right: 0;
  background: rgba(0,0,0,0.95);
  backdrop-filter: blur(10px);
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 999;
}

.nav-btn {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.3);
  color: white;
  padding: 8px 16px;
  font-size: 12px;
  border-radius: 4px;
  min-height: 44px;
}

.nav-btn.active {
  border-color: #0066FF;
  background: rgba(0,102,255,0.2);
}

.progress-mobile {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}

.progress-bar {
  width: 100px;
  height: 3px;
  background: rgba(255,255,255,0.2);
  border-radius: 2px;
}

.progress-fill {
  height: 100%;
  background: #0066FF;
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* Desktop header */
@media (min-width: 1024px) {
  .header-desktop {
    position: fixed;
    top: 0; left: 0; right: 0;
    background: rgba(0,0,0,0.95);
    backdrop-filter: blur(10px);
    padding: 20px 40px;
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    align-items: center;
    z-index: 999;
  }
  
  .progress-bar-desktop {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .progress-track {
    flex: 1;
    height: 4px;
    background: rgba(255,255,255,0.2);
    border-radius: 2px;
  }
}
```

### 3. Gallery компонент

#### Gallery.jsx структура:
```jsx
<div className="gallery-container">
  {/* Индикатор режима */}
  {currentMode === 'byPrompt' && (
    <div className="mode-indicator-mobile">
      <span className="mode-label">BY PROMPT</span>
      <span className="mode-value">{prompts[promptIndex]}</span>
    </div>
  )}
  
  {/* Основная сетка */}
  <div className="gallery-grid">
    {filteredImages.map((image, index) => (
      <div 
        key={index}
        className={`image-container ${hiddenImages.has(image) ? 'hidden' : ''}`}
        onTouchStart={() => handleImageTouch(image)}
        onMouseEnter={() => handleMouseEnter(image)}
      >
        <img src={image} alt={`Generated ${index}`} loading="lazy" />
        
        {/* Touch overlay */}
        <div className="image-overlay">
          <span>{getPromptForImage(image)}</span>
        </div>
      </div>
    ))}
  </div>
</div>
```

#### Gallery.css стили:
```css
.gallery-container {
  padding: 80px 16px 80px 16px; /* Space for header/footer */
  min-height: 100vh;
}

/* Mobile grid */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
}

.image-container {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  transition: opacity 0.3s ease, transform 0.2s ease;
}

.image-container.hidden {
  opacity: 0;
  transform: scale(0.8);
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Touch overlay */
.image-overlay {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  padding: 8px;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.image-container:active .image-overlay {
  transform: translateY(0);
}

/* Desktop version */
@media (min-width: 1024px) {
  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 3px;
  }
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  .gallery-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 3px;
  }
}
```

### 4. Footer компонент

#### Footer.jsx структура:
```jsx
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
  // Определяем режимы
  const isFormMode = activeButton === "form";
  const isTextMode = activeButton === "text";
  const isImagesMode = ["gallery", "byPrompt", "byContributor"].includes(activeButton);
  
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Основные режимы - всегда показываем кроме Form */}
        {!isFormMode && (
          <div className="footer-main-modes">
            <button 
              className={`mode-btn ${isImagesMode ? "active" : ""}`}
              onClick={() => handleButtonClick("gallery")}
            >
              IMAGES
            </button>
            <span className="separator">|</span>
            <button 
              className={`mode-btn ${isTextMode ? "active" : ""}`}
              onClick={() => handleButtonClick("text")}
            >
              TEXT
            </button>
          </div>
        )}

        {/* Фильтры - только в Images режимах */}
        {isImagesMode && (
          <div className="footer-filters">
            <span className="filter-label">FILTER:</span>
            <button
              className={`filter-btn ${activeButton === "gallery" ? "active" : ""}`}
              onClick={() => handleButtonClick("gallery")}
            >
              ALL
            </button>
            <span className="separator">|</span>
            <button
              className={`filter-btn ${activeButton === "byPrompt" ? "active" : ""}`}
              onClick={() => handleButtonClick("byPrompt")}
            >
              BY PROMPT
            </button>
            <span className="separator">|</span>
            <button
              className={`filter-btn ${activeButton === "byContributor" ? "active" : ""}`}
              onClick={() => handleButtonClick("byContributor")}
            >
              BY CONTRIBUTOR
            </button>
          </div>
        )}

        {/* Управление - только в byPrompt и Text */}
        {(activeButton === "byPrompt" || isTextMode) && (
          <div className="footer-controls">
            <button className="control-btn" onClick={togglePause}>
              {isPaused ? "PLAY" : "PAUSE"}
            </button>
            <button className="control-btn" onClick={toggleSound}>
              VOL: {soundOn ? "ON" : "OFF"}
            </button>
            <button className="control-btn" onClick={prevPrompt}>←</button>
            <button className="control-btn" onClick={nextPrompt}>→</button>
          </div>
        )}

        {/* Навигация контрибьюторов - только в byContributor */}
        {activeButton === "byContributor" && contributors && (
          <div className="footer-contributor-nav">
            {contributors.map((_, idx) => (
              <React.Fragment key={idx}>
                <button
                  className={`contributor-btn ${idx === selectedContributorIndex ? 'active' : ''}`}
                  onClick={() => onSelectContributor(idx)}
                >
                  {idx + 1}
                </button>
                {idx < contributors.length - 1 && <span className="separator">|</span>}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Информационная строка - контекстная */}
        <div className="footer-info">
          {isFormMode && (
            <span>STEP: {formStep} / 3</span>
          )}
          {activeButton === "gallery" && (
            <span>SHOWING ALL IMAGES</span>
          )}
          {activeButton === "byPrompt" && (
            <span>PROMPT: {prompts[promptIndex]} ({promptIndex + 1}/{prompts.length})</span>
          )}
          {activeButton === "byContributor" && contributors && (
            <span>CONTRIBUTOR: {contributors[selectedContributorIndex]?.name || 'Unknown'}</span>
          )}
          {isTextMode && (
            <span>NOW PLAYING: {prompts[promptIndex] || 'None'}</span>
          )}
        </div>

      </div>
    </footer>
  );
}
```

#### Footer.css стили:
```css
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(15px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px 20px;
  z-index: 1000;
  font-family: "Hershey-Noailles-Futura-Triplex-Regular";
}

/* Mobile: вертикальный стек */
.footer-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Блоки футера */
.footer-main-modes,
.footer-filters,
.footer-controls,
.footer-contributor-nav,
.footer-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Кнопки */
.mode-btn,
.filter-btn,
.control-btn,
.contributor-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: 44px; /* Touch-friendly */
  min-width: 60px;
  font-family: inherit;
}

/* Active состояния */
.mode-btn.active {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.4);
  color: white;
}

.filter-btn.active {
  background: rgba(0, 255, 0, 0.1);
  border-color: #00FF00;
  color: #00FF00;
}

.contributor-btn.active {
  background: rgba(255, 255, 0, 0.1);
  border-color: #FFFF00;
  color: #FFFF00;
}

/* Hover состояния */
.mode-btn:hover,
.filter-btn:hover,
.control-btn:hover,
.contributor-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

/* Разделители */
.separator {
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
  user-select: none;
}

/* Лейблы */
.filter-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1px;
  margin-right: 4px;
}

/* Информационная строка */
.footer-info {
  background: rgba(255, 255, 255, 0.02);
  border-color: rgba(255, 255, 255, 0.05);
}

.footer-info span {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 280px;
}

/* Desktop адаптация */
@media (min-width: 1024px) {
  .footer-container {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    grid-template-areas: 
      "modes filters controls"
      "info info info";
    align-items: center;
    gap: 20px;
  }
  
  .footer-main-modes {
    grid-area: modes;
    justify-self: start;
  }
  
  .footer-filters {
    grid-area: filters;
    justify-self: center;
  }
  
  .footer-controls,
  .footer-contributor-nav {
    grid-area: controls;
    justify-self: end;
  }
  
  .footer-info {
    grid-area: info;
    justify-self: center;
    grid-column: 1 / -1;
  }
}
```

### 5. Intro компонент (новый)

```jsx
// Новый компонент для первого экрана:
const IntroScreen = ({ onSelect }) => {
  return (
    <div className="intro-split">
      <button 
        className="intro-section" 
        onClick={() => onSelect('form')}
      >
        BEFORE LIFE
      </button>
      <button 
        className="intro-section active" 
        onClick={() => onSelect('gallery')}
      >
        AFTERLIFE
      </button>
    </div>
  );
};
```

```css
.intro-split {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}

.intro-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  color: white;
  font-family: "Hershey-Noailles-Times";
  font-size: clamp(32px, 10vw, 72px);
  text-transform: uppercase;
  letter-spacing: -2px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.intro-section.active {
  box-shadow: inset 0 0 0 4px #0066FF;
}

.intro-section:hover {
  background: #111;
}

@media (min-width: 768px) {
  .intro-split {
    flex-direction: row;
  }
}
```

## 🧪 Тестирование

```bash
# Dev server
npm start

# В браузере:
# 1. Chrome DevTools → Responsive mode
# 2. Проверить breakpoints: 320px, 768px, 1024px
# 3. Touch simulation
# 4. Network throttling для performance
```
