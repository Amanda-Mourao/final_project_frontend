import { NavLink } from "react-router-dom";
import logo from "../assets/website-logo.png";

function Navbar() {
  return (
    <header className="absolute top-0 left-0 w-full z-10">
      <nav className="">
        {/* <NavLink to="/">
          <img src={logo} alt="Hogwarts And The Hat Logo" className="w-50" />
        </NavLink> */}
      </nav>
    </header>
  );
}
export default Navbar;
