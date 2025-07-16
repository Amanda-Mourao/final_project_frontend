import { useAudio } from "./AudioContext";

const ICON_MUTE =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1752142089/ChatGPT_Image_10._Juli_2025_12_08_03_gj8pcp.webp";

const ICON_UNMUTE =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1752141901/craiyon_120440_image_uwukl8.webp";

const AudioToggle = ({ size = 28 }) => {
  const { muted, setMuted } = useAudio();

  return (
    <button
      onClick={() => setMuted((m) => !m)}
      aria-label={muted ? "sound on" : "sound off"}
      title={muted ? "sound on" : "sound off"}
      className="bg-none border-none p-0 cursor-pointer outline-none"
    >
      <img
        src={muted ? ICON_MUTE : ICON_UNMUTE}
        alt={muted ? "sound off" : "sound on"}
        className={`select-none w-[${size}px] h-auto`}
        draggable={false}
      />
    </button>
  );
};

export default AudioToggle;
