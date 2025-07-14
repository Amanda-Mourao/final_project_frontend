import { Outlet, useLocation } from "react-router-dom";
import { SidebarNav } from "../components/SidebarNav";

export const MainLayout = ({ user }) => {
  const location = useLocation();
  const isIntro = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {!isIntro && <SidebarNav />}
        <Outlet />
      </main>
    </div>
  );
};
