import type React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../../styles/globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ByeStunting - Cegah Stunting Sejak Dini",
  description:
    "Aplikasi untuk memantau tumbuh kembang anak dan mencegah stunting dengan dukungan AI",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={poppins.className}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
