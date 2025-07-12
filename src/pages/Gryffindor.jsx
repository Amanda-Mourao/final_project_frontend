import { useState, useEffect } from "react";
import { AllGamesGryffindor } from "../components/AllGamesGryffindor.jsx";
import { PageTransition } from "../components/PageTransition";
import {
  getMe,
  getUserProgress,
  updateUserProgress,
  initUserProgress,
} from "../utils/api";

const ARROW_IMG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751037480/arrow_ygrkzv.webp";

const GRYFFINDOR_ROOM =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751385661/Gryffindor-Haus_jza0mf.png";

const STAIRS_PARTS = [
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751459137/ende_treppen_1_inrlsz.png",
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751459149/mitte_links_treppe_1_jxuorj.png",
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751459213/mitte_rechts_treppe_1_sj14dy.png",
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751459191/start_treppen_2_unf6l5.png",
];

const STAIRS_WHOLE =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751455883/craiyon_133114_image_zkh5jc.png";

const ARTEFACT_PNG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1752156220/craiyon_160333_image_vkk0hm.png";

const Award_PNG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1752227885/craiyon_115759_image_anyrf2.png";

const ARROWS = [
  { dir: "up", tw: "rotate-0" },
  { dir: "right", tw: "rotate-90" },
  { dir: "down", tw: "rotate-180" },
  { dir: "left", tw: "-rotate-90" },
];

const getRandomSequence = () => {
  const shuffled = [...ARROWS].sort(() => Math.random() - 0.5);
  return shuffled;
};

const GryffindorFeedbackScreen = ({ correct, onContinue }) => {
  const [animPhase, setAnimPhase] = useState(0);
  useEffect(() => {
    if (correct) return;
    if (animPhase < 3) {
      const timeout = setTimeout(
        () => setAnimPhase((p) => p + 1),
        animPhase === 0 ? 700 : 1800
      );
      return () => clearTimeout(timeout);
    }
  }, [correct, animPhase]);
  const getStairPartStyle = (idx) => {
    if (correct) return "";
    const keyframes = [
      [
        "translate-x-0 translate-y-0 rotate-0 scale-100 opacity-100",
        "translate-x-0 translate-y-0 rotate-0 scale-100 opacity-100",
        "translate-x-0 translate-y-0 rotate-0 scale-100 opacity-100",
        "translate-x-0 translate-y-0 rotate-0 scale-100 opacity-100",
      ],
      [
        "translate-x-[-40px] translate-y-[-10px] rotate-[-6deg] scale-110 opacity-90",
        "translate-x-[-60px] translate-y-[40px] rotate-[-18deg] scale-110 opacity-80",
        "translate-x-[55px] translate-y-[30px] rotate-[17deg] scale-110 opacity-80",
        "translate-x-[35px] translate-y-[65px] rotate-[9deg] scale-115 opacity-85",
      ],
      [
        "translate-x-[-120px] translate-y-[-100px] rotate-[-32deg] scale-125 opacity-0",
        "translate-x-[-140px] translate-y-[100px] rotate-[-38deg] scale-120 opacity-0",
        "translate-x-[135px] translate-y-[90px] rotate-[37deg] scale-120 opacity-0",
        "translate-x-[130px] translate-y-[160px] rotate-[26deg] scale-125 opacity-0",
      ],
    ];
    let cls = "";
    if (animPhase === 0) cls = keyframes[0][idx];
    if (animPhase === 1) cls = keyframes[1][idx];
    if (animPhase >= 2) cls = keyframes[2][idx];
    return cls;
  };
  return (
    <div className=" bg-opacity-70 rounded-xl p-6  shadow-lg flex flex-col items-center w-full max-w-md min-h-[320px] justify-center relative">
      <div className="flex flex-col items-center justify-center w-full min-h-[100px] relative transition-all">
        {correct ? (
          <img
            src={STAIRS_WHOLE}
            alt="Golden stairs"
            draggable="false"
            className="w-[200px] h-auto mx-auto mb-6 transition-all duration-700"
          />
        ) : (
          <div className="relative w-[240px] h-[240px] mx-auto mb-4 flex flex-col items-center">
            <div className="flex flex-row justify-center items-end w-full mb-[-16px] z-10">
              <img
                src={STAIRS_PARTS[0]}
                alt="Stair part 1"
                draggable="false"
                className={`w-[160px] z-13 h-auto absolute left-0 -translate-x-1/2 top-[-12px] transition-all duration-[1700ms] ${getStairPartStyle(
                  0
                )}`}
              />
            </div>
            <div className="flex flex-row justify-center items-end w-full relative mb-[-12px] mt-[64px] z-9">
              <img
                src={STAIRS_PARTS[1]}
                alt="Stair part 2"
                draggable="false"
                className={`w-[70px] z-12 h-auto transition-all duration-[1700ms] ${getStairPartStyle(
                  1
                )}`}
              />
              <img
                src={STAIRS_PARTS[2]}
                alt="Stair part 3"
                draggable="false"
                className={`w-[90px] z-11 h-auto transition-all duration-[1700ms] ${getStairPartStyle(
                  2
                )}`}
              />
            </div>
            <div className="flex flex-row justify-center items-end w-full mt-[98px] z-8">
              <img
                src={STAIRS_PARTS[3]}
                alt="Stair part 4"
                draggable="false"
                className={`w-[140px] z-10 h-auto absolute left-4 -translate-x-1/2 top-[158px] transition-all duration-[1700ms] ${getStairPartStyle(
                  3
                )}`}
              />
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br blur-xl opacity-70"></div>
          </div>
        )}
      </div>
      <div className="text-lg mb-4 font-extrabold tracking-widest uppercase text-center text-text">
        {correct
          ? "Well done, you found the right way!"
          : "You tried the wrong way."}
      </div>
      <button
        type="button"
        className="relative group active:scale-95 text-[var(--color-text)] font-bold text-base px-5 py-2 rounded-xl shadow-md border-2 border-[var(--color-text)] 
                  transition-all duration-150 uppercase tracking-widest overflow-hidden"
        onClick={onContinue}
        autoFocus
      >
        <span className="absolute inset-0 rounded-xl blur-sm bg-[var(--color-text)] opacity-0 group-hover:opacity-30 transition duration-300 animate-pulse" />
        <span className="relative z-10 tracking-widest">Continue</span>
      </button>
    </div>
  );
};

const ArtefactModal = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center backdrop-blur-[2px]">
      <div
        className="bg-[var(--color-b)] drop-shadow-[0_0_10px_#00FFFF] shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed 
                     transition-opacity duration-700 rounded-2xl p-8 flex flex-col items-center relative max-w-xl w-full"
      >
        <h2 className="text-2xl font-bold text-center mb-4 text-text">
          You won a magical artefact!
        </h2>
        <img
          src={ARTEFACT_PNG}
          alt="Magical Artefact"
          className="w-40 h-40 object-contain mb-4"
        />
        <p className="text-xl font-bold text-center mb-4 text-text">
          Sword of Gryffindor
        </p>
        <button
          onClick={onClose}
          className="p-3 hover:shadow-[0_0_10px_#00FFFF] rounded bg-[var(--color-b-shadow)] text-[var(--color-b)] hover:drop-shadow-lg transition hover:text-white hover:bg-white/20"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export const Gryffindor = () => {
  const [step, setStep] = useState(0);
  const [round, setRound] = useState(1);
  const [sequence, setSequence] = useState(getRandomSequence());
  const [showArrows, setShowArrows] = useState(true);
  const [input, setInput] = useState([]);
  const [results, setResults] = useState([]);
  const [timer, setTimer] = useState(5);

  const [showArrowFeedback, setShowArrowFeedback] = useState(false);
  const [arrowFeedbackCorrect, setArrowFeedbackCorrect] = useState(false);

  const [doorResult, setDoorResult] = useState(null);
  const [dogResult, setDogResult] = useState(null);
  const [stoneResult, setStoneResult] = useState(null);
  const [showDog, setShowDog] = useState(false);

  const [showDoneButton, setShowDoneButton] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // --- UserProgress Laden ---
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        const me = await getMe();
        setUser(me.user);
        // UserProgress laden oder initialisieren
        try {
          const prog = await getUserProgress(me.user._id || me.user.id);
          setProgress(prog.data);
        } catch (e) {
          await initUserProgress(me.user._id || me.user.id);
          const prog = await getUserProgress(me.user._id || me.user.id);
          setProgress(prog.data);
        }
      } catch (err) {}
    };
    fetchUserProgress();
  }, []);

  useEffect(() => {
    setShowDoneButton(false);
    if (step === 1 && input.length === 4) {
      setShowDoneButton(true);
    }
  }, [input, step]);

  useEffect(() => {
    if (round > 3 && step === 2) {
      setTimeout(() => setStep(100), 300);
    }
  }, [round, step]);

  useEffect(() => {
    if (step === 0 && showArrows) {
      const countdown = setInterval(() => setTimer((t) => t - 1), 1000);
      const timeout = setTimeout(() => {
        setShowArrows(false);
        setStep(1);
        setTimer(4);
        clearInterval(countdown);
      }, 3000);
      return () => {
        clearInterval(countdown);
        clearTimeout(timeout);
      };
    }
  }, [step, showArrows]);

  const handleArrowClick = (dir) => {
    const idx = input.indexOf(dir);
    if (idx !== -1) {
      setInput(input.filter((d, i) => i !== idx));
    } else if (input.length < 4) {
      setInput([...input, dir]);
    }
  };

  const handleMap = async () => {
    if (!user) {
      window.location.href = "/map";
      return;
    }
    setSaving(true);
    try {
      // Score berechnen
      const getArrowPoints = (correct) => (correct ? 10 : 0);
      const getMissionPoints = (correct) => (correct ? 5 : -5);
      const arrowPointsArr = results.map(getArrowPoints);
      const doorPoints = doorResult !== null ? getMissionPoints(doorResult) : 0;
      const dogPoints = dogResult !== null ? getMissionPoints(dogResult) : 0;
      const stonePoints =
        stoneResult !== null ? getMissionPoints(stoneResult) : 0;
      const total = [
        ...arrowPointsArr,
        doorPoints,
        dogPoints,
        stonePoints,
      ].reduce((a, b) => a + b, 0);

      // Haus-Objekt finden
      let newHouses = [];
      if (progress && progress.houses) {
        newHouses = progress.houses.map((house) =>
          house.houseName === "Gryffindor"
            ? {
                ...house,
                isCompleted: true,
                completedAt: new Date(),
                score: total,
              }
            : house
        );
      }

      const updateData = {
        houses: newHouses,
        pointsGryffindor: total,
      };

      const userId = user?._id || user?.id;
      await updateUserProgress(userId, updateData);
    } catch (e) {
      alert("Error while saving your progress.");
    }
    setSaving(false);
    window.location.href = "/map";
  };

  const getArrowPoints = (correct) => (correct ? 10 : 0);
  const getMissionPoints = (correct) => (correct ? 5 : -5);
  const arrowPointsArr = results.map(getArrowPoints);
  const doorPoints = doorResult !== null ? getMissionPoints(doorResult) : 0;
  const dogPoints = dogResult !== null ? getMissionPoints(dogResult) : 0;
  const stonePoints = stoneResult !== null ? getMissionPoints(stoneResult) : 0;
  const total = [...arrowPointsArr, doorPoints, dogPoints, stonePoints].reduce(
    (a, b) => a + b,
    0
  );

  const missionProps = {
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
    sequence,
    input,
    results,
    showDoneButton,
    setShowDoneButton,
  };

  const handleArrowFeedbackContinue = () => {
    setShowArrowFeedback(false);
    setInput([]);
    setSequence(getRandomSequence());
    setShowArrows(true);
    setTimer(5);

    if (round === 1) {
      setStep("mission");
    } else if (round === 2) {
      setStep(99);
    } else if (round === 3) {
      setStep("mission");
    }
  };

  return (
    <div>
      <PageTransition />
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
        style={
          !showDog && step !== "mission"
            ? { backgroundImage: `url('${GRYFFINDOR_ROOM}')` }
            : { background: "#000" }
        }
      >
        <div
          className="bg-[var(--color-b)] rounded-xl p-8 shadow-lg flex flex-col 
                    items-center w-full max-w-2xl relative"
        >
          {step === 3 ? (
            <>
              <button
                onClick={() => setShowModal(true)}
                className="absolute top-[-4rem] right-[-2.5rem] zooming-wappe z-10 transition hover:scale-110 hover:opacity-100 opacity-90 hover:drop-shadow-[0_0_18px_#b48534]"
                aria-label="Show Artefact Modal"
              >
                <img
                  src={Award_PNG}
                  loop
                  autoplay
                  className="w-35 h-35 drop-shadow-[0_0_12px_#facd6c] pointer-events-none"
                />
              </button>
              <h2 className="text-4xl font-extrabold mb-8 text-text text-shadow-lg tracking-widest uppercase">
                Final Score
              </h2>
              <div className="flex flex-col md:flex-row w-full gap-8 justify-center mb-8">
                <div className="flex-1">
                  <table className="w-full table-auto border-collapse text-lg rounded shadow">
                    <thead>
                      <tr>
                        <th className="border-b-2 text-text px-4 py-2 opacity-100 text-left">
                          Round
                        </th>
                        <th className="border-b-2 px-4 text-text py-2 text-left">
                          Points
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((correct, idx) => (
                        <tr key={`arrow${idx}`}>
                          <td className="border-b px-4 py-2">
                            Round {idx + 1}
                          </td>
                          <td className="border-b px-4 py-2 font-bold">
                            {getArrowPoints(correct)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex-1">
                  <table className="w-full table-auto border-collapse text-lg rounded shadow">
                    <thead>
                      <tr>
                        <th className="border-b-2 px-4 py-2 text-left">
                          Mission
                        </th>
                        <th className="border-b-2 px-4 py-2 text-left">
                          Points
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border-b px-4 py-2">Open the door</td>
                        <td className="border-b px-4 py-2 font-bold">
                          {doorResult !== null ? doorPoints : "-"}
                        </td>
                      </tr>
                      <tr>
                        <td className="border-b px-4 py-2">Calm the dog</td>
                        <td className="border-b px-4 py-2 font-bold">
                          {dogResult !== null ? dogPoints : "-"}
                        </td>
                      </tr>
                      <tr>
                        <td className="border-b px-4 py-2">Move the stone</td>
                        <td className="border-b px-4 py-2 font-bold">
                          {stoneResult !== null ? stonePoints : "-"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <ArtefactModal
                open={showModal}
                onClose={() => setShowModal(false)}
              />
              <div
                className="mt-4 mb-8 text-2xl font-extrabold bg-black opacity-90 p-4 rounded-xl 
                          drop-shadow-[0_3px_20x_black] text-text text-center"
              >
                Total score: <span className=" text-text">{total}</span>
              </div>
              <button
                onClick={handleMap}
                disabled={saving}
                className="relative group  active:scale-95 text-[var(--color-text)] 
                          font-bold text-lg px-6 py-3 rounded-xl shadow-md border-2 border-[var(--color-text)]
                          transition-all duration-150 uppercase tracking-widest overflow-hidden"
              >
                <span
                  className="absolute inset-0 rounded-xl blur-sm bg-[var(--color-text)] 
                            opacity-0 group-hover:opacity-30 transition duration-300 animate-pulse"
                />
                <span className="relative z-10">
                  {saving ? "Saving..." : "Back to the map"}
                </span>
              </button>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-text mb-6">
                Gryffindor – Round {round > 3 ? 3 : round}/3
              </h1>
              {showArrowFeedback && (
                <GryffindorFeedbackScreen
                  correct={arrowFeedbackCorrect}
                  onContinue={handleArrowFeedbackContinue}
                />
              )}
              {!showArrowFeedback && (
                <>
                  {step === 0 && showArrows && (
                    <>
                      <p className="text-2xl mb-8 text-center">
                        Remember the following order!
                        <br />
                        <span className="text-lg text-text">
                          The arrows will disappear in{" "}
                          <span className="text-[var(--color-attention)] text-2xl font-bold">
                            {timer}
                          </span>{" "}
                          seconds.
                        </span>
                      </p>
                      <div className="flex flex-row justify-center items-center gap-6 w-full">
                        {sequence.map((arrow, idx) => (
                          <span
                            key={idx}
                            className="flex-1 m-2 px-4 py-2 rounded bg-[var(--color-b)] shadow transition flex
                                      items-center justify-center min-w-[96px] min-h-[96px] max-w-[140px] max-h-[140px]"
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
                              className="flex-1 m-2 px-4 py-2 rounded bg-[var(--color-b)]  
                                        shadow transition flex items-center justify-center min-w-[96px] 
                                        min-h-[96px] max-w-[140px] max-h-[140px]"
                            >
                              <img
                                src={ARROW_IMG}
                                alt={arrow?.dir}
                                className={`w-28 h-28 object-contain ${arrow?.tw}`}
                              />
                            </span>
                          );
                        })}

                        {Array.from({ length: 4 - input.length }).map(
                          (_, idx) => (
                            <span
                              key={`empty-${idx}`}
                              className="flex-1 m-2 px-4 py-2 rounded bg-[var(--color-b)] shadow 
                                        min-w-[96px] min-h-[96px] max-w-[140px] max-h-[140px]"
                            ></span>
                          )
                        )}
                      </div>
                      <div className="flex justify-center flex-wrap mb-6 ">
                        {ARROWS.map((arrow) => {
                          const isSelected = input.includes(arrow.dir);
                          return (
                            <button
                              key={arrow.dir}
                              className={`m-2 px-4 py-2 rounded bg-[var(--color-b)] shadow transition
                                        disabled:opacity-40 flex items-center justify-center
                                        hover:scale-105 hover:-translate-y-3 hover:shadow-2xl
                                        ${
                                          isSelected
                                            ? "ring-1 ring-text scale-95"
                                            : ""
                                        }`}
                              onClick={() => handleArrowClick(arrow.dir)}
                              disabled={input.length >= 4 && !isSelected}
                              aria-pressed={isSelected}
                            >
                              <img
                                src={ARROW_IMG}
                                alt={arrow.dir}
                                className={`w-24 h-24 object-contain ${arrow.tw}`}
                              />
                            </button>
                          );
                        })}
                      </div>

                      {showDoneButton && (
                        <button
                          onClick={() => {
                            setShowDoneButton(false);
                            const correct =
                              input.join(",") ===
                              sequence.map((a) => a.dir).join(",");
                            setResults((prev) => [...prev, correct]);
                            setArrowFeedbackCorrect(correct);
                            setShowArrowFeedback(true);
                          }}
                          className="relative group  active:scale-95 text-[var(--color-text)] 
                                    font-bold text-lg px-6 py-3 rounded-xl shadow-md border-2 border-[var(--color-text)] 
                                    transition-all duration-150 uppercase tracking-widest overflow-hidden"
                        >
                          <span
                            className="absolute inset-0 rounded-xl blur-sm bg-[var(--color-text)] opacity-0 
                                      group-hover:opacity-30 transition duration-300 animate-pulse"
                          />
                          <span className="relative z-10">Done</span>
                        </button>
                      )}
                    </>
                  )}
                  <AllGamesGryffindor {...missionProps} />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
