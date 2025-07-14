import { useState, useRef, useEffect } from "react";
import { AllGamesHufflepuff } from "../components/AllGamesHufflepuff";
import {
  getMe,
  getUserProgress,
  updateUserProgress,
  initUserProgress,
} from "../utils/api";
import { useNavigate } from "react-router-dom";

const PLANTS = [
  {
    name: "Mimbulus Mimbletonia",
    img: "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751809484/Pflanze-2_un4mbe.png",
    needs: ["water", "fertilizer", "weed"],
    lifeDrain: 0.4,
  },
  {
    name: "Devil's Snare",
    img: "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751809483/Pflanze-4_wt0osl.png",
    needs: ["pest", "water", "fertilizer"],
    lifeDrain: 0.5,
  },
  {
    name: "Wolfsbane",
    img: "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751809483/Pflanze-3_avlcyv.png",
    needs: ["weed", "fertilizer", "pest"],
    lifeDrain: 0.5,
  },
  {
    name: "Snargaluff",
    img: "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751809487/Pflanze-1_laatdy.png",
    needs: ["pest", "weed", "water"],
    lifeDrain: 0.4,
  },
  {
    name: "Venomous Tentacula",
    img: "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751893946/ChatGPT_Image_7._Juli_2025_15_12_18_hmoews.png",
    needs: ["fertilizer", "pest", "water"],
    lifeDrain: 0.6,
  },
];

const TOOLS = [
  {
    key: "water",
    name: "Watering Can",
    img: "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751814393/Neues_Projekt_8_c0qnjz.png",
  },
  {
    key: "weed",
    name: "Weeding Tool",
    img: "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751814393/Neues_Projekt_10_zqfpqq.png",
  },
  {
    key: "pest",
    name: "Pest Spray",
    img: "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751814393/Neues_Projekt_11_yt5mkv.png",
  },
  {
    key: "fertilizer",
    name: "Fertilizer",
    img: "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751814393/Neues_Projekt_9_quu4ca.png",
  },
];

const BACKGROUND_IMG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751565332/Huffelpuf-haus_cse36l.png";

const ROUNDS = 3;

const PLANT_LIFE_START = 100;

const PLANTS_SUCCESS_IMG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751896637/Pflanze-1_laatdy_2_ru5mjz.png";

const PLANTS_FAIL_IMG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751896768/ChatGPT_Image_7._Juli_2025_15_59_12_rynzma.png";

const Award_PNG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1752227885/craiyon_115759_image_anyrf2.png";

const ARTEFACT_PNG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1752156480/craiyon_160752_image_r9xahv.png";

const FLOW = [
  "plants1",
  "feedback1",
  "puffskein",
  "plants2",
  "feedback2",
  "repot",
  "plants3",
  "feedback3",
  "badger",
  "score",
];
const MISSION_LABELS = [
  "Help The Puffskein",
  "Plant The Mandrake",
  "Befriend The Badger",
];

const shuffle = (arr) => {
  return [...arr].sort(() => Math.random() - 0.5);
};
const makePlants = () => {
  return PLANTS.map((p) => ({
    ...p,
    needs: shuffle(p.needs),
    currentNeed: 0,
    life: PLANT_LIFE_START,
    withered: false,
    finished: false,
  }));
};
const getLifeBarColor = (life) => {
  if (life > 60) return "bg-green-400";
  if (life > 30) return "bg-yellow-300";
  return "bg-red-500";
};

const ArtefactModal = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center [backdrop-filter:blur(2px)]">
      <div
        className="bg-[var(--color-b)] drop-shadow-[0_0_10px_#00FFFF] shadow-lg text-white 
      disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-700 rounded-2xl p-8 flex flex-col items-center 
      relative max-w-xl w-full"
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
          Helga Hufflepuff’s Cup
        </p>
        <button
          onClick={onClose}
          className="p-3 hover:shadow-[0_0_10px_#00FFFF] rounded bg-[var(--color-b-shadow)] text-[var(--color-b)]
           hover:drop-shadow-lg transition hover:text-white hover:bg-white/20"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export const Hufflepuff = () => {
  const [step, setStep] = useState(0);
  const [plants, setPlants] = useState(makePlants());
  const [plantsReady, setPlantsReady] = useState(true);
  const [draggedTool, setDraggedTool] = useState(null);
  const [points, setPoints] = useState([]);
  const [missionResults, setMissionResults] = useState([]);
  const [plantRoundResult, setPlantRoundResult] = useState(null);
  const intervals = useRef([]);
  const [showModal, setShowModal] = useState(false);
  const [fade, setFade] = useState(false);
  const [showFail, setShowFail] = useState(false);

  // User-Progress
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  // Lade UserProgress
  useEffect(() => {
    async function fetchUserProgress() {
      try {
        const me = await getMe();
        setUser(me.user);
        try {
          const prog = await getUserProgress(me.user._id || me.user.id);
          setProgress(prog.data);
        } catch (e) {
          await initUserProgress(me.user._id || me.user.id);
          const prog = await getUserProgress(me.user._id || me.user.id);
          setProgress(prog.data);
        }
      } catch (err) {}
    }
    fetchUserProgress();
  }, []);

  const getCurrentPlantRound = () => {
    if (FLOW[step] === "plants1" || FLOW[step] === "feedback1") return 1;
    if (FLOW[step] === "plants2" || FLOW[step] === "feedback2") return 2;
    if (FLOW[step] === "plants3" || FLOW[step] === "feedback3") return 3;
    return null;
  };

  useEffect(() => {
    if (!FLOW[step]?.startsWith("plants") || !plantsReady) return;
    intervals.current.forEach(clearInterval);
    intervals.current = plants.map((plant, idx) =>
      setInterval(() => {
        setPlants((old) => {
          if (old[idx].withered || old[idx].finished) return old;
          const newLife = Math.max(0, old[idx].life - old[idx].lifeDrain);
          if (newLife === 0)
            return old.map((p, j) =>
              j === idx ? { ...p, life: 0, withered: true } : p
            );
          return old.map((p, j) => (j === idx ? { ...p, life: newLife } : p));
        });
      }, 100)
    );
    return () => intervals.current.forEach(clearInterval);
  }, [plants, step, plantsReady]);

  useEffect(() => {
    if (!FLOW[step]?.startsWith("plants") || !plantsReady) return;
    if (plantRoundResult !== null) return;
    if (plants.every((p) => p.finished || p.withered)) {
      let roundSuccess = plants.every((p) => p.finished && !p.withered);
      let roundScore = roundSuccess ? 10 : 0;
      setTimeout(() => {
        setPoints((old) => [...old, roundScore]);
        setPlantRoundResult(roundSuccess ? "success" : "fail");
        setStep((s) => s + 1);
      }, 1000);
    }
  }, [plants, step, plantRoundResult, plantsReady]);

  useEffect(() => {
    if (
      FLOW[step] === "plants1" ||
      FLOW[step] === "plants2" ||
      FLOW[step] === "plants3"
    ) {
      setPlantsReady(false);
      setTimeout(() => {
        setPlants(makePlants());
        setPlantRoundResult(null);
        setPlantsReady(true);
      }, 0);
    }
  }, [step]);

  useEffect(() => {
    const isFeedbackStep =
      FLOW[step] === "feedback1" ||
      FLOW[step] === "feedback2" ||
      FLOW[step] === "feedback3";
    if (isFeedbackStep && plantRoundResult === "fail") {
      setFade(false);
      setShowFail(false);
      const fadeTimeout = setTimeout(() => {
        setFade(true);
        setShowFail(true);
      }, 50);
      return () => clearTimeout(fadeTimeout);
    } else {
      setFade(false);
      setShowFail(false);
    }
  }, [step, plantRoundResult]);

  const handleContinueFromFeedback = () => setStep((s) => s + 1);
  const handleDragStart = (toolKey) => setDraggedTool(toolKey);
  const handleDrop = (plantIdx) => {
    setPlants((old) =>
      old.map((p, i) => {
        if (
          i === plantIdx &&
          !p.withered &&
          !p.finished &&
          TOOLS.find((t) => t.key === draggedTool)?.key ===
            p.needs[p.currentNeed]
        ) {
          const nextNeed = p.currentNeed + 1;
          if (nextNeed >= p.needs.length)
            return { ...p, currentNeed: nextNeed, finished: true };
          return { ...p, currentNeed: nextNeed };
        }
        return p;
      })
    );
    setDraggedTool(null);
  };

  const handleMissionComplete = (result) => {
    const label =
      MISSION_LABELS[missionResults.length] ||
      `Mission ${missionResults.length + 1}`;
    const pointsForMission =
      result === "success" ? 5 : result === "fail" ? -5 : 0;
    setMissionResults((old) => [
      ...old,
      {
        label,
        result: result === "success" ? "Success" : "Failed",
        points: pointsForMission,
      },
    ]);
    setStep((s) => s + 1);
  };

  const totalScore =
    points.reduce((a, b) => a + b, 0) +
    missionResults.reduce((a, b) => a + b.points, 0);

  async function handleMap() {
    if (!user) {
      navigate("/map");
      return;
    }
    setSaving(true);
    try {
      let newHouses = [];
      if (progress && progress.houses) {
        newHouses = progress.houses.map((house) =>
          house.houseName === "Hufflepuff"
            ? {
                ...house,
                isCompleted: true,
                completedAt: new Date(),
                score: totalScore,
              }
            : house
        );
      }
      const updateData = { houses: newHouses, pointsHufflepuff: totalScore };
      const userId = user?._id || user?.id;
      await updateUserProgress(userId, updateData);
    } catch (e) {
      alert("Error saving your progress.");
    }
    setSaving(false);
    navigate("/map");
  }

  // Feedback screen
  const renderFeedbackScreen = () => {
    const round = getCurrentPlantRound();
    if (!round) return null;
    const isSuccess = plantRoundResult === "success";
    const renderPlantImage = () => {
      if (isSuccess) {
        return (
          <img
            src={PLANTS_SUCCESS_IMG}
            alt="Healthy Plants"
            className="w-80 h-80 object-contain"
          />
        );
      }
      return (
        <div className="relative w-80 h-80">
          <img
            src={PLANTS_FAIL_IMG}
            alt="Withered Plants"
            className={`absolute inset-0 w-80 h-80 object-contain transition-opacity duration-[1200ms] ${
              showFail ? "opacity-100" : "opacity-0"
            }`}
            style={{ zIndex: 1 }}
          />
          <img
            src={PLANTS_SUCCESS_IMG}
            alt="Healthy Plants"
            className={`absolute inset-0 w-80 h-80 object-contain transition-opacity duration-[1200ms] 
              [z-index:2] ${fade ? "opacity-0" : "opacity-100"}`}
          />
        </div>
      );
    };

    return (
      <div className="flex flex-col items-center justify-center w-full">
        <h1 className="text-3xl font-bold text-text uppercase">
          Hufflepuff – Round {round}/{ROUNDS}
        </h1>
        <div className="flex flex-row items-end justify-center gap-6 w-full">
          <div className="flex flex-col items-center justify-center rounded-xl shadow-lg">
            {renderPlantImage()}
            <span className="text-lg mb-4 font-extrabold tracking-widest uppercase text-center text-text">
              {isSuccess
                ? "Well done, you saved all plants."
                : "Oh no, you let them die."}
            </span>
          </div>
        </div>
        <button
          className="relative group active:scale-95 text-[var(--color-text)] 
          font-bold text-base px-5 py-2 rounded-xl shadow-md border-2 border-[var(--color-text)] transition-all duration-150
           uppercase tracking-widest overflow-hidden"
          onClick={handleContinueFromFeedback}
          autoFocus
        >
          <span
            className="absolute inset-0 rounded-xl blur-sm bg-[var(--color-text)] opacity-0 group-hover:opacity-30 
          transition duration-300 animate-pulse"
          />
          <span className="relative z-10">Continue</span>
        </button>
      </div>
    );
  };

  return (
    <div>
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url('${BACKGROUND_IMG}')` }}
      >
        <div className="bg-black/70 rounded-xl p-8 shadow-lg flex flex-col items-center w-full max-w-4xl relative">
          {FLOW[step] === "score" && (
            <button
              onClick={() => setShowModal(true)}
              className="absolute top-[-4rem] right-[-2.5rem]  zooming-wappe  z-10 transition hover:scale-110
               hover:opacity-100 opacity-90 hover:drop-shadow-[0_0_18px_#b48534]"
              aria-label="Show Artefact Modal"
            >
              <img
                src={Award_PNG}
                loop
                autoPlay
                className="w-35 h-35 drop-shadow-[0_0_12px_#facd6c] pointer-events-none"
              />
            </button>
          )}

          {FLOW[step].startsWith("plants") && plantsReady && (
            <>
              <h1 className="text-3xl font-bold text-text mb-4 uppercase">
                Hufflepuff – Round {getCurrentPlantRound()}/{ROUNDS}
              </h1>
              <p className="text-2xl text-text mb-8 text-center">
                Drag the required symbol to each plant to fulfill its needs.
              </p>
              <div className="flex flex-row items-end justify-center gap-6 w-full mb-10">
                {plants.map((plant, idx) => (
                  <div
                    key={plant.name}
                    className="relative flex flex-col items-center justify-end rounded-xl shadow-lg p-4 
                    bg-gradient-to-b from-yellow-900/70 to-black/60 w-[160px] h-[260px] border-1 transition-all duration-700"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(idx)}
                  >
                    <img
                      src={plant.img}
                      alt={plant.name}
                      className={`w-27 h-27 mb-2 object-contain transition-all duration-700 drop-shadow-lg ${
                        plant.withered ? "grayscale opacity-60" : ""
                      }`}
                    />
                    <div className="w-full h-2 bg-gray-900 rounded-lg mb-2 overflow-hidden">
                      <div
                        className={`h-4 transition-all duration-700 ${getLifeBarColor(
                          plant.life
                        )}`}
                        style={{ width: `${plant.life}%` }}
                      ></div>
                    </div>
                    {!plant.finished && !plant.withered && (
                      <div className="flex flex-col items-center mt-2">
                        <span className="text-xs text-text mb-1">Need:</span>
                        <img
                          src={
                            TOOLS.find(
                              (t) => t.key === plant.needs[plant.currentNeed]
                            )?.img
                          }
                          alt={plant.needs[plant.currentNeed]}
                          className="w-12 h-12 mb-1 object-contain"
                        />
                        <span className="text-xs text-text">
                          {
                            TOOLS.find(
                              (t) => t.key === plant.needs[plant.currentNeed]
                            )?.name
                          }
                        </span>
                      </div>
                    )}
                    {plant.finished && (
                      <span className="mt-2 text-text font-bold text-sm">
                        Done!
                      </span>
                    )}
                    {plant.withered && (
                      <span className="mt-2 text-text font-bold text-sm">
                        Withered!
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex flex-row gap-8 w-full justify-center mt-2">
                {TOOLS.map((tool) => (
                  <div
                    key={tool.key}
                    draggable
                    onDragStart={() => handleDragStart(tool.key)}
                    className="flex flex-col items-center cursor-grab active:scale-95"
                  >
                    <img
                      src={tool.img}
                      alt={tool.name}
                      className="w-14 object-contain h-14 mb-1 drop-shadow-lg"
                    />
                    <span className="text-xs text-yellow-200">{tool.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {(FLOW[step] === "feedback1" ||
            FLOW[step] === "feedback2" ||
            FLOW[step] === "feedback3") &&
            renderFeedbackScreen()}

          {FLOW[step] === "puffskein" && (
            <AllGamesHufflepuff
              missionType="puffskein"
              onComplete={handleMissionComplete}
            />
          )}
          {FLOW[step] === "repot" && (
            <AllGamesHufflepuff
              missionType="repot"
              onComplete={handleMissionComplete}
            />
          )}
          {FLOW[step] === "badger" && (
            <AllGamesHufflepuff
              missionType="badger"
              onComplete={handleMissionComplete}
            />
          )}

          {FLOW[step] === "score" && (
            <>
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
                      {points.map((pt, idx) => (
                        <tr key={idx}>
                          <td className="border-b px-4 py-2">
                            Round {idx + 1}
                          </td>
                          <td className="border-b px-4 py-2 font-bold">{pt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex-1">
                  <table className="w-full table-auto border-collapse text-lg rounded shadow">
                    <thead>
                      <tr>
                        <th className="border-b-2 px-4 py-2 text-left text-text">
                          Mission
                        </th>
                        <th className="border-b-2 px-4 py-2 text-left text-text">
                          Points
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {missionResults.map((m, idx) => (
                        <tr key={idx}>
                          <td className="border-b px-4 py-2">{m.label}</td>
                          <td className="border-b px-4 py-2 font-bold">
                            {m.points}
                          </td>
                        </tr>
                      ))}
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
               text-center drop-shadow-[0_3px_20x_black] text-text"
              >
                Total score: <span className="text-text">{totalScore}</span>
              </div>
              <button
                className="relative group active:scale-95 text-[var(--color-text)] font-bold text-lg 
                px-6 py-3 rounded-xl shadow-md border-2 border-[var(--color-text)] transition-all duration-150 uppercase
                 tracking-widest overflow-hidden"
                disabled={saving}
                onClick={handleMap}
              >
                <span
                  className="absolute inset-0 rounded-xl blur-sm bg-[var(--color-text)] opacity-0 
                group-hover:opacity-30 transition duration-300 animate-pulse"
                />
                <span className="relative z-10">
                  {saving ? "Saving..." : "Back to the map"}
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
