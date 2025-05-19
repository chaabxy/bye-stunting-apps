"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut, Menu, LayoutDashboard, FileText, Film, Database } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Cek status login dari localStorage
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true"
    setIsLoggedIn(adminLoggedIn)

    // Redirect ke halaman login jika belum login dan bukan di halaman login
    if (!adminLoggedIn && pathname !== "/admin/login") {
      router.push("/admin/login")
    }
  }, [pathname, router])

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn")
    setIsLoggedIn(false)
    router.push("/admin/login")
  }

  // Jika belum login dan bukan di halaman login, atau komponen belum di-mount, jangan tampilkan apa-apa
  if ((!isLoggedIn && pathname !== "/admin/login") || !isMounted) {
    return null
  }

  // Jika di halaman login, tampilkan konten tanpa layout admin
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="text-xl font-bold text-blue-600 dark:text-blue-400">
              ByeStunting Admin
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleLogout} className="hidden md:flex">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 mt-8">
                  <Link href="/admin/dashboard">
                    <Button variant="ghost" className="w-full justify-start">
                      <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                    </Button>
                  </Link>
                  <Link href="/admin/articles">
                    <Button variant="ghost" className="w-full justify-start">
                      <FileText className="mr-2 h-4 w-4" /> Kelola Artikel
                    </Button>
                  </Link>
                  <Link href="/admin/videos">
                    <Button variant="ghost" className="w-full justify-start">
                      <Film className="mr-2 h-4 w-4" /> Kelola Video
                    </Button>
                  </Link>
                  <Link href="/admin/health-data">
                    <Button variant="ghost" className="w-full justify-start">
                      <Database className="mr-2 h-4 w-4" /> Data Kesehatan
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start text-red-500" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Sidebar and Content */}
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm hidden md:block">
          <nav className="space-y-2">
            <Link href="/admin/dashboard">
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  pathname === "/admin/dashboard"
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                    : ""
                }`}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
              </Button>
            </Link>
            <Link href="/admin/articles">
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  pathname === "/admin/articles"
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                    : ""
                }`}
              >
                <FileText className="mr-2 h-4 w-4" /> Kelola Artikel
              </Button>
            </Link>
            <Link href="/admin/videos">
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  pathname === "/admin/videos" ? "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400" : ""
                }`}
              >
                <Film className="mr-2 h-4 w-4" /> Kelola Video
              </Button>
            </Link>
            <Link href="/admin/health-data">
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  pathname === "/admin/health-data"
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                    : ""
                }`}
              >
                <Database className="mr-2 h-4 w-4" /> Data Kesehatan
              </Button>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">{children}</main>
      </div>
    </div>
  )
}
