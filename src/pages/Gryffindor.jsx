import React, { useState, useEffect, useRef } from "react";

const ARROW_IMG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751037480/arrow_ygrkzv.webp";
const DOG_IMG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751109258/Fluffy-nobg_ib3fak.png";
const DOOR_IMG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751108526/T%C3%BCrZU_zbktie.png";
const DOOR_OPEN_IMG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751108526/T%C3%BCrAuf_yzsbez.png";
const STONE_IMG =
  "https://cdn.pixabay.com/photo/2016/03/23/17/33/stone-1276287_1280.png";

const ARROWS = [
  { dir: "up", tw: "rotate-0" },
  { dir: "right", tw: "rotate-90" },
  { dir: "down", tw: "rotate-180" },
  { dir: "left", tw: "-rotate-90" },
];

const DOG_MISSION_TEXT =
  "The three-headed dog appears!\nCast the spell 'musica' and catch the moving button before the time runs out to make him fall asleep!";
const DOOR_MISSION_TEXT =
  "A locked door blocks your way!\nWhich spell will open it?";
const STONE_MISSION_TEXT =
  "A large stone blocks your way!\nWhich spell will move it?";

function getRandomSequence() {
  const shuffled = [...ARROWS].sort(() => Math.random() - 0.5);
  return shuffled;
}

export default function Gryffindor() {
  // Game state
  const [step, setStep] = useState(0);
  const [round, setRound] = useState(1);
  const [sequence, setSequence] = useState(getRandomSequence());
  const [showArrows, setShowArrows] = useState(true);
  const [input, setInput] = useState([]);
  const [results, setResults] = useState([]);
  const [timer, setTimer] = useState(5);

  // Mission states
  const [missionPhase, setMissionPhase] = useState(""); // "" | "fade" | "typing" | "show" | "success" | "fail"
  const [missionType, setMissionType] = useState(""); // "door" | "stone"
  const [missionTyped, setMissionTyped] = useState("");
  const [missionTypingDone, setMissionTypingDone] = useState(false);
  const [missionFade, setMissionFade] = useState(false);

  const [showDog, setShowDog] = useState(false);
  const [dogPhase, setDogPhase] = useState("start"); // start, running, sleeping, gameover
  const [dogTimer, setDogTimer] = useState(10);
  const [dogResult, setDogResult] = useState(null);
  const [dogButtonPos, setDogButtonPos] = useState({ x: 50, y: 50 });
  const dogMoveInterval = useRef(null);
  const dogCountdown = useRef(null);
  const [dogFade, setDogFade] = useState(false);
  const [dogButtonShake, setDogButtonShake] = useState({ x: 0, y: 0 });
  const [dogTyped, setDogTyped] = useState("");
  const [dogTypingDone, setDogTypingDone] = useState(false);
  const [dogTextFadeOut, setDogTextFadeOut] = useState(false);

  // Stone Mission State (for the old popup, now unused)
  const [stoneResult, setStoneResult] = useState(null);

  // Door Mission State
  const [doorResult, setDoorResult] = useState(null);
  // NEW: Door open transition
  const [doorOpenTransition, setDoorOpenTransition] = useState(false);

  // After round 3, show stone mission
  useEffect(() => {
    if (round > 3 && step === 2) {
      setTimeout(() => setStep(100), 300);
    }
  }, [round, step]);

  // Arrow timer
  useEffect(() => {
    if (step === 0 && showArrows) {
      const countdown = setInterval(() => setTimer((t) => t - 1), 1000);
      const timeout = setTimeout(() => {
        setShowArrows(false);
        setStep(1);
        setTimer(5);
        clearInterval(countdown);
      }, 5000);
      return () => {
        clearInterval(countdown);
        clearTimeout(timeout);
      };
    }
  }, [step, showArrows]);

  // Show Done Button after input
  const [showDoneButton, setShowDoneButton] = useState(false);
  useEffect(() => {
    setShowDoneButton(false);
    if (step === 1 && input.length === 4) {
      setShowDoneButton(true);
    }
  }, [input, step]);

  function handleDoneButton() {
    setShowDoneButton(false);
    const correct = input.join(",") === sequence.map((a) => a.dir).join(",");
    setResults((prev) => [...prev, correct]);
    if (round === 1) {
      setMissionType("door");
      setMissionPhase("fade");
      setMissionFade(false);
      setStep("mission");
      setDoorOpenTransition(false);
    } else if (round === 2) {
      setMissionType("dog");
      setStep(99);
    } else if (round === 3) {
      setMissionType("stone");
      setMissionPhase("fade");
      setMissionFade(false);
      setStep("mission");
    }
  }

  // Mission fade effect
  useEffect(() => {
    if (step === "mission" && missionPhase === "fade") {
      setMissionTyped("");
      setMissionTypingDone(false);
      setMissionFade(false);
      const t = setTimeout(() => setMissionPhase("typing"), 700);
      return () => clearTimeout(t);
    }
  }, [missionPhase, step]);

  // Mission typing effect
  useEffect(() => {
    if (step === "mission" && missionPhase === "typing") {
      let i = 0;
      setMissionTyped("");
      setMissionTypingDone(false);
      let text =
        missionType === "door" ? DOOR_MISSION_TEXT : STONE_MISSION_TEXT;
      const chars = text.split("");
      let typingTimeout;
      function typeNext() {
        setMissionTyped((prev) => prev + chars[i]);
        i++;
        if (i < chars.length) {
          typingTimeout = setTimeout(
            typeNext,
            chars[i - 1] === "\n" ? 480 : 80
          );
        } else {
          setMissionTypingDone(true);
        }
      }
      typingTimeout = setTimeout(typeNext, 650);
      return () => clearTimeout(typingTimeout);
    }
  }, [missionPhase, step, missionType]);

  // After typing done, wait, then show mission buttons
  useEffect(() => {
    if (missionTypingDone && step === "mission" && missionPhase === "typing") {
      const t = setTimeout(() => setMissionPhase("show"), 900);
      return () => clearTimeout(t);
    }
  }, [missionTypingDone, step, missionPhase]);

  // DOG MISSION ===
  useEffect(() => {
    if (step === 99) {
      setShowDog(true);
      setDogPhase("start");
      setDogFade(false);
      setDogResult(null);
      setDogButtonPos({
        x: window.innerWidth / 2 - 80,
        y: window.innerHeight / 2 + 160,
      });
      setDogTyped("");
      setDogTypingDone(false);
      setDogTextFadeOut(false);
    } else {
      clearInterval(dogMoveInterval.current);
      clearInterval(dogCountdown.current);
      setDogTyped("");
      setDogTypingDone(false);
      setDogTextFadeOut(false);
    }
    return () => {
      clearInterval(dogMoveInterval.current);
      clearInterval(dogCountdown.current);
      setDogTyped("");
      setDogTypingDone(false);
      setDogTextFadeOut(false);
    };
    // eslint-disable-next-line
  }, [step]);

  // Typing effect for dog mission
  useEffect(() => {
    if (showDog && dogPhase === "start") {
      let i = 0;
      setDogTyped("");
      setDogTypingDone(false);
      setDogTextFadeOut(false);
      const chars = DOG_MISSION_TEXT.split("");
      let typingTimeout;
      function typeNext() {
        setDogTyped((prev) => prev + chars[i]);
        i++;
        if (i < chars.length) {
          typingTimeout = setTimeout(
            typeNext,
            chars[i - 1] === "\n" ? 480 : 80
          );
        } else {
          setDogTypingDone(true);
        }
      }
      typingTimeout = setTimeout(typeNext, 950);
      return () => clearTimeout(typingTimeout);
    }
  }, [showDog, dogPhase]);

  useEffect(() => {
    if (dogTypingDone && showDog && dogPhase === "start") {
      const fadeTimeout = setTimeout(() => setDogTextFadeOut(true), 1300);
      const runTimeout = setTimeout(() => {
        setDogPhase("running");
        setDogTimer(10);
        moveDogButtonScreen();
        clearInterval(dogMoveInterval.current);
        clearInterval(dogCountdown.current);
        dogMoveInterval.current = setInterval(() => moveDogButtonScreen(), 270); // fast!
        dogCountdown.current = setInterval(
          () => setDogTimer((prev) => prev - 1),
          1000
        );
      }, 2300);
      return () => {
        clearTimeout(fadeTimeout);
        clearTimeout(runTimeout);
      };
    }
  }, [dogTypingDone, showDog, dogPhase]);

  useEffect(() => {
    let shakeInt = null;
    if (showDog && (dogPhase === "running" || dogPhase === "sleeping")) {
      const el = document.getElementById("dog-mission-bg");
      shakeInt = setInterval(() => {
        const x = Math.random() * 30 - 15;
        const y = Math.random() * 30 - 15;
        el && (el.style.transform = `translate(${x}px, ${y}px)`);
      }, 33);
    } else {
      const el = document.getElementById("dog-mission-bg");
      if (el) el.style.transform = "";
    }
    return () => {
      const el = document.getElementById("dog-mission-bg");
      if (el) el.style.transform = "";
      if (shakeInt) clearInterval(shakeInt);
    };
  }, [showDog, dogPhase]);

  useEffect(() => {
    let btnShakeInt = null;
    if (showDog && dogPhase === "running") {
      btnShakeInt = setInterval(() => {
        setDogButtonShake({
          x: Math.random() * 28 - 14,
          y: Math.random() * 28 - 14,
        });
      }, 24);
    } else {
      setDogButtonShake({ x: 0, y: 0 });
    }
    return () => {
      if (btnShakeInt) clearInterval(btnShakeInt);
      setDogButtonShake({ x: 0, y: 0 });
    };
  }, [showDog, dogPhase]);

  useEffect(() => {
    if (
      showDog &&
      dogPhase === "running" &&
      dogTimer <= 0 &&
      dogResult === null
    ) {
      setDogPhase("gameover");
      setTimeout(() => setDogFade(true), 1200);
    }
  }, [dogTimer, showDog, dogPhase, dogResult]);

  function moveDogButtonScreen() {
    const btnW = 120;
    const btnH = 60;
    const pad = 32;
    const maxX = window.innerWidth - btnW - pad;
    const maxY = window.innerHeight - btnH - pad;
    const x = Math.floor(Math.random() * (maxX - pad) + pad);
    const y = Math.floor(Math.random() * (maxY - pad) + pad);
    setDogButtonPos({ x, y });
  }

  function handleArrowClick(dir) {
    if (input.length < 4) setInput([...input, dir]);
  }

  // Door Mission option click
  function handleDoorMission(choice) {
    if (missionPhase !== "show") return;
    const correct = choice === "Alohomora";
    setMissionPhase(correct ? "success" : "fail");
    setDoorResult(correct);
    if (correct) {
      // Start door open transition
      setDoorOpenTransition(true);
      setTimeout(() => {
        setMissionFade(true);
        setTimeout(() => {
          setMissionPhase("");
          setMissionType("");
          setMissionTyped("");
          setMissionTypingDone(false);
          setMissionFade(false);
          setShowArrows(true);
          setInput([]);
          setSequence(getRandomSequence());
          setTimer(5);
          setStep(0);
          setRound(2);
          setDoorOpenTransition(false);
        }, 2000);
      }, 2200); // Wait a bit longer for the door transition
    }
  }
  function handleDoorGameOverContinue() {
    setMissionPhase("");
    setMissionType("");
    setMissionTyped("");
    setMissionTypingDone(false);
    setMissionFade(false);
    setShowArrows(true);
    setInput([]);
    setSequence(getRandomSequence());
    setTimer(5);
    setStep(0);
    setRound(2);
    setDoorOpenTransition(false);
  }

  // Stone Mission option click
  function handleStoneMission(choice) {
    if (missionPhase !== "show") return;
    const correct = choice === "Wingardium Leviosa";
    setMissionPhase(correct ? "success" : "fail");
    setStoneResult(correct);
    if (correct) {
      setTimeout(() => {
        setMissionFade(true);
        setTimeout(() => {
          setMissionPhase("");
          setMissionType("");
          setMissionTyped("");
          setMissionTypingDone(false);
          setMissionFade(false);
          setShowArrows(true);
          setInput([]);
          setSequence(getRandomSequence());
          setTimer(5);
          setStep(3); // show score!
          setRound(4);
        }, 2000);
      }, 1400);
    }
  }
  function handleStoneGameOverContinue() {
    setMissionPhase("");
    setMissionType("");
    setMissionTyped("");
    setMissionTypingDone(false);
    setMissionFade(false);
    setShowArrows(true);
    setInput([]);
    setSequence(getRandomSequence());
    setTimer(5);
    setStep(3); // show score!
    setRound(4);
  }

  function handleDogSuccess() {
    clearInterval(dogMoveInterval.current);
    clearInterval(dogCountdown.current);
    setDogPhase("sleeping");
    setTimeout(() => setDogFade(true), 1100);
    setTimeout(() => {
      setDogFade(false);
      setShowDog(false);
      setDogResult(true);
      setStep(0);
      setShowArrows(true);
      setInput([]);
      setSequence(getRandomSequence());
      setTimer(5);
      setRound(3);
    }, 3800);
  }

  function handleDogGameOverOk() {
    setShowDog(false);
    setDogResult(false);
    setDogFade(false);
    setStep(0);
    setShowArrows(true);
    setInput([]);
    setSequence(getRandomSequence());
    setTimer(5);
    setRound(3);
  }

  function handleMap() {
    window.location.href = "/map";
  }

  // Points calculation
  function getArrowPoints(correct) {
    return correct ? 10 : 0;
  }
  function getMissionPoints(correct) {
    return correct ? 5 : -5;
  }
  const arrowPointsArr = results.map(getArrowPoints);
  const doorPoints = doorResult !== null ? getMissionPoints(doorResult) : 0;
  const dogPoints = dogResult !== null ? getMissionPoints(dogResult) : 0;
  const stonePoints = stoneResult !== null ? getMissionPoints(stoneResult) : 0;
  const total = [...arrowPointsArr, doorPoints, dogPoints, stonePoints].reduce(
    (a, b) => a + b,
    0
  );

  // --- UI ---
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('/gryffindor-bg.jpg')` }}
    >
      <div className="bg-white/80 rounded-xl p-8 shadow-lg flex flex-col items-center w-full max-w-4xl relative">
        <h1 className="text-3xl font-bold text-red-900 mb-6">
          Gryffindor – Round {round > 3 ? 3 : round}/3
        </h1>
        {step === 0 && showArrows && (
          <>
            <p className="text-2xl mb-8 text-center">
              Remember the following order!
              <br />
              <span className="text-lg text-gray-600">
                The arrows will disappear in {timer} seconds.
              </span>
            </p>
            <div className="flex flex-row justify-center items-center gap-6 w-full">
              {sequence.map((arrow, idx) => (
                <span
                  key={idx}
                  className="flex-1 m-2 px-4 py-2 rounded bg-white/70 shadow transition flex items-center justify-center min-w-[96px] min-h-[96px] max-w-[140px] max-h-[140px]"
                >
                  <img
                    src={ARROW_IMG}
                    alt={arrow.dir}
                    className={`w-28 h-28 object-contain ${arrow.tw}`}
                  />
                </span>
              ))}
            </div>
          </>
        )}
        {/* Arrow input */}
        {step === 1 && (
          <>
            <p className="text-2xl mb-8 text-center">
              Click the arrows in the correct order!
            </p>
            <div className="flex flex-row justify-center items-center mb-4 gap-6 w-full">
              {input.map((dir, idx) => {
                const arrow = ARROWS.find((a) => a.dir === dir);
                return (
                  <span
                    key={idx}
                    className="flex-1 m-2 px-4 py-2 rounded bg-white/70 shadow transition flex items-center justify-center min-w-[96px] min-h-[96px] max-w-[140px] max-h-[140px]"
                  >
                    <img
                      src={ARROW_IMG}
                      alt={arrow?.dir}
                      className={`w-28 h-28 object-contain ${arrow?.tw}`}
                    />
                  </span>
                );
              })}
              {Array.from({ length: 4 - input.length }).map((_, idx) => (
                <span
                  key={`empty-${idx}`}
                  className="flex-1 m-2 px-4 py-2 rounded bg-white/50 shadow min-w-[96px] min-h-[96px] max-w-[140px] max-h-[140px]"
                ></span>
              ))}
            </div>
            <div className="flex justify-center flex-wrap mb-6 gap-4">
              {ARROWS.map((arrow) => (
                <button
                  key={arrow.dir}
                  className="m-2 px-4 py-2 rounded bg-white/70 shadow hover:bg-yellow-100 transition disabled:opacity-40 flex items-center justify-center"
                  onClick={() => handleArrowClick(arrow.dir)}
                  disabled={input.length >= 4}
                >
                  <img
                    src={ARROW_IMG}
                    alt={arrow.dir}
                    className={`w-24 h-24 object-contain ${arrow.tw}`}
                  />
                </button>
              ))}
            </div>
            {showDoneButton && (
              <button
                className="bg-yellow-500 text-red-900 text-xl px-8 py-3 mt-2 rounded-lg shadow hover:bg-yellow-600 transition"
                onClick={handleDoneButton}
              >
                Done
              </button>
            )}
          </>
        )}

        {/* Mission Fade+Typing+Show+Result */}
        {step === "mission" && (
          <div
            className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-1000`}
            style={{
              background: "#000",
              transition: "background 1s",
              overflow: "hidden",
            }}
          >
            {/* ----- DOOR MISSION BACKGROUND (open/closed door effect) ----- */}
            {missionType === "door" && (
              <div
                className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
                style={{
                  width: "min(97vw, 540px)",
                  height: "min(80vh, 560px)",
                }}
              >
                {/* Closed door */}
                <img
                  src={DOOR_IMG}
                  alt="Closed door"
                  className="absolute w-full h-full object-contain transition-opacity duration-[1900ms] ease-in"
                  style={{
                    opacity: doorOpenTransition ? 0 : 1,
                    zIndex: 2,
                  }}
                  draggable={false}
                />
                {/* Open door (fades in) */}
                <img
                  src={DOOR_OPEN_IMG}
                  alt="Open door"
                  className="absolute w-full h-full object-contain transition-opacity duration-[1900ms] ease-in"
                  style={{
                    opacity: doorOpenTransition ? 1 : 0,
                    zIndex: 3,
                  }}
                  draggable={false}
                />
              </div>
            )}

            {/* Typing effect center */}
            {(missionPhase === "fade" || missionPhase === "typing") && (
              <div className="absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-[min(94vw,480px)]">
                <div
                  className={`bg-black/90 text-white rounded-2xl px-8 py-8 text-lg shadow-2xl whitespace-pre-line text-center tracking-wider leading-relaxed min-h-[160px] font-sans transition-opacity duration-800`}
                >
                  {missionTyped}
                  {!missionTypingDone && (
                    <span className="blink-cursor">|</span>
                  )}
                </div>
              </div>
            )}
            {/* Show mission with image and buttons */}
            {missionPhase === "show" && (
              <>
                {/* Only show the mission image and buttons for stone */}
                {missionType === "stone" && (
                  <img
                    src={STONE_IMG}
                    alt="Stone"
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] object-contain opacity-90 pointer-events-none"
                  />
                )}
                <div className="absolute left-1/2 top-[60%] z-50 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-[min(96vw,480px)]">
                  <div className="flex gap-4 w-full items-center mt-2">
                    {missionType === "door" && (
                      <>
                        <button
                          className="w-72 py-4 rounded-lg text-xl font-bold transition bg-[var(--color-b)] hover:bg-[var(--color-b-shadow)] hover:text-[var(--color-b)] drop-shadow-[0_0_10px_#00FFFF] shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => handleDoorMission("Alohomora")}
                        >
                          Alohomora
                        </button>
                        <button
                          className="w-72 py-4 rounded-lg text-xl font-bold transition bg-[var(--color-b)] hover:bg-[var(--color-b-shadow)] hover:text-[var(--color-b)] drop-shadow-[0_0_10px_#00FFFF] shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => handleDoorMission("Lumos")}
                        >
                          Lumos
                        </button>
                        <button
                          className="w-72 py-4 rounded-lg text-xl font-bold transition bg-[var(--color-b)] hover:bg-[var(--color-b-shadow)] hover:text-[var(--color-b)] drop-shadow-[0_0_10px_#00FFFF] shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => handleDoorMission("Expelliarmus")}
                        >
                          Expelliarmus
                        </button>
                      </>
                    )}
                    {missionType === "stone" && (
                      <div className="flex gap-10">
                        <button
                          className="w-auto flex items-center gap-2 py-4 p-4 rounded-lg text-xl font-bold transition bg-[var(--color-b)] hover:bg-[var(--color-b-shadow)] hover:text-[var(--color-b)] drop-shadow-[0_0_10px_#00FFFF] shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                          onClick={() =>
                            handleStoneMission("Wingardium Leviosa")
                          }
                        >
                          Wingardium Leviosa
                        </button>
                        <button
                          className="w-auto flex items-center gap-2 py-4 p-4 rounded-lg text-xl font-bold transition bg-[var(--color-b)] hover:bg-[var(--color-b-shadow)] hover:text-[var(--color-b)] drop-shadow-[0_0_10px_#00FFFF] shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                          onClick={() => handleStoneMission("Stupor")}
                        >
                          Stupor
                        </button>
                        <button
                          className="w-auto flex items-center gap-2 py-4 p-4 rounded-lg text-xl font-bold transition bg-[var(--color-b)] hover:bg-[var(--color-b-shadow)] hover:text-[var(--color-b)] drop-shadow-[0_0_10px_#00FFFF] shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                          onClick={() => handleStoneMission("Avada Kedavra")}
                        >
                          Avada Kedavra
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
            {/* Mission result success */}
            {missionPhase === "success" && (
              <div
                className={`absolute inset-0 bg-black z-50 flex items-center justify-center transition-all duration-[2000ms] ${
                  missionFade ? "backdrop-blur-xl" : ""
                }`}
                style={{
                  opacity: missionFade ? 1 : 0,
                  pointerEvents: "all",
                  transition: "opacity 2s cubic-bezier(0.4,0,0.2,1), filter 2s",
                }}
              >
                <span className="text-4xl font-black text-white tracking-wider animate-fade-in">
                  {missionType === "door"
                    ? "Well done, the door is open!"
                    : "You moved the stone!"}
                </span>
              </div>
            )}
            {/* Mission result fail */}
            {missionPhase === "fail" && (
              <div
                className={`absolute inset-0 bg-black z-50 flex flex-col items-center justify-center transition-all duration-[2000ms]`}
                style={{
                  opacity: 0.95,
                  pointerEvents: "all",
                }}
              >
                <span className="text-4xl font-black text-white mb-8 animate-fade-in">
                  Game Over
                </span>
                <button
                  className="bg-yellow-500 text-red-900 text-xl px-8 py-3 rounded-lg shadow hover:bg-yellow-600 transition"
                  onClick={
                    missionType === "door"
                      ? handleDoorGameOverContinue
                      : handleStoneGameOverContinue
                  }
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        )}

        {/* === DOG MISSION === */}
        {showDog && (
          <div
            id="dog-mission-bg"
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              background: "#000",
              transition: "background 1s",
              overflow: "hidden",
            }}
          >
            {/* Typing effect on black background */}
            {dogPhase === "start" && (
              <div className="absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-[min(94vw,480px)]">
                <div
                  className={`bg-black/90 text-white rounded-2xl px-8 py-8 text-lg shadow-2xl whitespace-pre-line text-center tracking-wider leading-relaxed min-h-[160px] font-sans transition-opacity duration-800 ${
                    dogTextFadeOut ? "opacity-0" : "opacity-100"
                  }`}
                >
                  {dogTyped}
                  {!dogTypingDone && <span className="blink-cursor">|</span>}
                </div>
              </div>
            )}

            {(dogPhase === "running" ||
              dogPhase === "sleeping" ||
              dogPhase === "gameover") && (
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 pointer-events-none"
                style={{ width: "100vw", height: "100vh" }}
              >
                <img
                  src={DOG_IMG}
                  alt="Three-headed dog"
                  className="w-[min(97vw,1400px)] max-h-[98vh] h-auto object-contain drop-shadow-2xl select-none pointer-events-none"
                  style={{
                    filter:
                      dogPhase === "sleeping"
                        ? "grayscale(1) blur(2.7px)"
                        : "none",
                    opacity: dogPhase === "sleeping" && dogFade ? 0 : 1,
                    transition: "filter 1.9s, opacity 2.6s",
                  }}
                  draggable={false}
                />
              </div>
            )}
            {dogPhase === "running" && (
              <>
                <button
                  onClick={handleDogSuccess}
                  className="fixed z-[100] w-72 bg-[var(--color-b)] hover:bg-[var(--color-b-shadow)] hover:text-[var(--color-b)] drop-shadow-[0_0_10px_#00FFFF] shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed text-xl px-8 py-3 font-bold rounded-lg transition"
                  style={{
                    left: `${dogButtonPos.x + dogButtonShake.x}px`,
                    top: `${dogButtonPos.y + dogButtonShake.y}px`,
                  }}
                >
                  musica
                </button>
                <div className="w-auto fixed top-6 right-8 z-[110] bg-black/70 text-white px-6 py-2 rounded-lg text-2xl font-bold select-none pointer-events-none border-2 border-white shadow-lg">
                  {dogTimer}
                </div>
              </>
            )}
            {dogPhase === "sleeping" && (
              <div
                className={`absolute inset-0 bg-black z-40 flex items-center justify-center transition-all duration-[2600ms] ${
                  dogFade ? "backdrop-blur-2xl" : ""
                }`}
                style={{
                  opacity: dogFade ? 1 : 0,
                  pointerEvents: "all",
                  transition:
                    "opacity 2.7s cubic-bezier(0.4,0,0.2,1), filter 2.6s",
                }}
              >
                <span className="text-7xl font-black text-white tracking-widest animate-fade-in">
                  zzzZZZ
                </span>
              </div>
            )}
            {dogPhase === "gameover" && (
              <div
                className={`absolute inset-0 bg-black z-40 flex flex-col items-center justify-center transition-all duration-[2600ms]`}
                style={{
                  opacity: 0.93,
                  pointerEvents: "all",
                }}
              >
                <span className="text-4xl font-black text-white mb-8 animate-fade-in">
                  Game Over
                </span>
                <button
                  className="w-72 py-4 rounded-lg text-xl font-bold transition bg-[var(--color-b)] hover:bg-[var(--color-b-shadow)] hover:text-[var(--color-b)] drop-shadow-[0_0_10px_#00FFFF] shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleDogGameOverOk}
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        )}

        {/* Score/Ende */}
        {step === 3 && (
          <>
            <h2 className="text-3xl font-bold mb-6 text-purple-900 drop-shadow-lg">
              Final Score
            </h2>
            <div className="flex flex-col md:flex-row w-full gap-8 justify-center mb-8">
              {/* Arrow Table */}
              <div className="flex-1">
                <table className="w-full table-auto border-collapse text-lg bg-white rounded shadow">
                  <thead>
                    <tr>
                      <th className="border-b-2 px-4 py-2 text-left">Round</th>
                      <th className="border-b-2 px-4 py-2 text-left">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((correct, idx) => (
                      <tr key={`arrow${idx}`}>
                        <td className="border-b px-4 py-2">Round {idx + 1}</td>
                        <td
                          className={`border-b px-4 py-2 font-bold ${
                            getArrowPoints(correct) > 0
                              ? "text-green-700"
                              : "text-gray-700"
                          }`}
                        >
                          {getArrowPoints(correct)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mission Table */}
              <div className="flex-1">
                <table className="w-full table-auto border-collapse text-lg bg-white rounded shadow">
                  <thead>
                    <tr>
                      <th className="border-b-2 px-4 py-2 text-left">
                        Mission
                      </th>
                      <th className="border-b-2 px-4 py-2 text-left">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border-b px-4 py-2">Open the door</td>
                      <td
                        className={`border-b px-4 py-2 font-bold ${
                          doorPoints > 0 ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {doorResult !== null ? doorPoints : "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="border-b px-4 py-2">Calm the dog</td>
                      <td
                        className={`border-b px-4 py-2 font-bold ${
                          dogPoints > 0 ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {dogResult !== null ? dogPoints : "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="border-b px-4 py-2">Move the stone</td>
                      <td
                        className={`border-b px-4 py-2 font-bold ${
                          stonePoints > 0 ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {stoneResult !== null ? stonePoints : "-"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-4 mb-8 text-2xl font-extrabold text-center">
              Total score: <span className="text-indigo-900">{total}</span>
            </div>
            <button
              className="mt-2 bg-yellow-500 text-red-900 text-xl px-8 py-3 rounded-lg shadow hover:bg-yellow-600 transition"
              onClick={handleMap}
            >
              Back to the map
            </button>
          </>
        )}
      </div>
      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; }
          60% { opacity: 1; }
          100% { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 1.9s cubic-bezier(0.4,0,0.2,1);
        }
        .blink-cursor {
          display: inline-block;
          width: 1ch;
          color: #fff7;
          animation: blink 1.1s steps(2, start) infinite;
        }
        @keyframes blink {
          to { visibility: hidden; }
        }
        .font-sans {
          font-family: 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, 'Liberation Sans', sans-serif;
        }
      `}</style>
    </div>
  );
}
