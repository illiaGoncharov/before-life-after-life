import React from "react";
import "./Footer.css";

function Footer({ handleButtonClick, activeButton }) {
  return (
    <header className="footer">
      <div className="footer-main-toggler">
        <button
          onClick={() => handleButtonClick("gallery")}
          className={`footer-button ${
            activeButton === "gallery" ||
            activeButton === "byPrompt" ||
            activeButton === "byContributor"
              ? "active"
              : ""
          }`}
        >
          Images
        </button>
        <span> | </span>
        <button
          onClick={() => handleButtonClick("text")}
          className={`footer-button ${activeButton === "text" ? "active" : ""}`}
        >
          Text
        </button>
      </div>
      <div className="footer-filter">
        <p className="footer-filter-label">FILTER:</p>
        <button
          onClick={() => handleButtonClick("gallery")}
          className={`footer-button ${
            activeButton === "gallery" ? "active" : ""
          }`}
        >
          All
        </button>
        <span>|</span>
        <button
          onClick={() => handleButtonClick("byPrompt")}
          className={`footer-button ${
            activeButton === "byPrompt" ? "active" : ""
          }`}
        >
          By Prompt
        </button>
        <span>|</span>
        <button
          onClick={() => handleButtonClick("byContributor")}
          className={`footer-button ${
            activeButton === "byContributor" ? "active" : ""
          }`}
        >
          By Contributor
        </button>
      </div>
    </header>
  );
}

export default Footer;
