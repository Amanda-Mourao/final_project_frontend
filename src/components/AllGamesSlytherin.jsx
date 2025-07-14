import { useEffect, useState, useRef } from "react";

// Bilder und Video verlinkungen als Variabeln
const FIRE_IMG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751471292/tumblr_0b3396be11767653e65a8df232a3edcf_35664549_400_ld9e3i.webp";

const SNAKE_VIDEO =
  "https://res.cloudinary.com/ddloaxsnx/video/upload/v1751644711/0704_2_ntbapx.mp4";

const FROGBOY_IMG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751477347/craiyon_192849_image_m8tge2.png";

const HUMAN_IMG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751474521/mensch_tjxqck.png";

/// Typing Texte
const FIRE_TYPING_TEXT =
  "A classmate mixed the wrong ingredients. The cauldron exploded and fire is spreading!\nWhich spell puts out the fire?";

const SNAKE_TYPING_TEXT =
  "While getting new ingredients a snake appears. Put all letters in Parseltongue order to calm it.";

const FROG_TYPING_TEXT =
  "A classmate has turned into a frog-like creature due to a potion accident.\nWhich potion turns him back into a human?";

// Typing Speed
const TYPING_SPEED = 90;

//  Zeilenumbrüche
const renderWithLineBreaks = (text) =>
  (text || "").split("\n").map((line, idx, arr) => (
    <span key={idx}>
      {line}
      {idx < arr.length - 1 && <br />}
    </span>
  ));

export const AllGamesSlytherin = ({ step, onMissionComplete, missionIdx }) => {
  if (step === "fire")
    return (
      <FireMission onComplete={onMissionComplete} missionIdx={missionIdx} />
    );
  if (step === "snake")
    return (
      <SnakeLetterMission
        onComplete={onMissionComplete}
        missionIdx={missionIdx}
      />
    );
  if (step === "frog")
    return (
      <FrogPotionMission
        onComplete={onMissionComplete}
        missionIdx={missionIdx}
      />
    );
  return null;
};

// ---------- Fire Mission ----------
const FireMission = ({ onComplete, missionIdx }) => {
  const [phase, setPhase] = useState("intro");
  const [displayedText, setDisplayedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const [buttons, setButtons] = useState([
    { label: "Aguamenti", correct: true, id: 1 },
    { label: "Incendio", correct: false, id: 2 },
    { label: "Lumos", correct: false, id: 3 },
  ]);
  const [shuffling, setShuffling] = useState(true);
  const [fireFade, setFireFade] = useState(0);
  const [fireGrow, setFireGrow] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFail, setShowFail] = useState(false);
  const [result, setResult] = useState(null);

  const charIndexRef = useRef(0);
  const typingIntervalRef = useRef(null);

  useEffect(() => {
    if (phase === "intro") setTimeout(() => setPhase("typing"), 800);
  }, [phase]);

  useEffect(() => {
    if (phase !== "typing") return;
    setDisplayedText("");
    setTypingDone(false);
    charIndexRef.current = 0;
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

    typingIntervalRef.current = setInterval(() => {
      const fullText = FIRE_TYPING_TEXT;
      if (!fullText) return;
      const nextIndex = charIndexRef.current + 1;
      setDisplayedText(fullText.slice(0, nextIndex));
      charIndexRef.current = nextIndex;
      if (nextIndex === fullText.length) {
        clearInterval(typingIntervalRef.current);
        setTimeout(() => setTypingDone(true), 0);
      }
    }, TYPING_SPEED);

    return () => clearInterval(typingIntervalRef.current);
  }, [phase]);

  useEffect(() => {
    if (phase === "typing" && typingDone)
      setTimeout(() => setPhase("play"), 600);
  }, [typingDone, phase]);

  useEffect(() => {
    if (!shuffling || phase !== "play") return;
    const interval = setInterval(() => {
      setButtons((prev) => {
        const arr = [...prev];
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [shuffling, phase]);

  const handleSpellClick = (idx) => {
    setShuffling(false);
    if (buttons[idx].correct) {
      setResult("success");
      let t = 0;
      let fadeAnim;
      const fadeStep = () => {
        t += 0.045;
        setFireFade(Math.min(1, t));
        if (t < 1.12) fadeAnim = requestAnimationFrame(fadeStep);
        else setTimeout(() => setShowSuccess(true), 400);
      };
      fadeAnim = requestAnimationFrame(fadeStep);
    } else {
      setResult("fail");
      let t = 0;
      let growAnim;
      const growStep = () => {
        t += 0.025;
        setFireGrow(1 + t * 1.2);
        if (t < 1) growAnim = requestAnimationFrame(growStep);
        else setTimeout(() => setShowFail(true), 600);
      };
      growAnim = requestAnimationFrame(growStep);
    }
  };

  const handleContinue = () => {
    if (typeof onComplete === "function") {
      onComplete(result === "success", missionIdx);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
     bg-black transition-all duration-700 overflow-hidden w-full h-full"
    >
      <img
        src={FIRE_IMG}
        alt="Fire"
        className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 object-contain pointer-events-none
        transition-[width,height,opacity,filter] duration-[1200ms] [transition-timing-function:cubic-bezier(.14,1.1,.8,1.1)]"
        style={{
          width: result === "fail" && showFail ? 700 * fireGrow : 600,
          height: result === "fail" && showFail ? 700 * fireGrow : 600,
          filter:
            result === "success"
              ? `brightness(${1 - 0.82 * fireFade}) blur(${
                  20 * fireFade
                }px) grayscale(${0.7 * fireFade}) saturate(${
                  1 - 0.8 * fireFade
                })`
              : "hue-rotate(-30deg)",
          opacity:
            result === "success"
              ? 1 - fireFade
              : result === "fail" && showFail
              ? 0.35
              : 1,
        }}
        draggable={false}
      />
      {result === "success" && (
        <div
          className="
         pointer-events-none
         z-[100]
         fixed
         inset-0
         transition-opacity
         duration-[1600ms]
         [transition-timing-function:cubic-bezier(.2,.7,.7,1.2)]
         [background:radial-gradient(ellipse_at_50%_60%,rgba(0,0,0,0.00)_0%,rgba(0,0,0,0.98)_79%,#000_100%)]
       "
          style={{
            opacity: Math.max(0, Math.min(1, fireFade)),
            filter: `blur(${Math.floor(25 * fireFade)}px)`,
          }}
        />
      )}
      {result === "fail" && showFail && (
        <div className="fixed inset-0 z-[110] bg-black transition-opacity duration-700 opacity-75" />
      )}

      {(phase === "typing" || phase === "intro") && (
        <div className="absolute left-1/2 top-[70%] z-40 -translate-x-1/2 flex flex-col items-center w-[94vw] max-w-[580px]">
          <div
            className="text-white rounded-2xl px-10 py-10 text-lg shadow-2xl whitespace-pre-line 
          text-center tracking-wider leading-relaxed min-h-[120px] transition-opacity duration-800"
          >
            {renderWithLineBreaks(displayedText)}
            {!typingDone && phase === "typing" && (
              <span className="blink-cursor">|</span>
            )}
          </div>
        </div>
      )}

      {phase === "play" && !showSuccess && !showFail && (
        <div className="fixed bottom-16 left-1/2 z-[120] -translate-x-1/2 flex flex-row gap-10">
          {buttons.map((btn, idx) => (
            <button
              key={btn.id}
              onClick={() => handleSpellClick(idx)}
              className={`px-10 py-5 rounded-xl text-2xl font-bold transition 
                shadow-xl 
                ${
                  btn.correct
                    ? "w-72 py-4 pl-4 pr-4 rounded-lg text-xl font-bold transition bg-[var(--color-b)] hover:bg-[var(--color-b-shadow)] hover:text-[var(--color-b)] drop-shadow-[0_0_10px_#00FFFF] shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    : "w-72 py-4 pl-4 pr-4 rounded-lg text-xl font-bold transition bg-[var(--color-b)] hover:bg-[var(--color-b-shadow)] hover:text-[var(--color-b)] drop-shadow-[0_0_10px_#00FFFF] shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                }
                ${shuffling ? "transition-transform duration-600" : ""}
              `}
              disabled={!!result}
              style={{
                transform: shuffling
                  ? `translateY(${Math.sin(idx + Date.now() / 900) * 5}px)`
                  : "none",
                opacity: result ? 0.7 : 1,
                cursor: result ? "not-allowed" : "pointer",
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-[120] bg-black">
          <span className="text-4xl mb-8 font-black text-white tracking-wider animate-fade-in">
            Well done! The fire is out.
          </span>
          <button
            onClick={handleContinue}
            className="w-72 py-4 pl-4 pr-4 rounded-lg text-xl font-bold transition bg-[var(--color-b)] 
                        hover:bg-[var(--color-b-shadow)] hover:text-[var(--color-b)] drop-shadow-[0_0_10px_#00FFFF] 
                        shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      )}

      {showFail && (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-[120] bg-black/0">
          <span className="text-4xl mb-8 font-black text-white tracking-wider animate-fade-in">
            Game Over
          </span>
          <button
            onClick={handleContinue}
            className="w-72 py-4 pl-4 pr-4 rounded-lg text-xl font-bold transition bg-[var(--color-b)] 
                        hover:bg-[var(--color-b-shadow)] hover:text-[var(--color-b)] drop-shadow-[0_0_10px_#00FFFF] 
                        shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
            autoFocus
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

// ---------- Snake Mission ----------
const SnakeLetterMission = ({ onComplete, missionIdx }) => {
  const PARSEL_WORD = ["s", "s", "a", "a", "a", "h"];
  const BUTTONS = [
    { letter: "s", id: 1 },
    { letter: "s", id: 2 },
    { letter: "a", id: 3 },
    { letter: "a", id: 4 },
    { letter: "a", id: 5 },
    { letter: "h", id: 6 },
  ];

  const DURATION = 10;
  const getRandomPositions = (count) => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: Math.random() * 60 + 15,
        y: Math.random() * 50 + 18,
        angle: Math.random() * 360,
        duration: Math.random() * 3.6 + 7.4,
        radius: Math.random() * 35 + 46,
        direction: Math.random() > 0.5 ? 1 : -1,
        fadeDelay: Math.random() * 2.8,
      });
    }
    return arr;
  };
  const [phase, setPhase] = useState("typing");
  const [displayedText, setDisplayedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const [timer, setTimer] = useState(DURATION);
  const [result, setResult] = useState(null);
  const [positions, setPositions] = useState(
    getRandomPositions(BUTTONS.length)
  );
  const [clickedIds, setClickedIds] = useState([]);
  const [chosen, setChosen] = useState([]);
  const [snakeFade, setSnakeFade] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFail, setShowFail] = useState(false);

  const charIndexRef = useRef(0);
  const typingIntervalRef = useRef(null);

  useEffect(() => {
    if (phase !== "typing") return;
    setDisplayedText("");
    setTypingDone(false);
    charIndexRef.current = 0;
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

    typingIntervalRef.current = setInterval(() => {
      const fullText = SNAKE_TYPING_TEXT;
      if (!fullText) return;
      const nextIndex = charIndexRef.current + 1;
      setDisplayedText(fullText.slice(0, nextIndex));
      charIndexRef.current = nextIndex;
      if (nextIndex === fullText.length) {
        clearInterval(typingIntervalRef.current);
        setTimeout(() => setTypingDone(true), 0);
      }
    }, TYPING_SPEED);

    return () => clearInterval(typingIntervalRef.current);
  }, [phase]);

  useEffect(() => {
    if (phase === "typing" && typingDone) {
      setTimeout(() => setPhase("play"), 1100);
    }
  }, [typingDone, phase]);

  useEffect(() => {
    if (phase !== "play") return;
    setTimer(DURATION);
    let t = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setTimeout(() => setResult("fail"), 1100);
          clearInterval(t);
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "play") return;
    let animFrame = null;
    const start = performance.now();
    const animate = () => {
      const now = performance.now();
      setPositions((prev) =>
        prev.map((p, idx) => {
          const t =
            ((now - start) / 1000 / p.duration) * 2 * Math.PI * p.direction;
          const fadeT = ((now / 1000 + p.fadeDelay) % 2.9) / 2.9;
          const alpha =
            0.27 + 0.73 * (0.5 + 0.5 * Math.sin(2 * Math.PI * fadeT));
          return {
            ...p,
            xOffset: Math.cos(t + idx) * p.radius,
            yOffset: Math.sin(t + idx) * p.radius * 0.6,
            alpha,
          };
        })
      );
      animFrame = requestAnimationFrame(animate);
    };
    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [phase]);

  useEffect(() => {
    if (chosen.length === PARSEL_WORD.length) {
      const word = chosen.map((c) => c.letter).join("");
      if (word.toLowerCase() === PARSEL_WORD.join("")) {
        setTimeout(() => setResult("success"), 350);
      } else {
        setTimeout(() => setResult("fail"), 500);
      }
    }
  }, [chosen]);

  useEffect(() => {
    if (result === "success") {
      let t = 0;
      let fadeAnim;
      const fadeStep = () => {
        t += 0.045;
        setSnakeFade(Math.min(1, t));
        if (t < 1.15) fadeAnim = requestAnimationFrame(fadeStep);
        else setTimeout(() => setShowSuccess(true), 300);
      };
      fadeAnim = requestAnimationFrame(fadeStep);
      return () => cancelAnimationFrame(fadeAnim);
    }
    if (result === "fail") {
      setTimeout(() => setShowFail(true), 900);
    }
  }, [result]);

  const handleLetterClick = (idx) => {
    if (clickedIds.includes(BUTTONS[idx].id) || phase !== "play") return;
    setClickedIds([...clickedIds, BUTTONS[idx].id]);
    setChosen([...chosen, BUTTONS[idx]]);
  };

  const handleContinue = () => {
    if (typeof onComplete === "function") {
      onComplete(result === "success", missionIdx);
    }
    setPhase("typing");
    setDisplayedText("");
    setTypingDone(false);
    setTimer(DURATION);
    setResult(null);
    setClickedIds([]);
    setChosen([]);
    setPositions(getRandomPositions(BUTTONS.length));
    setSnakeFade(0);
    setShowSuccess(false);
    setShowFail(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black
                transition-all duration-1000 w-full h-full overflow-hidden"
    >
      {phase === "typing" && (
        <div
          className="absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 
                    flex flex-col items-center w-[94vw] max-w-[560px]"
        >
          <div
            className="bg-black/80 text-white rounded-2xl px-9 py-9 text-lg shadow-2xl 
                      whitespace-pre-line text-center tracking-wider leading-relaxed min-h-[120px]  
                      transition-opacity duration-800"
          >
            {renderWithLineBreaks(displayedText)}
            {!typingDone && <span className="blink-cursor">|</span>}
          </div>
        </div>
      )}
      {phase === "play" && (
        <>
          <video
            src={SNAKE_VIDEO}
            autoPlay
            loop
            muted
            playsInline
            className="fixed left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 w-[970px] h-[970px] 
                      pointer-events-none transition-opacity transition-filter duration-[1100ms]
                      [transition-timing-function:cubic-bezier(.14,1.1,.8,1.1)] object-contain"
            style={{
              opacity:
                result === "success"
                  ? 1 - snakeFade
                  : result === "fail" && showFail
                  ? 0.45
                  : 1,
              filter:
                result === "success"
                  ? `blur(${15 * snakeFade}px) grayscale(${
                      0.85 * snakeFade
                    }) brightness(${1 - 0.7 * snakeFade})`
                  : result === "fail" && showFail
                  ? `grayscale(0.5)`
                  : "",
            }}
          />
          {result !== "fail" &&
            BUTTONS.map((btn, idx) => {
              const p = positions[idx];
              const baseX = p ? p.x : 40;
              const baseY = p ? p.y : 45;
              const x = `calc(${baseX}% + ${
                p?.xOffset ? p.xOffset.toFixed(0) : 0
              }px)`;
              const y = `calc(${baseY}% + ${
                p?.yOffset ? p.yOffset.toFixed(0) : 0
              }px)`;

              return (
                <button
                  key={btn.id}
                  onClick={() => handleLetterClick(idx)}
                  disabled={clickedIds.includes(btn.id)}
                  className={`
                  fixed
                  z-[70]
                  font-serif
                  font-extrabold
                  text-[2.8rem]
                  bg-transparent
                  border-none
                  shadow-none
                  outline-none
                  transition-opacity
                  duration-[520ms]
                  [transition-timing-function:cubic-bezier(.5,.8,.7,1.6)]
                  select-none
                  ${
                    clickedIds.includes(btn.id)
                      ? "pointer-events-none"
                      : "pointer-events-auto"
                  }
                  focus:outline-none
                `}
                  style={{
                    left: x,
                    top: y,
                    color: `rgba(255,255,255,${p?.alpha || 1})`,
                    opacity: clickedIds.includes(btn.id) ? 0.17 : p?.alpha || 1,
                    cursor:
                      phase !== "play" || clickedIds.includes(btn.id)
                        ? "default"
                        : "pointer",
                    filter: "drop-shadow(0 0 16px #6efc8fd9)",
                    textShadow: "0 0 8px #fff, 0 0 2px #7df7c1",
                  }}
                  tabIndex={-1}
                >
                  {btn.letter.toUpperCase()}
                </button>
              );
            })}
          {result !== "fail" && (
            <div
              className="fixed left-1/2 bottom-[9%] z-[60] px-8 py-3 rounded-2xl flex flex-row gap-3 
            shadow-xl min-w-[220px] bg-black/60 border-2 border-white "
            >
              {chosen.length === 0 ? (
                <span className="text-white text-lg opacity-0.77">
                  Tap the magical letters in Parseltongue order!
                </span>
              ) : (
                chosen.map((c, i) => (
                  <span
                    key={i}
                    className="
                    text-[2.3rem]
                    text-[#eafff9]
                    select-none
                  "
                    style={{
                      textShadow: "0 0 8px #fff, 0 0 2px #7df7c1",
                    }}
                  >
                    {c.letter.toUpperCase()}
                  </span>
                ))
              )}
            </div>
          )}

          <div
            className="w-auto fixed top-6 right-8 z-[110] bg-black/80 
            text-white px-6 py-2 rounded-lg text-2xl
           font-bold select-none pointer-events-none border-2 shadow-lg"
          >
            {timer}
          </div>
          {result === "success" && (
            <div
              className="
              pointer-events-none 
              z-[100] 
              fixed 
              inset-0 
              transition-opacity 
              duration-[1600ms] 
              [transition-timing-function:cubic-bezier(.2,.7,.7,1.2)]
            "
              style={{
                opacity: Math.max(0, Math.min(1, snakeFade)),
                background:
                  "radial-gradient(ellipse at 50% 60%, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.96) 75%, #000 100%)",
                filter: `blur(${Math.floor(25 * snakeFade)}px)`,
              }}
            ></div>
          )}
          {result === "fail" && showFail && (
            <div className="fixed inset-0 z-[110] bg-black transition-opacity duration-700 opacity-50"></div>
          )}
        </>
      )}
      {showSuccess && (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-[120] bg-black">
          <span className="text-4xl font-black text-white tracking-wider animate-fade-in">
            Well done! You calmed the snake.
          </span>
          <button
            onClick={handleContinue}
            className="w-72 py-4 pl-4 pr-4 rounded-lg text-xl font-bold transition bg-[var(--color-b)] 
                        hover:bg-[var(--color-b-shadow)] hover:text-[var(--color-b)] drop-shadow-[0_0_10px_#00FFFF] 
                        shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
            autoFocus
          >
            Continue
          </button>
        </div>
      )}

      {showFail && (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-[120] bg-black/0">
          <span className="text-4xl font-black text-white mb-8 animate-fade-in">
            Game Over
          </span>
          <button
            onClick={handleContinue}
            className="w-72 py-4 pl-4 pr-4 rounded-lg text-xl font-bold transition bg-[var(--color-b)] 
                        hover:bg-[var(--color-b-shadow)] hover:text-[var(--color-b)] drop-shadow-[0_0_10px_#00FFFF] 
                        shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
            autoFocus
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

// ---------- FROG POTION MISSION ----------
const FrogPotionMission = ({ onComplete, missionIdx }) => {
  const [phase, setPhase] = useState("glitch");
  const [displayedText, setDisplayedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);

  const [glitchMix, setGlitchMix] = useState(0.5);
  const [glitching, setGlitching] = useState(true);

  const [morphMix, setMorphMix] = useState(0);
  const [fadeBack, setFadeBack] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const POTIONS = [
    { label: "Polyjuice Potion", correct: false },
    { label: "Felix Felicis", correct: false },
    { label: "Restorative Potion", correct: true },
  ];

  const charIndexRef = useRef(0);
  const typingIntervalRef = useRef(null);

  useEffect(() => {
    if (phase === "glitch") setTimeout(() => setPhase("typing"), 1200);
  }, [phase]);

  useEffect(() => {
    if (phase !== "typing") return;
    setDisplayedText("");
    setTypingDone(false);
    charIndexRef.current = 0;
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

    typingIntervalRef.current = setInterval(() => {
      const fullText = FROG_TYPING_TEXT;
      if (!fullText) return;
      const nextIndex = charIndexRef.current + 1;
      setDisplayedText(fullText.slice(0, nextIndex));
      charIndexRef.current = nextIndex;
      if (nextIndex === fullText.length) {
        clearInterval(typingIntervalRef.current);
        setTimeout(() => setTypingDone(true), 0);
      }
    }, TYPING_SPEED);

    return () => clearInterval(typingIntervalRef.current);
  }, [phase]);

  useEffect(() => {
    if (phase === "typing" && typingDone)
      setTimeout(() => setPhase("play"), 700);
  }, [typingDone, phase]);

  useEffect(() => {
    if (!["glitch", "typing", "play"].includes(phase)) return;
    setGlitching(true);
    let running = true;
    let mix = 0.5;
    const loop = () => {
      if (!running) return;
      mix += (Math.random() - 0.5) * 0.42;
      if (mix < 0) mix = 0;
      else if (mix > 1) mix = 1;
      setGlitchMix(mix);
      setTimeout(loop, 37 + Math.random() * 45);
    };
    setTimeout(loop, 30);
    return () => {
      running = false;
    };
  }, [phase]);

  // Übergang Animation Mensch/frosch
  useEffect(() => {
    if (phase !== "morphing") return;
    setGlitching(false);
    setMorphMix(0);
    setFadeBack(false);
    setShowResult(false);
    let start;
    let anim1;
    const morphStep = (ts) => {
      if (!start) start = ts;
      const t = Math.min(1, (ts - start) / 900);
      setMorphMix(t);
      if (t < 1) {
        anim1 = requestAnimationFrame(morphStep);
      } else {
        setFadeBack(true);
        setTimeout(() => {
          setShowResult(true);
        }, 900);
      }
    };
    anim1 = requestAnimationFrame(morphStep);
    return () => cancelAnimationFrame(anim1);
  }, [phase]);

  const handlePotion = (idx) => {
    setSelected(idx);
    setResult(POTIONS[idx].correct ? "success" : "fail");
    setTimeout(() => {
      setPhase("morphing");
    }, 230);
  };

  const handleContinue = () => {
    if (typeof onComplete === "function") {
      onComplete(result === "success", missionIdx);
    }
    setPhase("glitch");
    setDisplayedText("");
    setTypingDone(false);
    setSelected(null);
    setResult(null);
    setGlitchMix(0.5);
    setGlitching(true);
    setMorphMix(0);
    setFadeBack(false);
    setShowResult(false);
  };

  const MorphImages = ({
    frog,
    human,
    glitchMix,
    morphMix,
    fadeBack,
    showResult,
    result,
    phase,
    glitching,
  }) => {
    let opacity = 1;
    if (fadeBack) opacity = 0.25;

    let imgSrc, imgAlt, imgFilter;
    if (phase === "morphing" || phase === "result") {
      if (result === "success") {
        imgSrc = human;
        imgAlt = "Human";
        imgFilter = `hue-rotate(12deg) brightness(1.06)`;
      } else {
        imgSrc = frog;
        imgAlt = "Frog";
        imgFilter = `hue-rotate(-18deg) brightness(1.01)`;
      }
      return (
        <div className="absolute left-0 top-0 w-[320px] h-[320px] pointer-events-none">
          {!showResult && (
            <>
              <img
                src={frog}
                alt="Frog Person"
                className="absolute w-[320px] h-[320px] object-contain z-[2] pointer-events-none transition-opacity duration-800"
                style={{
                  left: glitching ? Math.round((Math.random() - 0.5) * 8) : 0,
                  top: glitching ? Math.round((Math.random() - 0.5) * 8) : 0,
                  opacity: result === "success" ? 1 - morphMix : 1 - morphMix,
                  filter: `hue-rotate(-15deg) brightness(1.03)`,
                }}
                draggable={false}
              />
              <img
                src={human}
                alt="Human"
                className="absolute w-[320px] h-[320px] object-contain z-[3] pointer-events-none transition-opacity duration-800"
                style={{
                  left: glitching ? Math.round((Math.random() - 0.5) * 8) : 0,
                  top: glitching ? Math.round((Math.random() - 0.5) * 8) : 0,
                  opacity: result === "success" ? morphMix : 0,
                  filter: `hue-rotate(10deg) brightness(1.07)`,
                }}
                draggable={false}
              />
            </>
          )}
          <img
            src={imgSrc}
            alt={imgAlt}
            className="absolute w-[320px] h-[320px] object-contain z-[4] pointer-events-none transition-opacity duration-[1200ms] [transition-timing-function:cubic-bezier(.5,1.1,.7,1.04)]"
            style={{
              left: 0,
              top: 0,
              opacity: opacity,
              filter: imgFilter,
            }}
            draggable={false}
          />
        </div>
      );
    }

    const frogOffset = glitching ? Math.round((Math.random() - 0.5) * 8) : 0;
    const humanOffset = glitching ? Math.round((Math.random() - 0.5) * 8) : 0;
    const frogHue = glitching ? -15 + Math.random() * 40 : 0;
    const humanHue = glitching ? 15 - Math.random() * 40 : 0;
    return (
      <div className="absolute left-0 top-0 w-[320px] h-[320px] pointer-events-none">
        <img
          src={frog}
          alt="Frog Person"
          className="absolute w-[320px] h-[320px] object-contain z-[3]"
          style={{
            left: frogOffset,
            top: frogOffset,
            opacity: 1 - glitchMix,
            filter: `hue-rotate(${frogHue}deg) brightness(1.03)`,
          }}
          draggable={false}
        />
        <img
          src={human}
          alt="Human"
          className="absolute w-[320px] h-[320px] object-contain z-[4]"
          style={{
            left: humanOffset,
            top: humanOffset,
            opacity: glitchMix,
            filter: `hue-rotate(${humanHue}deg) brightness(1.06)`,
          }}
          draggable={false}
        />
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-all 
    duration-1000 overflow-hidden w-full h-full"
    >
      <div className="relative w-[320px] h-[320px] mt-5 mb-8 flex items-center justify-center self-center">
        <MorphImages
          frog={FROGBOY_IMG}
          human={HUMAN_IMG}
          glitchMix={glitchMix}
          morphMix={morphMix}
          fadeBack={fadeBack}
          showResult={showResult}
          result={result}
          phase={phase}
          glitching={glitching}
        />
      </div>
      {(phase === "typing" || phase === "glitch") && (
        <div className="flex flex-col justify-center items-center w-full">
          <div
            className="bg-black/80 text-white rounded-2xl px-8 py-8 text-lg shadow-2xl
             whitespace-pre-line text-center tracking-wider 
          leading-relaxed min-h-[120px]  transition-opacity duration-800"
          >
            {renderWithLineBreaks(displayedText)}
            {!typingDone && phase === "typing" && (
              <span className="blink-cursor">|</span>
            )}
          </div>
        </div>
      )}
      {phase === "play" && (
        <div className="flex flex-row gap-8 mb-8">
          {POTIONS.map((potion, idx) => (
            <button
              key={potion.label}
              onClick={() => handlePotion(idx)}
              className={`w-72 py-4 pl-4 pr-4 rounded-lg text-xl font-bold transition bg-[var(--color-b)] 
                hover:bg-[var(--color-b-shadow)] hover:text-[var(--color-b)] drop-shadow-[0_0_10px_#00FFFF] shadow-lg
                 text-white disabled:opacity-50 disabled:cursor-not-allowed
               
              `}
              disabled={selected !== null}
            >
              {potion.label}
            </button>
          ))}
        </div>
      )}
      {showResult && (
        <div className="absolute inset-0 flex flex-col items-center animate-fade-in justify-center z-[120] bg-black/0 pointer-events-none">
          <span
            className={`text-4xl mb-8 font-black text-white tracking-wider animate-fade-in pointer-events-auto`}
          >
            {result === "success"
              ? "Well done! You saved your classmate."
              : "Game Over"}
          </span>
          <button
            onClick={handleContinue}
            className="w-72 py-4 pl-4 pr-4 rounded-lg text-xl font-bold transition bg-[var(--color-b)] hover:bg-[var(--color-b-shadow)] 
            hover:text-[var(--color-b)] drop-shadow-[0_0_10px_#00FFFF] shadow-lg text-white disabled:opacity-50 
            disabled:cursor-not-allowed pointer-events-auto"
            autoFocus
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};
