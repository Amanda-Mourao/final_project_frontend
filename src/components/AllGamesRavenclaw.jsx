import React, { useState, useEffect, useRef } from "react";

// --- MISSION 1: Wassertank ---
const WORDS = [
  "ravenclaw",
  "lumos",
  "hogwarts",
  "pensieve",
  "dobby",
  "leviosa",
];
const WATERGAME_INTRO =
  " A glowing basin shows a twisted word.\n Can you decode the magic?";
const WATERGAME_IMG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1752481229/WaterBasin_qatmi5.png";

const mirrorAndDistort = (word) => {
  const mirrored = word.split("").reverse();
  if (mirrored.length >= 4) {
    const i = 1 + Math.floor(Math.random() * (mirrored.length - 2));
    let j = 1 + Math.floor(Math.random() * (mirrored.length - 2));
    while (j === i) j = 1 + Math.floor(Math.random() * (mirrored.length - 2));
    [mirrored[i], mirrored[j]] = [mirrored[j], mirrored[i]];
  }
  return mirrored.join("");
};

const WaterGame = ({ onComplete }) => {
  // Typing Animation Intro
  const [phase, setPhase] = useState("fade");
  const [displayedText, setDisplayedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const charIndexRef = useRef(0);
  const typingIntervalRef = useRef(null);

  // State für das Spiel
  const [originalWord, setOriginalWord] = useState("");
  const [distortedWord, setDistortedWord] = useState("");
  const [input, setInput] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [resultType, setResultType] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const timerRef = useRef(null);

  // Typing effect
  useEffect(() => {
    setPhase("fade");
    setDisplayedText("");
    setTypingDone(false);
    charIndexRef.current = 0;
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    setTimeout(() => setPhase("typing"), 700);
    return () => clearTimeout(typingIntervalRef.current);
  }, []);

  useEffect(() => {
    if (phase === "typing") {
      setDisplayedText("");
      charIndexRef.current = 0;
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = setInterval(() => {
        const nextIndex = charIndexRef.current + 1;
        setDisplayedText(WATERGAME_INTRO.slice(0, nextIndex));
        charIndexRef.current = nextIndex;
        if (nextIndex === WATERGAME_INTRO.length) {
          clearInterval(typingIntervalRef.current);
          setTypingDone(true);
        }
      }, 90);
      return () => clearInterval(typingIntervalRef.current);
    }
  }, [phase]);

  useEffect(() => {
    if (typingDone && phase === "typing") {
      setTimeout(() => setPhase("show"), 950);
    }
  }, [typingDone, phase]);

  // Spiel anfangen
  const startNewGame = () => {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    setOriginalWord(word);
    setDistortedWord(mirrorAndDistort(word));
    setInput("");
    setShowResult(false);
    setResultType(null);
    setTimeLeft(10);

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          triggerFail();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (phase === "show") {
      startNewGame();
    }
  }, [phase]);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const triggerFail = () => {
    setTimeout(() => {
      setShowResult(true);
      setResultType("fail");
    }, 400);
  };

  const checkAnswer = () => {
    clearInterval(timerRef.current);
    if (input.trim().toLowerCase() === originalWord.toLowerCase()) {
      setResultType("success");
    } else {
      setResultType("fail");
    }
    setTimeout(() => setShowResult(true), 350);
  };

  const handleContinue = () => {
    onComplete && onComplete(resultType === "success" ? "success" : "fail");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
     bg-black transition-all duration-1000 overflow-hidden w-full h-full"
    >
      {/* --- Intro --- */}
      {(phase === "fade" || phase === "typing") && (
        <div className="absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full">
          <div className="relative mb-6 flex items-center justify-center w-full max-w-[400px]">
            <img
              src={WATERGAME_IMG}
              alt="Water Basin Top View"
              className="w-full h-auto max-w-[500px] drop-shadow-xl pointer-events-none rounded-[24px]"
              draggable={false}
            />
          </div>
          <div
            className="text-white rounded-2xl px-8 py-8 text-lg shadow-2xl whitespace-pre-line 
          text-center tracking-wider leading-relaxed min-h-[120px] transition-opacity duration-800 max-w-[520px]"
          >
            {displayedText}
            {!typingDone && <span className="blink-cursor">|</span>}
          </div>
        </div>
      )}
      {/* --- Haput Spiel --- */}
      {phase === "show" && !showResult && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black w-full h-full">
          {/* --- Timer --- */}
          <div
            className="w-auto fixed top-6 right-8 z-[110] bg-black/70 text-white px-6 py-2 
          rounded-lg text-2xl font-bold select-none pointer-events-none border-2 border-white shadow-lg"
          >
            {timeLeft}s
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="relative flex flex-col items-center justify-center">
              {/* Wassertank Bild */}
              <img
                src={WATERGAME_IMG}
                alt="Water Basin Top View"
                className="w-[380px] h-auto drop-shadow-xl pointer-events-none rounded-[24px] mb-0"
                draggable={false}
              />
              {/* Schwebendes Wort direkt AUF dem Bild */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center 
                justify-center w-full pointer-events-none select-none"
              >
                <div
                  className="font-mono font-bold text-[2.5rem] text-transparent bg-gradient-to-b from-[#92C1FF]
                 via-[#88B9F9] to-[#92C1FF] bg-clip-text animate-[wave_4s_ease-in-out_infinite] scale-y-[-1]"
                >
                  {distortedWord.split("").map((c, i) => (
                    <span key={i} className="inline-block">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Input direkt darunter */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What is the true word?"
              disabled={timeLeft <= 0}
              className="w-72 px-6 py-3 text-lg rounded focus:ring-1 focus:ring-[var(--color-b-shadow)] 
              focus:border-[var(--color-b-shadow)] outline-none bg-white text-black mt-5 mb-4"
            />
            {/* Check-Button direkt darunter */}
            <button
              onClick={checkAnswer}
              disabled={timeLeft <= 0}
              className="w-72 py-4 rounded-lg text-xl font-bold bg-[var(--color-b)] hover:bg-[var(--color-b-shadow)] 
              hover:text-[var(--color-b)] drop-shadow-[0_0_10px_#00FFFF] shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed 
              transition-opacity duration-700"
            >
              Check
            </button>
          </div>
        </div>
      )}
      {/* --- Result Overlay --- */}
      {showResult && (
        <div
          className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center transition-all 
          duration-[1300ms] opacity-90 pointer-events-auto"
          style={{ minHeight: "100vh" }}
        >
          <div className="relative w-full flex flex-col items-center">
            <img
              src={WATERGAME_IMG}
              alt="Water Basin"
              className="w-[200px] h-auto mb-10 drop-shadow-xl pointer-events-none opacity-96"
              draggable="false"
            />

            <div className="text-white text-4xl font-bold mb-7 mt-2 transition-opacity duration-700">
              {resultType === "success" ? "Well done!" : "Game Over"}
            </div>
            {resultType === "fail" && (
              <div className="text-white text-xl mb-6">
                The correct word was: <b>{originalWord}</b>
              </div>
            )}
            <button
              className="w-72 py-4 pl-4 pr-4 rounded-lg text-xl font-bold bg-[var(--color-b)] hover:bg-[var(--color-b-shadow)]
               hover:text-[var(--color-b)] drop-shadow-[0_0_10px_#00FFFF] shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed 
               transition-opacity duration-700"
              style={{ transitionDelay: "0.8s" }}
              onClick={handleContinue}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- MISSION 2: RIDDLE ---

const RIDDLE_INTRO = "A magical riddle appears, are you able to solve it?";
const RIDDLES = [
  {
    question:
      "I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?",
    answer: "echo",
  },
  {
    question: "What has keys but can't open locks?",
    answer: "piano",
  },
  {
    question: "What gets wetter the more it dries?",
    answer: "towel",
  },
];

const MissionRiddle = ({ onComplete }) => {
  // Typing Animation Intro
  const [phase, setPhase] = useState("fade");
  const [displayedText, setDisplayedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const charIndexRef = useRef(0);
  const typingIntervalRef = useRef(null);

  // Riddle Spiel states
  const [riddle, setRiddle] = useState(null);
  const [input, setInput] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [resultType, setResultType] = useState(null);

  // Typing effect
  useEffect(() => {
    setPhase("fade");
    setDisplayedText("");
    setTypingDone(false);
    charIndexRef.current = 0;
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    setTimeout(() => setPhase("typing"), 700);
    return () => clearTimeout(typingIntervalRef.current);
  }, []);

  useEffect(() => {
    if (phase === "typing") {
      setDisplayedText("");
      charIndexRef.current = 0;
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = setInterval(() => {
        const nextIndex = charIndexRef.current + 1;
        setDisplayedText(RIDDLE_INTRO.slice(0, nextIndex));
        charIndexRef.current = nextIndex;
        if (nextIndex === RIDDLE_INTRO.length) {
          clearInterval(typingIntervalRef.current);
          setTypingDone(true);
        }
      }, 90);
      return () => clearInterval(typingIntervalRef.current);
    }
  }, [phase]);

  // nach Typing direkt weiter zum Rätsel
  useEffect(() => {
    if (typingDone && phase === "typing") {
      setTimeout(() => {
        setPhase("riddle");
        const r = RIDDLES[Math.floor(Math.random() * RIDDLES.length)];
        setRiddle(r);
        setInput("");
        setShowResult(false);
        setResultType(null);
      }, 950);
    }
  }, [typingDone, phase]);

  const check = () => {
    if (input.trim().toLowerCase() === riddle.answer.toLowerCase()) {
      setResultType("success");
    } else {
      setResultType("fail");
    }
    setTimeout(() => setShowResult(true), 350);
  };
  const finish = () =>
    onComplete && onComplete(resultType === "success" ? "success" : "fail");

  if (phase === "fade" || phase === "typing") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black w-full h-full">
        <div className="absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full">
          <div
            className="text-white rounded-2xl px-8 py-8 text-lg shadow-2xl whitespace-pre-line text-center tracking-wider 
          leading-relaxed min-h-[120px] transition-opacity duration-800 max-w-[520px]"
          >
            {displayedText}
            {!typingDone && <span className="blink-cursor">|</span>}
          </div>
        </div>
      </div>
    );
  }

  if (phase === "riddle" && riddle) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black w-full h-full">
        {!showResult ? (
          <div className="flex flex-col items-center w-full">
            <h2 className="text-white text-3xl font-bold mb-6 mt-2">
              The Riddle
            </h2>

            <div className="text-white text-2xl font-semibold mb-6 text-center max-w-xl">
              {riddle.question}
            </div>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your answer..."
              className="w-72 px-6 py-3 text-lg rounded focus:ring-1 focus:ring-[var(--color-b-shadow)] 
              focus:border-[var(--color-b-shadow)] outline-none bg-white text-black mt-5 mb-4"
              disabled={showResult}
            />

            <button
              onClick={check}
              disabled={showResult}
              className="w-72 py-4 pl-4 pr-4 rounded-lg text-xl font-bold bg-[var(--color-b)] hover:bg-[var(--color-b-shadow)] 
              hover:text-[var(--color-b)] drop-shadow-[0_0_10px_#00FFFF] shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed 
              transition-opacity duration-700"
            >
              Check
            </button>
          </div>
        ) : (
          <div className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center">
            <div className="text-white text-4xl font-bold mb-7 mt-2">
              {resultType === "success" ? "Well Done!" : "Game Over"}
            </div>
            <button
              className="w-72 py-4 pl-4 pr-4 rounded-lg text-xl font-bold bg-[var(--color-b)] hover:bg-[var(--color-b-shadow)] 
              hover:text-[var(--color-b)] drop-shadow-[0_0_10px_#00FFFF] shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed 
              transition-opacity duration-700"
              onClick={finish}
            >
              Continue
            </button>
          </div>
        )}
      </div>
    );
  }

  return null;
};

// --- MISSION 3: MEMORY GAME ---
const GAME_SIZE = 750;
const CARD_SIZE = 185;
const CARD_PAIRS = 3;
const GAME_TIME = 10;
const REVEAL_TIME = 1.1;
const CARD_IMAGES = [
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751991041/Dance_Dancing_Sticker_by_Fuzzy_Wobble_vzob06.gif",
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751991027/Harry_Potter_Quidditch_Sticker_by_Warner_Bros_uzpp12.gif",
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751991021/fantastic_beasts_running_Sticker_by_Fantastic_Beasts_The_Crimes_of_Grindelwald_cfpokq.gif",
];
const RAVENCLAW_MISSION_TEXT = `Can you solve this magical Memory Game?
You have only a few seconds to study the cards.`;

const shuffle = (array) => {
  let arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const MissionRuneTranslate = ({ onComplete }) => {
  const [phase, setPhase] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const charIndexRef = useRef(0);
  const typingIntervalRef = useRef(null);
  const [typingDone, setTypingDone] = useState(false);

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [lockBoard, setLockBoard] = useState(false);

  const [time, setTime] = useState(GAME_TIME);
  const [result, setResult] = useState(null);
  const [fadeOut, setFadeOut] = useState(false);
  const [hideImages, setHideImages] = useState(false);
  const [hideAllImages, setHideAllImages] = useState(false);

  useEffect(() => setPhase("fade"), []);

  useEffect(() => {
    if (phase === "fade") {
      setDisplayedText("");
      setTypingDone(false);
      setTimeout(() => setPhase("typing"), 700);
      return () => {};
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "typing") {
      setDisplayedText("");
      charIndexRef.current = 0;
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = setInterval(() => {
        const nextIndex = charIndexRef.current + 1;
        setDisplayedText(RAVENCLAW_MISSION_TEXT.slice(0, nextIndex));
        charIndexRef.current = nextIndex;
        if (nextIndex === RAVENCLAW_MISSION_TEXT.length) {
          clearInterval(typingIntervalRef.current);
          setTypingDone(true);
        }
      }, 90);
      return () => clearInterval(typingIntervalRef.current);
    }
  }, [phase]);

  useEffect(() => {
    if (typingDone && phase === "typing") {
      setTimeout(() => setPhase("reveal"), 950);
    }
  }, [typingDone, phase]);

  useEffect(() => {
    if (phase === "reveal") {
      let pairs = [];
      for (let i = 0; i < CARD_PAIRS; i++) {
        pairs.push({ img: CARD_IMAGES[i], id: i + "-a" });
        pairs.push({ img: CARD_IMAGES[i], id: i + "-b" });
      }
      const shuffled = shuffle(pairs);
      setCards(shuffled);
      setFlipped([]);
      setMatched([]);
      setLockBoard(true);
      setTime(GAME_TIME);
      setResult(null);
      setHideImages(false);
      setHideAllImages(false);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "reveal" && cards.length) {
      setTimeout(() => {
        setHideImages(true);
        setLockBoard(false);
        setPhase("game");
      }, REVEAL_TIME * 1000);
    }
  }, [phase, cards]);

  useEffect(() => {
    if (phase !== "game" || result) return;
    if (time <= 0) {
      setResult("fail");
      setHideAllImages(true);
      setLockBoard(true);
      setTimeout(() => setFadeOut(true), 1000);
      return;
    }
    const timer = setInterval(() => setTime((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [phase, result, time]);

  const handleCardClick = (idx) => {
    if (lockBoard || flipped.includes(idx) || matched.includes(idx)) return;
    if (flipped.length === 1) {
      const firstIdx = flipped[0];
      setFlipped((old) => [...old, idx]);
      setLockBoard(true);
      if (cards[firstIdx].img === cards[idx].img) {
        setTimeout(() => {
          setMatched((old) => [...old, firstIdx, idx]);
          setFlipped([]);
          setLockBoard(false);
        }, 650);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setResult("fail");
          setHideAllImages(true);
          setTimeout(() => setFadeOut(true), 900);
        }, 650);
      }
    } else {
      setFlipped([idx]);
    }
  };

  useEffect(() => {
    if (
      phase === "game" &&
      matched.length === cards.length &&
      cards.length &&
      !result
    ) {
      setResult("success");
      setLockBoard(true);
      setTimeout(() => setFadeOut(true), 1000);
    }
  }, [matched, cards, phase, result]);

  const handleContinue = () => {
    onComplete && onComplete(result === "success" ? "success" : "fail");
  };

  return (
    <div>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black transition-all 
      duration-1000 overflow-hidden w-full h-full"
      >
        {(phase === "fade" || phase === "typing") && (
          <div className="absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full">
            <div
              className="text-white rounded-2xl px-8 py-8 text-lg shadow-2xl whitespace-pre-line text-center tracking-wider 
            leading-relaxed min-h-[120px] transition-opacity duration-800 max-w-[520px]"
            >
              {displayedText}
              {!typingDone && <span className="blink-cursor">|</span>}
            </div>
          </div>
        )}
        {(phase === "reveal" || phase === "game") && (
          <div className="flex  items-center w-full h-full">
            {/* Timer */}
            <div
              className="w-auto fixed top-6 right-8 z-[110] bg-black/70 text-white px-6 py-2 rounded-lg 
            text-2xl font-bold select-none pointer-events-none border-2 border-white shadow-lg"
            >
              {time}s
            </div>
            <div
              className={`relative grid grid-cols-3 gap-12 w-[${GAME_SIZE}px] mx-auto pt-[60px]`}
            >
              {cards.map((c, idx) => {
                const showImage =
                  !hideAllImages &&
                  (!hideImages ||
                    flipped.includes(idx) ||
                    matched.includes(idx));
                return (
                  <div
                    key={c.id}
                    className={`cursor-pointer select-none transition-transform duration-400 flex items-center justify-center 
                      w-[${CARD_SIZE}px] h-[${CARD_SIZE}px] perspective-[600px] p-0`}
                    onClick={() => phase === "game" && handleCardClick(idx)}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "visible",
                      }}
                    >
                      <div
                        className="relative w-full h-full transition-transform duration-400"
                        style={{
                          width: `${CARD_SIZE}px`,
                          height: `${CARD_SIZE}px`,
                          maxWidth: "210px",
                          maxHeight: "210px",
                          margin: "0 auto",
                        }}
                      >
                        {showImage ? (
                          <div
                            className="absolute w-full h-full rounded-xl text-xl font-bold bg-[var(--color-b)]  
                            hover:bg-[var(--color-b-shadow)] hover:text-[var(--color-b)] 
                            drop-shadow-[0_0_10px_#00FFFF] shadow-lg text-white 
                            transition-all duration-700 flex items-center justify-center overflow-hidden backface-hidden z-2"
                          >
                            <img
                              src={c.img}
                              alt="card"
                              className="w-4/5 h-4/5 object-contain select-none pointer-events-none"
                              draggable={false}
                            />
                          </div>
                        ) : (
                          <div
                            className="absolute w-full h-full rounded-xl text-xl font-bold bg-[var(--color-b)] hover:bg-[var(--color-b-shadow)] 
                            hover:text-[var(--color-b)] drop-shadow-[0_0_10px_#00FFFF] shadow-lg text-white transition-opacity duration-700 
                             disabled:opacity-50 disabled:cursor-not-allowed opacity-90"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {phase && result && (
          <div
            className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center transition-all 
            duration-[2000ms] opacity-90 pointer-events-auto min-h-screen"
          >
            <div className="relative w-full flex flex-col items-center">
              <div
                className={`text-white text-4xl font-bold mb-7 mt-2 transition-opacity duration-700 ${
                  fadeOut ? "opacity-100" : "opacity-0"
                } delay-[300ms]`}
              >
                {result === "success" ? "Well done!" : "Game Over"}
              </div>
              <button
                className={`w-72 py-4 pl-4 pr-4 rounded-lg text-xl font-bold bg-[var(--color-b)] 
                hover:bg-[var(--color-b-shadow)] hover:text-[var(--color-b)] drop-shadow-[0_0_10px_#00FFFF] shadow-lg
                 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-700 delay-[800ms] ${
                   fadeOut ? "opacity-100" : "opacity-0"
                 }`}
                onClick={handleContinue}
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- EXPORT: Alle Spieler ---
export const AllGamesRavenclaw = ({ missionType, onComplete }) => {
  if (
    missionType === "watergame" ||
    missionType === "mission1" ||
    missionType === 0
  )
    return <WaterGame onComplete={onComplete} />;
  if (
    missionType === "riddle" ||
    missionType === "mission2" ||
    missionType === 1
  )
    return <MissionRiddle onComplete={onComplete} />;
  if (
    missionType === "runememory" ||
    missionType === "mission3" ||
    missionType === 2
  )
    return <MissionRuneTranslate onComplete={onComplete} />;
  return <WaterGame onComplete={onComplete} />;
};
