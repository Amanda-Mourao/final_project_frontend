import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PageTransition } from "../components/PageTransition";

// Bilder als Variabeln
const GREAT_HALL_BG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751382414/Hogwards-Greathall_kjio3v.png";

const HAT_GIF =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751295551/GIF-2025-06-30-12-23-34-unscreen_ysixss.gif";

// Hut Ansage
const PHRASES = [
  `Welcome to Hogwarts, young witch or wizard!`,
  `I am the legendary Sorting Hat, and it is my honor to greet you at the start of your magical journey.`,
  `My job is to look deep into your heart and mind, and assign you to one of the four great Houses: Gryffindor, Slytherin, Hufflepuff, or Ravenclaw.`,
  `But... wait a moment—something feels very wrong...`,
  `Oh dear! I... I can't sense your destiny at all! My magic has vanished! Without my powers, I cannot sort anyone.`,
  `This is most unusual and rather troubling.`,
  `But do not worry! There is still hope. If you help me recover my lost magic, I will be able to sort you properly.`,
  `To do so, you must collect the four powerful artefacts, each hidden within a different House.`,
  `Are you ready for this magical quest?`,
  `Step forward and choose any House to start your adventure. The Map will guide you—visit every House, help me regain my powers, and together we will restore the magic to Hogwarts!`,
  `Let us begin!`,
];

export const GreatHall = () => {
  const navigate = useNavigate();

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [startExit, setStartExit] = useState(false);

  const charIndexRef = useRef(0);
  const typingIntervalRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartExit(true);
      setTimeout(() => {
        navigate("/map");
      }, 100);
    }, 76000);
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
        setTimeout(() => {
          if (currentPhraseIndex < PHRASES.length - 1) {
            setCurrentPhraseIndex((prev) => prev + 1);
          }
        }, 5000);
      }
    }, 30);

    return () => clearInterval(typingIntervalRef.current);
  }, [currentPhraseIndex]);

  const renderWithLineBreaks = (text) =>
    text.split("\n").map((line, idx) => (
      <div key={idx} style={{ display: "inline" }}>
        {line}
        {idx < text.split("\n").length - 1 && <br />}
      </div>
    ));

  return (
    <div
      className="w-screen h-screen min-h-screen flex flex-col items-center 
                justify-end relative overflow-hidden bg-black"
    >
      <PageTransition isExiting={startExit} />

      <img
        src={GREAT_HALL_BG}
        alt="Great Hall"
        className="fixed inset-0 w-full h-full object-top z-0"
        draggable={false}
      />
      <div
        className="absolute left-0 bottom-0 flex flex-col 
                  items-center z-20 w-full sm:w-auto sm:left-12 sm:bottom-8"
      >
        <img
          src={HAT_GIF}
          alt="Sorting Hat"
          className="w-80 h-80 sm:w-70 sm:h-70 mx-auto select-none pointer-events-none drop-shadow-lg"
          draggable={false}
        />
      </div>
      <div
        className="absolute left-75 bottom-40 z-30 bg-[var(--color-b)] bg-opacity-90 
                  text-text px-8 py-6 rounded-3xl shadow-lg font-semibold text-lg md:text-xl 
                  border-2 border-text w-[600px] min-h-[140px] whitespace-pre-wrap leading-[1.5] select-none"
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
