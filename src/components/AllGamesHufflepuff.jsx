import { useState, useEffect, useRef } from "react";

// --- Puffskein Mission ---
const GAME_SIZE = 700;
const PUFF_SIZE = 80;
const FOOD_SIZE = 36;
const FOOD_COUNT = 7;
const GAME_TIME = 9;

// --- Mandrake Repot Mission  ---
const PLANT_IMG =
  "https://raw.githubusercontent.com/klarsongs/cave/master/no_hands.svg?sanitize=true";
const PLANT_IN_POT_IMG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751892377/Screenshot_2025-07-07_144531_sad4ee.png";
const POT_IMG =
  "https://raw.githubusercontent.com/klarsongs/cave/master/pot.svg?sanitize=true";
const SCREAM_SOUND =
  "https://raw.githubusercontent.com/klarsongs/cave/master/scream.mp3";

// Puffskein Images
const PUFF_IMG_SICK =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751657959/Puffskein-krank_ohrpnw.png";
const PUFF_IMG_HEALTHY =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751655175/Puffskein_jqsate.png";

// Badger Mission
const BADGER_IMG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751881312/craiyon_114144_image_dxx6er.png";
const TREE_IMG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751566924/Baum_rdyohr.png";

const randomPosWithinBounds = (width, height, margin = 80) => {
  const x = Math.floor(Math.random() * (width - margin * 2)) + margin;
  const y = Math.floor(Math.random() * (height - margin * 2)) + margin;
  return { x, y };
};

const getDistance = (a, b, sizeA, sizeB) => {
  const dx = a.x + sizeA / 2 - (b.x + sizeB / 2);
  const dy = a.y + sizeA / 2 - (b.y + sizeB / 2);
  return Math.sqrt(dx * dx + dy * dy);
};

export const AllGamesHufflepuff = ({
  missionType = "puffskein",
  onComplete,
}) => {
  const [missionPhase, setMissionPhase] = useState("");
  const [displayedMissionText, setDisplayedMissionText] = useState("");
  const missionCharIndexRef = useRef(0);
  const missionTypingIntervalRef = useRef(null);
  const [missionTypingDone, setMissionTypingDone] = useState(false);

  // ------------------ PUFFSKEIN STATE ------------------
  const [foods, setFoods] = useState([]);
  const [puff, setPuff] = useState({
    x: GAME_SIZE / 2 - PUFF_SIZE / 2,
    y: GAME_SIZE / 2 - PUFF_SIZE / 2,
  });
  const [time, setTime] = useState(GAME_TIME);
  const [running, setRunning] = useState(false);
  const [endScreen, setEndScreen] = useState(null);
  const [fadeOut, setFadeOut] = useState(false);
  const [showHealthyOnSuccess, setShowHealthyOnSuccess] = useState(false);

  // ------------------ Mandrake Repot State ------------------
  const REPOT_WIDTH = 700;
  const REPOT_HEIGHT = 550;
  const MANDRAKE_SIZE = 90;
  const REPOT_POT_SIZE = 130;
  const [mandrakePhase, setMandrakePhase] = useState("intro");
  const [mandrakePos, setMandrakePos] = useState({ x: 330, y: 150 });
  const [mandrakeDragging, setMandrakeDragging] = useState(false);
  const [mandrakeOffset, setMandrakeOffset] = useState({ x: 0, y: 0 });
  const [mandrakeInPot, setMandrakeInPot] = useState(false);
  const [mandrakeTime, setMandrakeTime] = useState(8);
  const [mandrakeGameOver, setMandrakeGameOver] = useState(false);
  const [mandrakeWin, setMandrakeWin] = useState(false);
  const [mandrakeScreaming, setMandrakeScreaming] = useState(false);
  const [mandrakeEndFade, setMandrakeEndFade] = useState(false);

  const mandrakeRandomMoveInterval = useRef(null);
  const mandrakeTimerInterval = useRef(null);
  const screamRef = useRef(null);

  // ------------------ BADGER MISSION STATE ------------------
  const [badgerPhase, setBadgerPhase] = useState("intro");
  const [badgerSpellResult, setBadgerSpellResult] = useState(null);
  const [badgerSpellActive, setBadgerSpellActive] = useState(false);
  const [badgerDepth, setBadgerDepth] = useState(0);
  const [badgerOpacity, setBadgerOpacity] = useState(0);
  const [badgerScale, setBadgerScale] = useState(0.55);
  const [treeOpacity, setTreeOpacity] = useState(1);
  const [badgerShow, setBadgerShow] = useState(true);
  const [showBadgerContinue, setShowBadgerContinue] = useState(false);

  // --- Texts für die Missionen
  const PUFF_MISSION_TEXT =
    "A stray Puffskein appears! It looks hungry and in desperate need of care. Will you take care of it?";
  const MANDRAKE_MISSION_TEXT =
    "While repotting some plants, you accidentally uncover a shrieking mandrake! Quickly place it back before its scream knocks you out.";
  const BADGER_MISSION_TEXT =
    "You spot a shy badger hiding in a hollow tree. Can you coax it out with a magic spell and become friends?";

  // --- Typing Intro ---
  useEffect(() => {
    setMissionPhase("fade");
  }, [missionType]);

  useEffect(() => {
    if (missionPhase === "fade") {
      setDisplayedMissionText("");
      setMissionTypingDone(false);
      const t = setTimeout(() => setMissionPhase("typing"), 700);
      return () => clearTimeout(t);
    }
  }, [missionPhase]);

  useEffect(() => {
    if (missionPhase === "typing") {
      setDisplayedMissionText("");
      missionCharIndexRef.current = 0;
      if (missionTypingIntervalRef.current)
        clearInterval(missionTypingIntervalRef.current);
      let missionText = "";
      if (missionType === "puffskein") missionText = PUFF_MISSION_TEXT;
      else if (missionType === "repot") missionText = MANDRAKE_MISSION_TEXT;
      else if (missionType === "badger") missionText = BADGER_MISSION_TEXT;
      missionTypingIntervalRef.current = setInterval(() => {
        const nextIndex = missionCharIndexRef.current + 1;
        setDisplayedMissionText(missionText.slice(0, nextIndex));
        missionCharIndexRef.current = nextIndex;
        if (nextIndex === missionText.length) {
          clearInterval(missionTypingIntervalRef.current);
          setMissionTypingDone(true);
        }
      }, 90);
      return () => clearInterval(missionTypingIntervalRef.current);
    }
  }, [missionPhase, missionType]);

  useEffect(() => {
    if (missionTypingDone && missionPhase === "typing") {
      const t = setTimeout(() => setMissionPhase("show"), 950);
      return () => clearTimeout(t);
    }
  }, [missionTypingDone, missionPhase]);

  // ------------------ PUFFSKEIN GAME LOGIC ------------------
  const resetGame = () => {
    setTime(GAME_TIME);
    setEndScreen(null);
    setFadeOut(false);
    setShowHealthyOnSuccess(false);
    setPuff({
      x: GAME_SIZE / 2 - PUFF_SIZE / 2,
      y: GAME_SIZE / 2 - PUFF_SIZE / 2,
    });
    setFoods(
      Array.from({ length: FOOD_COUNT }).map(() => ({
        x: randomPosWithinBounds(GAME_SIZE, GAME_SIZE, 40).x,
        y: randomPosWithinBounds(GAME_SIZE, GAME_SIZE, 40).y,
        eaten: false,
        id: Math.random(),
      }))
    );
    setRunning(false);
  };

  useEffect(() => {
    if (missionType === "puffskein" && missionPhase === "show") {
      resetGame();
    }
  }, [missionType, missionPhase]);

  useEffect(() => {
    if (
      missionType === "puffskein" &&
      missionPhase === "show" &&
      foods.length > 0 &&
      !running
    ) {
      const t = setTimeout(() => setRunning(true), 350);
      return () => clearTimeout(t);
    }
  }, [foods, missionType, missionPhase, running]);

  useEffect(() => {
    if (missionType !== "puffskein" || !running) return;
    const timer = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setRunning(false);
          handleEnd("fail");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [running, missionType]);

  useEffect(() => {
    if (missionType !== "puffskein" || !running) return;
    const stepPx = 30;
    function handleKey(e) {
      setPuff((old) => {
        let { x, y } = old;
        if (e.key === "ArrowLeft") x = Math.max(0, x - stepPx);
        if (e.key === "ArrowRight")
          x = Math.min(GAME_SIZE - PUFF_SIZE, x + stepPx);
        if (e.key === "ArrowUp") y = Math.max(0, y - stepPx);
        if (e.key === "ArrowDown")
          y = Math.min(GAME_SIZE - PUFF_SIZE, y + stepPx);
        return { x, y };
      });
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [running, missionType]);

  useEffect(() => {
    if (missionType !== "puffskein" || !running) return;
    setFoods((oldFoods) =>
      oldFoods.map((f) => {
        if (
          !f.eaten &&
          getDistance(puff, f, PUFF_SIZE, FOOD_SIZE) <
            PUFF_SIZE / 2 + FOOD_SIZE / 2
        ) {
          return { ...f, eaten: true };
        }
        return f;
      })
    );
  }, [puff, running, missionType]);

  useEffect(() => {
    if (
      missionType === "puffskein" &&
      foods.length &&
      foods.every((f) => f.eaten) &&
      running
    ) {
      setRunning(false);
      handleEnd("success");
    }
  }, [foods, running, missionType]);

  const handleEnd = (type) => {
    setTimeout(() => setEndScreen(type), 480);
    if (type === "success") {
      setTimeout(() => setShowHealthyOnSuccess(true), 900);
      setTimeout(() => setFadeOut(true), 2200);
    } else {
      setTimeout(() => setFadeOut(true), 1200);
    }
  };

  const handlePuffContinue = () => {
    onComplete && onComplete(endScreen === "success" ? "success" : "fail");
  };

  // ------------------ MANDRAKE REPOT logik ------------------
  useEffect(() => {
    if (missionType !== "repot" || missionPhase !== "show") return;
    setMandrakePhase("show");
    setMandrakePos(randomPosWithinBounds(REPOT_WIDTH, REPOT_HEIGHT, 90));
    setMandrakeDragging(false);
    setMandrakeInPot(false);
    setMandrakeWin(false);
    setMandrakeGameOver(false);
    setMandrakeTime(8);
    setMandrakeScreaming(true);
    setMandrakeEndFade(false);
    if (screamRef.current) {
      screamRef.current.currentTime = 1;
      screamRef.current.play();
      screamRef.current.loop = true;
    }
    mandrakeRandomMoveInterval.current = setInterval(() => {
      setMandrakePos(randomPosWithinBounds(REPOT_WIDTH, REPOT_HEIGHT, 90));
    }, Math.floor(Math.random() * 400) + 350);

    mandrakeTimerInterval.current = setInterval(() => {
      setMandrakeTime((prev) => {
        if (prev <= 1) {
          clearInterval(mandrakeRandomMoveInterval.current);
          clearInterval(mandrakeTimerInterval.current);
          setMandrakeScreaming(false);
          setMandrakeGameOver(true);
          if (screamRef.current) {
            screamRef.current.pause();
            screamRef.current.currentTime = 0;
            screamRef.current.loop = false;
          }
          setTimeout(() => setMandrakeEndFade(true), 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(mandrakeRandomMoveInterval.current);
      clearInterval(mandrakeTimerInterval.current);
      if (screamRef.current) {
        screamRef.current.pause();
        screamRef.current.currentTime = 0;
        screamRef.current.loop = false;
      }
    };
  }, [missionType, missionPhase]);

  const handleMandrakeMouseDown = (e) => {
    if (mandrakeGameOver || mandrakeWin) return;
    setMandrakeDragging(true);
    const rect = e.target.getBoundingClientRect();
    setMandrakeOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    e.preventDefault();
  };

  const handleMandrakeMouseMove = (e) => {
    if (!mandrakeDragging || mandrakeGameOver || mandrakeWin) return;
    setMandrakePos({
      x: Math.max(
        0,
        Math.min(
          REPOT_WIDTH - MANDRAKE_SIZE,
          e.clientX - repotContainerLeft() - mandrakeOffset.x
        )
      ),
      y: Math.max(
        0,
        Math.min(
          REPOT_HEIGHT - MANDRAKE_SIZE,
          e.clientY - repotContainerTop() - mandrakeOffset.y
        )
      ),
    });
  };

  const handleMandrakeMouseUp = (e) => {
    if (!mandrakeDragging || mandrakeGameOver || mandrakeWin) return;
    setMandrakeDragging(false);
    const mandrakeCenter = {
      x: mandrakePos.x + MANDRAKE_SIZE / 2,
      y: mandrakePos.y + MANDRAKE_SIZE / 2,
    };
    const potCenter = {
      x: REPOT_WIDTH / 2,
      y: REPOT_HEIGHT / 2 + 90,
    };
    if (
      Math.abs(mandrakeCenter.x - potCenter.x) < REPOT_POT_SIZE / 2 &&
      Math.abs(mandrakeCenter.y - potCenter.y) < REPOT_POT_SIZE / 2
    ) {
      clearInterval(mandrakeRandomMoveInterval.current);
      clearInterval(mandrakeTimerInterval.current);
      setMandrakeInPot(true);
      setMandrakeWin(true);
      setMandrakeScreaming(false);
      setTimeout(() => setMandrakeEndFade(true), 400);
      if (screamRef.current) {
        screamRef.current.pause();
        screamRef.current.currentTime = 0;
        screamRef.current.loop = false;
      }
    }
  };

  const repotContainerLeft = () => {
    const el = document.getElementById("repot-container");
    return el ? el.getBoundingClientRect().left : 0;
  };

  const repotContainerTop = () => {
    const el = document.getElementById("repot-container");
    return el ? el.getBoundingClientRect().top : 0;
  };

  const handleMandrakeContinue = () => {
    onComplete && onComplete(mandrakeWin ? "success" : "fail");
  };

  // ------------------ BADGER MISSION Logik ------------------
  useEffect(() => {
    if (missionType !== "badger" || missionPhase !== "show") return;
    setBadgerPhase("emerging");
    setBadgerSpellResult(null);
    setBadgerSpellActive(false);
    setBadgerDepth(0);
    setBadgerScale(0.55);
    setBadgerOpacity(0);
    setTreeOpacity(1);
    setBadgerShow(true);
    setShowBadgerContinue(false);

    let depth = 0;
    let scale = 0.55;
    let opacity = 0;
    const emergeInterval = setInterval(() => {
      depth = Math.min(1, depth + 0.035);
      scale = Math.min(1.0, scale + 0.022);
      opacity = Math.min(1, opacity + 0.035);
      setBadgerDepth(depth);
      setBadgerScale(scale);
      setBadgerOpacity(opacity);
      if (depth >= 1 && scale >= 1 && opacity >= 1) {
        clearInterval(emergeInterval);
        setBadgerPhase("spell");
        setBadgerSpellActive(true);
      }
    }, 28);
    return () => clearInterval(emergeInterval);
  }, [missionType, missionPhase]);

  useEffect(() => {
    if (
      missionType === "badger" &&
      (badgerPhase === "success" || badgerPhase === "fail")
    ) {
      setShowBadgerContinue(false);
      const t = setTimeout(() => setShowBadgerContinue(true), 1200);
      return () => clearTimeout(t);
    }
  }, [missionType, badgerPhase]);

  const handleBadgerSpellClick = (spell) => {
    if (!badgerSpellActive) return;
    setBadgerSpellActive(false);
    setTimeout(() => setBadgerShow(false), 1500);

    if (spell === "Accio") {
      setBadgerSpellResult("win");
      setBadgerPhase("success");
      let scale = 1.0;
      let opacity = 1;
      let tree = 1;
      const fadeInterval = setInterval(() => {
        scale = Math.min(2.1, scale + 0.06);
        opacity = Math.max(0, opacity - 0.024);
        tree = Math.max(0, tree - 0.035);
        setBadgerScale(scale);
        setBadgerOpacity(opacity);
        setTreeOpacity(tree);
        if (opacity <= 0.1 && tree <= 0.1) clearInterval(fadeInterval);
      }, 30);
    } else {
      setBadgerSpellResult("fail");
      setBadgerPhase("fail");
      let opacity = 1;
      let tree = 1;
      const fadeInterval = setInterval(() => {
        opacity = Math.max(0, opacity - 0.045);
        tree = Math.max(0.16, tree - 0.022);
        setBadgerOpacity(opacity);
        setTreeOpacity(tree);
        if (opacity <= 0.1) clearInterval(fadeInterval);
      }, 30);
    }
  };

  const renderWithLineBreaks = (text) =>
    text.split("\n").map((line, idx) => (
      <div key={idx} style={{ display: "inline" }}>
        {line}
        {idx < text.split("\n").length - 1 && <br />}
      </div>
    ));

  return (
    <div>
      <div
        className="
          fixed inset-0 z-50 flex items-center justify-center
          bg-black
          transition-all duration-1000
          overflow-hidden
          w-full h-full
        "
        onMouseMove={
          missionType === "repot" && mandrakeDragging
            ? handleMandrakeMouseMove
            : undefined
        }
        onMouseUp={
          missionType === "repot" && mandrakeDragging
            ? handleMandrakeMouseUp
            : undefined
        }
      >
        {/* Mission Intro */}
        {(missionPhase === "fade" || missionPhase === "typing") && (
          <div className="absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full">
            <img
              src={
                missionType === "puffskein"
                  ? PUFF_IMG_SICK
                  : missionType === "badger"
                  ? TREE_IMG
                  : PLANT_IMG
              }
              alt={missionType}
              className="w-[200px] h-auto mb-8 drop-shadow-xl select-none pointer-events-none"
              draggable="false"
            />
            <div
              className="text-white rounded-2xl px-8 py-8 text-lg shadow-2xl
                    whitespace-pre-line text-center tracking-wider leading-relaxed min-h-[120px] 
                   transition-opacity duration-800 max-w-[520px]"
            >
              {renderWithLineBreaks(displayedMissionText) || ""}
              {!missionTypingDone && <span className="blink-cursor">|</span>}
            </div>
          </div>
        )}

        {/* Puffskein Mission */}
        {missionType === "puffskein" &&
          missionPhase === "show" &&
          !endScreen && (
            <div className="flex flex-col items-center w-full h-full">
              {/* Timer */}
              <div
                className="w-auto fixed top-6 right-8 z-[110] bg-black/70 text-white px-6 py-2 
            rounded-lg text-2xl font-bold select-none pointer-events-none border-2 border-white shadow-lg"
              >
                {time}s
              </div>
              <div
                className={`relative mx-auto outline-none`}
                style={{
                  width: `${GAME_SIZE}px`,
                  height: `${GAME_SIZE}px`,
                }}
                tabIndex={0}
              >
                {/* Puffskein */}
                <img
                  src={PUFF_IMG_SICK}
                  alt="Puffskein"
                  className="absolute w-[150px] h-auto pointer-events-none drop-shadow-xl transition-all duration-75"
                  style={{ left: puff.x, top: puff.y }}
                  draggable="false"
                />
                {/* Essennnn*/}
                {foods.map(
                  (f) =>
                    !f.eaten && (
                      <div
                        key={f.id}
                        className="absolute text-3xl transition-all duration-100"
                        style={{ left: f.x, top: f.y }}
                      >
                        🕷️
                      </div>
                    )
                )}
              </div>
            </div>
          )}

        {/* Puffskein Endscreen */}
        {missionType === "puffskein" && endScreen && (
          <div
            className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center 
            transition-all duration-[2000ms] opacity-90 pointer-events-auto min-h-screen"
          >
            <div className="relative w-full flex flex-col items-center">
              {endScreen === "fail" && (
                <img
                  src={PUFF_IMG_SICK}
                  alt="Puffskein sick"
                  className={`w-[150px] h-auto drop-shadow-xl mb-7 
                    transition-opacity duration-[2200ms] [filter:drop-shadow(0_0_32px_#fff5)]
                     ${fadeOut ? "opacity-20" : "opacity-100"}`}
                  draggable="false"
                />
              )}
              {endScreen === "success" && (
                <div className="relative w-[150px] h-[150px] mb-7 flex items-center justify-center">
                  <img
                    src={PUFF_IMG_SICK}
                    alt="Puffskein sick"
                    className={`absolute left-0 top-0 w-[150px] h-auto drop-shadow-xl 
                      transition-opacity duration-[2200ms] [filter:drop-shadow(0_0_32px_#fff5)]
                      ${showHealthyOnSuccess ? "opacity-20" : "opacity-100"}`}
                    draggable="false"
                  />
                  <img
                    src={PUFF_IMG_HEALTHY}
                    alt="Puffskein healthy"
                    className={`absolute left-0 top-0 w-[150px] h-auto drop-shadow-xl 
                      transition-opacity duration-[900ms] [filter:drop-shadow(0_0_32px_#fff5)]
                      ${showHealthyOnSuccess ? "opacity-100" : "opacity-0"}
                      ${fadeOut ? "opacity-40" : ""}`}
                    draggable="false"
                  />
                </div>
              )}
              <div
                className={`text-white text-3xl font-bold mb-7 mt-2 
                   transition-opacity duration-700 [transition-delay:0.3s]
                   ${fadeOut ? "opacity-100" : "opacity-0"}`}
              >
                {endScreen === "success"
                  ? "You took good care of it!"
                  : "Game Over"}
              </div>
              <button
                className={`w-72 py-4 pl-4 pr-4 rounded-lg text-xl font-bold bg-[var(--color-b)] 
                   hover:bg-[var(--color-b-shadow)] hover:text-[var(--color-b)] drop-shadow-[0_0_10px_#00FFFF] 
                   shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed 
                    transition-opacity duration-700 [transition-delay:0.8s]
                    ${fadeOut ? "opacity-100" : "opacity-0"}`}
                onClick={handlePuffContinue}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* --- Mandrake Repot Mission --- */}
        {missionType === "repot" && missionPhase === "show" && (
          <div className="fixed inset-0 flex flex-col items-center justify-center bg-black">
            <audio id="scream" ref={screamRef}>
              <source src={SCREAM_SOUND} />
            </audio>
            {!mandrakeWin && !mandrakeGameOver && (
              <>
                <div
                  className="w-auto fixed top-6 right-8 z-[110] bg-black/70 text-white px-6 py-2 
              rounded-lg text-2xl font-bold select-none pointer-events-none border-2 border-white shadow-lg"
                >
                  {mandrakeTime}s
                </div>
              </>
            )}
            <div
              id="repot-container"
              className="relative mx-auto bg-transparent"
              style={{
                width: REPOT_WIDTH,
                height: REPOT_HEIGHT,
              }}
            >
              {/* Pot */}
              <img
                src={POT_IMG}
                alt="pot"
                className="absolute left-1/2 -translate-x-1/2 [z-index:5] opacity-98"
                style={{
                  width: REPOT_POT_SIZE,
                  height: REPOT_POT_SIZE,
                  top: REPOT_HEIGHT / 2 + 40,
                }}
                draggable={false}
              />
              {/* Mandrake */}
              {!mandrakeWin && !mandrakeGameOver && (
                <img
                  src={PLANT_IMG}
                  alt="Mandrake"
                  className={`absolute cursor-grab select-none [z-index:10] 
                    ${
                      mandrakeScreaming
                        ? "[filter:drop-shadow(0_0_20px_#f88)]"
                        : ""
                    } 
                     ${
                       mandrakeDragging
                         ? ""
                         : "[animation:shake_0.14s_infinite]"
                     }`}
                  style={{
                    left: mandrakePos.x,
                    top: mandrakePos.y,
                    width: MANDRAKE_SIZE,
                    height: MANDRAKE_SIZE,
                    userSelect: "none",
                  }}
                  onMouseDown={handleMandrakeMouseDown}
                  draggable={false}
                />
              )}
            </div>
            {(mandrakeWin || mandrakeGameOver) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 z-50 transition-all duration-1000">
                {mandrakeWin && (
                  <img
                    src={PLANT_IN_POT_IMG}
                    alt="Mandrake in pot"
                    className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                      pointer-events-none transition-opacity duration-[750ms]`}
                    style={{
                      width: 320,
                      opacity: mandrakeEndFade ? 0.4 : 0.37,
                    }}
                    draggable={false}
                  />
                )}
                {mandrakeGameOver && (
                  <img
                    src={PLANT_IMG}
                    alt="Mandrake lose"
                    className="absolute left-[52%] top-1/2 -translate-x-1/2 -translate-y-1/2 
                    pointer-events-none [filter:blur(0.5px)_grayscale(0.3)] transition-opacity duration-[750ms]"
                    style={{
                      width: 220,
                      opacity: mandrakeEndFade ? 0.17 : 0.33,
                    }}
                    draggable={false}
                  />
                )}
                <div className="text-4xl font-extrabold mb-9 text-white z-10">
                  {mandrakeWin ? "Well done!" : "Game Over"}
                </div>
                <button
                  className="w-72 py-4 pl-4 pr-4 rounded-lg text-xl font-bold 
                        transition bg-[var(--color-b)] hover:bg-[var(--color-b-shadow)] hover:text-[var(--color-b)]
                         drop-shadow-[0_0_10px_#00FFFF] shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleMandrakeContinue}
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        )}

        {/* --- BADGER Mission baum.... --- */}
        {missionType === "badger" && missionPhase === "show" && (
          <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50 select-none">
            <div className="relative w-[700px] h-[750px] flex flex-col items-center justify-end">
              <img
                src={TREE_IMG}
                alt="Baum"
                className="absolute top-0 w-[500px] h-[550px] pointer-events-none transition-opacity duration-[1200ms]"
                style={{
                  opacity: treeOpacity,
                }}
                draggable={false}
              />
              {badgerShow && (
                <img
                  src={BADGER_IMG}
                  alt="Dachs"
                  className="absolute"
                  style={{
                    left: "50%",
                    bottom: 160,
                    transform: `translateX(-50%) scale(${badgerScale})`,
                    opacity: badgerOpacity,
                    transition: "transform 0.8s, opacity 1.1s",
                    zIndex: 20,
                    width: "90px",
                    height: "90px",
                  }}
                  draggable={false}
                />
              )}
              {badgerPhase === "spell" && badgerSpellActive && (
                <div className="absolute left-1/2 bottom-12 -translate-x-1/2 flex flex-row gap-7 z-40">
                  <button
                    className="w-72 py-4 pl-4 pr-4 rounded-lg text-xl font-bold 
                        transition bg-[var(--color-b)] hover:bg-[var(--color-b-shadow)] hover:text-[var(--color-b)]
                         drop-shadow-[0_0_10px_#00FFFF] shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleBadgerSpellClick("Accio")}
                  >
                    Accio
                  </button>
                  <button
                    className="w-72 py-4 pl-4 pr-4 rounded-lg text-xl font-bold 
                        transition bg-[var(--color-b)] hover:bg-[var(--color-b-shadow)] hover:text-[var(--color-b)]
                         drop-shadow-[0_0_10px_#00FFFF] shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleBadgerSpellClick("Avada Kedavra")}
                  >
                    Avada Kedavra
                  </button>
                  <button
                    className="w-72 py-4 pl-4 pr-4 rounded-lg text-xl font-bold 
                        transition bg-[var(--color-b)] hover:bg-[var(--color-b-shadow)] hover:text-[var(--color-b)]
                         drop-shadow-[0_0_10px_#00FFFF] shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleBadgerSpellClick("Wingardium Leviosa")}
                  >
                    Wingardium Leviosa
                  </button>
                </div>
              )}
              {(badgerPhase === "success" || badgerPhase === "fail") && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/80 transition-all">
                  <div className="text-4xl font-extrabold mb-9 text-white text-center">
                    {badgerPhase === "success" ? (
                      <>
                        Well done!
                        <br />
                        You are friends now
                      </>
                    ) : (
                      "Game Over"
                    )}
                  </div>
                  {showBadgerContinue && (
                    <button
                      className="w-72 py-4 px-4 rounded-lg text-xl font-bold bg-[var(--color-b)] 
                      hover:bg-[var(--color-b-shadow)] hover:text-[var(--color-b)] drop-shadow-[0_0_10px_#00FFFF] shadow-lg text-white 
                      disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() =>
                        onComplete &&
                        onComplete(
                          badgerPhase === "success" ? "success" : "fail"
                        )
                      }
                    >
                      Continue
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
