import React, { useEffect, useState } from "react";
import "./ImageModal.css";

const ImageModal = ({ images, startIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  useEffect(() => {
    setCurrentIndex(startIndex);
  }, [startIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      handlePrevious();
    } else if (event.key === "ArrowRight") {
      handleNext();
    } else if (event.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content">
        <button
          className="modal-exit-button"
          onClick={onClose}
          aria-label="Exit"
        >
          [EXIT]
        </button>
        <img
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          className="modal-image"
        />
        <button
          className="modal-prev-button"
          onClick={handlePrevious}
          aria-label="Previous image"
        >
          &lt;
        </button>
        <button
          className="modal-next-button"
          onClick={handleNext}
          aria-label="Next image"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default ImageModal; 