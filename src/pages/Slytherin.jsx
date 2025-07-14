import { useState, useEffect } from "react";
import { AllGamesSlytherin } from "../components/AllGamesSlytherin";
import { PageTransition } from "../components/PageTransition";
import {
  getMe,
  getUserProgress,
  updateUserProgress,
  initUserProgress,
} from "../utils/api";

// --- Bilder und Daten ---
const INGREDIENTS = [
  {
    name: "DRAGON BLOOD",
    closed:
      "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751396541/Potion-rot-mit_rwfkco.png",
    open: "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751396541/Potion-rot-ohne_rbbtfq.png",
    hint: "GIVES THE POTION STRENGTH.",
  },
  {
    name: "VEIL HERB",
    closed:
      "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751396541/Potion-green-mit_jvp9zs.png",
    open: "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751396541/Potion-green-ohne_pl1bdk.png",
    hint: "ADDS WIT TO THE POTION.",
  },
  {
    name: "MOONSTONE",
    closed:
      "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751396541/Potion-blue-mit_q3kedm.png",
    open: "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751396541/Potion-blue-ohne_ujfrwq.png",
    hint: "BRINGS CLARITY AND CALM.",
  },
  {
    name: "BASILISK SCALE",
    closed:
      "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751396542/Potion-lila-mit_vi3dxs.png",
    open: "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751396541/Potion-lila-ohne_sifqxi.png",
    hint: "GIVES THE POTION ASSERTIVENESS.",
  },
  {
    name: "MANDRAKE ROOT",
    closed:
      "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751446137/Potion-gelb-mit_abn8s1.png",
    open: "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751446137/Potion-gelb-ohne_ii1dts.png",
    hint: "BRINGS HIDDEN THOUGHTS TO LIFE.",
  },
];

const CORRECT_COMBOS = [
  [1, 2, 4], // Round 1
  [0, 2, 3], // Round 2
  [0, 2, 3], // Round 3
];

const POTIONS = [
  {
    name: "elixir of cunning",
    desc: "for cleverness, deception, and strategic thinking.",
  },
  {
    name: "essence of ambition",
    desc: "gives you perseverance and helps you overcome setbacks.",
  },
  {
    name: "serum of self-assertion",
    desc: "strengthens self-confidence and protects against manipulation and intimidation.",
  },
];

const MISSION_NAMES = [
  "Extinguish the fire",
  "Catch the snake",
  "Transform the frog",
];

const ARTEFACT_PNG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1752156792/craiyon_161305_image_g9r7fg.png";

const Award_PNG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1752227885/craiyon_115759_image_anyrf2.png";

// --- FEEDBACK-Screen ---
const FeedbackScreen = ({ correct, onContinue }) => {
  const CAULDRON_IMG =
    "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751451728/craiyon_122152_image_wcedsd.png";

  const SMOKE_IMAGES = [
    "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751451373/Rauch-Blau_wvcyh9.png",
    "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751451373/Rauch-gr%C3%BCn_euqba6.png",
    "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751451373/Rauch-lila_lew0yx.png",
    "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751451373/Rauch-rot_bcorzg.png",
  ];

  return (
    <div
      className="bg-[var(--color-b)] rounded-xl p-10 shadow-lg flex flex-col items-center w-full max-w-5xl 
    relative text-[var(--color-text)] min-h-[550px] justify-center"
    >
      <div className="relative flex flex-col items-center justify-center min-h-[360px]">
        <img
          src={CAULDRON_IMG}
          alt="cauldron"
          className="w-[320px] mt-12 z-1 drop-shadow-[0_10px_40px_#222b]"
          draggable="false"
        />
        {correct && (
          <div className="absolute left-1/2 bottom-55 w-[260px] h-[180px] -translate-x-1/2 pointer-events-none">
            {SMOKE_IMAGES.map((src, i) => (
              <img
                key={i}
                src={src}
                alt="Smoke"
                draggable="false"
                className={`absolute w-[60px] h-auto opacity-80 mix-blend-lighten pointer-events-none
                  ${i === 0 && "left-[80px] top-[30px] animate-smoke1"}
                  ${i === 1 && "left-[100px] top-[50px] animate-smoke2"}
                  ${i === 2 && "left-[70px] top-[50px] animate-smoke3"}
                  ${i === 3 && "left-[130px] top-[60px] animate-smoke4"}
                `}
              />
            ))}
          </div>
        )}
      </div>

      <div className="text-lg mb-4 font-extrabold tracking-widest uppercase text-center">
        {correct
          ? "Well done, you did it!"
          : "Nice try! You should practice your brewing skills."}
      </div>
      <button
        type="button"
        className="relative group active:scale-95 text-[var(--color-text)] 
          font-bold text-lg px-6 py-3 rounded-xl shadow-md border-2 border-[var(--color-text)] 
          transition-all duration-150 uppercase tracking-wide overflow-hidden"
        onClick={onContinue}
        autoFocus
      >
        <span
          className="absolute inset-0 rounded-xl blur-sm bg-[var(--color-text)] opacity-0 
            group-hover:opacity-30 transition duration-300 animate-pulse"
        />
        <span className="relative z-10 tracking-widest">continue</span>
      </button>
    </div>
  );
};

// --- Artefact Modal fenster ---
const ArtefactModal = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center backdrop-blur-[2px]">
      <div
        className="bg-[var(--color-b)] drop-shadow-[0_0_10px_#00FFFF] 
                  shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed 
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
          Slytherin’s Locket
        </p>
        <button
          onClick={onClose}
          className="p-3 hover:shadow-[0_0_10px_#00FFFF] rounded bg-[var(--color-b-shadow)] text-[var(--color-b)] hover:drop-shadow-lg 
          transition hover:text-white hover:bg-white/20 "
        >
          Close
        </button>
      </div>
    </div>
  );
};

// --- Hauptspiel ---
export const Slytherin = () => {
  const [step, setStep] = useState("main");
  const [currentRound, setCurrentRound] = useState(0);
  const [selected, setSelected] = useState([]);
  const [score, setScore] = useState([null, null, null]);
  const [lastCorrect, setLastCorrect] = useState(null);
  const [missionStep, setMissionStep] = useState(0);
  const [missionResults, setMissionResults] = useState([null, null, null]);
  const [showModal, setShowModal] = useState(false);

  // --- UserProgress ---
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Lade UserProgress
    const fetchUserProgress = async () => {
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
    };
    fetchUserProgress();
  }, []);

  const handleSelect = (idx) => {
    const isSelected = selected.includes(idx);
    if (isSelected) {
      setSelected(selected.filter((i) => i !== idx));
    } else if (selected.length < 3) {
      setSelected([...selected, idx]);
    }
  };

  const handleCheck = () => {
    const sorted = [...selected].sort();
    const correct = [...CORRECT_COMBOS[currentRound]].sort();
    const isCorrect =
      sorted.length === 3 &&
      sorted[0] === correct[0] &&
      sorted[1] === correct[1] &&
      sorted[2] === correct[2];
    setLastCorrect(isCorrect);
    setScore((prev) =>
      prev.map((val, idx) =>
        idx === currentRound ? (isCorrect ? 10 : 0) : val
      )
    );
    setStep("feedback");
    setSelected([]);
  };

  const handleContinueAfterFeedback = () => {
    if (currentRound < 2) {
      setStep("mission");
    } else {
      setStep("mission");
      setMissionStep(2);
      setCurrentRound(3);
    }
  };

  const handleMissionComplete = (success, missionIdx) => {
    setMissionResults((prev) => {
      const updated = [...prev];
      updated[missionIdx] = success;
      return updated;
    });
    setCurrentRound((prev) => prev + 1);
    setStep("main");
    setMissionStep((prev) => prev + 1);
  };

  const isDone = score.every((s) => s !== null) && currentRound >= 3;

  // Punkte Kalkulation
  const total =
    score.reduce((sum, s) => sum + (s || 0), 0) +
    (missionResults[0] === true ? 5 : missionResults[0] === false ? -5 : 0) +
    (missionResults[1] === true ? 5 : missionResults[1] === false ? -5 : 0) +
    (missionResults[2] === true ? 5 : missionResults[2] === false ? -5 : 0);

  // Speichern des Fortschritts in Mongo!
  const handleMap = async () => {
    if (!user) {
      window.location.href = "/map";
      return;
    }
    setSaving(true);
    try {
      // Score berechnen und UserProgress aktualisieren
      let newHouses = [];
      if (progress && progress.houses) {
        newHouses = progress.houses.map((house) =>
          house.houseName === "Slytherin"
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
        pointsSlytherin: total,
      };

      const userId = user?._id || user?.id;
      await updateUserProgress(userId, updateData);
    } catch (e) {
      alert("Error while saving your progress");
    }
    setSaving(false);
    window.location.href = "/map";
  };

  return (
    <div>
      <PageTransition />
      <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-[url('https://res.cloudinary.com/ddloaxsnx/image/upload/v1751389728/Slytherin-Haus_zwvojj.png')]">
        {/* --- Missionen --- */}
        {step === "mission" && missionStep < 3 ? (
          <AllGamesSlytherin
            step={["fire", "snake", "frog"][missionStep]}
            missionIdx={missionStep}
            onMissionComplete={handleMissionComplete}
          />
        ) : step === "feedback" ? (
          <FeedbackScreen
            correct={lastCorrect}
            onContinue={handleContinueAfterFeedback}
          />
        ) : !isDone && currentRound < 3 ? (
          <div className="bg-[var(--color-b)] rounded-xl p-10 shadow-lg flex flex-col items-center w-full max-w-5xl relative text-text">
            <h1 className="text-3xl font-bold text-text mb-6">
              slytherin – round {currentRound + 1}/3
            </h1>

            <div className="w-full flex flex-col items-center">
              <p className="text-2xl text-text text-center">
                {POTIONS[currentRound].name}
              </p>
              <p className="mb-8 text-[var(--color-attention)] tracking-widest uppercase text-center text-lg font-bold">
                {POTIONS[currentRound].desc}
              </p>
              {/* Potions */}
              <div className="flex flex-row justify-center items-end gap-10 w-full mb-8">
                {INGREDIENTS.map((ing, idx) => {
                  const isSelected = selected.includes(idx);
                  return (
                    <button
                      key={ing.name}
                      type="button"
                      onClick={() => handleSelect(idx)}
                      disabled={selected.length >= 3 && !isSelected}
                      aria-pressed={isSelected}
                      className={`
                      group flex flex-col items-center focus:outline-none transition-all duration-200
                      ${isSelected ? "scale-105" : ""}
                      relative
                    `}
                    >
                      <div className="w-28 h-28 mb-4 mt-4 relative flex items-center justify-center magic-glow-hover ">
                        <img
                          src={isSelected ? ing.open : ing.closed}
                          alt={ing.name}
                          className={`
                          w-full h-full object-contain
                          transition-all duration-500 ease-in-out
                        `}
                          draggable="false"
                        />
                      </div>
                      <span className="font-extrabold text-sm text-center text-[var(--color-text)] tracking-widest uppercase">
                        {ing.name}
                      </span>
                      <span className="text-[0.6rem] italic text-[var(--color-attention)] text-center block mt-1 tracking-widest uppercase">
                        {ing.hint}
                      </span>
                    </button>
                  );
                })}
              </div>
              {/* Done button */}
              <button
                className="relative group active:scale-95 text-[var(--color-text)] 
                font-bold text-lg px-6 py-3 rounded-xl shadow-md border-2 border-[var(--color-text)] 
                transition-all duration-150 uppercase tracking-widest overflow-hidden"
                onClick={handleCheck}
                disabled={selected.length !== 3}
              >
                <span
                  className="absolute inset-0 rounded-xl blur-sm bg-[var(--color-text)] opacity-0 
                group-hover:opacity-30 transition duration-300 animate-pulse"
                />
                <span className="relative z-10 tracking-widest">done</span>
              </button>
            </div>
          </div>
        ) : (
          // FINAL RESULT
          <div className="bg-[var(--color-b)] rounded-xl p-8 shadow-lg flex flex-col items-center w-full max-w-3xl relative">
            <button
              onClick={() => setShowModal(true)}
              className="absolute top-[-4rem] right-[-2.5rem] zooming-wappe z-10 transition hover:scale-110 hover:opacity-100 
              opacity-90 hover:drop-shadow-[0_0_18px_#b48534]"
              aria-label="Show Artefact Modal"
            >
              <img
                src={Award_PNG}
                loop
                autoPlay
                className="w-35 h-35 drop-shadow-[0_0_12px_#facd6c] pointer-events-none"
              />
            </button>
            <h2 className="text-4xl font-extrabold mb-8 text-text text-shadow-lg tracking-widest uppercase">
              final score
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
                    {score.map((val, idx) => (
                      <tr key={`slyth-round${idx}`}>
                        <td className="border-b px-4 py-2">Round {idx + 1}</td>
                        <td className="border-b px-4 py-2 font-bold">
                          {val === 10 ? 10 : 0}
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
                      <th className="border-b-2 px-4 py-2 text-left">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MISSION_NAMES.map((mission, idx) => (
                      <tr key={mission}>
                        <td className="border-b px-4 py-2">{mission}</td>
                        <td className="border-b px-4 py-2 font-bold">
                          {missionResults[idx] === true
                            ? 5
                            : missionResults[idx] === false
                            ? -5
                            : "-"}
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
              className="mt-4 mb-8 text-2xl font-extrabold bg-black opacity-90 p-4 rounded-xl text-center 
                drop-shadow-[0_3px_20x_black] text-text"
            >
              total score: <span className=" text-text">{total}</span>
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
                {saving ? "Saving..." : "back to the map"}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
