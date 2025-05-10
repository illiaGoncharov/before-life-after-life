import React, { useState, Suspense, lazy } from "react";
import "./App.css";
import Header from "./../../ui/header/Header";
import Footer from "./../../ui/footer/Footer";

// Ленивая загрузка компонентов для улучшения производительности
const Gallery = lazy(() => import("./../Gallery/Gallery"));
const Form = lazy(() => import("./../Form/Form"));
const About = lazy(() => import("./../About/About"));
const Text = lazy(() => import("./../Text/Text"));
const ByPrompt = lazy(() => import("./../ByPrompt/ByPrompt"));
const ByContributor = lazy(() => import("./../ByContributor/ByContributor"));

// Определение типов компонентов
const COMPONENTS = {
  gallery: Gallery,
  form: Form,
  about: About,
  text: Text,
  byPrompt: ByPrompt,
  byContributor: ByContributor
};

function App() {
  const [currentComponent, setCurrentComponent] = useState("gallery");
  const [activeButton, setActiveButton] = useState("gallery");
  const [formStep, setFormStep] = useState(1);

  // Унифицированный обработчик переключения компонентов
  const handleComponentChange = (componentName) => {
    if (COMPONENTS[componentName]) {
      setCurrentComponent(componentName);
      setActiveButton(componentName);
    }
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
      />
      {renderCurrentComponent()}
      {/* Footer shows toggles or form step indicator */}
      <Footer
        handleButtonClick={handleComponentChange}
        activeButton={activeButton}
        formStep={formStep}
      />
    </div>
  );
}

export default App;
