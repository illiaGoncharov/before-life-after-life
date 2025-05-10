import React, { useState, useEffect } from "react";
import "./Form.css";
import Typewriter from "../Typewriter";

const totalPrompts = 45;

function Form({ onNavigate, onStepChange }) {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState(Array(totalPrompts).fill(null));
  const [completed, setCompleted] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [typedStep1Count, setTypedStep1Count] = useState(0);
  const [typedStep3Count, setTypedStep3Count] = useState(0);
  const [typedStep4Count, setTypedStep4Count] = useState(0);
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

  const STEP4_ITEMS = [
    { prefix: "[✓]", text: "Thank you! Your contribution is priceless." },
    { prefix: "", text: "Your dataset will be transformed into 45 images tracing your speculative lifespan—from [before life] to [after life]." },
    { prefix: "", text: "It may take anywhere from 1 to 365 business days to process your data. If you get impatient, don't hesitate to drop us a line at [beforelife@yahoo.com]" },
    { prefix: "", text: "We may feature selected results on this page (and beyond). If so, we'll make sure to ask for your permission first." },
    { prefix: "", text: "Bisou-bisou! Talk to you soon :)" },
  ];

  // Reset typing counters on step change; in dev show all step1 immediately for testing
  const isDev = process.env.NODE_ENV !== 'production';
  useEffect(() => {
    if (step === 1) {
      if (isDev) {
        // immediately reveal all step 1 items in dev
        setTypedStep1Count(STEP1_ITEMS.length);
      } else {
        setTypedStep1Count(0);
      }
    }
    if (step === 3) setTypedStep3Count(0);
  }, [step, isDev]);

  // Notify parent about step changes
  useEffect(() => {
    if (onStepChange) onStepChange(step);
  }, [step, onStepChange]);

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
    setCompleted(true);
    setTypedStep4Count(0);
  };

  return (
    <div className="form-container">
      {!completed ? (
        <>
          {/* ТЕКСТОВЫЙ СТОЛБЕЦ */}
          <div className={`form-text-view ${step > 1 ? "dimmed" : ""}`}>
            <ul className="form-text-list">
              {STEP1_ITEMS.map((item, idx) => {
                const isComplete = idx < typedStep1Count;
                const isTyping = idx === typedStep1Count;
                if (!isComplete && !isTyping) return null;
                return (
                  <li key={idx} className="form-text-list-element">
                    <span>{item.prefix}</span>
                    {isComplete ? (
                      <p>{item.text}</p>
                    ) : (
                      <Typewriter
                        text={item.text}
                        charInterval={CHAR_INTERVAL}
                        onComplete={() => setTypedStep1Count((c) => c + 1)}
                        instant={true}
                      />
                    )}
                  </li>
                );
              })}
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
                <div className="form-data-field">
                  <span>[2]</span>
                  <div className="form-data-field-content">
                    <p>Fill any information you feel comfortable sharing.</p>
                    <p><em>Fields marked with * are required, and answering question 2.4 is encouraged.</em></p>
                  </div>
                </div>
                <div className="form-data-field">
                  <span>[2.1]</span>
                  <div className="form-data-field-content">
                    <p>YOUR NAME OR NICKNAME</p>
                    <input type="text" name="name" required />
                  </div>
                </div>
                <div className="form-data-field">
                  <span>[2.2]</span>
                  <div className="form-data-field-content">
                    <p>YOUR E-MAIL</p>
                    <em>(for very rare updates)</em>
                    <input type="email" name="email" required />
                  </div>
                </div>
                <div className="form-data-field">
                  <span>[2.3]</span>
                  <div className="form-data-field-content">
                    <p>PLACE OF ORIGIN</p>
                    <input type="text" name="origin" />
                  </div>
                </div>
                <div className="form-data-field">
                  <span>[2.4]</span>
                  <div className="form-data-field-content">
                    <p>YOUR OWN PROMPT</p>
                    <em>(a phrase or sentence you'd like to see influence the generated images)</em>
                    <input
                      type="text"
                      placeholder="Suggest your own prompt"
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-data-field">
                  <span>[2.5]</span>
                  <div className="form-data-field-content">
                    <p>Would you like to receive $1 for participating?</p>
                    <em>(If so, you'll be contacted by provided e-mail)</em>
                    <div className="radio-group">
                      <label>
                        <input type="radio" name="payment" value="yes" required /> [YES]
                      </label>
                      <label>
                        <input type="radio" name="payment" value="no" required /> [NO], I participate voluntarily.
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-data-field">
                  <span>[2.6*]</span>
                  <div className="form-data-field-content">
                    <p>Do you agree to your images being used to train AI?</p>
                    <div className="radio-group">
                      <label>
                        <input type="radio" name="train_ai" value="yes" required /> [YES]
                      </label>
                      <label>
                        <input type="radio" name="train_ai" value="no" required /> [NO]
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-data-field">
                  <span>[2.7*]</span>
                  <div className="form-data-field-content">
                    <p>Do you agree to your images potentially shown publicly?</p>
                    <div className="radio-group">
                      <label>
                        <input type="radio" name="publicly" value="yes" required /> [YES]
                      </label>
                      <label>
                        <input type="radio" name="publicly" value="no" required /> [NO]
                      </label>
                    </div>
                  </div>
                </div>
                <button type="submit" className="form-data-view-submit">
                  [COMPLETE]
                </button>
              </form>
            </div>
          )}
        </>
      ) : (
        <div className="form-completed-view">
          <div className="form-completed-text">
            {STEP4_ITEMS.map((item, idx) => {
              const isComplete = idx < typedStep4Count;
              const isTyping = idx === typedStep4Count;
              if (!isComplete && !isTyping) return null;
              return (
                <div key={idx} className="form-completed-list-element">
                  <span>{item.prefix}</span>
                  {isComplete ? (
                    <p>{item.text}</p>
                  ) : (
                    <Typewriter
                      text={item.text}
                      charInterval={CHAR_INTERVAL}
                      onComplete={() => setTypedStep4Count((c) => c + 1)}
                      instant={true}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <button
            className="learn-more-button"
            onClick={() => onNavigate("text")}
          >
            [learn more]
          </button>
        </div>
      )}
    </div>
  );
}

export default Form;
