import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, getUserProgress, updateUserProgress } from "../utils/api";

// Bilder als Variabeln
const Hatfinal_BG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751382414/Hogwards-Greathall_kjio3v.webp";
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

// Wappen als Variabeln
const HOUSE_WAPPEN = {
  Gryffindor:
    "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751878917/ChatGPT_Image_7._Juli_2025_10_55_51_1_rfptfw.webp",
  Slytherin:
    "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751878905/ChatGPT_Image_7._Juli_2025_10_55_51_4_ddz8oh.webp",
  Hufflepuff:
    "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751878911/ChatGPT_Image_7._Juli_2025_10_55_51_2_y32nm4.webp",
  Ravenclaw:
    "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751878909/ChatGPT_Image_7._Juli_2025_10_55_51_3_dzojes.webp",
};

const WAPPEN_LIST = Object.keys(HOUSE_WAPPEN);

const MagicText = ({ text, className = "" }) => {
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

// --------- Glitch für die Wappen ---------
const GlitchImageMulti = ({
  images = [],
  mix = [0.25, 0.25, 0.25, 0.25],
  glitching = true,
  width = 320,
  height = 320,
  style,
}) => {
  const [glitch, setGlitch] = useState([
    { o: 0, h: 0 },
    { o: 0, h: 0 },
    { o: 0, h: 0 },
    { o: 0, h: 0 },
  ]);

  useEffect(() => {
    if (!glitching) return;
    let running = true;
    const loop = () => {
      if (!running) return;
      setGlitch(
        Array(4)
          .fill(0)
          .map(() => ({
            o: Math.round((Math.random() - 0.5) * 8),
            h: -30 + Math.random() * 60,
          }))
      );
      setTimeout(loop, 33 + Math.random() * 45);
    };
    loop();
    return () => {
      running = false;
    };
  }, [glitching]);

  return (
    <div className="relative" style={{ width, height, ...style }}>
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`img${i}`}
          className="absolute object-contain pointer-events-none"
          draggable={false}
          style={{
            width,
            height,
            left: glitch[i]?.o || 0,
            top: glitch[i]?.o || 0,
            opacity: mix[i] ?? 0.25,
            filter: `hue-rotate(${glitch[i]?.h || 0}deg) brightness(1.03)`,
            transition: glitching ? "none" : "opacity 0.6s, filter 0.6s",
            zIndex: 10 + i,
          }}
        />
      ))}
    </div>
  );
};

// ---------  HatFinal ---------
export const HatFinal = () => {
  const [winnerHouse, setWinnerHouse] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [phase, setPhase] = useState("shuffle");
  const audioRef = useRef(null);

  const navigate = useNavigate();

  //getme fetchen
  useEffect(() => {
    async function getWinnerHouse() {
      try {
        const me = await getMe();
        const prog = await getUserProgress(me.user._id || me.user.id);
        const top = getTopHouse(prog.data);
        setWinnerHouse(top);
        setAudioUrl(HOUSE_AUDIOS[top]);
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

  //10 Sekunden Shuffle, dann anzeigen lassen
  useEffect(() => {
    if (!audioUrl || !winnerHouse) return;
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;

    // Starte Audio
    const playAudioAndReveal = () => {
      audio.play();
      // Nach 10 Sekunden Wappe anzeigen lassen
      const revealTimeout = setTimeout(() => {
        setPhase("reveal");
      }, 10000);

      // Wenn AUdio endet, anzeigen lassen
      const onEnd = () => {
        setPhase("reveal");
        clearTimeout(revealTimeout);
      };
      audio.addEventListener("ended", onEnd);

      return () => {
        audio.removeEventListener("ended", onEnd);
        clearTimeout(revealTimeout);
      };
    };

    return playAudioAndReveal();
  }, [audioUrl, winnerHouse]);

  const handleBack = () => navigate("/contact");
  const handleNotSatisfied = () => navigate("/housequiz");

  // Glitch für vier Wappen
  const wappenImages = WAPPEN_LIST.map((house) => HOUSE_WAPPEN[house]);
  const mixShuffle = [0.25, 0.25, 0.25, 0.25];
  const mixReveal =
    winnerHouse != null
      ? WAPPEN_LIST.map((h) => (h === winnerHouse ? 1 : 0))
      : [1, 0, 0, 0];

  return (
    <div className="w-screen h-screen min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-black">
      {/* Hintergrundbild */}
      <img
        src={Hatfinal_BG}
        alt="Great Hall"
        className="fixed inset-0 w-full h-full object-top z-0 transition-all duration-1000 pointer-events-none brightness-[0.6]"
        draggable={false}
      />

      {/* Hut  */}
      <img
        src={HAT_GIF}
        alt="Sorting Hat"
        className="fixed left-35 bottom-6 w-[150px] h-[1250px] md:w-[300px] md:h-[300px] z-20 pointer-events-none drop-shadow-2xl"
        draggable={false}
      />

      {/* Audio */}
      {audioUrl && <audio ref={audioRef} src={audioUrl} autoPlay />}

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center">
        {phase === "shuffle" && (
          <div className="relative w-[300px] h-[300px] md:w-[380px] md:h-[380px] mx-auto flex items-center justify-center">
            <GlitchImageMulti
              images={wappenImages}
              mix={mixShuffle}
              glitching={true}
              width={380}
              height={380}
            />
          </div>
        )}

        {phase === "reveal" && (
          <>
            <MagicText
              text="WELCOME TO"
              className="text-accent text-6xl font-bold mb-2"
            />
            <div className="w-[320px] h-[320px] md:w-[420px] md:h-[420px] mx-auto flex items-center justify-center magic-reveal">
              <GlitchImageMulti
                images={wappenImages}
                mix={mixReveal}
                glitching={false}
                width={420}
                height={420}
              />
            </div>
            <div className="flex mt-4 items-center flex-wrap gap-4">
              <button
                onClick={handleBack}
                className="relative group active:scale-95 text-[var(--color-text)] font-bold 
                text-lg px-6 py-3 rounded-xl shadow-md border-2 border-[var(--color-text)] 
                transition-all duration-150 uppercase tracking-widest overflow-hidden"
              >
                <span
                  className="absolute inset-0 rounded-xl blur-sm bg-[var(--color-text)] opacity-0 group-hover:opacity-30 
                transition duration-300 animate-pulse"
                />
                <span className="relative z-10">contact us</span>
              </button>
              <button
                onClick={handleNotSatisfied}
                className="relative group active:scale-95 text-[var(--color-text)] font-bold text-lg px-6 py-3 rounded-xl 
                shadow-md border-2 border-[var(--color-text)] transition-all duration-150 uppercase tracking-widest overflow-hidden"
              >
                <span
                  className="absolute inset-0 rounded-xl blur-sm bg-[var(--color-text)] opacity-0 group-hover:opacity-30
                transition duration-300 animate-pulse"
                />
                <span className="relative z-10">Not satisfied?</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
