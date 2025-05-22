"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${
        scrolled
          ? "bg-white/80 shadow-md border-b border-gray-200"
          : ""
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center px-5">
            <Link href="/" className="text-xl font-bold text-[#1D3557]">
              ByeStunting
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-12">
            {["Home", "Cek Stunting", "Edukasi", "Kontak", "Tentang Kami"].map(
              (text, idx) => (
                <Link
                  key={idx}
                  href={`/${text.toLowerCase().replace(" ", "-")}`}
                  className="text-sm font-semibold text-gray-800 hover:text-[#317BC4]"
                >
                  {text}
                </Link>
              )
            )}
          </nav>
          <div className="mr-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
