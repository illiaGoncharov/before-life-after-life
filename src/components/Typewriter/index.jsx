import React, { useState, useEffect, useRef } from "react";

const Typewriter = ({ text = "", delayBeforeStart = 0, charInterval = 50, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");
  const startTimeout = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    startTimeout.current = setTimeout(() => {
      let idx = 0;
      intervalRef.current = setInterval(() => {
        setDisplayedText((prev) => prev + text[idx]);
        idx++;
        if (idx >= text.length) {
          clearInterval(intervalRef.current);
          if (onComplete) onComplete();
        }
      }, charInterval);
    }, delayBeforeStart);

    return () => {
      clearTimeout(startTimeout.current);
      clearInterval(intervalRef.current);
    };
  }, [text, delayBeforeStart, charInterval, onComplete]);

  return <p>{displayedText}</p>;
};

export default Typewriter; 