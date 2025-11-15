import React, { useState, useEffect, useRef } from "react";
import "./Typewriter.css";

/**
 * Enhanced Typewriter component with improved animation and cursor effect
 * @param {string} text - Text to animate
 * @param {number} charInterval - Interval between characters in ms
 * @param {function} onComplete - Callback when animation completes
 * @param {boolean} isInstant - Show text instantly without animation
 */
const Typewriter = ({ 
  text = "", 
  charInterval = 15, 
  onComplete, 
  isInstant = false,
  skipAnimation = false
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef(null);
  const indexRef = useRef(0);

  useEffect(() => {
    if (isInstant || skipAnimation) {
      setDisplayedText(text);
      setIsTyping(false);
      if (onComplete) onComplete();
      return;
    }

    setIsTyping(true);
    indexRef.current = 0;
    setDisplayedText("");

    const type = () => {
      if (indexRef.current < text.length) {
        setDisplayedText(text.slice(0, indexRef.current + 1));
        indexRef.current += 1;
        timeoutRef.current = setTimeout(type, charInterval);
      } else {
        setIsTyping(false);
        if (onComplete) onComplete();
      }
    };

    timeoutRef.current = setTimeout(type, charInterval);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsTyping(false);
      indexRef.current = 0;
    };
  }, [text, charInterval, isInstant, skipAnimation, onComplete]);

  return (
    <p className={`typewriter-text ${isTyping ? "typing" : ""}`}>
      {displayedText}
      {isTyping && <span className="typewriter-cursor">|</span>}
    </p>
  );
};

export default Typewriter; 