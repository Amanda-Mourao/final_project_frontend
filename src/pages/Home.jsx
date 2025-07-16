import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageTransition } from "../components/PageTransition";

// Bilder Links als Variabeln:
const startscreen =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751564575/ChatGPT_Image_3._Juli_2025_19_38_21_ghelar.webp";

const logo =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751013110/ChatGPT_Image_26._Juni_2025_18_46_13-Photoroom_laujaa.webp";

// Fade Effekt für den Anfang
const DURATION_BEFORE_FADE = 5500;
const FADE_OUT_DURATION = 6500;

const Home = () => {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), DURATION_BEFORE_FADE);
    const navTimer = setTimeout(
      () => navigate("/greathall"),
      DURATION_BEFORE_FADE + FADE_OUT_DURATION
    );
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PageTransition />

      {/* Logo Bild */}
      <img
        src={logo}
        alt="Logo"
        className="w-120 md:w-[20rem] pointer-events-none logo-fade z-50 absolute 
        left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      />

      {/* Background Bild */}
      <img
        src={startscreen}
        alt="Startscreen Background"
        className="object-cover brightness-90 fixed top-0 left-0 w-screen h-screen -z-10 zoom-in-bg"
        draggable={false}
      />

      {/* Schwarzer Overlay für Fade-Out */}
      <div
        className={`fixed inset-0  pointer-events-none z-30 fade-bg ${
          fadeOut ? "visible" : "invisible"
        }`}
      />
    </div>
  );
};

export default Home;
