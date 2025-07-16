import { useState, useEffect, useRef } from "react";

// Cloudinary Bilder als Variabeln
const DOG_IMG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751109258/Fluffy-nobg_ib3fak.webp";

const DOOR_IMG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751108526/T%C3%BCrZU_zbktie.webp";

const DOOR_OPEN_IMG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751108526/T%C3%BCrAuf_yzsbez.webp";

const STONE_IMG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751276277/Weg-ohne-stein_qr3oru.webp";

const BLOCKING_STONE_IMG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751276923/Weg-mit-stein_ivoy0v.webp";

// Typing Text Animation
const DOG_MISSION_TEXT =
  "The three-headed dog appears!\nCast the spell 'musica' and click the moving button before the time runs out to make him fall asleep!";

const DOOR_MISSION_TEXT =
  "A locked door blocks your way!\nWhich spell will open it?";

const STONE_MISSION_TEXT =
  "A large stone blocks your way!\nWhich spell will move it?";

export const AllGamesGryffindor = ({
  step,
  setStep,
  round,
  setRound,
  setShowArrows,
  setInput,
  setSequence,
  setTimer,
  setResults,
  setDoorResult,
  setDogResult,
  setStoneResult,
  setShowDog,
  showDog,
}) => {
  const [missionPhase, setMissionPhase] = useState("");
  const [missionType, setMissionType] = useState("");
  const [displayedMissionText, setDisplayedMissionText] = useState("");
  const missionCharIndexRef = useRef(0);
  const missionTypingIntervalRef = useRef(null);
  const [missionTypingDone, setMissionTypingDone] = useState(false);
  const [missionFade, setMissionFade] = useState(false);

  // Dogi States
  const [dogPhase, setDogPhase] = useState("start");
  const [dogTimer, setDogTimer] = useState(10);
  const [dogButtonPos, setDogButtonPos] = useState({ x: 50, y: 50 });
  const dogMoveInterval = useRef(null);
  const dogCountdown = useRef(null);
  const [dogFade, setDogFade] = useState(false);
  const [dogButtonShake, setDogButtonShake] = useState({ x: 0, y: 0 });
  const [dogImageShake, setDogImageShake] = useState({ x: 0, y: 0 });

  const [displayedDogText, setDisplayedDogText] = useState("");
  const dogCharIndexRef = useRef(0);
  const dogTypingIntervalRef = useRef(null);
  const [dogTypingDone, setDogTypingDone] = useState(false);
  const [dogTextFadeOut, setDogTextFadeOut] = useState(false);

  // Tür öffnen Transition
  const [doorOpenTransition, setDoorOpenTransition] = useState(false);

  // Neu: Delay für Door-Success-UI und Success-Continue
  const [doorSuccessDelay, setDoorSuccessDelay] = useState(false);

  //Stein bewegen
  const [stoneMoveTransition, setStoneMoveTransition] = useState(false);

  // --- BUTTON HANDLERS ---
  const handleDoorMission = (choice) => {
    if (missionPhase !== "show") return;
    const correct = choice === "Alohomora";
    setMissionPhase(correct ? "success" : "fail");
    setDoorResult(correct);
    if (correct) {
      setDoorOpenTransition(true);

      // Erst nach Übergang Door-Success Overlay & Continue anzeigen
      setDoorSuccessDelay(false);
      setTimeout(() => {
        setDoorSuccessDelay(true);
      }, 2200);
    }
  };

  // Door Game Over & Door Success Continue
  const handleDoorGameOverContinue = () => {
    setMissionPhase("");
    setMissionType("");
    setDisplayedMissionText("");
    setMissionTypingDone(false);
    setMissionFade(false);
    setShowArrows(true);
    setInput([]);
    setSequence((sequence) => [...sequence]);
    setTimer(5);
    setStep(0);
    setRound(2);
    setDoorOpenTransition(false);
    setDoorSuccessDelay(false);
  };

  const handleDoorSuccessContinue = () => {
    setMissionFade(true);
    setTimeout(() => {
      setMissionPhase("");
      setMissionType("");
      setDisplayedMissionText("");
      setMissionTypingDone(false);
      setMissionFade(false);
      setShowArrows(true);
      setInput([]);
      setSequence((sequence) => [...sequence]);
      setTimer(5);
      setStep(0);
      setRound(2);
      setDoorOpenTransition(false);
      setDoorSuccessDelay(false);
    }, 2000);
  };

  // Stein Mission
  const handleStoneMission = (choice) => {
    if (missionPhase !== "show") return;
    const correct = choice === "Wingardium Leviosa";
    setMissionPhase(correct ? "success" : "fail");
    setStoneResult(correct);
    if (correct) {
      setStoneMoveTransition(true);
      setTimeout(() => {
        setMissionFade(true);
        setTimeout(() => {
          setMissionPhase("");
          setMissionType("");
          setDisplayedMissionText("");
          setMissionTypingDone(false);
          setMissionFade(false);
          setShowArrows(true);
          setInput([]);
          setSequence((sequence) => [...sequence]);
          setTimer(5);
          setStep(3);
          setRound(4);
          setStoneMoveTransition(false);
        }, 2000);
      }, 2200);
    }
  };

  const handleStoneGameOverContinue = () => {
    setMissionPhase("");
    setMissionType("");
    setDisplayedMissionText("");
    setMissionTypingDone(false);
    setMissionFade(false);
    setShowArrows(true);
    setInput([]);
    setSequence((sequence) => [...sequence]);
    setTimer(5);
    setStep(3);
    setRound(4);
  };

  const handleDogSuccess = () => {
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
      setSequence((sequence) => [...sequence]);
      setTimer(5);
      setRound(3);
    }, 3800);
  };
  const handleDogGameOverOk = () => {
    setShowDog(false);
    setDogResult(false);
    setDogFade(false);
    setStep(0);
    setShowArrows(true);
    setInput([]);
    setSequence((sequence) => [...sequence]);
    setTimer(5);
    setRound(3);
  };

  // Effekte für die Missions
  useEffect(() => {
    if (step === "mission" && missionPhase === "") {
      setMissionType(round === 1 ? "door" : "stone");
      setMissionPhase("fade");
    }
    if (step === "mission" && missionPhase === "fade") {
      setDisplayedMissionText("");
      setMissionTypingDone(false);
      setMissionFade(false);
      const t = setTimeout(() => setMissionPhase("typing"), 700);
      return () => clearTimeout(t);
    }
  }, [step, round, missionPhase]);

  useEffect(() => {
    if (step === "mission" && missionPhase === "typing") {
      setDisplayedMissionText("");
      missionCharIndexRef.current = 0;

      if (missionTypingIntervalRef.current) {
        clearInterval(missionTypingIntervalRef.current);
      }

      let text =
        missionType === "door" ? DOOR_MISSION_TEXT : STONE_MISSION_TEXT;

      missionTypingIntervalRef.current = setInterval(() => {
        const nextIndex = missionCharIndexRef.current + 1;
        setDisplayedMissionText(text.slice(0, nextIndex));
        missionCharIndexRef.current = nextIndex;

        if (nextIndex === text.length) {
          clearInterval(missionTypingIntervalRef.current);
          setMissionTypingDone(true);
        }
      }, 90);

      return () => clearInterval(missionTypingIntervalRef.current);
    }
  }, [missionPhase, step, missionType]);

  useEffect(() => {
    if (missionTypingDone && step === "mission" && missionPhase === "typing") {
      const t = setTimeout(() => setMissionPhase("show"), 900);
      return () => clearTimeout(t);
    }
  }, [missionTypingDone, step, missionPhase]);

  // Dogi Mission
  useEffect(() => {
    if (step === 99) {
      setShowDog(true);
      setDogPhase("start");
      setDogFade(false);
      setDogButtonPos({
        x: window.innerWidth / 2 - 80,
        y: window.innerHeight / 2 + 160,
      });
      setDisplayedDogText("");
      setDogTypingDone(false);
      setDogTextFadeOut(false);
    } else {
      clearInterval(dogMoveInterval.current);
      clearInterval(dogCountdown.current);
      setDisplayedDogText("");
      setDogTypingDone(false);
      setDogTextFadeOut(false);
    }
    return () => {
      clearInterval(dogMoveInterval.current);
      clearInterval(dogCountdown.current);
      setDisplayedDogText("");
      setDogTypingDone(false);
      setDogTextFadeOut(false);
    };
  }, [step, setShowDog]);

  useEffect(() => {
    if (showDog && dogPhase === "start") {
      setDisplayedDogText("");
      dogCharIndexRef.current = 0;

      if (dogTypingIntervalRef.current) {
        clearInterval(dogTypingIntervalRef.current);
      }

      const text = DOG_MISSION_TEXT;

      dogTypingIntervalRef.current = setInterval(() => {
        const nextIndex = dogCharIndexRef.current + 1;
        setDisplayedDogText(text.slice(0, nextIndex));
        dogCharIndexRef.current = nextIndex;

        if (nextIndex === text.length) {
          clearInterval(dogTypingIntervalRef.current);
          setDogTypingDone(true);
        }
      }, 90);

      return () => clearInterval(dogTypingIntervalRef.current);
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
        dogMoveInterval.current = setInterval(() => moveDogButtonScreen(), 500);
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

  // Effekt shake Dogi
  useEffect(() => {
    let shakeInt = null;
    if (showDog && dogPhase === "running") {
      shakeInt = setInterval(() => {
        setDogImageShake({
          x: Math.random() * 30 - 15,
          y: Math.random() * 30 - 15,
        });
      }, 34);
    } else {
      setDogImageShake({ x: 0, y: 0 });
    }
    return () => {
      if (shakeInt) clearInterval(shakeInt);
      setDogImageShake({ x: 0, y: 0 });
    };
  }, [showDog, dogPhase]);

  // Button shake
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
    if (showDog && dogPhase === "running" && dogTimer <= 0) {
      setDogPhase("gameover");
      setTimeout(() => setDogFade(true), 1200);
    }
  }, [dogTimer, showDog, dogPhase]);

  const moveDogButtonScreen = () => {
    const btnW = 120;
    const btnH = 60;
    const pad = 32;
    const maxX = window.innerWidth - btnW - pad;
    const maxY = window.innerHeight - btnH - pad;
    const x = Math.floor(Math.random() * (maxX - pad) + pad);
    const y = Math.floor(Math.random() * (maxY - pad) + pad);
    setDogButtonPos({ x, y });
  };

  // Zeilenumbrüche
  const renderWithLineBreaks = (text) =>
    text.split("\n").map((line, idx) => (
      <div key={idx} className="inline">
        {line}
        {idx < text.split("\n").length - 1 && <br />}
      </div>
    ));

  return (
    <div>
      {/* Mission Fade+Typing+Result */}
      {step === "mission" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black transition-all duration-1000
                    overflow-hidden w-full h-full"
        >
          {/* offene Tür */}
          {missionType === "door" && (
            <div
              className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 
                        pointer-events-none select-none w-[97vw] max-w-[540px] h-[80vh] max-h-[560px]"
            >
              {/* geschlossene Tür  */}
              <img
                src={DOOR_IMG}
                alt="Closed door"
                className={`absolute w-full h-full object-contain transition-opacity duration-[1900ms] ease-in
                  ${
                    doorOpenTransition ? "opacity-0 z-20" : "opacity-100 z-20"
                  }`}
                draggable={false}
              />

              {/* Übergang */}
              <img
                src={DOOR_OPEN_IMG}
                alt="Open door"
                className={`absolute w-full h-full object-contain transition-opacity duration-[1900ms] ease-in
                          ${
                            doorOpenTransition
                              ? "opacity-100 z-30"
                              : "opacity-0 z-30"
                          }`}
                draggable={false}
              />
            </div>
          )}

          {missionType === "stone" && (
            <div
              className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none 
                        select-none w-[97vw] max-w-[540px] h-[80vh] max-h-[560px]"
            >
              {/* Stein */}
              <img
                src={BLOCKING_STONE_IMG}
                alt="Stone"
                className={`absolute w-full h-full object-contain transition-opacity duration-[1900ms] ease-in
                          ${
                            stoneMoveTransition
                              ? "opacity-0 z-20"
                              : "opacity-100 z-20"
                          }`}
                draggable={false}
              />

              {/* Bewegter Stein */}
              <img
                src={STONE_IMG}
                alt="Moved stone"
                className={`absolute w-full h-full object-contain transition-opacity duration-[1900ms] ease-in
                          ${
                            stoneMoveTransition
                              ? "opacity-100 z-30"
                              : "opacity-0 z-30"
                          }`}
                draggable={false}
              />
            </div>
          )}

          {/* Typing Effekt */}
          {(missionPhase === "fade" || missionPhase === "typing") && (
            <div
              className="absolute left-1/2 top-[85%] z-40 -translate-x-1/2 -translate-y-1/2 flex 
                        flex-col items-center w-[94vw] max-w-[480px]"
            >
              <div
                className="text-white rounded-2xl px-8 py-8 text-lg shadow-2xl
                          whitespace-pre-line text-center tracking-wider leading-relaxed min-h-[160px] 
                          transition-opacity duration-800"
              >
                {renderWithLineBreaks(displayedMissionText) || ""}
                {!missionTypingDone && <span className="blink-cursor">|</span>}
              </div>
            </div>
          )}

          {/* Bilder und Buttonsss von Missionen */}
          {missionPhase === "show" && (
            <>
              {missionType === "stone" && (
                <img
                  src={BLOCKING_STONE_IMG}
                  alt="Stone"
                  className="bg-[var(--color-b)] absolute left-1/2 top-1/2 -translate-x-1/2 
                            -translate-y-1/2 w-[260px] h-[260px] object-contain opacity-90 pointer-events-none"
                />
              )}
              <div
                className="absolute left-1/2 top-[85%] z-50 -translate-x-1/2 
                          -translate-y-1/2 flex flex-col items-center w-[100vw] max-w-[600px]"
              >
                <div className="flex gap-8 w-full items-center mt-2">
                  {missionType === "door" && (
                    <>
                      <button
                        className="w-72 py-4 pl-4 pr-4 rounded-lg text-xl font-bold 
                                  transition bg-[var(--color-b)] hover:bg-[var(--color-b-shadow)] hover:text-[var(--color-b)]
                                  drop-shadow-[0_0_10px_#00FFFF] shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleDoorMission("Alohomora")}
                      >
                        Alohomora
                      </button>
                      <button
                        className="w-72 pl-4 pr-4 py-4 rounded-lg text-xl font-bold 
                                  transition bg-[var(--color-b)] hover:bg-[var(--color-b-shadow)] 
                                  hover:text-[var(--color-b)] drop-shadow-[0_0_10px_#00FFFF] shadow-lg
                                 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleDoorMission("Lumos")}
                      >
                        Lumos
                      </button>
                      <button
                        className="w-72 py-4 pl-4 pr-4 rounded-lg text-xl font-bold 
                                  transition bg-[var(--color-b)] hover:bg-[var(--color-b-shadow)]
                                  hover:text-[var(--color-b)] drop-shadow-[0_0_10px_#00FFFF] shadow-lg 
                                text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleDoorMission("Expelliarmus")}
                      >
                        Expelliarmus
                      </button>
                    </>
                  )}
                  {missionType === "stone" && (
                    <>
                      <button
                        className="whitespace-nowrap w-72 py-5 pl-5 pr-5 rounded-lg text-xl 
                                  font-bold transition bg-[var(--color-b)] hover:bg-[var(--color-b-shadow)] hover:text-[var(--color-b)] 
                                  drop-shadow-[0_0_10px_#00FFFF] shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleStoneMission("Wingardium Leviosa")}
                      >
                        Wingardium Leviosa
                      </button>
                      <button
                        className="whitespace-nowrap w-72 py-5 pl-5 pr-5 rounded-lg text-xl font-bold transition
                                  bg-[var(--color-b)] hover:bg-[var(--color-b-shadow)] hover:text-[var(--color-b)] 
                                  drop-shadow-[0_0_10px_#00FFFF] shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleStoneMission("Stupor")}
                      >
                        Stupor
                      </button>
                      <button
                        className="whitespace-nowrap w-72 py-5 pl-5 pr-5 rounded-lg text-xl font-bold transition 
                                  bg-[var(--color-b)] hover:bg-[var(--color-b-shadow)] hover:text-[var(--color-b)] drop-shadow-[0_0_10px_#00FFFF] 
                                  shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleStoneMission("Avada Kedavra")}
                      >
                        Avada Kedavra
                      </button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Mission result beim Erfolg */}
          {missionPhase === "success" &&
            missionType === "door" &&
            doorSuccessDelay && (
              <div
                className={`absolute inset-0 bg-black/70 opacity-100 z-50 flex flex-col items-center justify-center
                        transition-all duration-[2000ms] fade-in-slow ${
                          missionFade ? "backdrop-blur-xl" : ""
                        } ${
                  missionFade ? "opacity-100" : "opacity-0"
                } pointer-events-auto`}
              >
                <span className="text-4xl font-black text-white tracking-wider animate-fade-in mb-8">
                  Well done, the door is open!
                </span>
                <button
                  className="w-72 py-4 rounded-lg text-xl font-bold transition bg-[var(--color-b)] 
                          hover:bg-[var(--color-b-shadow)] hover:text-[var(--color-b)] drop-shadow-[0_0_10px_#00FFFF] 
                          shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ pointerEvents: "auto" }}
                  onClick={handleDoorSuccessContinue}
                >
                  Continue
                </button>
              </div>
            )}

          {/* Mission result beim Erfolg - Stein */}
          {missionPhase === "success" && missionType === "stone" && (
            <div
              className={`absolute inset-0 bg-black opacity-60 z-50 flex items-center justify-center
                        transition-all duration-[2000ms] ${
                          missionFade ? "backdrop-blur-xl" : ""
                        } ${
                missionFade ? "opacity-100" : "opacity-0"
              } pointer-events-auto`}
            >
              <span className="text-4xl font-black text-white tracking-wider animate-fade-in">
                You moved the stone!
              </span>
            </div>
          )}

          {/* Mission result fail */}
          {missionPhase === "fail" && (
            <div
              className="absolute inset-0 bg-black/70 opacity-100 z-50 flex flex-col items-center justify-center 
                        transition-all duration-[2000ms] pointer-events-auto fade-in-slow"
            >
              <span className="text-4xl font-black text-white mb-8 animate-fade-in">
                Game Over
              </span>
              <button
                className="w-72 py-4 pl-4 pr-4 rounded-lg text-xl font-bold transition bg-[var(--color-b)] 
                          hover:bg-[var(--color-b-shadow)] hover:text-[var(--color-b)] drop-shadow-[0_0_10px_#00FFFF] 
                          shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
      {/* === DOGI MISSION === */}
      {showDog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black transition-all
                    duration-1000 overflow-hidden w-full h-full"
        >
          {/* Typing Effekt auf schwarz */}
          {dogPhase === "start" && (
            <div
              className="absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 flex flex-col 
                        items-center w-[94vw] max-w-[480px]"
            >
              <div
                className={`bg-black/70 text-white rounded-2xl px-8 py-8 text-lg shadow-2xl whitespace-pre-line 
                          text-center tracking-wider leading-relaxed min-h-[160px] transition-opacity duration-800 ${
                            dogTextFadeOut ? "opacity-0" : "opacity-100"
                          }`}
              >
                {renderWithLineBreaks(displayedDogText) ?? ""}

                {!dogTypingDone && <span className="blink-cursor">|</span>}
              </div>
            </div>
          )}
          {(dogPhase === "running" ||
            dogPhase === "sleeping" ||
            dogPhase === "gameover") && (
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                        flex flex-col items-center z-10 pointer-events-none w-full h-full"
            >
              <img
                src={DOG_IMG}
                alt="Three-headed dog"
                className="w-[97vw] max-w-[1400px] max-h-[98vh] h-auto object-contain 
                          drop-shadow-2xl select-none pointer-events-none transition-transform duration-75"
                style={{
                  transform: `translate(${dogImageShake.x}px, ${dogImageShake.y}px)`,
                }}
              />
            </div>
          )}

          {dogPhase === "running" && (
            <>
              <button
                onClick={handleDogSuccess}
                className="fixed z-[100] w-72 bg-[var(--color-b)] hover:bg-[var(--color-b-shadow)] 
                          hover:text-[var(--color-b)] drop-shadow-[0_0_10px_#00FFFF] shadow-lg text-white disabled:opacity-50 
                          disabled:cursor-not-allowed text-xl px-8 py-3 font-bold rounded-lg transition"
                style={{
                  left: `${dogButtonPos.x + dogButtonShake.x}px`,
                  top: `${dogButtonPos.y + dogButtonShake.y}px`,
                }}
              >
                musica
              </button>
              <div
                className="w-auto fixed top-6 right-8 z-[110] bg-black/70 text-white px-6 py-2 
                          rounded-lg text-2xl font-bold select-none pointer-events-none border-2 border-white shadow-lg"
              >
                {dogTimer}
              </div>
            </>
          )}

          {dogPhase === "sleeping" && (
            <div
              className={
                `absolute inset-0 bg-black z-40 flex items-center justify-center transition-all fade-in-slow duration-[2600ms]` +
                (dogFade
                  ? " backdrop-blur-2xl opacity-100 pointer-events-auto"
                  : " opacity-0 pointer-events-auto")
              }
            >
              <span className="text-7xl font-black text-white tracking-widest animate-fade-in">
                zzzZZZ
              </span>
            </div>
          )}
          {dogPhase === "gameover" && (
            <div
              className={`absolute inset-0 bg-black/70 z-40 flex flex-col items-center 
                        justify-center transition-all duration-[2600ms] opacity-100 fade-in-slow pointer-events-auto`}
            >
              <span className="text-4xl font-black text-white mb-8 animate-fade-in">
                Game Over
              </span>
              <button
                className="w-72 py-4 rounded-lg text-xl font-bold transition bg-[var(--color-b)] 
                          hover:bg-[var(--color-b-shadow)] hover:text-[var(--color-b)] drop-shadow-[0_0_10px_#00FFFF] 
                          shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleDogGameOverOk}
              >
                Continue
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
