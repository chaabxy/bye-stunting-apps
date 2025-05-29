"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <div
            className={`flex items-center px-2 md:px-5 ${
              scrolled ? "md:mt-0" : "md:mt-5"
            }`}
          >
            <Link href="/" className="text-xl font-bold text-[#1D3557]">
              ByeStunting
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav
            className={`hidden md:flex items-center space-x-8 lg:space-x-12 ${
              scrolled ? "md:mt-0" : "md:mt-5"
            }`}
          >
            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.path}
                className="text-sm font-semibold text-gray-800 hover:text-[#317BC4]"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div
            className={`flex items-center gap-4 ${
              scrolled ? "md:mt-0" : "md:mt-5"
            }`}
          >
            <div className="mr-2">
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
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
              {navLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.path}
                  className="text-sm font-semibold text-gray-800 hover:text-[#317BC4] py-2 border-b border-gray-100 last:border-0"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
