import React, { useState } from "react";
import "./Form.css";

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
              <li className="form-text-list-element">
                <span>[0]</span>
                <p>
                  On this page, you can upload your images and fill out a short
                  form
                </p>
              </li>
              <li className="form-text-list-element">
                <span>[0.1]</span>
                <p>
                  The images you share will be used to generate a sequence of
                  AI-created visuals, guided by the prompts listed in the{" "}
                  <span className="text">[text] </span>
                  section. Your photographs will help shape a visual
                  journey—from before life to afterlife.
                </p>
              </li>
              <li className="form-text-list-element">
                <span>[0.2]</span>
                <p>
                  Submit personal images already captured in everyday life. The
                  images should form a coherent set through a recurring object,
                  shape, or motif, a visual pattern, or a consistent
                  photographic style—the connection can be thematic or
                  aesthetic, but it must emerge naturally across the collection.
                  <br />
                  <br />
                  For example: meals photographed across different days, views
                  from the same window in changing light, or street scenes
                  showing subtle variations over time.
                </p>
              </li>
              <li className="form-text-list-element">
                <span className="red">[0.3]</span>
                <p>
                  <span className="red">
                    Do not take new photos just for this project.
                  </span>
                  <br />
                  <br />
                  Send images that naturally reflect how you photograph your
                  surroundings.
                </p>
              </li>
            </ul>
            {step === 1 && (
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
                      <img src={images[i]} alt={`Upload ${i + 1}`} />
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
                <label>
                  [2]&nbsp;&nbsp;&nbsp;
                  <p>
                    Fill <span className="any">any</span> information you fill
                    comfortable sharing. Fields marked with * are required, and
                    question 2.4 is highly encouraged.
                  </p>
                </label>
                <label>
                  [2.1]
                  <input type="name" placeholder="Your name or nickname" />
                </label>
                <label>
                  [2.2]
                  <input type="email" placeholder="Your e-mail"></input>
                </label>
                <label>
                  [2.3]
                  <input type="text" placeholder="Place of origin"></input>
                </label>
                <label>
                  !2.4!
                  <input
                    type="text"
                    placeholder="Suggest your own prompt"
                  ></input>
                </label>
                <label>
                  [2.5]
                  <div>
                    <p>Would you like to receive $1 for participating?</p>
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
                  </div>
                </label>
                <label>
                  [2.6]
                  <div>
                    <p>Do you agree to your images being used to train AI?</p>
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
                  </div>
                </label>
                <label>
                  [2.7]
                  <div>
                    <p>
                      Do you agree to your images potentially shown publicly?
                    </p>
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
                        <input type="radio" name="publicly" value="no" />
                        No
                      </label>
                    </div>
                  </div>
                </label>
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
