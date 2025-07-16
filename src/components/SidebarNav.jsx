import AudioToggle from "./AudioToggle";
import { logout } from "../utils/api";
import { NavLink, useNavigate } from "react-router-dom";

const logoutImgUrl =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1752141127/ChatGPT_Image_10._Juli_2025_11_51_44_vzlvyh.png";

const MapImgUrl =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1752141750/craiyon_120224_image_yrbhtd.png";

const navItems = [
  {
    id: "tune",
    label: "Tune",
    icon: (
      <div className="w-12 h-12 flex items-center justify-center drop-shadow-[0_0_2px_black]">
        <AudioToggle className="w-12 h-12" />
      </div>
    ),
  },
  {
    id: "exit",
    label: "Exit",
    icon: (
      <div className="w-12 h-12 flex items-center drop-shadow-[0_0_2px_black] justify-center">
        <img
          src={logoutImgUrl}
          alt="icon-exit"
          className="w-12 h-12 object-contain"
          draggable={false}
        />
      </div>
    ),
    isLogout: true,
  },
  {
    id: "map",
    label: "Map",
    icon: (
      <div className="w-12 h-12 flex items-center drop-shadow-[0_0_2px_black] justify-center">
        <img
          src={MapImgUrl}
          alt="icon-map"
          className="w-12 h-12 object-contain"
          draggable={false}
        />
      </div>
    ),
    link: "/map",
    isNavLink: true,
  },
];

export const SidebarNav = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-1/3 left-0 z-50 flex flex-col gap-4">
      {navItems.map((item) => {
        const Content = (
          <>
            <span className="flex items-center justify-center text-[#461901] w-12 h-12">
              {item.icon}
            </span>
            <span
              className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                        whitespace-nowrap text-base font-bold text-[#461901] pointer-events-none select-none"
            >
              {item.label}
            </span>
          </>
        );

        if (item.isNavLink && item.link) {
          return (
            <NavLink
              key={item.id}
              to={item.link}
              className="group relative flex items-center transition-all duration-300 pr-2 py-1 rounded-r-lg shadow-lg
                        bg-[var(--color-text)]/80 hover:bg-[var(--color-text)]/80 pl-2 w-17 hover:w-31 cursor-pointer
                        outline-none border-none no-underline"
              tabIndex={0}
              aria-label={item.label}
            >
              {Content}
            </NavLink>
          );
        }

        if (item.isLogout) {
          return (
            <div
              key={item.id}
              onClick={handleLogout}
              tabIndex={0}
              role="button"
              aria-label={item.label}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleLogout();
              }}
              className="group relative flex items-center transition-all duration-300 pr-2 py-1 rounded-r-lg shadow-lg
                        bg-[var(--color-text)]/80 hover:bg-[var(--color-text)]/80 pl-2 w-17 hover:w-31 cursor-pointer select-none
                        outline-none border-none"
            >
              {Content}
            </div>
          );
        }

        return (
          <div
            key={item.id}
            className="group relative flex items-center transition-all duration-300 pr-2 py-1 rounded-r-lg shadow-lg
                      bg-[var(--color-text)]/80 hover:bg-[var(--color-text)]/80 pl-2 w-17 hover:w-30 cursor-pointer"
          >
            {Content}
          </div>
        );
      })}
    </nav>
  );
};
