
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="bg-[#0b0b0b] text-white">

      <section className="relative min-h-[650px] flex items-center overflow-hidden">

        <img
          src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1800"
          alt="Luxury fashion collection"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-55"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-10 py-24">

          <p className="text-[#d6bd91] uppercase tracking-[0.35em] text-xs mb-6">
            The New Collection — 2026
          </p>

          <h1 className="font-['Cormorant_Garamond'] text-6xl md:text-8xl leading-[0.95] max-w-2xl">
            Define Your
            <span className="block italic text-[#d6bd91]">Own Style.</span>
          </h1>

          <p className="text-gray-300 max-w-md mt-7 leading-7 text-sm md:text-base">
            Discover timeless fashion, explore your identity and experience
            a new way to express your personal style.
          </p>

          <button className="mt-10 bg-[#d6bd91] text-black px-8 py-4 flex items-center gap-4 text-xs uppercase tracking-[0.2em] hover:bg-white transition">
            Explore Collection
            <ArrowRight size={17} />
          </button>

        </div>
      </section>

    </main>
  );
}
