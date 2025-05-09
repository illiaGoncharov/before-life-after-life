import React, { useState } from "react";
import "./ByContributor.css";
import ImageModal from "../ImageModal/ImageModal";

const contributors = ["andrey", "anna", "clara", "dexter", "jeff"];
const totalPrompts = 45;

function ByContributor() {
  const [selectedContributor, setSelectedContributor] = useState("andrey");
  const [modalIndex, setModalIndex] = useState(null);

  // Собираем URLs изображений текущего участника
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
      <div className="contributor-navigation">
        {contributors.map((contributor, index) => (
          <button
            key={contributor}
            onClick={() => setSelectedContributor(contributor)}
            className={selectedContributor === contributor ? "active" : ""}
          >
            {/* {contributor} */}
            {index + 1} {index < contributors.length - 1 && "|"}
          </button>
        ))}
      </div>
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
