import type React from "react";
import "@/styles/globals.css";

export const metadata = {
  title: "Admin ByeStunting",
  description: "Panel Admin ByeStunting",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
