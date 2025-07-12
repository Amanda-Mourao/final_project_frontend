import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm.jsx";
import RegisterForm from "../components/RegisterForm.jsx";

const Intro = ({ onAuth }) => {
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(false);

  // Nachdem Login direkt soll zu Home navigieren
  const handleAuth = (user) => {
    if (onAuth) onAuth(user);
    navigate("/home");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* HG_bild */}
      <img
        src="https://res.cloudinary.com/ddloaxsnx/image/upload/v1751564747/ChatGPT_Image_3._Juli_2025_19_45_28_mj5ftk.png"
        alt="Hintergrund-Bild"
        className="w-full h-full object-fill filter brightness-70 saturate-120 hue-rotate-[-10deg]"
      />

      {/* Blitz Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover hue-rotate-[-20deg] 
        opacity-10 mix-blend-screen pointer-events-none"
      >
        <source
          src="https://res.cloudinary.com/ddloaxsnx/video/upload/v1751555364/28067-367411324_phcedl.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Auth- einbinden/prüfen */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-40">
        <div
          className="w-auto py-4 pl-4 pr-4 rounded-lg text-sm font-bold transition bg-[var(--color-b)] 
                         drop-shadow-[0_0_10px_#00FFFF] 
                        shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {showRegister ? (
            <>
              <RegisterForm onAuth={handleAuth} />
              <button
                className="mt-4  text-xs underline"
                onClick={() => setShowRegister(false)}
              >
                Already registered? Log in
              </button>
            </>
          ) : (
            <>
              <LoginForm onAuth={handleAuth} />
              <button
                className="mt-4 text-xs underline"
                onClick={() => setShowRegister(true)}
              >
                New here? Register now
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Intro;
