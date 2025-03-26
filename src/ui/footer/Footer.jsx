import React from "react";
import "./Footer.css";

function Footer({ setCurrentComponent }) {
  return (
    <header className="footer">
      <div className="footer-main-toggler">
        <button
          className="footer-button"
          onClick={() => setCurrentComponent("gallery")}
        >
          Images
        </button>
        <span> | </span>
        <button
          className="footer-button"
          onClick={() => setCurrentComponent("text")}
        >
          Text
        </button>
      </div>
    </header>
  );
}

export default Footer;
