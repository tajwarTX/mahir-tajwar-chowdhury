const logo = "/logo.png";
import { NavLink } from 'react-router-dom';
import ScrollLetterRevealDelayed from "./ScrollLetterRevealDelayed";

const Navbar = () => {
  return (
    <>

      <div className="fixed top-5 left-6 z-50">
        <NavLink to="/">
          <img
            src={logo}
            alt="Logo"
            className="cursor-target  px-0 w-24 h-21 object-contain"
          />
        </NavLink>
      </div>
    </>
  );
};

export default Navbar;