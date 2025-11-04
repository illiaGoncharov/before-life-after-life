import React, { useState, Suspense, lazy, useEffect, useRef } from "react";
import "./App.css";
import Header from "./../../ui/header/Header";
import Footer from "./../../ui/footer/Footer";
import { prompts } from "../../data/prompts";
import { contributors } from "../../data/contributors";

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
  // Флаг для отслеживания пользовательского взаимодействия для автозапуска аудио
  const hasUserInteractedRef = useRef(false);

  // Унифицированный обработчик переключения компонентов
  const handleComponentChange = (componentName) => {
    if (COMPONENTS[componentName]) {
      setCurrentComponent(componentName);
      setActiveButton(componentName);
    }
  };

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

    return (
      <Suspense fallback={
        <div className="loading-screen">
          loading...
        </div>
      }>
        <Component {...componentProps} />
      </Suspense>
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
      />
    </div>
  );
}

export default App;
