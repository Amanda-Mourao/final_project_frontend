import { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { useAudio } from "../components/AudioContext";

export const AudioLayout = ({ soundtrackUrl }) => {
  const audioRef = useRef(null);
  const { muted } = useAudio();

  useEffect(() => {
    const tryPlay = () => {
      if (audioRef.current && soundtrackUrl) {
        audioRef.current.src = soundtrackUrl;
        audioRef.current.loop = true;
        audioRef.current.volume = muted ? 0 : 0.14;
        audioRef.current.play().catch(() => {
          window.addEventListener("pointerdown", resume);
        });
      }
    };

    const resume = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
      window.removeEventListener("pointerdown", resume);
    };

    tryPlay();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      window.removeEventListener("pointerdown", tryPlay);
      window.removeEventListener("pointerdown", resume);
    };
  }, [soundtrackUrl, muted]);

  return (
    <div className="relative w-full min-h-screen">
      <audio ref={audioRef} preload="auto" className="hidden" />
      <Outlet />
    </div>
  );
};
