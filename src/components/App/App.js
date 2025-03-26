import React, { useState } from "react";
import "./App.css";
import Header from "./../../ui/header/Header";
import Footer from "./../../ui/footer/Footer";
import Gallery from "./../Gallery/Gallery";
import Form from "./../Form/Form";
import About from "./../About/About";
import Text from "./../Text/Text";
import ByPrompt from "./../ByPrompt/ByPrompt"; // Импортируем новый компонент
import ByContributor from "./../ByContributor/ByContributor"; // Импортируем новый компонент

function App() {
  const [currentComponent, setCurrentComponent] = useState("gallery");
  const [activeButton, setActiveButton] = useState("gallery");

  const handleButtonClick = (component) => {
    setCurrentComponent(component);
    if (component === "gallery") {
      setActiveButton("gallery");
    } else if (component === "byPrompt") {
      setActiveButton("byPrompt");
    } else if (component === "byContributor") {
      setActiveButton("byContributor");
    } else {
      setActiveButton(component);
    }
  };

  let renderComponent;
  switch (currentComponent) {
    case "form":
      renderComponent = <Form />;
      break;
    case "about":
      renderComponent = <About />;
      break;
    case "text":
      renderComponent = <Text />;
      break;
    case "byPrompt":
      renderComponent = <ByPrompt />;
      break;
    case "byContributor":
      renderComponent = <ByContributor />;
      break;
    default:
      renderComponent = <Gallery />;
  }

  return (
    <div className="App">
      <Header setCurrentComponent={setCurrentComponent} />
      {renderComponent}
      <Footer
        handleButtonClick={handleButtonClick}
        activeButton={activeButton}
      />
    </div>
  );
}

export default App;
