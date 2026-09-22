import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import LogoImg from "../img/logo.png";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed z-50 h-[64px] w-full bg-[#3c3c3c] px-[20px] lg:h-[80px] lg:px-[150px]">
      <div className="relative flex h-full items-center justify-between">
        <Link
          to="/"
          className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0"
          onClick={() => setMenuOpen(false)}
        >
          <img
            src={LogoImg}
            alt="로고이미지"
            className="w-[86px] transition-transform duration-300 hover:scale-[1.02] scale-[1] transition-all duration-200 lg:w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-[50px] font-['Forum'] text-[20px] text-[#fafafa] lg:flex">
          <Link
            className="transition-all duration-300 hover:text-[#CEB68F]"
            to="/curation"
          >
            CURATION
          </Link>

          <Link
            className="transition-all duration-300 hover:text-[#CEB68F]"
            to="/search"
          >
            SEARCH
          </Link>

          <Link
            className="transition-all duration-300 hover:text-[#CEB68F]"
            to="/my_exhibition"
          >
            MY EXHIBITION
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="ml-auto flex items-center justify-center text-[#fafafa] lg:hidden"
        >
          {menuOpen ? (
            <X size={24} strokeWidth={1.5} />
          ) : (
            <Menu size={24} strokeWidth={1.5} />
          )}
        </button>
      </div>

      <div
        className={`absolute left-0 top-[64px] w-full overflow-hidden bg-[#3c3c3c] transition-all duration-300 lg:hidden ${
          menuOpen
            ? "max-h-[240px] border-t border-white/10 opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col items-center gap-[26px] py-[30px] font-['Forum'] text-[18px] text-[#fafafa]">
          <Link
            to="/curation"
            onClick={() => setMenuOpen(false)}
            className="transition-colors duration-300 hover:text-[#CEB68F]"
          >
            CURATION
          </Link>

          <Link
            to="/search"
            onClick={() => setMenuOpen(false)}
            className="transition-colors duration-300 hover:text-[#CEB68F]"
          >
            SEARCH
          </Link>

          <Link
            to="/my_exhibition"
            onClick={() => setMenuOpen(false)}
            className="transition-colors duration-300 hover:text-[#CEB68F]"
          >
            MY EXHIBITION
          </Link>
        </nav>
      </div>
    </header>
  );
}
