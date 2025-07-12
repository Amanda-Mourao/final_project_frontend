import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PageTransition } from "../components/PageTransition";

// Links als Variabeln
const Hufflepuff_BG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751565332/Huffelpuf-haus_cse36l.png";
const HAT_GIF =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751295551/GIF-2025-06-30-12-23-34-unscreen_ysixss.gif";

// Hut ANsage
const PHRASES = [
  `Welcome, loyal Hufflepuff!`,
  `Professor Sprout has sent for—her magical plants are in great peril and withering fast!`,
  `Will you prove your loyalty and diligence, the proud values of this house, by lending her your aid and saving the enchanted greenery?`,
  `But beware—there may be others in need! Not only the plants rely on your help today.`,
  `Quickly now, every moment counts! The magic of Hufflepuff is in your hands!`,
];

export const HufflepuffHat = () => {
  const navigate = useNavigate();

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const charIndexRef = useRef(0);
  const typingIntervalRef = useRef(null);

  //hufflepuff seite Übergang
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/hufflepuff");
    }, 35500);
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
      <div key={idx} style={{ display: "inline" }}>
        {line}
        {idx < text.split("\n").length - 1 && <br />}
      </div>
    ));

  return (
    <div
      className="w-screen h-screen min-h-screen flex flex-col 
items-center justify-end relative overflow-hidden bg-black"
    >
      {/* Background image */}
      <PageTransition />
      <img
        src={Hufflepuff_BG}
        alt="Hufflepuff Hall"
        className="fixed inset-0 w-full h-full object-cover brightness-70 object-center z-0"
        draggable={false}
      />

      {/* Sorting Hat GIF */}
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

      {/* Statische Sprechblase */}

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
