import React from "react";
import "./Footer.css";

function Footer({ handleButtonClick, activeButton, formStep }) {
  return (
    <header className="footer">
      <div className="footer-main-toggler">
        {activeButton === "form" ? (
          <>
            {/* Form step indicator */}
            {Array.from({ length: 3 }, (_, idx) => (
              <React.Fragment key={idx}>
                <button
                  className={`footer-button ${idx < formStep ? "active" : ""}`}
                >
                  {idx < formStep ? "✓" : idx + 1}
                </button>
                {idx < 2 && <span> | </span>}
              </React.Fragment>
            ))}
          </>
        ) : (
          <>
            {/* Default component toggles */}
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
          </>
        )}
      </div>
      {activeButton !== "text" && activeButton !== "form" && (
        <div className="footer-filter">
          <p className="footer-filter-label">FILTER:</p>
          <button
            onClick={() => handleButtonClick("gallery")}
            className={`footer-button ${activeButton === "gallery" ? "active" : ""}`}
          >
            All
          </button>
          <span>|</span>
          <button
            onClick={() => handleButtonClick("byPrompt")}
            className={`footer-button ${activeButton === "byPrompt" ? "active" : ""}`}
          >
            By Prompt
          </button>
          <span>|</span>
          <button
            onClick={() => handleButtonClick("byContributor")}
            className={`footer-button ${activeButton === "byContributor" ? "active" : ""}`}
          >
            By Contributor
          </button>
        </div>
      )}
    </header>
  );
}

export default Footer;
