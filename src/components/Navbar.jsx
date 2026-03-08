import logo from '../assets/Logo.png';
import { NavLink } from 'react-router-dom';
import ScrollLetterRevealDelayed from "./ScrollLetterRevealDelayed";
const Navbar = () => {
  return (
    <>
      <div
        className="absolute text-white text-xs font-light leading-none"
        style={{
          top: "19px",
          left: "160px",
        }}
      >
        <ScrollLetterRevealDelayed
          text="@mahir_tajwar_chowdhury"
          duration={500}
          delay={500}
          className="block"
        />
        <ScrollLetterRevealDelayed
          text="Personal Portfolio Website"
          duration={500}
          delay={500}
          className="block"
        />
        <ScrollLetterRevealDelayed
          text="2025-2026"
          duration={500}
          delay={500}
          className="block"
        />
      </div>
      <div className="fixed top-5 left-6 z-50">
        <NavLink to="/">
          <img
            src={logo}
            alt="Logo"
            className="cursor-target  px-0 w-24 h-21 object-contain"
          />
        </NavLink>
      </div>

      <header className="fixed top-0 right-0 left-0 z-40 flex justify-end items-start px-6 py-4 bg-transparent">
  <nav className="flex flex-col sm:flex-row items-end sm:items-center text-sm gap-2 sm:gap-5 font-light">

    <NavLink
      to="/about"
      className={({ isActive }) =>
        isActive ? "text-purple-500" : "text-white"
      }
    >
      <div className="cursor-target px-4 mt-1 w-fit">ABOUT</div>
    </NavLink>

    <NavLink
      to="/projects"
      className={({ isActive }) =>
        isActive ? "text-purple-500" : "text-white"
      }
    >
      <div className="cursor-target px-4 mt-1 w-fit">PROJECTS</div>
    </NavLink>

    <NavLink
      to="/contact"
      className={({ isActive }) =>
        isActive ? "text-purple-500" : "text-white"
      }
    >
      <div className="cursor-target px-4 mt-1 w-fit">CONTACT</div>
    </NavLink>

  </nav>
</header>
    </>
  );
};

export default Navbar;