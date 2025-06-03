"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Menu,
  LayoutDashboard,
  FileText,
  Database,
  User,
  MessageCircle,
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const sidebarItems = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    description: "Ringkasan Informasi",
  },
  {
    href: "/kelola-edukasi",
    icon: FileText,
    label: "Kelola Edukasi",
    description: "Edukasi Di Tampilan User",
  },
  {
    href: "/kelola-data-stunting",
    icon: Database,
    label: "Kelola Data Stunting",
    description: "Data Hasil Input User",
  },
  {
    href: "/kelola-pesan-user",
    icon: MessageCircle,
    label: "Kelola Pesan User",
    description: "Pesan Kiriman User",
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    setIsLoggedIn(adminLoggedIn);

    if (!adminLoggedIn && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    setIsLoggedIn(false);
    router.push("/admin/login");
  };

  if ((!isLoggedIn && pathname !== "/admin/login") || !isMounted) {
    return null;
  }

  if (pathname === "/admin/login") {
    return <div className="min-h-screen">{children}</div>;
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-input">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center space-x-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">ByeStunting</h2>
            <p className="text-sm text-gray-500">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`group flex items-center p-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <Icon
                  className={`w-5 h-5 mr-3 ${
                    isActive
                      ? "text-white"
                      : "text-gray-500 group-hover:text-gray-700"
                  }`}
                />
                <div className="flex-1">
                  <p className="font-medium">{item.label}</p>
                  <p
                    className={`text-xs ${
                      isActive ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="p-0 w-80">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-80 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200">
          <SidebarContent />
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-80">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200 py-4">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </Button>
                <div className="ml-4 lg:ml-0">
                  <h1 className="text-lg font-semibold text-gray-900">
                    {sidebarItems.find((item) => item.href === pathname)
                      ?.label || "Admin Panel"}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {sidebarItems.find((item) => item.href === pathname)
                      ?.description || "Kelola platform ByeStunting"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-10 w-10 rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Admin
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          admin@byestunting.com
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
