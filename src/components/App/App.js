import React, { useState } from "react";
import "./App.css";
import Header from "./../../ui/header/Header";
import Footer from "./../../ui/footer/Footer";
import Gallery from "./../Gallery/Gallery";
import Form from "./../Form/Form";
import About from "./../About/About";
import Text from "./../Text/Text";

function App() {
  const [currentComponent, setCurrentComponent] = useState("gallery");

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
    default:
      renderComponent = <Gallery />;
  }
  return (
    <div className="App">
      <Header setCurrentComponent={setCurrentComponent} />
      {renderComponent}
      <Footer setCurrentComponent={setCurrentComponent} />
    </div>
  );
}

export default App;
