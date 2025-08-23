import React, { useState } from "react";
import { contributors } from "../../data/contributors";
import "./ByContributor.css";
import ImageModal from "../ImageModal/ImageModal";

const totalPrompts = 45;

function ByContributor({ selectedContributorIndex, onSelectContributor }) {
  const [modalIndex, setModalIndex] = useState(null);

  const selectedContributor = contributors[selectedContributorIndex];
  const contributorImages = Array.from({ length: totalPrompts }, (_, i) =>
    `${process.env.PUBLIC_URL}/images/${selectedContributor}/${selectedContributor}_${String(
      i + 1
    ).padStart(2, "0")}.png`
  );

  const handleImageClick = (index) => setModalIndex(index);
  const handleModalClose = () => setModalIndex(null);

  return (
    <div className="by-contributor-container">
      <div className="image-contributor-grid">
        {contributorImages.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`${selectedContributor} ${index + 1}`}
            className="image-contributor-item"
            onClick={() => handleImageClick(index)}
            onKeyDown={(e) => e.key === "Enter" && handleImageClick(index)}
            tabIndex="0"
            role="button"
            aria-label={`View image ${index + 1}`}
          />
        ))}
      </div>
      {/* Removed component-level navigation; footer provides controls now */}
      {modalIndex !== null && (
        <ImageModal
          images={contributorImages}
          startIndex={modalIndex}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

export default ByContributor;
