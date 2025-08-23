import React from "react";
import "./Footer.css";
import { prompts } from "../../data/prompts";

function Footer({
  handleButtonClick,
  activeButton,
  formStep,
  promptIndex,
  soundOn,
  isPaused,
  togglePause,
  toggleSound,
  prevPrompt,
  nextPrompt,
  selectedContributorIndex,
  onSelectContributor,
  contributors,
}) {
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
      {/* Now Playing and playback controls for ByPrompt */}
      {activeButton === "byPrompt" && (
        <div className="footer-playback">
          <span className="footer-now-playing">
            NOW PLAYING: {prompts[prompts.length - 1 - promptIndex]}
          </span>
          <button
            className="footer-sound-toggle"
            onClick={toggleSound}
          >
            SOUND: {soundOn ? "ON" : "OFF"}
          </button>
          <button
            className="footer-ctrl-button"
            onClick={prevPrompt}
          >
            &lt;
          </button>
          <button
            className="footer-ctrl-button"
            onClick={togglePause}
          >
            {isPaused ? "PLAY" : "PAUSE"}
          </button>
          <button
            className="footer-ctrl-button"
            onClick={nextPrompt}
          >
            &gt;
          </button>
        </div>
      )}
      {/* Contributor navigation buttons in footer */}
      {activeButton === "byContributor" && contributors && (
        <div className="footer-contributor-nav">
          {contributors.map((_, idx) => (
            <React.Fragment key={idx}>
              <button
                className={`footer-button ${idx === selectedContributorIndex ? 'active' : ''}`}
                onClick={() => onSelectContributor(idx)}
              >
                {idx + 1}
              </button>
              {idx < contributors.length - 1 && <span>|</span>}
            </React.Fragment>
          ))}
        </div>
      )}
    </header>
  );
}

export default Footer;
