import { PageTransition } from "../components/PageTransition";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Forbidden() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 4000);
    return () => clearTimeout(timer);
  }, [navigate]);
  return (
    <div className="w-screen flex-col gap-2 h-screen bg-black flex items-center justify-center">
      <PageTransition />
      <p className="text-white text-3xl">You Shall Not Pass</p>
      <p className="text-white text-s">403 Forbidden</p>
      <img
        src="https://res.cloudinary.com/ddloaxsnx/image/upload/v1752069106/ChatGPT_Image_9._Juli_2025_15_51_16_dhbopf.webp"
        alt="You Shall Not Pass"
        className="max-w-xs md:max-w-xs w-full h-auto"
        draggable={false}
      />
    </div>
  );
}
