const Loading =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1752071300/WB4y_k7xksp.gif";

export const Loader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black flex items-center justify-center z-9999">
      <img src={Loading} alt="Loading..." className="w-[300px] h-[300px]" />
    </div>
  );
};
