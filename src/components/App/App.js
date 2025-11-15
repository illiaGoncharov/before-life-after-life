import React, { useState, Suspense, lazy, useEffect, useRef } from "react";
import "./App.css";
import Header from "./../../ui/header/Header";
import Footer from "./../../ui/footer/Footer";
import { prompts } from "../../data/prompts";
import { contributors } from "../../data/contributors";
import Loader from "../Loader/Loader";

// Ленивая загрузка компонентов для улучшения производительности
const Gallery = lazy(() => import("./../Gallery/Gallery"));
const Form = lazy(() => import("./../Form/Form"));
const About = lazy(() => import("./../About/About"));
const Text = lazy(() => import("./../Text/Text"));
const ByPrompt = lazy(() => import("./../ByPrompt/ByPrompt"));
const ByContributor = lazy(() => import("./../ByContributor/ByContributor"));
const Card = lazy(() => import("./../Card/Card"));

// Определение типов компонентов
const COMPONENTS = {
  gallery: Gallery,
  form: Form,
  about: About,
  text: Text,
  byPrompt: ByPrompt,
  byContributor: ByContributor,
  card: Card
};

function App() {
  const [currentComponent, setCurrentComponent] = useState("gallery");
  const [activeButton, setActiveButton] = useState("gallery");
  const [promptIndex, setPromptIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());
  const audioRef = useRef(new Audio());
  const [formStep, setFormStep] = useState(1);
  // ByContributor state
  const [selectedContributorIndex, setSelectedContributorIndex] = useState(0);
  // Text page state (camera and sound)
  const [textCameraOn, setTextCameraOn] = useState(true);
  const [textSoundOn, setTextSoundOn] = useState(true);
  // Флаг для отслеживания пользовательского взаимодействия для автозапуска аудио
  const hasUserInteractedRef = useRef(false);

  // Состояние для контроля показа Loader
  const [isComponentLoading, setIsComponentLoading] = useState(false);
  const loadingTimeoutRef = useRef(null);

  // Унифицированный обработчик переключения компонентов
  const handleComponentChange = (componentName) => {
    if (COMPONENTS[componentName]) {
      // Останавливаем предыдущий таймаут если есть
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      
      // Устанавливаем состояние загрузки
      setIsComponentLoading(true);
      setCurrentComponent(componentName);
      setActiveButton(componentName);
      
      // Сбрасываем состояние загрузки через задержку
      // Это дает время показать анимацию и компоненту загрузиться
      loadingTimeoutRef.current = setTimeout(() => {
        setIsComponentLoading(false);
        loadingTimeoutRef.current = null;
      }, 500);
    }
  };

  // Cleanup для таймаута загрузки
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };
  }, []);

  // Отслеживание пользовательского взаимодействия
  useEffect(() => {
    const handleUserInteraction = () => {
      hasUserInteractedRef.current = true;
    };

    // Отслеживаем различные типы взаимодействий
    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('keydown', handleUserInteraction, { once: true });
    document.addEventListener('touchstart', handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  // Handlers for prompt navigation
  const prevPrompt = () => {
    hasUserInteractedRef.current = true;
    setPromptIndex((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
    setLastInteractionTime(Date.now());
  };
  const nextPrompt = () => {
    hasUserInteractedRef.current = true;
    setPromptIndex((prev) => (prev + 1) % prompts.length);
    setLastInteractionTime(Date.now());
  };

  // Audio playback for prompts
  useEffect(() => {
    if (!soundOn) {
      audioRef.current.pause();
      return;
    }
    
    // Воспроизводим аудио только после пользовательского взаимодействия
    if (!hasUserInteractedRef.current) {
      return;
    }
    
    const audioSrc = `${process.env.PUBLIC_URL}/audio/audio_${String(
      promptIndex + 1
    ).padStart(2, "0")}.mp3`;
    audioRef.current.src = audioSrc;
    audioRef.current
      .play()
      .catch((e) => {
        // Тихо обрабатываем ошибку, если пользователь еще не взаимодействовал
        if (e.name !== 'NotAllowedError') {
          console.error("Ошибка воспроизведения BYPROMPT", e);
        }
      });
  }, [promptIndex, soundOn]);

  // Auto-rotate prompts with 3s pause after interactions
  useEffect(() => {
    if (currentComponent !== "byPrompt" || isPaused) return;
    const timer = setTimeout(() => {
      setPromptIndex((prev) => (prev + 1) % prompts.length);
      setLastInteractionTime(Date.now());
    }, 3000);
    return () => clearTimeout(timer);
  }, [lastInteractionTime, isPaused, currentComponent]);

  // Маппинг названий компонентов для Loader
  const getComponentLoaderText = (componentName) => {
    const textMap = {
      gallery: 'images',
      form: 'before life',
      about: 'afterlife',
      text: 'text',
      byPrompt: 'by prompt',
      byContributor: 'by contributor',
      card: 'andrey lopatin'
    };
    return textMap[componentName] || 'loading';
  };

  // Безопасный рендеринг компонента с резервным вариантом
  const renderCurrentComponent = () => {
    const Component = COMPONENTS[currentComponent] || Gallery;
    // Props for lazy-loaded components
    const componentProps = {};
    if (currentComponent === 'gallery') {
      componentProps.onAllHidden = () => handleComponentChange('text');
    }
    if (currentComponent === 'form') {
      componentProps.onNavigate = handleComponentChange;
      componentProps.onStepChange = setFormStep;
    }
    if (currentComponent === 'byPrompt') {
      componentProps.promptIndex = promptIndex;
      componentProps.prevPrompt = prevPrompt;
      componentProps.nextPrompt = nextPrompt;
      componentProps.setLastInteractionTime = setLastInteractionTime;
      componentProps.soundOn = soundOn;
      componentProps.isPaused = isPaused;
      componentProps.togglePause = () => setIsPaused((p) => !p);
      componentProps.toggleSound = () => setSoundOn((s) => !s);
    }
    if (currentComponent === 'byContributor') {
      componentProps.selectedContributorIndex = selectedContributorIndex;
      componentProps.onSelectContributor = setSelectedContributorIndex;
      componentProps.contributors = contributors;
    }
    if (currentComponent === 'card') {
      componentProps.onNavigate = handleComponentChange;
    }
    if (currentComponent === 'text') {
      componentProps.cameraOn = textCameraOn;
      componentProps.soundOn = textSoundOn;
      componentProps.toggleCamera = () => setTextCameraOn((c) => !c);
      componentProps.toggleSound = () => setTextSoundOn((s) => !s);
    }

    // Для byPrompt, byContributor и gallery не показываем анимацию загрузки
    const shouldShowLoader = currentComponent !== 'byPrompt' && 
                             currentComponent !== 'byContributor' && 
                             currentComponent !== 'gallery';
    const loaderText = getComponentLoaderText(currentComponent);
    
    return (
      <>
        {/* Показываем Loader только при явном состоянии загрузки, а не через Suspense */}
        {isComponentLoading && shouldShowLoader && (
          <Loader 
            text={loaderText} 
            charInterval={50}
          />
        )}
        <Suspense fallback={null}>
          <Component {...componentProps} />
        </Suspense>
      </>
    );
  };

  return (
    <div className="App">
      <Header
        setCurrentComponent={handleComponentChange}
        currentComponent={currentComponent}
        promptIndex={currentComponent === "byPrompt" ? promptIndex : undefined}
      />
      {renderCurrentComponent()}
      {/* Footer shows toggles or form step indicator */}
      <Footer
        handleButtonClick={handleComponentChange}
        activeButton={activeButton}
        formStep={formStep}
        // ByPrompt props
        promptIndex={currentComponent === "byPrompt" ? promptIndex : undefined}
        soundOn={soundOn}
        isPaused={isPaused}
        togglePause={() => setIsPaused((p) => !p)}
        toggleSound={() => setSoundOn((s) => !s)}
        prevPrompt={prevPrompt}
        nextPrompt={nextPrompt}
        // ByContributor props
        selectedContributorIndex={currentComponent === "byContributor" ? selectedContributorIndex : undefined}
        onSelectContributor={setSelectedContributorIndex}
        contributors={currentComponent === "byContributor" ? contributors : undefined}
        // Text props
        textCameraOn={currentComponent === "text" ? textCameraOn : undefined}
        textSoundOn={currentComponent === "text" ? textSoundOn : undefined}
        toggleTextCamera={() => setTextCameraOn((c) => !c)}
        toggleTextSound={() => setTextSoundOn((s) => !s)}
      />
    </div>
  );
}

export default App;
