import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="container mx-auto px-4 md:px-6 text-center text-black bg-foreground py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 justify-items-center">
          {/* Kolom 1: Logo dan Deskripsi */}
          <div>
            <h3 className="text-xl font-bold mb-4">ByeStunting</h3>
            <p className="text-sm leading-relaxed max-w-xs mx-auto">
              Aplikasi untuk memantau tumbuh kembang anak dan mencegah stunting
              dengan dukungan AI.
            </p>
          </div>

          {/* Kolom 2: Tautan Navigasi */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tautan</h3>
            <ul className="space-y-2">
              {["/", "/cek-stunting", "/edukasi", "/kontak"].map((path, i) => {
                const names = ["Home", "Cek Stunting", "Edukasi", "Kontak"];
                return (
                  <li key={path}>
                    <Link href={path} className="text-sm hover:underline">
                      {names[i]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Kolom 3: Kontak */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontak</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: info@byestunting.id</li>
              <li>Telepon: +62 123 4567 890</li>
            </ul>
          </div>

          {/* Kolom 4: Sosial Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Ikuti Kami</h3>
            <div className="flex justify-center space-x-4">
              {[
                { href: "#", label: "Facebook", iconPath: "M18 2h-3a5..." },
                { href: "#", label: "Twitter", iconPath: "M22 4s-.7..." },
                { href: "#", label: "Instagram", iconPath: "M16 11.37A..." },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="hover:text-blue-600 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{item.label}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d={item.iconPath} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Copyright */}
      <div className="border-t border-gray-300 p-5 bg-background text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} ByeStunting. Hak Cipta Dilindungi.
        </p>
      </div>
    </footer>
  );
}
