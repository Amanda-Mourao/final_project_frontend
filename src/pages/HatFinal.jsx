import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, getUserProgress, updateUserProgress } from "../utils/api";

const Hatfinal_BG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751382414/Hogwards-Greathall_kjio3v.png";
const HAT_GIF =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751295551/GIF-2025-06-30-12-23-34-unscreen_ysixss.gif";

const HOUSE_AUDIOS = {
  Gryffindor:
    "https://res.cloudinary.com/ddloaxsnx/video/upload/v1752227308/ttsMP3.com_VoiceText_2025-7-11_11-40-39_f2efdt.mp3",
  Slytherin:
    "https://res.cloudinary.com/ddloaxsnx/video/upload/v1752227351/Syltherin_jvzjx7.mp3",
  Hufflepuff:
    "https://res.cloudinary.com/ddloaxsnx/video/upload/v1752227351/Hufflepuff_ea3jkv.mp3",
  Ravenclaw:
    "https://res.cloudinary.com/ddloaxsnx/video/upload/v1752227351/Ravenclaw_juwzlb.mp3",
};

const HOUSE_WAPPEN = {
  Gryffindor:
    "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751878917/ChatGPT_Image_7._Juli_2025_10_55_51_1_rfptfw.png",
  Slytherin:
    "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751878905/ChatGPT_Image_7._Juli_2025_10_55_51_4_ddz8oh.png",
  Hufflepuff:
    "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751878911/ChatGPT_Image_7._Juli_2025_10_55_51_2_y32nm4.png",
  Ravenclaw:
    "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751878909/ChatGPT_Image_7._Juli_2025_10_55_51_3_dzojes.png",
};

const MagicText = ({ text, className = "" }) => {
  //Wörter als Animation /magic fadeout
  const chars = [...text];
  return (
    <h1 className={`magic-text flex space-x-1 ${className}`}>
      {chars.map((char, i) => (
        <span key={i} className={`delay-${i + 1}`}>
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h1>
  );
};

const getTopHouse = (scores) => {
  if (!scores) return "Gryffindor";
  const houses = [
    { name: "Slytherin", points: Number(scores.pointsSlytherin ?? -Infinity) },
    {
      name: "Gryffindor",
      points: Number(scores.pointsGryffindor ?? -Infinity),
    },
    {
      name: "Hufflepuff",
      points: Number(scores.pointsHufflepuff ?? -Infinity),
    },
    { name: "Ravenclaw", points: Number(scores.pointsRavenclaw ?? -Infinity) },
  ];

  houses.forEach((h) => {
    if (isNaN(h.points)) h.points = -Infinity;
  });

  const max = Math.max(...houses.map((h) => h.points));
  const topHouses = houses.filter((h) => h.points === max);
  const winner = topHouses[Math.floor(Math.random() * topHouses.length)].name;
  return winner;
};

export const HatFinal = () => {
  const [winnerHouse, setWinnerHouse] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [phase, setPhase] = useState("sorting");
  const audioRef = useRef(null);
  const navigate = useNavigate();

  //muss User+Progres geladen werden
  useEffect(() => {
    async function getWinnerHouse() {
      try {
        const me = await getMe();
        const prog = await getUserProgress(me.user._id || me.user.id);
        const top = getTopHouse(prog.data);
        setWinnerHouse(top);
        setAudioUrl(HOUSE_AUDIOS[top]);
        //  Wenn House abgeschlossen is, muss markeirt werden
        if (prog.data.houses) {
          let updateData = {
            houses: prog.data.houses.map((h) =>
              h.houseName === top
                ? {
                    ...h,
                    isCompleted: true,
                    completedAt: new Date(),
                    score: prog.data["points" + top],
                  }
                : h
            ),
          };
          await updateUserProgress(me.user._id || me.user.id, updateData);
        }
      } catch (e) {}
    }
    getWinnerHouse();
  }, []);

  //Audio Hut abspielen dann weiterleiten zu Wappe mit den Wörter ....
  useEffect(() => {
    if (!audioUrl || !audioRef.current) return;
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
    audio.play();
    const onEnd = () => {
      setTimeout(() => setPhase("fadeOut"), 2000);
    };
    audio.addEventListener("ended", onEnd);
    return () => audio.removeEventListener("ended", onEnd);
  }, [audioUrl]);

  useEffect(() => {
    if (phase === "fadeOut") {
      setTimeout(() => setPhase("wappen"), 1000);
    }
  }, [phase]);

  const handleBack = () => navigate("/map");
  const handleNotSatisfied = () => navigate("/housequiz");

  return (
    <div
      className="w-screen h-screen min-h-screen flex flex-col items-center justify-center relative overflow-hidden 
    bg-black"
    >
      {/*  (Hut, Audio, Hintergrund) */}
      <img
        src={Hatfinal_BG}
        alt="Great Hall"
        className={
          "fixed inset-0 w-full h-full object-top z-0 transition-all duration-1000 brightness-[0.6] " +
          (phase === "fadeOut" || phase === "wappen"
            ? "opacity-0"
            : "opacity-100")
        }
        draggable={false}
      />
      {phase === "sorting" && (
        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <img
            src={HAT_GIF}
            alt="Sorting Hat"
            className="w-[320px] object-contain h-[320px] md:w-[420px] md:h-[420px] mx-auto pointer-events-none drop-shadow-2xl"
            draggable={false}
          />
          {/* Audio */}
          {audioUrl && <audio ref={audioRef} src={audioUrl} autoPlay />}
        </div>
      )}
      {/* Wappen-Anzeige */}
      {phase === "wappen" && winnerHouse && (
        <div
          className="fixed inset-0 bg-black flex flex-col items-center justify-center 
        z-50 transition-all duration-900"
        >
          <MagicText
            text="WELCOME TO"
            className="text-accent text-6xl font-bold "
          />
          <img
            src={HOUSE_WAPPEN[winnerHouse]}
            alt={`${winnerHouse} crest`}
            className="w-[320px] h-[320px] object-contain md:w-[420px] md:h-[420px] mx-auto drop-shadow-2xl"
            draggable={false}
          />
          <div className="flex mt-2 items-center flex-wrap gap-4">
            <button
              onClick={handleBack}
              className="relative group active:scale-95 text-[var(--color-text)] font-bold 
              text-lg px-6 py-3 rounded-xl shadow-md border-2 border-[var(--color-text)] 
              transition-all duration-150 uppercase tracking-widest overflow-hidden"
            >
              <span
                className="absolute inset-0 rounded-xl blur-sm bg-[var(--color-text)] 
              opacity-0 group-hover:opacity-30 transition duration-300 animate-pulse"
              />
              <span className="relative z-10">Back to map</span>
            </button>
            <button
              onClick={handleNotSatisfied}
              className="relative group active:scale-95 text-[var(--color-text)] font-bold text-lg px-6 py-3 
              rounded-xl shadow-md border-2 border-[var(--color-text)] transition-all duration-150 uppercase 
              tracking-widest overflow-hidden"
            >
              <span
                className="absolute inset-0 rounded-xl blur-sm bg-[var(--color-text)]
               opacity-0 group-hover:opacity-30 transition duration-300 animate-pulse"
              />
              <span className="relative z-10">Not satisfied?</span>
            </button>
          </div>
        </div>
      )}

      {/* Übergang zu Spiegel Seite*/}
      {phase === "fadeOut" && (
        <div className="fixed inset-0 bg-black opacity-100 z-40 transition-all duration-1100"></div>
      )}
    </div>
  );
};
