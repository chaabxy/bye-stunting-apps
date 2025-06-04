import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="container mx-auto px-4 md:px-6 text-center justify-center text-black bg-card py-8 md:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-items-center md:ml-10 lg:ml-14">
          {/* Kolom 1: Logo dan Deskripsi */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">
              ByeStunting
            </h3>
            <p className="text-xs md:text-sm leading-relaxed max-w-xs mx-auto sm:mx-0">
              Aplikasi untuk memantau tumbuh kembang anak dan mencegah stunting
              dengan dukungan AI.
            </p>
          </div>

          {/* Kolom 2: Tautan Navigasi */}
          <div className="text-center sm:text-left">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">
              Tautan
            </h3>
            <ul className="space-y-2">
              {["/", "/cek-stunting", "/edukasi", "/kontak"].map((path, i) => {
                const names = ["Home", "Cek Stunting", "Edukasi", "Kontak"];
                return (
                  <li key={path}>
                    <Link
                      href={path}
                      className="text-xs md:text-sm hover:underline"
                    >
                      {names[i]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Kolom 3: Kontak */}
          <div className="text-center sm:text-left lg:ml-5">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">
              Kontak
            </h3>
            <ul className="space-y-2 text-xs md:text-sm">
              <li>Email: info@byestunting.id</li>
              <li>Telepon: +62 123 4567 890</li>
            </ul>
          </div>

          {/* Kolom 4: Sosial Media */}
          <div className="text-center sm:text-left lg:ml-10">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 ">
              Ikuti Kami
            </h3>
            <div className="flex justify-center sm:justify-start">
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
      <div className="border-t border-gray-300 p-4 md:p-5 bg-background text-center">
        <p className="text-xs md:text-sm">
          &copy; {new Date().getFullYear()} ByeStunting. Hak Cipta Dilindungi.
        </p>
      </div>
    </footer>
  );
}
