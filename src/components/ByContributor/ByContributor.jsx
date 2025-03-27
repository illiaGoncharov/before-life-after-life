import React, { useState } from "react";
import "./ByContributor.css";

const contributors = ["andrey", "anna", "clara", "dexter", "jeff"];
const totalPrompts = 45;

function ByContributor() {
  const [selectedContributor, setSelectedContributor] = useState("andrey");

  return (
    <div className="by-contributor-container">
      <div className="image-contributor-grid">
        {[...Array(totalPrompts).keys()].map((index) => (
          <img
            key={index}
            src={`${
              process.env.PUBLIC_URL
            }/images/${selectedContributor}/${selectedContributor}_${String(
              index + 1
            ).padStart(2, "0")}.png`}
            alt={`${selectedContributor} ${index + 1}`}
            className="image-contributor-item"
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
    </div>
  );
}

export default ByContributor;
