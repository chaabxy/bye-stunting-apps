"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Cek Stunting", path: "/cek-stunting" },
    { name: "Edukasi", path: "/edukasi" },
    { name: "Kontak", path: "/kontak" },
    { name: "Tentang Kami", path: "/tentang-kami" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 rounded-sm ${
        scrolled
          ? "bg-white/80 shadow-md border-b border-gray-200"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-10">
        <div className={`flex h-16 items-center justify-between`}>
          {/* Logo */}
          <div
            className={`flex items-center px-2 md:px-5 flex-1 ${
              scrolled ? "md:mt-0" : "md:mt-5"
            }`}
          >
            <Link href="/" className="text-xl font-bold text-[#1D3557]">
              ByeStunting
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav
            className={`hidden md:flex items-center space-x-8 lg:space-x-12 justify-center ${
              scrolled ? "md:mt-0" : "md:mt-5"
            }`}
          >
            {navLinks.map((link, idx) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={idx}
                  href={link.path}
                  className={`text-sm font-semibold px-3 py-1 transition-all duration-200 ${
                    isActive
                      ? "text-white bg-secondary rounded-xl shadow-sm"
                      : "text-text hover:text-[#0a0b0c]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Theme Toggle & Mobile Menu Button */}
          <div
            className={`flex items-center gap-4 md:ml-4 ${
              scrolled ? "md:mt-0" : "md:mt-5"
            }`}
          >
            <button
              className="md:hidden flex items-center"
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-800" />
              ) : (
                <Menu className="h-6 w-6 text-gray-800" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg rounded-b-lg py-4 px-6 absolute left-0 right-0 z-50">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link, idx) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={idx}
                    href={link.path}
                    className={`text-sm font-semibold py-2 px-3 border-b border-gray-100 last:border-0 ${
                      isActive
                        ? "text-white bg-[#317BC4] rounded-md"
                        : "text-gray-800 hover:text-[#317BC4]"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
