import React from "react";
import "./Header.css";

function Header({ setCurrentComponent, currentComponent }) {
  return (
    <header className="header">
      <button
        className={`header-button ${
          currentComponent === "form" ? "active" : ""
        }`}
        onClick={() => setCurrentComponent("form")}
      >
        Before Life
      </button>
      <button
        className={`header-button ${
          currentComponent === "about" ? "active" : ""
        }`}
        onClick={() => setCurrentComponent("about")}
      >
        Afterlife
      </button>
    </header>
  );
}

export default Header;
