interface HeroSectionProps {
  title: string;
  subtitle: string;
}

export function HeroSection({ title, subtitle }: HeroSectionProps) {
  return (
    <div className="relative rounded-3xl overflow-hidden mb-16 shadow-xl h-[160px]">
      {/* Gradient latar belakang */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-cyan-500/90 z-10"></div>

      {/* Kotak div pengganti gambar */}
      <div className="absolute inset-0 z-0 bg-blue-200 -900"></div>

      {/* Konten teks */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white p-4">
        <h2 className="text-xl md:text-3xl font-bold mb-2 text-center">
          {title}
        </h2>
        <p className="text-sm md:text-lg max-w-xl text-center">{subtitle}</p>
      </div>
    </div>
  );
}
