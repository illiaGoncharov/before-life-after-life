import React, { useEffect, useRef, useState } from "react";
import "./Text.css";
import { prompts } from "../../data/prompts";
import Loader from "../Loader/Loader";

// Define a direct mapping from prompt text to audio number
const AUDIO_MAPPING = {
  "before life": 1,
  "home": 2,
  "family at home": 3,
  "birth": 4,
  "unintended child": 5,
  "puberty": 6,
  "bullied teen": 7,
  "love": 8,
  "love between men": 9,
  "love between women": 10,
  "sex": 11,
  "unsafe sex": 12,
  "healthy person": 13,
  "sick person": 14,
  "person with mental health condition": 15,
  "person with substance use disorder": 16,
  "immigrant": 17,
  "apolitical person": 18,
  "propaganda": 19,
  "people at protest": 20,
  "rich politician": 21,
  "poor politician": 22,
  "poor person": 23,
  "homeless person": 24,
  "unemployed person": 25,
  "influencer": 26,
  "artist": 27,
  "office worker": 28,
  "city": 29,
  "city celebration": 30,
  "city at war": 31,
  "person at war": 32,
  "woman at war": 33,
  "women military parade": 34,
  "tampon in blood": 35,
  "bullet in blood": 36,
  "elderly person": 37,
  "dying person": 38,
  "euthanasia": 39,
  "dying pet": 40,
  "death": 41,
  "funeral": 42,
  "cemetery": 43,
  "religion": 44,
  "afterlife": 45
};

function Text({ cameraOn = true, soundOn = true, toggleCamera, toggleSound }) {
  const [offset, setOffset] = useState(window.innerHeight);
  const SCROLL_SPEED = 0.3;
  const [currentPromptInCenter, setCurrentPromptInCenter] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [audioDisabled, setAudioDisabled] = useState(false);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const animationRef = useRef(null);
  const textWrapperRef = useRef(null);
  const audioErrorCount = useRef(0);
  const cameraStreamRef = useRef(null);

  // Start scrolling immediately after brief loading
  useEffect(() => {
    const fastStartTimer = setTimeout(() => {
      setIsLoading(false);
      setIsInitialized(true);
    }, 2000);
    
    return () => clearTimeout(fastStartTimer);
  }, []);

  // Инициализация и управление камерой
  useEffect(() => {
    if (!cameraOn) {
      // Выключаем камеру
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
        cameraStreamRef.current = null;
      }
      return;
    }

    const constraints = {
      video: { 
        facingMode: 'user',
        width: window.innerWidth,
        height: window.innerHeight
      }
    };

    // Функция для запуска камеры
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        cameraStreamRef.current = stream;
        
        if (videoRef.current) {
          // Подключаем поток к видео элементу
          videoRef.current.srcObject = stream;
          
          // Важно! Нужно дождаться, пока видео будет готово к воспроизведению
          videoRef.current.onloadedmetadata = () => {
            // Теперь можно запускать воспроизведение
            if (videoRef.current) {
              videoRef.current.play()
                .catch(e => console.error('Ошибка воспроизведения:', e));
            }
          };

          // Если видео остановилось, пытаемся перезапустить
          videoRef.current.onpause = () => {
            if (cameraOn && videoRef.current) {
              videoRef.current.play()
                .catch(e => console.error('Ошибка перезапуска:', e));
            }
          };
        }
      } catch (err) {
        console.error('Ошибка запуска камеры:', err);
      }
    };

    // Запускаем камеру только если она включена
    startCamera();

    // Следим за видимостью страницы
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && cameraOn) {
        startCamera();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // При размонтировании компонента или выключении камеры
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // Останавливаем все треки камеры
      if (cameraStreamRef.current) {
        const tracks = cameraStreamRef.current.getTracks();
        tracks.forEach(track => track.stop());
        cameraStreamRef.current = null;
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [cameraOn]);

  // Initialize audio
  useEffect(() => {
    try {
      audioRef.current = new Audio();
      
      const handleAudioEnded = () => {
        setIsAudioPlaying(false);
      };
      
      audioRef.current.addEventListener('ended', handleAudioEnded);
      
      const handleAudioError = (e) => {
        console.error("Audio error:", e);
        audioErrorCount.current += 1;
        
        if (audioErrorCount.current >= 3) {
          setAudioDisabled(true);
        }
        
        setIsAudioPlaying(false);
      };
      
      audioRef.current.addEventListener('error', handleAudioError);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.removeEventListener('ended', handleAudioEnded);
          audioRef.current.removeEventListener('error', handleAudioError);
        }
      };
    } catch (error) {
      console.error("Audio initialization error:", error);
      setAudioDisabled(true);
      return () => {};
    }
  }, []);

  // Останавливаем аудио при выключении звука
  useEffect(() => {
    if (!soundOn && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    }
  }, [soundOn]);

  // Set up animation and center detection
  useEffect(() => {
    if (!isInitialized) return;
    
    const checkCenterPrompt = () => {
      if (isAudioPlaying || audioDisabled || !soundOn) return;

      try {
        const windowCenter = window.innerHeight / 2;
        const textSteps = document.querySelectorAll('.text-step');
        if (!textSteps || !textSteps.length) return;
        
        let closestToCenter = null;
        let smallestDistance = Infinity;
        
        textSteps.forEach((step) => {
          try {
            const rect = step.getBoundingClientRect();
            const stepCenter = rect.top + rect.height / 2;
            const distance = Math.abs(stepCenter - windowCenter);
            
            if (distance < smallestDistance) {
              smallestDistance = distance;
              closestToCenter = step;
            }
          } catch (error) {
            // Silent catch for any getBoundingClientRect errors
          }
        });
        
        if (closestToCenter && smallestDistance < 50) {
          const promptInCenter = closestToCenter.textContent;
          
          if (promptInCenter && promptInCenter !== currentPromptInCenter) {
            setCurrentPromptInCenter(promptInCenter);
            
            if (!audioDisabled) {
              const audioNumber = AUDIO_MAPPING[promptInCenter];
              if (audioNumber) {
                playAudio(audioNumber);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error in checkCenterPrompt:", error);
      }
    };
    
    const animate = () => {
      try {
        setOffset((prev) => prev - SCROLL_SPEED);
        
        if (!audioDisabled && soundOn) {
          checkCenterPrompt();
        }
        
        animationRef.current = requestAnimationFrame(animate);
      } catch (error) {
        console.error("Animation error:", error);
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentPromptInCenter, isAudioPlaying, isInitialized, audioDisabled, soundOn]);

  const playAudio = (audioNumber) => {
    if (!audioRef.current || audioDisabled || !soundOn) return;

    try {
      setIsAudioPlaying(true);

      const audioSrc = `${process.env.PUBLIC_URL}/audio/audio_${
        String(audioNumber).padStart(2, "0")
      }.mp3`;

      if (!audioRef.current.paused) audioRef.current.pause();
      audioRef.current.src = audioSrc;
      
      const safetyTimeout = setTimeout(() => {
        setIsAudioPlaying(false);
      }, 10000);
      
      audioRef.current.play()
        .then(() => {
          clearTimeout(safetyTimeout);
        })
        .catch((error) => {
          console.error("Audio playback error:", error);
          clearTimeout(safetyTimeout);
          setIsAudioPlaying(false);
          
          audioErrorCount.current += 1;
          if (audioErrorCount.current >= 3) {
            setAudioDisabled(true);
          }
        });
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsAudioPlaying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-container loading">
        <Loader 
          text="text" 
          charInterval={50}
        />
      </div>
    );
  }

  return (
    <div className="text-container">
      {cameraOn && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="video-bg"
        />
      )}

      <div
        ref={textWrapperRef}
        className="text-wrapper"
        style={{ transform: `translateX(-50%) translateY(${-offset}px)` }}
      >
        {prompts.map((prompt, idx) => (
          <div 
            key={idx} 
            className="text-step"
          >
            {prompt}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Text;
