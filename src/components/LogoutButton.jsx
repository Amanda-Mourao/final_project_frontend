import { logout } from "../utils/api";

export const LogoutButton = ({ onLogout }) => {
  const handleLogout = async () => {
    await logout();
    onLogout && onLogout();
  };

  return <button onClick={handleLogout}>Logout</button>;
};
