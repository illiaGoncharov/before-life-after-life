import React, { useState, useEffect } from "react";
import "./Form.css";
import Typewriter from "../Typewriter";

const totalPrompts = 45;

function SuccessMessage({ onHide }) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      window.location.reload();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onHide]);

  return (
    <div className="success-message">[ Your submission was successful ]</div>
  );
}

function Form() {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState(Array(totalPrompts).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [typedStep1Count, setTypedStep1Count] = useState(0);
  const [typedStep3Count, setTypedStep3Count] = useState(0);
  const CHAR_INTERVAL = 50;
  const PARAGRAPH_DELAY = 500;

  const STEP1_ITEMS = [
    { prefix: "[0]", text: "On this page, you can upload your images and fill out a short form." },
    { prefix: "[0.1]", text: "The images you share will be used to generate a sequence of AI-created visuals, guided by the prompts listed in the [text] section. Your photographs will help shape a visual journey—from before life to afterlife." },
    { prefix: "[0.2]", text: "Submit personal images already captured in everyday life. The images should form a coherent set through a recurring object, shape, or motif, a visual pattern, or a consistent photographic style—the connection can be thematic or aesthetic, but it must emerge naturally across the collection. For example: meals photographed across different days, views from the same window in changing light, or street scenes showing subtle variations over time." },
    { prefix: "[0.3]", text: "Do not take new photos just for this project. Send images that naturally reflect how you photograph your surroundings." },
  ];

  const STEP3_ITEMS = [
    { prefix: "[2]", text: "Fill any information you feel comfortable sharing. Fields marked with * are required, and question 2.4 is highly encouraged." },
    { prefix: "[2.5]", text: "Would you like to receive $1 for participating?" },
    { prefix: "[2.6]", text: "Do you agree to your images being used to train AI?" },
    { prefix: "[2.7]", text: "Do you agree to your images potentially shown publicly?" },
  ];

  useEffect(() => {
    if (step === 1) setTypedStep1Count(0);
    if (step === 3) setTypedStep3Count(0);
  }, [step]);

  const handleImageUpload = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = URL.createObjectURL(file);
      setImages(newImages);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="form-container">
      {submitted ? (
        <SuccessMessage onHide={() => setSubmitted(false)} />
      ) : (
        <>
          {/* ТЕКСТОВЫЙ СТОЛБЕЦ */}
          <div className={`form-text-view ${step > 1 ? "dimmed" : ""}`}>
            <ul className="form-text-list">
              {STEP1_ITEMS.map((item, idx) => (
                <li key={idx} className="form-text-list-element">
                  <span>{item.prefix}</span>
                  {idx < typedStep1Count ? (
                    <p>{item.text}</p>
                  ) : idx === typedStep1Count ? (
                    <Typewriter
                      text={item.text}
                      charInterval={CHAR_INTERVAL}
                      onComplete={() => setTypedStep1Count((c) => c + 1)}
                    />
                  ) : null}
                </li>
              ))}
            </ul>
            {step === 1 && typedStep1Count >= STEP1_ITEMS.length && (
              <button
                className="form-text-next-button"
                onClick={() => setStep(2)}
              >
                [Next]
              </button>
            )}
          </div>

          {/* СЕТКА ДЛЯ ЗАГРУЗКИ ИЗОБРАЖЕНИЙ */}
          {step > 1 && (
            <div className={`form-upload-view ${step === 3 ? "dimmed" : ""}`}>
              <div className="form-image-grid">
                {Array.from({ length: totalPrompts }, (_, i) => (
                  <div key={i} className="form-grid-cell">
                    {images[i] ? (
                      <img loading="lazy" src={images[i]} alt={`Upload ${i + 1}`} />
                    ) : (
                      <label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, i)}
                          style={{ display: "none" }}
                        />
                      </label>
                    )}
                  </div>
                ))}
              </div>
              {step === 2 && (
                <button
                  className="form-upload-button"
                  onClick={() => setStep(3)}
                  disabled={!images.some((img) => img !== null)}
                >
                  [Upload]
                </button>
              )}
            </div>
          )}

          {/* ФОРМА ДЛЯ ИМЕНИ И ДАННЫХ */}
          {step === 3 && (
            <div className="form-data-view">
              <form className="form-data-view-form" onSubmit={handleSubmit}>
                {STEP3_ITEMS.map((item, idx) => {
                  const isComplete = idx < typedStep3Count;
                  const isTyping = idx === typedStep3Count;
                  return (
                    <label key={idx}>
                      {item.prefix}
                      {isComplete ? (
                        <p>{item.text}</p>
                      ) : isTyping ? (
                        <Typewriter
                          text={item.text}
                          charInterval={CHAR_INTERVAL}
                          onComplete={() => setTypedStep3Count((c) => c + 1)}
                        />
                      ) : null}
                      {item.prefix === "[2.5]" && (
                        <div className="radio-group">
                          <label>
                            <input
                              type="radio"
                              name="payment"
                              value="yes"
                              required
                            />
                            [YES], here's my PayPal
                          </label>
                          <input
                            className="paypal"
                            type="text"
                            placeholder="Enter PayPal email"
                          />
                          <label>
                            <input
                              type="radio"
                              name="payment"
                              value="no"
                              required
                            />
                            [NO], payment needed. I participate voluntarily.
                          </label>
                        </div>
                      )}
                      {item.prefix === "[2.6]" && (
                        <div className="radio-group">
                          <label>
                            <input
                              type="radio"
                              name="train_ai"
                              value="yes"
                              required
                            />
                            Yes
                          </label>
                          <label>
                            <input
                              type="radio"
                              name="train_ai"
                              value="no"
                              required
                            />
                            No
                          </label>
                        </div>
                      )}
                      {item.prefix === "[2.7]" && (
                        <div className="radio-group">
                          <label>
                            <input
                              type="radio"
                              name="publicly"
                              value="yes"
                              required
                            />
                            Yes
                          </label>
                          <label>
                            <input
                              type="radio"
                              name="publicly"
                              value="no"
                            />
                            No
                          </label>
                        </div>
                      )}
                    </label>
                  );
                })}
                <button type="submit" className="form-data-view-submit">
                  [Complite]
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Form;
