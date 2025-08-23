# Мобильная версия проекта Before Life | After Life

В данном документе описан подход к реализации мобильной версии проекта с учетом упрощенной структуры.

## Концепция мобильной версии

Мобильная версия проекта представляет собой упрощенную структуру с фокусом на основные функции:

1. **Центральная галерея** - основной элемент без сложной логики
2. **Before Life** - адаптированная форма для мобильных устройств
3. **After Life** - адаптированный лендинг с описанием проекта

## Структура мобильной версии

```
Главный экран
├── Галерея (центральный элемент)
├── Before Life (ведет на форму)
└── After Life (ведет на лендинг)
```

## Технические особенности реализации

### 1. Галерея

**Текущее состояние:**
- Сложная сетка с 25 колонками
- Множество режимов отображения (Gallery, ByPrompt, ByContributor)
- Неоптимизированные изображения

**Мобильная версия:**
- Упрощенная сетка с 3 колонками
- Единый режим отображения
- Оптимизированные изображения (WebP, разные размеры)
- Свайп-жесты для взаимодействия

```jsx
// Пример компонента мобильной галереи
const MobileGallery = () => {
  return (
    <div className="mobile-gallery-grid">
      {images.map((src, index) => (
        <div 
          key={index}
          className="mobile-image-container"
          onTouchStart={() => handleImageTouch(src)}
        >
          <img 
            src={src} 
            alt={`Image ${index + 1}`}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
};
```

```css
/* Стили для мобильной галереи */
.mobile-gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  padding: 2px;
}

.mobile-image-container {
  aspect-ratio: 1;
  overflow: hidden;
}

.mobile-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

### 2. Форма (Before Life)

**Текущее состояние:**
- Сложная структура с множеством текстовых элементов
- Неадаптивный интерфейс загрузки изображений
- Длинные тексты с Typewriter-анимацией

**Мобильная версия:**
- Полноэкранный вертикальный интерфейс
- Упрощенный интерфейс загрузки с поддержкой touch
- Сохранение Typewriter-анимации с сокращенными текстами
- Адаптивные элементы формы (минимум 44px для touch)

```jsx
// Пример адаптации формы для мобильных устройств
const MobileForm = () => {
  return (
    <div className="mobile-form-container">
      <h1 className="mobile-form-title">Before Life</h1>
      
      <div className="mobile-form-content">
        {currentStep === 1 && <FormStep1Mobile />}
        {currentStep === 2 && <FormStep2Mobile />}
        {currentStep === 3 && <FormStep3Mobile />}
      </div>
      
      <div className="mobile-form-steps">
        <span className={step === 1 ? 'active' : ''}>0</span>
        <span className={step === 2 ? 'active' : ''}>1</span>
        <span className={step === 3 ? 'active' : ''}>2</span>
      </div>
    </div>
  );
};
```

```css
/* Стили для мобильной формы */
.mobile-form-container {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: #000;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.mobile-form-title {
  font-size: clamp(28px, 8vw, 42px);
  text-align: center;
  margin-bottom: 40px;
}

.mobile-form-content {
  flex: 1;
  overflow-y: auto;
}

.mobile-form-steps {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 20px 0;
}
```

### 3. Лендинг (After Life)

**Текущее состояние:**
- Статичная страница с текстом и изображением
- Неадаптивная верстка с фиксированными размерами

**Мобильная версия:**
- Адаптивная верстка с правильным масштабированием
- Улучшенная типографика для мобильных устройств
- Оптимизированные изображения

```jsx
// Пример компонента мобильного лендинга
const MobileLanding = () => {
  return (
    <div className="mobile-landing">
      <h1 className="mobile-landing-title">After Life</h1>
      
      <div className="mobile-landing-content">
        <p className="mobile-landing-text">
          In this project created during self-initiated course under mentorship of
          Milo Keller at ECAL, I collaborated with AI to examine what personal
          archives can preserve beyond the purely individual...
        </p>
        
        <div className="mobile-landing-image">
          <img 
            src="/images/about.jpg" 
            alt="Installation view" 
            loading="lazy"
          />
          <p className="mobile-landing-caption">
            5-channel video installation displayed on five screens
          </p>
        </div>
      </div>
    </div>
  );
};
```

```css
/* Стили для мобильного лендинга */
.mobile-landing {
  padding: 20px;
  min-height: 100vh;
}

.mobile-landing-title {
  font-size: clamp(28px, 8vw, 42px);
  margin-bottom: 30px;
}

.mobile-landing-text {
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 30px;
}

.mobile-landing-image {
  width: 100%;
  margin-bottom: 30px;
}

.mobile-landing-image img {
  width: 100%;
  height: auto;
}
```

## Навигация

**Текущее состояние:**
- Сложная структура с Header и Footer
- Множество режимов и фильтров

**Мобильная версия:**
- Упрощенная навигация
- Минималистичный Header с двумя кнопками (Before Life, After Life)
- Отсутствие сложного Footer с фильтрами

```jsx
// Пример мобильной навигации
const MobileNavigation = ({ onNavigate }) => {
  return (
    <header className="mobile-header">
      <button 
        className="mobile-nav-btn"
        onClick={() => onNavigate("form")}
      >
        Before Life
      </button>
      
      <button 
        className="mobile-nav-btn"
        onClick={() => onNavigate("about")}
      >
        After Life
      </button>
    </header>
  );
};
```

```css
/* Стили для мобильной навигации */
.mobile-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 15px;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(10px);
  z-index: 100;
}

.mobile-nav-btn {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.3);
  color: white;
  padding: 10px 16px;
  font-size: 14px;
  border-radius: 4px;
  min-height: 44px;
}
```

## Адаптивные медиа-запросы

```css
/* Базовые медиа-запросы */
@media (max-width: 480px) {
  /* Смартфоны в портретной ориентации */
}

@media (min-width: 481px) and (max-width: 767px) {
  /* Смартфоны в ландшафтной ориентации */
}

@media (min-width: 768px) and (max-width: 1023px) {
  /* Планшеты */
}

@media (min-width: 1024px) {
  /* Десктоп */
}
```

## План реализации

1. **Неделя 1**: Настройка базовой структуры и навигации
   - Создание мобильного каркаса приложения
   - Настройка адаптивных медиа-запросов
   - Реализация базовой навигации

2. **Неделя 2**: Галерея и оптимизация изображений
   - Реализация мобильной галереи
   - Оптимизация изображений (WebP, разные размеры)
   - Настройка ленивой загрузки

3. **Неделя 3**: Адаптация формы (Before Life)
   - Адаптация интерфейса формы для мобильных устройств
   - Оптимизация текстов для Typewriter-анимации
   - Создание мобильного интерфейса загрузки изображений

4. **Неделя 4**: Адаптация лендинга (After Life)
   - Создание адаптивной верстки для лендинга
   - Оптимизация типографики и изображений
   - Финальное тестирование на различных устройствах

## Тестирование

- iPhone (Safari): iPhone SE, iPhone X/11/12/13
- Android (Chrome): Samsung Galaxy, Google Pixel
- Планшеты: iPad (Safari), Samsung Tab (Chrome)
- Различные размеры экрана и разрешения
- Тестирование touch-взаимодействия
- Проверка производительности и скорости загрузки
