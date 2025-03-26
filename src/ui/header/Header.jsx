import React from "react";
import "./Header.css";

function Header({ setCurrentComponent }) {
  return (
    <header className="header">
      <button
        className="header-button"
        onClick={() => setCurrentComponent("form")}
      >
        Before Life
      </button>
      <button
        className="header-button"
        onClick={() => setCurrentComponent("about")}
      >
        After Life
      </button>
    </header>
  );
}

export default Header;
