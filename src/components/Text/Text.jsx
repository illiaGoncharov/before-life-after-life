import React, { useEffect, useRef, useState } from "react";
import "./Text.css";

const words = [
  "afterlife",
  "religion",
  "cemetery",
  "funeral",
  "death",
  "dying pet",
  "euthanasia",
  "dying person",
  "elderly person",
  "bullet in blood",
  "tampon in blood",
  "women military parade",
  "woman at war",
  "person at war",
  "city at war",
  "city celebration",
  "city",
  "office worker",
  "artist",
  "influencer",
  "unemployed person",
  "homeless person",
  "poor person",
  "poor politician",
  "rich politician",
  "people at protest",
  "propaganda",
  "apolitical person",
  "immigrant",
  "person with substance use disorder",
  "person with mental health condition",
  "sick person",
  "healthy person",
  "unsafe sex",
  "sex",
  "love between women",
  "love between men",
  "love",
  "bullied teen",
  "puberty",
  "unintended child",
  "birth",
  "family at home",
  "home",
  "before life",
];

function Text() {
  const [offset, setOffset] = useState(window.innerHeight);
  const SCROLL_SPEED = process.env.NODE_ENV !== 'production' ? 10 : 0.3;
  const [currentAudioIndex, setCurrentAudioIndex] = useState(null);
  const [cameraError, setCameraError] = useState(false);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio();

    audioRef.current.addEventListener("ended", () => {
      console.log("Audio playback completed");
    });

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error("Ошибка доступа к камере", error);
        setCameraError(true);
      });

    const animate = () => {
      setOffset((prev) => prev - SCROLL_SPEED);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  useEffect(() => {
    const centerY = window.innerHeight / 2;
    const stepHeight = 70;
    const centerIndex = Math.floor((centerY - offset) / stepHeight);

    if (
      centerIndex !== currentAudioIndex &&
      centerIndex >= 0 &&
      centerIndex < words.length
    ) {
      setCurrentAudioIndex(centerIndex);
      playAudio(centerIndex);
    }
  }, [offset]);

  const playAudio = (index) => {
    if (!words[index] || !audioRef.current) return;

    // Используем индекс напрямую для правильного порядка аудио
    const audioSrc = `${process.env.PUBLIC_URL}/audio/audio_${(index + 1)
      .toString()
      .padStart(2, "0")}.mp3`; // Индексация начинается с 01

    if (!audioRef.current.paused) {
      audioRef.current.pause();
    }

    audioRef.current.src = audioSrc;
    audioRef.current
      .play()
      .catch((e) => console.error("Ошибка воспроизведения", e));
  };

  return (
    <div className="text-container">
      {cameraError && (
        <div className="camera-error">
          <span>Ошибка доступа к камере</span>
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="video-bg"
      ></video>

      <div
        className="text-wrapper"
        style={{ transform: `translateY(${-offset}px)` }}
      >
        {words.map((word, idx) => (
          <div key={idx} className="text-step">
            {word}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Text;
