# Технический стек проекта Before Life | After Life

В данном документе описаны технологии, используемые в проекте, их назначение и особенности реализации.

## Frontend

### React 19

Проект построен на последней версии React, что обеспечивает:
- Улучшенную производительность благодаря новому механизму рендеринга
- Поддержку современных паттернов разработки (Hooks, Context API)
- Более эффективную работу с памятью

```jsx
// Пример использования React Hooks в проекте
const Gallery = () => {
  const [hiddenImages, setHiddenImages] = useState(new Set());
  const [loadedImages, setLoadedImages] = useState([]);
  
  useEffect(() => {
    // Логика загрузки изображений
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setLoadedImages((prev) => [...prev, src]);
      };
    });
  }, []);
  
  // Остальная логика компонента
};
```

### Lazy Loading компонентов

Для оптимизации начальной загрузки применяется ленивая загрузка компонентов:

```jsx
// Ленивая загрузка компонентов
const Gallery = lazy(() => import("../Gallery/Gallery"));
const Form = lazy(() => import("../Form/Form"));
const About = lazy(() => import("../About/About"));
const Text = lazy(() => import("../Text/Text"));

// Использование с Suspense
<Suspense fallback={<div className="loading-screen">Loading...</div>}>
  <Component {...componentProps} />
</Suspense>
```

### CSS Modules

Стилизация компонентов осуществляется с помощью CSS Modules, что обеспечивает:
- Изоляцию стилей на уровне компонентов
- Отсутствие конфликтов имен классов
- Более структурированную организацию стилей

```css
/* Gallery.module.css */
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 3px;
}

.imageContainer {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
}
```

```jsx
// Использование CSS Modules в компоненте
import styles from './Gallery.module.css';

const Gallery = () => {
  return (
    <div className={styles.gallery}>
      {images.map((src, index) => (
        <div key={index} className={styles.imageContainer}>
          <img src={src} alt={`Image ${index + 1}`} />
        </div>
      ))}
    </div>
  );
};
```

## Оптимизация

### WebP формат изображений

Для улучшения производительности загрузки все изображения конвертируются в формат WebP:
- Меньший размер файлов (на 25-35% меньше по сравнению с JPEG)
- Поддержка прозрачности
- Лучшее качество при том же размере файла

```jsx
// Пример использования WebP с fallback для старых браузеров
const OptimizedImage = ({ src, alt }) => {
  const webpSrc = src.replace(/\.(jpg|png)$/, '.webp');
  
  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img src={src} alt={alt} loading="lazy" />
    </picture>
  );
};
```

### Адаптивные изображения

Для различных размеров экрана предоставляются оптимизированные версии изображений:

```html
<picture>
  <source 
    media="(max-width: 480px)" 
    srcSet="/images/small/image.webp" 
  />
  <source 
    media="(max-width: 1024px)" 
    srcSet="/images/medium/image.webp" 
  />
  <source 
    srcSet="/images/large/image.webp" 
  />
  <img 
    src="/images/large/image.jpg" 
    alt="Description" 
    loading="lazy" 
  />
</picture>
```

### Code Splitting

Разделение кода на чанки для оптимизации загрузки:
- Основной бандл содержит только необходимый код для начального рендеринга
- Дополнительные компоненты загружаются по требованию
- Используется динамический импорт и React.lazy()

## Типографика

### Кастомные шрифты Hershey-Noailles

Проект использует уникальные шрифты Hershey-Noailles:
- Hershey-Noailles-Times для основного текста
- Hershey-Noailles-Futura для UI элементов

```css
@font-face {
  font-family: "Hershey-Noailles-Times";
  src: url("./../../assets/fonts/Hershey-Noailles/Hershey-Noailles-Times-Triplex-Bold.ttf")
    format("truetype");
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: "Hershey-Noailles-Futura-Triplex-Regular";
  src: url("./../../assets/fonts/Hershey-Noailles/Hershey-Noailles-Futura-Triplex-Regular.ttf")
    format("truetype");
  font-weight: normal;
  font-style: normal;
}
```

### Оптимизация загрузки шрифтов

Для улучшения производительности применяются следующие техники:
- Предзагрузка критических шрифтов
- Использование font-display: swap для предотвращения блокировки рендеринга
- Подмножества шрифтов для уменьшения размера файлов

```html
<!-- Предзагрузка критических шрифтов -->
<link 
  rel="preload" 
  href="/assets/fonts/Hershey-Noailles-Times-Triplex-Bold.woff2" 
  as="font" 
  type="font/woff2" 
  crossorigin 
/>

<style>
  @font-face {
    font-family: "Hershey-Noailles-Times";
    src: url("/assets/fonts/Hershey-Noailles-Times-Triplex-Bold.woff2") format("woff2");
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
</style>
```

## Хранение данных

### Firebase Storage

Для хранения пользовательских изображений используется Firebase Storage:
- Безопасное хранение с контролем доступа
- Автоматическое масштабирование
- Интеграция с другими сервисами Firebase

```javascript
// Пример загрузки изображения в Firebase Storage
const uploadImage = async (file, userId) => {
  const storageRef = ref(storage, `images/${userId}/${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  
  return downloadURL;
};
```

### Firestore

Для хранения данных формы и метаданных используется Firestore:
- NoSQL база данных в реальном времени
- Гибкая структура данных
- Офлайн-поддержка и синхронизация

```javascript
// Пример сохранения данных формы в Firestore
const saveFormData = async (formData) => {
  const docRef = await addDoc(collection(db, "submissions"), {
    name: formData.name,
    email: formData.email,
    prompt: formData.prompt,
    timestamp: serverTimestamp(),
    images: formData.imageUrls
  });
  
  return docRef.id;
};
```

## Производительность

### Метрики Core Web Vitals

Проект оптимизирован для соответствия метрикам Core Web Vitals:
- LCP (Largest Contentful Paint) < 2.5s
- FID (First Input Delay) < 100ms
- CLS (Cumulative Layout Shift) < 0.1

### Оптимизация рендеринга

Для обеспечения плавности UI применяются следующие техники:
- Виртуализация списков для больших наборов данных
- Мемоизация компонентов с React.memo()
- Оптимизация перерендеров с useCallback() и useMemo()

```jsx
// Пример оптимизации с использованием мемоизации
const MemoizedGalleryItem = React.memo(({ src, index, onImageHide }) => {
  return (
    <div className="image-container">
      <img 
        src={src} 
        alt={`Image ${index + 1}`}
        onMouseEnter={() => onImageHide(src)}
      />
    </div>
  );
});

// Использование useCallback для стабильных ссылок на функции
const Gallery = () => {
  const [hiddenImages, setHiddenImages] = useState(new Set());
  
  const handleImageHide = useCallback((src) => {
    setHiddenImages(prev => new Set(prev).add(src));
  }, []);
  
  return (
    <div className="gallery">
      {images.map((src, index) => (
        <MemoizedGalleryItem 
          key={index}
          src={src}
          index={index}
          onImageHide={handleImageHide}
        />
      ))}
    </div>
  );
};
```

### Анимации

Для обеспечения плавности анимаций (60fps) применяются следующие подходы:
- Использование CSS-анимаций вместо JavaScript где возможно
- Анимация только transform и opacity свойств
- Применение will-change для подготовки браузера к анимации
- Использование requestAnimationFrame для JavaScript-анимаций

```css
.image-container {
  transition: opacity 0.3s ease, transform 0.2s ease;
  will-change: opacity, transform;
}

.image-container.hidden {
  opacity: 0;
  transform: scale(0.8);
}
```

## Доступность (A11y)

### Клавиатурная навигация

Все интерактивные элементы доступны с клавиатуры:
- Фокусируемые элементы (tabindex="0")
- Видимый фокус
- Логический порядок табуляции

```jsx
<div 
  role="button"
  tabIndex="0"
  className="image-container"
  onKeyDown={(e) => e.key === 'Enter' && handleImageClick(index)}
  onClick={() => handleImageClick(index)}
>
  <img src={src} alt={`Image ${index + 1}`} />
</div>
```

### ARIA-атрибуты

Для улучшения доступности используются ARIA-атрибуты:
- aria-label для описания элементов
- aria-hidden для скрытия декоративных элементов
- aria-expanded для раскрывающихся элементов

```jsx
<button 
  aria-label="Toggle menu"
  aria-expanded={isMenuOpen}
  onClick={toggleMenu}
>
  <span aria-hidden="true">☰</span>
</button>
```

## Тестирование

### Кроссбраузерное тестирование

Проект тестируется в следующих браузерах:
- Chrome (последние 2 версии)
- Firefox (последние 2 версии)
- Safari (последние 2 версии)
- Edge (последние 2 версии)

### Мобильное тестирование

Тестирование на реальных устройствах:
- iPhone (Safari): различные модели и размеры экранов
- Android (Chrome): различные производители и версии ОС
- Планшеты: iPad, Samsung Tab

### Инструменты тестирования

- Chrome DevTools для отладки и профилирования
- Lighthouse для аудита производительности и доступности
- WebPageTest для тестирования производительности на реальных устройствах
- Browserstack для тестирования на различных браузерах и устройствах
