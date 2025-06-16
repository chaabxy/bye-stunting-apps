import type React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/styles/globals.css";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ByeStunting - Cegah Stunting Sejak Dini",
  description:
    "Aplikasi untuk memantau tumbuh kembang anak dan mencegah stunting dengan dukungan AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${poppins.className} min-h-screen text-foreground`}>
        {children}
      </body>
    </html>
  );
}
