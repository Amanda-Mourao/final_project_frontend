import React from "react";
// import MagicWheel from "../components/MagicWheel.jsx";

const startscreen =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751011834/Harry_Potter_Night_GIF_db9pkt.gif";

const logo =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751025899/GameLogo_ggxid9.png";

function Home() {
  return (
    <div className="relative">
      <div className="text-center mt-16 space-y-4 font-serif text-color-text">
        {/* <h1 className="magicFade text-4xl md:text-6xl font-bold tracking-wide">WELCOME TO</h1> */}
        <div className="flex justify-center space-x-8 text-accent text-4xl font-bold magic-text">
          <h1 className="flex space-x-1">
            <span className="delay-1">W</span>
            <span className="delay-2">E</span>
            <span className="delay-3">L</span>
            <span className="delay-4">C</span>
            <span className="delay-5">O</span>
            <span className="delay-6">M</span>
            <span className="delay-7">E</span>
          </h1>
          <h1 className="flex space-x-1">
            <span className="delay-8">T</span>
            <span className="delay-9">O</span>
          </h1>
          {/* <MagicWheel /> */}
        </div>
        <img
          src={logo}
          alt="Logo"
          className="mx-auto w-62 md:w-40 logo-pop"
          style={{ animationFillMode: "forwards" }}
        />
        {/* <h2 className="text-5xl md:text-7xl font-extrabold tracking-wide">
          HOGWARTS
        </h2>
        <p className="text-xl md:text-2xl uppercase tracking-wider">
          AND THE HAT
        </p> */}
        <p className="text-lg md:text-xl tracking-wide">UNLOCK YOUR DESTINY</p>
      </div>
      <img
        src={startscreen}
        alt="Startscreen Background"
        className="fixed top-0 left-0 w-screen h-screen object-cover brightness-80 blur-xs grayscale-[0.5] -z-10"
      />
    </div>
  );
}

export default Home;
