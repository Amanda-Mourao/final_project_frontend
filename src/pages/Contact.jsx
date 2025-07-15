const LINKEDIN_ICON =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1752588293/craiyon_160445_image_kvyrui.png";

export const Contact = () => (
  <div className="fixed inset-0 min-h-screen w-screen flex flex-col items-center justify-center bg-black z-50 transition-all">
    <div className="flex flex-row items-end justify-center gap-8 ">
      {/* Amanda */}
      <div className="relative w-48 h-[390px] flex flex-col items-center">
        <img
          src="https://res.cloudinary.com/ddloaxsnx/image/upload/v1752586012/craiyon_152635_image_iv6f62.png"
          alt="Amanda"
          className="w-full h-full object-contain"
          style={{ maxHeight: 275 }}
          draggable={false}
        />
        <div
          className="absolute left-0 bottom-0 w-full h-2/5 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.98) 75%, rgba(0,0,0,0.0) 100%)",
          }}
        />
        <a
          href="https://www.linkedin.com/in/amanda-mourao/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 pt-1 z-9999 flex justify-center items-center"
        >
          <img
            src={LINKEDIN_ICON}
            alt="LinkedIn"
            style={{ width: 60, height: 60 }}
          />
        </a>
      </div>
      {/* Parween */}
      <div className="relative w-48 h-[390px] flex flex-col items-center">
        <img
          src="https://res.cloudinary.com/ddloaxsnx/image/upload/v1752584943/craiyon_145800_image_wioh4t.png"
          alt="Parween"
          className="w-full h-full object-contain"
          style={{ maxHeight: 280 }}
          draggable={false}
        />
        <div
          className="absolute left-0 bottom-0 w-full h-2/5 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.98) 75%, rgba(0,0,0,0.0) 100%)",
          }}
        />
        <a
          href="https://www.linkedin.com/in/parween-ahmad/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 z-9999 flex justify-center items-center"
        >
          <img
            src={LINKEDIN_ICON}
            alt="LinkedIn"
            style={{ width: 60, height: 60 }}
          />
        </a>
      </div>
    </div>
    <p className="fade-in-slow text-2xl md:text-3xl text-text mb-2 font-bold animate-fade text-center">
      Copyright © 2025 Hogwarts and the Hat - H.A.T.
      <br />
      <span className="text-base opacity-70">
         Amanda Mourao &middot; Parween Ahmad
      </span>
    </p>
  </div>
);