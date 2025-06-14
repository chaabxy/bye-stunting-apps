import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-blue-600 ">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">Halaman Tidak Ditemukan</h2>
      <p className="mt-2 text-gray-600  max-w-md">
        Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
      </p>
      <div className="mt-8">
        <Link href="/">
          <Button className="bg-blue-600 hover:bg-blue-700 ">
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    </div>
  )
}
