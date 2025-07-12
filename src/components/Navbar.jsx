import { NavLink } from "react-router-dom";

const logo =
  "https://res.cloudinary.com/ddloaxsnx/image/upload/v1751025899/GameLogo_ggxid9.png";

function Navbar() {
  return (
    <header className="absolute top-0 left-0 w-full z-10">
      <nav className="">
        <NavLink to="Gryffindor">
          <img src={logo} alt="Hogwarts And The Hat Logo" className="w-50" />
        </NavLink>
      </nav>
    </header>
  );
}
export default Navbar;
