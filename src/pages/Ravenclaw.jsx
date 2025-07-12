import { useState, useEffect } from "react";
import { PageTransition } from "../components/PageTransition";
import { AllGamesRavenclaw } from "../components/AllGamesRavenclaw";
import {
  getMe,
  getUserProgress,
  updateUserProgress,
  initUserProgress,
} from "../utils/api";

//Bilder als Links Cloudinary
const RAVENCLAW_IMAGE =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751566510/ChatGPT_Image_3._Juli_2025_20_14_35_vm2sn9.png";
const KNIGHT_PNG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751975062/ChatGPT_Image_8._Juli_2025_13_34_40_cqhxsx_1_avlfgi.png";
const KNIGHT_DESTROYED_PNG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751975538/ChatGPT_Image_8._Juli_2025_13_34_40_cqhxsx_3_l54hiw.png";
const GUARDIAN_PNG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751975476/ChatGPT_Image_8._Juli_2025_13_34_40_cqhxsx_2_moxp6k.png";
const ARTEFACT_PNG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1752156963/ChatGPT_Image_10._Juli_2025_16_15_44_p2b6kb.png";
const Award_PNG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1752227885/craiyon_115759_image_anyrf2.png";

const BOARD_SIZE = 8;

const ROUNDS = [
  { knight: { x: 0, y: 0 }, guardian: { x: 3, y: 1 }, maxMoves: 3 },
  { knight: { x: 7, y: 0 }, guardian: { x: 3, y: 5 }, maxMoves: 3 },
  { knight: { x: 4, y: 7 }, guardian: { x: 1, y: 3 }, maxMoves: 3 },
];
const MISSION_LABELS = [
  "Mirror Word Challenge",
  "Spell Logic Puzzle",
  "Enchanted Riddle",
];

const FLOW = [
  "main1",
  "feedback1",
  "mission1",
  "main2",
  "feedback2",
  "mission2",
  "main3",
  "feedback3",
  "mission3",
  "score",
];

// --- Knight schach bewegung ---
function getKnightMoves(x, y) {
  const moves = [
    [1, 2],
    [2, 1],
    [2, -1],
    [1, -2],
    [-1, -2],
    [-2, -1],
    [-2, 1],
    [-1, 2],
  ];
  return moves
    .map(([dx, dy]) => ({ x: x + dx, y: y + dy }))
    .filter(({ x, y }) => x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE);
}

// Feedback
const RavenclawFeedbackScreen = ({ round, success, onContinue }) => {
  const [fade, setFade] = useState(false);
  const [explode, setExplode] = useState(false);

  useEffect(() => {
    if (!success) {
      setFade(false);
      setExplode(false);
      const fadeTimeout = setTimeout(() => setFade(true), 400);
      const explodeTimeout = setTimeout(() => setExplode(true), 900);
      return () => {
        clearTimeout(fadeTimeout);
        clearTimeout(explodeTimeout);
      };
    } else {
      setFade(false);
      setExplode(false);
    }
  }, [success, round]);

  const KNIGHT_SUCCESS_IMG = KNIGHT_PNG;
  const KNIGHT_FAIL_IMG = KNIGHT_DESTROYED_PNG;

  const renderKnightImage = () => {
    if (success) {
      return (
        <img
          src={KNIGHT_SUCCESS_IMG}
          alt="Knight"
          className="w-60 h-60 mb-4 object-contain"
        />
      );
    }
    return (
      <div className="relative w-60 h-60 mb-4">
        <div
          className={`absolute inset-0 rounded-full pointer-events-none transition-all duration-[800ms] [z-index:3] ${
            explode
              ? "opacity-80 scale-110 blur-md"
              : "opacity-0 scale-95 blur-0"
          }`}
        />
        <img
          src={KNIGHT_FAIL_IMG}
          alt="Knight destroyed"
          className={`absolute inset-0 w-60 h-60 object-contain transition-opacity duration-[1000ms] [z-index:2] ${
            explode ? "opacity-100" : "opacity-0"
          }`}
        />
        <img
          src={KNIGHT_SUCCESS_IMG}
          alt="Knight"
          className={`absolute inset-0 w-60 h-60 object-contain transition-opacity duration-[800ms] [z-index:1] ${
            fade
              ? "opacity-0 [filter:blur(2px)_grayscale(1)_brightness(0.8)] [transform:scale(0.92)_rotate(4deg)]"
              : "opacity-100 [filter:none] [transform:scale(1)]"
          }`}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <h1 className="text-3xl font-bold text-text uppercase">
        Ravenclaw – Round {round}/3
      </h1>
      <div className="flex flex-row items-end justify-center gap-6 w-full">
        <div className="flex flex-col items-center justify-center rounded-xl shadow-lg">
          {renderKnightImage()}
          <span className="text-lg mb-4 font-extrabold tracking-widest uppercase text-center text-text">
            {success
              ? "Well done, you defeated the guardian!"
              : "Oh no, you failed to defeat the guardian."}
          </span>
        </div>
      </div>

      <button
        className="relative group active:scale-95 text-[var(--color-text)] font-bold text-base
        px-5 py-2 rounded-xl shadow-md border-2 border-[var(--color-text)] transition-all duration-150 uppercase tracking-widest overflow-hidden"
        onClick={onContinue}
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

// --- Artefact Modal als Pop-up ---
const ArtefactModal = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center [backdrop-filter:blur(2px)]">
      <div
        className="bg-[var(--color-b)] drop-shadow-[0_0_10px_#00FFFF] shadow-lg text-white disabled:opacity-50 
      disabled:cursor-not-allowed transition-opacity duration-700 rounded-2xl p-8 flex flex-col items-center relative max-w-xl w-full"
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
          The Ravenclaw Diadem
        </p>
        <button
          onClick={onClose}
          className="p-3 hover:shadow-[0_0_10px_#00FFFF] rounded bg-[var(--color-b-shadow)] 
          text-[var(--color-b)] hover:drop-shadow-lg transition hover:text-white hover:bg-white/20 "
        >
          Close
        </button>
      </div>
    </div>
  );
};

export const Ravenclaw = () => {
  const [step, setStep] = useState(0);
  const [knightPos, setKnightPos] = useState(ROUNDS[0].knight);
  const [moves, setMoves] = useState(0);

  const [mainResults, setMainResults] = useState([]);
  const [missionResults, setMissionResults] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // User-Progress-States
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [saving, setSaving] = useState(false);

  const currentRoundIdx =
    FLOW[step] === "main1"
      ? 0
      : FLOW[step] === "main2"
      ? 1
      : FLOW[step] === "main3"
      ? 2
      : null;

  const currentRound =
    typeof currentRoundIdx === "number" ? ROUNDS[currentRoundIdx] : null;

  const getMainPoints = (correct) => (correct ? 10 : 0);
  const totalScore =
    mainResults.reduce((sum, v) => sum + getMainPoints(v), 0) +
    missionResults.reduce((a, b) => a + b.points, 0);

  // --- User Progress laden ---
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

  useEffect(() => {
    if (typeof currentRoundIdx === "number") {
      setKnightPos(ROUNDS[currentRoundIdx].knight);
      setMoves(0);
    }
  }, [currentRoundIdx]);

  // --- Das Hauptspiel Spielfeld ---
  const handleSquareClick = (x, y) => {
    if (!currentRound) return;
    const legal = getKnightMoves(knightPos.x, knightPos.y).some(
      (m) => m.x === x && m.y === y
    );
    if (!legal) return;
    const newMoves = moves + 1;
    setKnightPos({ x, y });
    setMoves(newMoves);
    if (x === currentRound.guardian.x && y === currentRound.guardian.y) {
      setMainResults((prev) => [...prev, true]);
      setStep((s) => s + 1);
    } else if (newMoves >= currentRound.maxMoves) {
      setMainResults((prev) => [...prev, false]);
      setStep((s) => s + 1);
    }
  };

  // Missionen abgeschlossen-----
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

  // Fortschritt müssen hier speichern
  async function handleMap() {
    if (!user) {
      window.location.href = "/map";
      return;
    }
    setSaving(true);
    try {
      let newHouses = [];
      if (progress && progress.houses) {
        newHouses = progress.houses.map((house) =>
          house.houseName === "Ravenclaw"
            ? {
                ...house,
                isCompleted: true,
                completedAt: new Date(),
                score: totalScore,
              }
            : house
        );
      }
      const updateData = { houses: newHouses, pointsRavenclaw: totalScore };
      const userId = user?._id || user?.id;
      await updateUserProgress(userId, updateData);
    } catch (e) {
      alert("Error saving your progress.");
    }
    setSaving(false);
    window.location.href = "/map";
  }

  // Feedback-Screen
  const renderFeedbackScreen = () => {
    const round =
      FLOW[step] === "feedback1"
        ? 1
        : FLOW[step] === "feedback2"
        ? 2
        : FLOW[step] === "feedback3"
        ? 3
        : null;
    if (!round) return null;
    const result = mainResults[round - 1];
    return (
      <RavenclawFeedbackScreen
        round={round}
        success={!!result}
        onContinue={() => setStep((s) => s + 1)}
      />
    );
  };

  return (
    <div>
      <PageTransition />
      <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center">
        <img
          src={RAVENCLAW_IMAGE}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover brightness-70 z-0 pointer-events-none select-none"
        />
        <div className="bg-[var(--color-b)] rounded-xl p-8 shadow-lg flex flex-col items-center w-full max-w-4xl relative">
          {/* Hauptspiel */}
          {FLOW[step]?.startsWith("main") && currentRound && (
            <>
              <h1 className="text-3xl font-bold text-text mb-2">
                Ravenclaw – Round {currentRoundIdx + 1}/{ROUNDS.length}
              </h1>
              <div className="text-lg font-semibold text-text mb-4">
                Defeat the guardian in {currentRound.maxMoves} moves!
              </div>
              <div className="grid grid-cols-8 mb-6 border-2 rounded-sm">
                {[...Array(BOARD_SIZE)].map((_, row) =>
                  [...Array(BOARD_SIZE)].map((_, col) => {
                    const isKnight = knightPos.x === col && knightPos.y === row;
                    const isGuardian =
                      currentRound.guardian.x === col &&
                      currentRound.guardian.y === row;
                    const isMoveable = getKnightMoves(
                      knightPos.x,
                      knightPos.y
                    ).some((m) => m.x === col && m.y === row);

                    return (
                      <div
                        key={row + "-" + col}
                        onClick={() =>
                          isMoveable && handleSquareClick(col, row)
                        }
                        className={`w-12 h-12 flex items-center justify-center cursor-pointer 
                          ${
                            (row + col) % 2 === 0
                              ? "bg-[#2f4c57]"
                              : "bg-[#b7b198]"
                          } 
                          ${
                            isMoveable
                              ? "hover:bg-[var(--color-attention)]/20"
                              : ""
                          } 
                          transition-[background] duration-200 relative`}
                      >
                        {isKnight && (
                          <img
                            src={KNIGHT_PNG}
                            alt="Knight"
                            className="absolute left-1/2 top-1/2 w-[22px] h-auto pointer-events-none select-none [z-index:2] 
                            [transform:translate(-50%,-50%)] [filter:drop-shadow(0_0_3px_#b48534)]"
                            draggable={false}
                          />
                        )}
                        {isGuardian && (
                          <img
                            src={GUARDIAN_PNG}
                            alt="Guardian"
                            className="absolute left-1/2 top-1/2 w-[17px] h-auto pointer-events-none select-none [z-index:2] 
                            [transform:translate(-50%,-50%)]"
                            draggable={false}
                          />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
              <div className="mt-2 text-[var(--color-attention)] text-lg font-semibold">
                Moves: {moves} / {currentRound.maxMoves}
              </div>
            </>
          )}

          {/* Feedback */}
          {(FLOW[step] === "feedback1" ||
            FLOW[step] === "feedback2" ||
            FLOW[step] === "feedback3") &&
            renderFeedbackScreen()}

          {/* Missionen */}
          {FLOW[step] === "mission1" && (
            <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
              <AllGamesRavenclaw
                missionType="watergame"
                onComplete={handleMissionComplete}
              />
            </div>
          )}
          {FLOW[step] === "mission2" && (
            <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
              <AllGamesRavenclaw
                missionType="riddle"
                onComplete={handleMissionComplete}
              />
            </div>
          )}
          {FLOW[step] === "mission3" && (
            <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
              <AllGamesRavenclaw
                missionType="runememory"
                onComplete={handleMissionComplete}
              />
            </div>
          )}

          {/* Final Score */}
          {FLOW[step] === "score" && (
            <>
              <button
                onClick={() => setShowModal(true)}
                className="absolute top-[-4rem] right-[-2.5rem]  zooming-wappe  z-10 transition hover:scale-110 
                hover:opacity-100 opacity-90 hover:drop-shadow-[0_0_18px_#b48534]"
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
                      {mainResults.map((success, idx) => (
                        <tr key={idx}>
                          <td className="border-b px-4 py-2">
                            Round {idx + 1}
                          </td>
                          <td className="border-b px-4 py-2 font-bold">
                            {getMainPoints(success)}
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
                className="mt-4 mb-8 text-2xl font-extrabold bg-black opacity-90 p-4 rounded-xl text-center 
              drop-shadow-[0_3px_20x_black] text-text"
              >
                Total score: <span className=" text-text">{totalScore}</span>
              </div>
              <button
                onClick={handleMap}
                disabled={saving}
                className="relative group  active:scale-95 text-[var(--color-text)] font-bold text-lg px-6 py-3 
                rounded-xl shadow-md border-2 border-[var(--color-text)] transition-all duration-150 uppercase tracking-widest overflow-hidden"
              >
                <span
                  className="absolute inset-0 rounded-xl blur-sm bg-[var(--color-text)] opacity-0 group-hover:opacity-30
                 transition duration-300 animate-pulse"
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
