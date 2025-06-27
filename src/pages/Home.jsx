import React from "react";
const startscreen =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751011834/Harry_Potter_Night_GIF_db9pkt.gif";
const logo =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751025899/GameLogo_ggxid9.png";

const loading =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751029904/Ouroboros_Symbol-1-removebg-preview_ffhbza.png";

function Home() {
  return (
    <div className="relative min-h-screen">
      <img
        src={loading}
        className="m-auto w-80 animate-spin spin-slow filter-gold"
      />
      <div className="relative mt-16 h-[420px] flex items-center justify-center">
        {/* WELCOME TO */}
        <div className="absolute magic-text z-10">
          <h1 className="flex space-x-1 text-accent text-6xl font-bold">
            <span className="delay-1">W</span>
            <span className="delay-2">E</span>
            <span className="delay-3">L</span>
            <span className="delay-4">C</span>
            <span className="delay-5">O</span>
            <span className="delay-6">M</span>
            <span className="delay-7">E</span>
            <span className="delay-8 ml-3">T</span>
            <span className="delay-9">O</span>
          </h1>
        </div>
        {/* LOGO */}
        <img
          src={logo}
          alt="Logo"
          className="w-96 md:w-[24rem] logo-fade z-10"
        />
        {/* UNLOCK YOUR DESTINY */}
        <div className="flex justify-center space-x-4 text-accent text-6xl font-bold unlock-text absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-10">
          <h1 className="flex space-x-1">
            <span className="ud-delay-1">U</span>
            <span className="ud-delay-2">N</span>
            <span className="ud-delay-3">L</span>
            <span className="ud-delay-4">O</span>
            <span className="ud-delay-5">C</span>
            <span className="ud-delay-6">K</span>
          </h1>
          <h1 className="flex space-x-1">
            <span className="ud-delay-7">Y</span>
            <span className="ud-delay-8">O</span>
            <span className="ud-delay-9">U</span>
            <span className="ud-delay-10">R</span>
          </h1>
          <h1 className="flex space-x-1">
            <span className="ud-delay-11">D</span>
            <span className="ud-delay-12">E</span>
            <span className="ud-delay-13">S</span>
            <span className="ud-delay-14">T</span>
            <span className="ud-delay-15">I</span>
            <span className="ud-delay-16">N</span>
            <span className="ud-delay-17">Y</span>
          </h1>
        </div>
      </div>
      {/* BACKGROUND */}
      <img
        src={startscreen}
        alt="Startscreen Background"
        className="fixed top-0 left-0 w-screen h-screen object-cover brightness-80 blur-xs grayscale-[0.5] -z-10 zoom-in-bg"
      />
    </div>
  );
}
export default Home;
