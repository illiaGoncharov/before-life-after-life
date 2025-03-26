import React, { useState, useEffect, useRef } from "react";
import "./Text.css";

const firstSet = [
  "before life",
  "home",
  "family at home",
  "birth",
  "unintended child",
  "puberty",
  "bullied teen",
  "love",
  "love between men",
  "love between women",
  "sex",
  "unsafe sex",
  "healthy person",
  "sick person",
  "person with mental health condition",
  "person with substance use disorder",
];

const secondSet = [
  "immigrant",
  "apolitical person",
  "propaganda",
  "people at protest",
  "rich politician",
  "poor politician",
  "poor person",
  "homeless person",
  "unemployed person",
  "influencer",
  "artist",
  "office worker",
  "city",
  "city celebration",
  "city at war",
  "person at war",
  "woman at war",
  "women military parade",
  "tampon in blood",
  "bullet in blood",
  "elderly person",
  "dying person",
  "dying pet",
  "euthanasia",
  "death",
  "funeral",
  "cemetery",
  "religion",
  "afterlife",
];

function Text() {
  const [currentSet, setCurrentSet] = useState(firstSet);
  const [visibleWords, setVisibleWords] = useState([]);
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const audioRef = useRef(null);
  const isFirstSet = currentSet === firstSet;

  useEffect(() => {
    if (index < currentSet.length && !isPaused) {
      const timer = setTimeout(() => {
        setVisibleWords((prev) => [...prev, currentSet[index]]);
        playAudio(index, isFirstSet);
        setIndex(index + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else if (index >= currentSet.length && isFirstSet) {
      setTimeout(() => {
        setCurrentSet(secondSet);
        setIndex(0);
        setVisibleWords([]);
      }, 1500);
    }
  }, [index, currentSet, isPaused]);

  const playAudio = (idx, isFirstSet) => {
    const audioIndex = isFirstSet ? idx + 1 : firstSet.length + idx + 1;
    const audio = new Audio(
      `/audio/audio_${audioIndex.toString().padStart(2, "0")}.mp3`
    );
    audioRef.current = audio;
    audio.play();
  };

  const handleSwitchSet = (setNumber) => {
    setVisibleWords([]);
    setIndex(0);
    setCurrentSet(setNumber === 1 ? firstSet : secondSet);
  };

  const handlePauseResume = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
    setIsPaused((prev) => !prev);
  };

  return (
    <div className="text-container">
      {/* <div className="controls">
        <button onClick={() => handleSwitchSet(1)}>First Set</button>
        <button onClick={() => handleSwitchSet(2)}>Second Set</button>
        <button onClick={handlePauseResume}>
          {isPaused ? "Resume" : "Pause"}
        </button>
      </div> */}
      {visibleWords.map((word, idx) => (
        <div
          key={idx}
          className="text-step"
          style={{ marginLeft: `${idx * 20}px` }}
        >
          {word}
        </div>
      ))}
    </div>
  );
}

export default Text;
