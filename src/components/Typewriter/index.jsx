import React, { useState, useEffect, useRef } from "react";

const Typewriter = ({ text = "", delayBeforeStart = 0, charInterval = 50, onComplete, instant = false }) => {
  const [displayedText, setDisplayedText] = useState("");
  const startTimeout = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    // If instant mode or not in production, show full text immediately
    if (instant || process.env.NODE_ENV !== 'production') {
      setDisplayedText(text);
      if (onComplete) onComplete();
      return;
    }
    // Otherwise, perform typewriter animation
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
  }, [text, delayBeforeStart, charInterval, onComplete, instant]);

  return <p>{displayedText}</p>;
};

export default Typewriter; 