import { useEffect, useState } from "react";

export const PageTransition = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // kurz warten dann langsamer übergang
    const timeout = setTimeout(() => setShow(false), 10);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={`
        fixed inset-0 z-[9999] bg-black pointer-events-none transition-opacity duration-[4000ms] ease-in-out
        ${show ? "opacity-100" : "opacity-0"}
      `}
    />
  );
};
