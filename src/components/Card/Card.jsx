import React, { useState } from "react";
import "./Card.css";
import Loader from "../Loader/Loader";

/**
 * Компонент визитки для проекта Before Life After Life
 * Отображает информацию об Андрее Лопатине с loader-анимацией
 */

function Card({ onNavigate }) {
  const [loaderComplete, setLoaderComplete] = useState(false);

  const handleLoaderComplete = () => {
    setLoaderComplete(true);
  };

  // Если loader не завершен, показываем loader
  if (!loaderComplete) {
    return (
      <Loader 
        text="ANDREY LOPATIN" 
        onComplete={handleLoaderComplete}
        charInterval={50}
      />
    );
  }

  return (
    <div className="card-container">
      {/* Декоративный элемент с буквой A */}
      <div className="card-decorative-a card-decorative-a-top">A</div>
      
      <div className="card-content">
        {/* Заголовок с именем */}
        <div className="card-header">
          <div className="card-header-left">
            <span className="card-header-number">365119</span>
            <h1 className="card-name">ANDREY</h1>
          </div>
          <div className="card-header-right">
            <div className="card-status">
              <span>2022</span>
              <span>ongoing</span>
            </div>
            <h1 className="card-name-large">LOPATIN</h1>
          </div>
        </div>

        {/* Основной контент */}
        <div className="card-main">
          <div className="card-left">
            {/* Контакты */}
            <div className="card-section">
              <a href="mailto:andrey.lopatin@beforelife.com" className="card-link">
                andrey.lopatin@beforelife.com
              </a>
              <a href="https://instagram.com/streeterror" target="_blank" rel="noopener noreferrer" className="card-link">
                @streeterror
              </a>
            </div>

            {/* Образование */}
            <div className="card-section">
              <h2 className="card-section-title">EDUCATION</h2>
              <p className="card-text">BA in Cultural Studies at HSE, Moscow</p>
              <p className="card-text">MA in Photography at ECAL, Lausanne</p>
            </div>

            {/* Выпущенные проекты */}
            <div className="card-section">
              <h2 className="card-section-title">RELEASED</h2>
              <div className="card-project">
                <p className="card-project-title">before life-after life</p>
                <p className="card-project-description">webpage & 5-screen installation</p>
              </div>
              <div className="card-divider"></div>
              <div className="card-project">
                <p className="card-project-title">i have no radar contact with you</p>
                <p className="card-project-description">photobook, 180x240mm, softcover, 108p</p>
              </div>
            </div>

            {/* Скоро */}
            <div className="card-section">
              <h2 className="card-section-title">SOON</h2>
              <div className="card-project">
                <p className="card-project-title">grand perspective, 2025</p>
                <p className="card-project-description">video art, 9m 32s</p>
                <span className="card-preview-tag">[PREVIEW]</span>
              </div>
            </div>
          </div>

          <div className="card-right">
            {/* Биография */}
            <div className="card-biography">
              <p>
                Andrey Lopatin is a Russian-born artist currently based in Lausanne,
                where he is pursuing a Master's degree in Photography at ECAL. He holds
                a Bachelor's degree in Cultural Studies from HSE in Moscow, where he
                first became captivated by the interplay between visual media and
                emerging technologies—an interest that evolved to encompass artificial
                and other non-human intelligences, digital capitalism, and human
                responses to technological innovation. Grounded in active
                experimentation with cutting-edge tools, his practice explores the
                social and personal reverberations such technologies produce, shedding
                light on the ever-evolving terrain between human agency and
                machine-driven processes.
              </p>
            </div>
          </div>
        </div>

        {/* Навигация назад */}
        <button 
          className="card-back-button"
          onClick={() => onNavigate && onNavigate("about")}
        >
          BACK
        </button>
      </div>

      {/* Декоративный элемент с буквой A внизу */}
      <div className="card-decorative-a card-decorative-a-bottom">A</div>
    </div>
  );
}

export default Card;

