import { createContext, useContext, useState } from "react";

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [muted, setMuted] = useState(false);
  return (
    <AudioContext.Provider value={{ muted, setMuted }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
