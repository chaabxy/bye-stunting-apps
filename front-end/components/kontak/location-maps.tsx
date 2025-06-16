export function LocationMap() {
  return (
    <div className="mt-12">
      <h1 className="text-3xl md:text-4xl font-bold text-primary -300 mb-4 text-center">
        Lokasi <span className="text-secondary">Kami</span>
      </h1>
      <p className="text-muted-foreground -400 text-sm md:text-lg text-center mx-auto px-5 mb-10">
        Kunjungi lokasi kami untuk mengetahui lebih lanjut tentang upaya
        pencegahan stunting yang kami lakukan.
      </p>
      <div className="rounded-lg overflow-hidden shadow-md border border-blue-100 -900">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3958.405019954178!2d107.88682700000001!3d-7.194542999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zN8KwMTEnNDAuNCJTIDEwN8KwNTMnMTIuNiJF!5e0!3m2!1sid!2sid!4v1748594030096!5m2!1sid!2sid"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Lokasi ByeStunting"
          className="w-full"
        />
      </div>
    </div>
  );
}
