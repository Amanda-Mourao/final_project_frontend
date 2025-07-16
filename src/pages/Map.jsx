import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { PageTransition } from "../components/PageTransition";
import { getMe, getUserProgress } from "../utils/api";

// Bild-URLs als Variablen
const MAP_BG =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751879062/Mappe-Leer_cl4txj.webp";
const GRYFFINDOR_COLOR =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751878917/ChatGPT_Image_7._Juli_2025_10_55_51_1_rfptfw.webp";
const SLYTHERIN_COLOR =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751878905/ChatGPT_Image_7._Juli_2025_10_55_51_4_ddz8oh.webp";
const HUFFLEPUFF_COLOR =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751878911/ChatGPT_Image_7._Juli_2025_10_55_51_2_y32nm4.webp";
const RAVENCLAW_COLOR =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751878909/ChatGPT_Image_7._Juli_2025_10_55_51_3_dzojes.webp";
const HAT_Logo =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1752490203/Hat-final_ceiykr.webp";
const CHECK_ICON =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1752227885/craiyon_115759_image_anyrf2.webp";

//   Houses Verlinkung
const HOUSES = [
  {
    name: "Gryffindor",
    imgColor: GRYFFINDOR_COLOR,
    path: "/gryffindorhat",
    progressKey: "Gryffindor",
  },
  {
    name: "Slytherin",
    imgColor: SLYTHERIN_COLOR,
    path: "/slytherinhat",
    progressKey: "Slytherin",
  },
  {
    name: "Hufflepuff",
    imgColor: HUFFLEPUFF_COLOR,
    path: "/hufflepuffhat",
    progressKey: "Hufflepuff",
  },
  {
    name: "Ravenclaw",
    imgColor: RAVENCLAW_COLOR,
    path: "/ravenclawhat",
    progressKey: "Ravenclaw",
  },
];

export const Map = ({ onHouseClick }) => {
  const [hovered, setHovered] = useState(null);
  const [progress, setProgress] = useState(null);
  const uiRef = useRef(null);
  const navigate = useNavigate();

  // FÜßabdrück Effekt
  useEffect(() => {
    const timer = 10000;
    const ui = uiRef.current;
    if (!ui) return;
    const interval = setInterval(() => {
      ui.classList.toggle("switch");
    }, timer);
    return () => clearInterval(interval);
  }, []);

  // UseEffekt für User Progress wenn House abschließt....
  useEffect(() => {
    async function fetchProgress() {
      try {
        const me = await getMe();
        const prog = await getUserProgress(me.user._id || me.user.id);
        setProgress(prog.data);
      } catch (err) {}
    }
    fetchProgress();
  }, []);

  // Ist House abgeschlossen?
  const isHouseCompleted = (houseName) => {
    if (!progress || !Array.isArray(progress.houses)) return false;
    const h = progress.houses.find((h) => h.houseName === houseName);
    return h?.isCompleted;
  };

  // Sind alle Häuser abgeschlossen?
  const allDone = HOUSES.every((h) => isHouseCompleted(h.progressKey));

  const renderTracks = (trackNum = 1, max = 50) => {
    if (trackNum > max) return null;
    return (
      <div className={`track track_${trackNum}`}>
        <div className="foot left">
          <div className="foot_claw"></div>
          <div className="foot_claw"></div>
          <div className="foot_claw"></div>
        </div>
        <div className="foot right">
          <div className="foot_claw"></div>
          <div className="foot_claw"></div>
          <div className="foot_claw"></div>
        </div>
        {renderTracks(trackNum + 1, max)}
      </div>
    );
  };

  // Button für den Hut
  const handleDiscoverHouse = () => {
    navigate("/hatfinal");
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      <PageTransition />
      <img
        src={MAP_BG}
        alt="Map"
        className="fixed w-full h-full object-contain brightness-90 object-top z-0"
      />

      {/* Füßabdrück Overlay */}
      <div
        id="ui"
        ref={uiRef}
        className="pointer-events-none select-none absolute top-1/2 left-[40%] w-0 h-0 z-30"
      >
        {renderTracks()}
      </div>

      {/* HUT GIF in der Mitte kommt aber nur wenn alle Häuser fertig */}
      {allDone && (
        <div className="absolute top-1/2 left-1/2 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 z-[9999] pointer-events-auto">
          <img
            src={HAT_Logo}
            alt="Sorting Hat"
            className="w-50 mb-10  zooming-wappe pointer-events-none"
          />
          <button
            onClick={handleDiscoverHouse}
            className="px-3 py-3 bg-[var(--color-text)]/60 hover:bg-[var(--color-text)] cursor-pointer pointer-events-auto
             text-amber-950 font-bold rounded-lg shadow-lg  transition-colors text-xl"
          >
            get your House
          </button>
        </div>
      )}
      {/* 2 Häuser-Wappen und Status */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="flex flex-row justify-center z-999 gap-90 mb-20 pointer-events-auto">
          {[HOUSES[0], HOUSES[1]].map((house, i) => {
            const completed = isHouseCompleted(house.progressKey);
            return completed ? (
              <div
                key={house.name}
                className="outline-none bg-transparent border-none no-underline cursor-default pointer-events-none z-10"
              >
                {/* KEINE Animation/KEIN zooming-wappe, wenn House abgeschlossen ist*/}
                <div className="relative house-size scale-100 drop-shadow-[0_0_8px_#2226] z-10 transition-none">
                  <img
                    src={house.imgColor}
                    alt={house.name}
                    className="absolute object-contain w-full h-full"
                    draggable={false}
                  />
                  {/* Check-Icon */}
                  <img
                    src={CHECK_ICON}
                    alt="Abgeschlossen"
                    className="absolute -top-6 -right-5 w-20 h-20 z-50 drop-shadow-[0_0_8px_#facd6c]"
                  />
                </div>
              </div>
            ) : (
              <NavLink
                key={house.name}
                to={house.path}
                aria-label={house.name}
                className={`outline-none bg-transparent border-none cursor-pointer no-underline ${
                  hovered === i ? "z-20" : "z-10"
                }`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onHouseClick && onHouseClick(house.name)}
              >
                <div
                  className={`relative house-size transition-all duration-300 ease-[cubic-bezier(.53,1.82,.48,.86)] ${
                    hovered === i
                      ? "house-size-hover scale-110 drop-shadow-[0_0_40px_#fff8] z-20"
                      : "scale-100 drop-shadow-[0_0_8px_#2226] z-10"
                  }`}
                >
                  <img
                    src={house.imgColor}
                    alt={house.name}
                    className={`
                      zooming-wappe absolute object-contain w-full h-full
                      transition-all duration-500 ease-in-out
                      ${hovered !== i ? "filter sepia brightness-90" : ""}
                    `}
                    draggable={false}
                  />
                </div>
              </NavLink>
            );
          })}
        </div>
        <div className="flex flex-row z-999 justify-center gap-90 pointer-events-auto">
          {[HOUSES[2], HOUSES[3]].map((house, i) => {
            const completed = isHouseCompleted(house.progressKey);
            return completed ? (
              <div
                key={house.name}
                className="outline-none bg-transparent border-none no-underline cursor-default pointer-events-none z-10"
              >
                {/* KEINE Animation/KEIN zooming-wappe, wenn House abgeschlossen ist*/}
                <div className="relative house-size scale-100 drop-shadow-[0_0_8px_#2226] z-10 transition-none">
                  <img
                    src={house.imgColor}
                    alt={house.name}
                    className="absolute object-contain w-full h-full"
                    draggable={false}
                  />
                  {/* Check-Icon */}
                  <img
                    src={CHECK_ICON}
                    alt="Abgeschlossen"
                    className="absolute -top-6 -right-5 w-20 h-20 z-50 drop-shadow-[0_0_8px_#facd6c]"
                  />
                </div>
              </div>
            ) : (
              <NavLink
                key={house.name}
                to={house.path}
                aria-label={house.name}
                className={`outline-none bg-transparent border-none cursor-pointer no-underline ${
                  hovered === i + 2 ? "z-20" : "z-10"
                }`}
                onMouseEnter={() => setHovered(i + 2)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onHouseClick && onHouseClick(house.name)}
              >
                <div
                  className={`relative house-size transition-all duration-300 ease-[cubic-bezier(.53,1.82,.48,.86)] ${
                    hovered === i + 2
                      ? "house-size-hover scale-110 drop-shadow-[0_0_40px_#fff8] z-20"
                      : "scale-100 drop-shadow-[0_0_8px_#2226] z-10"
                  }`}
                >
                  <img
                    src={house.imgColor}
                    alt={house.name}
                    className={`
                      zooming-wappe absolute object-contain w-full h-full 
                      transition-all duration-500 ease-in-out
                      ${hovered !== i + 2 ? "filter sepia brightness-90" : ""}
                    `}
                    draggable={false}
                  />
                </div>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};
