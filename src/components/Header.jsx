import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import LogoImg from "../img/logo.png";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY >= 80);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 z-50 h-[80px] w-full px-[20px] transition-all duration-300 lg:h-[80px] lg:px-[150px] ${
          isScrolled
            ? "bg-[#7A2431]/85 shadow-[0_4px_20px_rgba(0,0,0,0.08)] backdrop-blur-md"
            : "bg-[#7A2431]"
        }`}
      >
        <div className="relative flex h-full items-center justify-between">
          <Link
            to="/"
            onClick={closeMenu}
            className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0"
          >
            <img
              src={LogoImg}
              alt="ARTROOM"
              className="w-[86px] transition-transform duration-300 hover:scale-[1.02] lg:w-auto"
            />
          </Link>

          <nav className="hidden items-center gap-[50px] font-['Forum'] text-[20px] text-[#fafafa] lg:flex">
            <Link
              to="/curation"
              className="transition-colors duration-300 hover:text-[#CEB68F]"
            >
              CURATION
            </Link>

            <Link
              to="/search"
              className="transition-colors duration-300 hover:text-[#CEB68F]"
            >
              SEARCH
            </Link>

            <Link
              to="/my_exhibition"
              className="transition-colors duration-300 hover:text-[#CEB68F]"
            >
              MY EXHIBITION
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="ml-auto flex items-center justify-center text-[#fafafa] lg:hidden"
            aria-label="메뉴 열기"
          >
            {menuOpen ? (
              <X size={27} strokeWidth={1.4} />
            ) : (
              <Menu size={27} strokeWidth={1.4} />
            )}
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-black/20 transition-opacity duration-300 lg:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={closeMenu}
      />

      <div
        className={`fixed top-[76px] right-[12px] left-[12px] z-50 overflow-hidden rounded-[24px] bg-[#f3f2f1]/95 shadow-[0_12px_40px_rgba(0,0,0,0.15)] backdrop-blur-md transition-all duration-300 lg:hidden ${
          menuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-[12px] opacity-0"
        }`}
      >
        <nav className="px-[28px] py-[14px] font-['Forum'] text-[20px] text-[#3c3c3c]">
          <Link
            to="/curation"
            onClick={closeMenu}
            className="flex h-[62px] items-center justify-center border-b border-[#3c3c3c]/20 transition-colors duration-300 hover:text-[#7A2431]"
          >
            CURATION
          </Link>

          <Link
            to="/search"
            onClick={closeMenu}
            className="flex h-[62px] items-center justify-center border-b border-[#3c3c3c]/20 transition-colors duration-300 hover:text-[#7A2431]"
          >
            SEARCH
          </Link>

          <Link
            to="/my_exhibition"
            onClick={closeMenu}
            className="flex h-[62px] items-center justify-center transition-colors duration-300 hover:text-[#7A2431]"
          >
            MY EXHIBITION
          </Link>
        </nav>
      </div>
    </>
  );
}
