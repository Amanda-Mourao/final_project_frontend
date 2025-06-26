import React from "react";
import Startscreen from "../assets/bg-start.gif";
import Logo from "../assets/website-logo.png";

function Home() {
  return (
    <div className="relative">
      <img
        alt="Hogwarts And The Hat Logo"
        class="w-100"
        src={Logo}
      />
      <img
        src={Startscreen}
        alt="Startscreen Background"
        className="fixed top-0 left-0 w-screen h-screen object-cover brightness-80 blur-xs grayscale-[0.5] -z-10"
      />
    </div>
  );
}

export default Home;
