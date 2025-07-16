import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PageTransition } from "../components/PageTransition";

// Bilder als Variabeln
const GRYFFINDOR_ROOM =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751385661/Gryffindor-Haus_jza0mf.png";

const HAT_GIF =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751295551/GIF-2025-06-30-12-23-34-unscreen_ysixss.gif";

// Hut Ansage
const PHRASES = [
  `Ah, welcome brave Gryffindor!`,
  `Listen carefully, for there is trouble afoot. One of your fellow students has become trapped deep within a secret passageway beneath the castle. It will take true courage and daring to venture inside and rescue them.`,
  `You must be brave at heart, daring, and chivalrous. These are the qualities that define the great Gryffindor House.`,
  `There will be three rounds. In each round, you will be shown a path combination. Pay close attention and remember it well! You must then retrace the path from memory.`,
  `Beware, for obstacles and surprises await you in the darkness of the passage. I hope you have practiced your spells, for you may need them to overcome dangers along the way.`,
  `Are you bold enough to face the unknown and prove yourself a true Gryffindor? The fate of your classmate depends on you. Good luck!`,
];

export const GryffindorHat = () => {
  const navigate = useNavigate();

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const charIndexRef = useRef(0);
  const typingIntervalRef = useRef(null);

  //gryffindor seite übergang
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/gryffindor");
    }, 54000);
    return () => clearTimeout(timer);
  }, [navigate]);

  useEffect(() => {
    setDisplayedText("");
    charIndexRef.current = 0;

    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }

    typingIntervalRef.current = setInterval(() => {
      const fullText = PHRASES[currentPhraseIndex];
      const nextIndex = charIndexRef.current + 1;

      setDisplayedText(fullText.slice(0, nextIndex));
      charIndexRef.current = nextIndex;

      if (nextIndex === fullText.length) {
        clearInterval(typingIntervalRef.current);
        // eien Sekunde warten dann nächste Absatz
        setTimeout(() => {
          if (currentPhraseIndex < PHRASES.length - 1) {
            setCurrentPhraseIndex((prev) => prev + 1);
          }
        }, 5000);
      }
    }, 30);

    return () => clearInterval(typingIntervalRef.current);
  }, [currentPhraseIndex]);

  // Zeilenumbrüche
  const renderWithLineBreaks = (text) =>
    text.split("\n").map((line, idx) => (
      <div key={idx} className="inline">
        {line}
        {idx < text.split("\n").length - 1 && <br />}
      </div>
    ));

  // Skip Button
  const handleSkip = () => {
    navigate("/gryffindor");
  };

  return (
    <div
      className="w-screen h-screen min-h-screen flex flex-col 
                items-center justify-end relative overflow-hidden bg-black"
    >
      {/* <PageTransition /> */}

      {/* Skip Button  */}
      <button
        onClick={handleSkip}
        className="fixed top-6 right-8 z-50 px-3 py-3 bg-[var(--color-text)]/60 hover:bg-[var(--color-text)] text-amber-950 font-bold rounded-lg shadow-lg  transition-colors text-xl  tracking-wide"
      >
        Skip
      </button>

      {/* Background Bild */}
      <img
        src={GRYFFINDOR_ROOM}
        alt="Gryffindor Common Room"
        className="fixed inset-0 w-full h-full object-cover object-center z-0"
        draggable={false}
      />

      {/* Hut GIF */}
      <div
        className="absolute left-0 bottom-0 flex flex-col items-center 
                  z-20 w-full sm:w-auto sm:left-12 sm:bottom-8"
      >
        <img
          src={HAT_GIF}
          alt="Sorting Hat"
          className="w-80 h-80 sm:w-70 sm:h-70 mx-auto select-none 
                    pointer-events-none drop-shadow-lg"
          draggable={false}
        />
      </div>

      {/* Sprechblase */}
      <div
        className="absolute left-75 bottom-40 z-30 bg-[var(--color-b)] 
                  bg-opacity-90 text-text px-8 py-6 rounded-3xl shadow-lg 
                  font-semibold text-lg md:text-xl border-2 border-text w-[600px] 
                  min-h-[140px] whitespace-pre-wrap leading-[1.5] select-none"
      >
        <div
          className="absolute -left-6 bottom-6 w-0 h-0 border-t-8
                    border-t-transparent border-b-8 border-b-transparent border-r-8 
                    border-opacity-90 border-r-text"
        />
        {renderWithLineBreaks(displayedText)}
      </div>
    </div>
  );
};
