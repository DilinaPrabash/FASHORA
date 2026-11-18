
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const collections = [
  {
    id: 1,
    name: "Women's Collection",
    subtitle: "Elegance in every detail",
    category: "Women",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000",
    number: "01",
  },
  {
    id: 2,
    name: "Men's Collection",
    subtitle: "Redefine your everyday style",
    category: "Men",
    image:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1000",
    number: "02",
  },
  {
    id: 3,
    name: "Footwear Collection",
    subtitle: "Step into something different",
    category: "Shoes",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000",
    number: "03",
  },
  {
    id: 4,
    name: "Accessories",
    subtitle: "The finishing touch",
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1000",
    number: "04",
  },
];

export default function Collections() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">

      {/* Hero Section */}
      <section className="relative min-h-[420px] md:min-h-[520px] flex items-center justify-center text-center px-6 overflow-hidden">

        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1800"
          alt="Fashion collection"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 max-w-3xl">

          <p className="text-[#d6bd91] text-xs tracking-[0.4em] uppercase mb-6">
            Curated For You
          </p>

          <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-7xl lg:text-8xl mb-6">
            Discover Your Style
          </h1>

          <p className="text-gray-300 text-sm md:text-base leading-7 max-w-xl mx-auto">
            Explore carefully selected collections designed
            to inspire your everyday fashion.
          </p>

          <a
            href="#collections"
            className="inline-flex items-center gap-3 mt-9 bg-[#d6bd91] text-black px-8 py-4 text-xs tracking-[0.2em] uppercase hover:bg-white transition"
          >
            Explore Collections
            <ArrowUpRight size={16} />
          </a>

        </div>
      </section>

      {/* Collection Heading */}
      <section
        id="collections"
        className="max-w-7xl mx-auto px-6 md:px-10 py-20"
      >

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-12">

          <div>
            <p className="text-[#d6bd91] text-xs tracking-[0.3em] uppercase mb-4">
              Find Your Inspiration
            </p>

            <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-6xl">
              Our Collections
            </h2>
          </div>

          <p className="text-gray-400 text-sm max-w-sm leading-6">
            From timeless essentials to modern statement pieces,
            find the collection that speaks to you.
          </p>

        </div>

        {/* Collection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">

          {collections.map((collection) => (
            <Link
              key={collection.id}
              to={`/products?category=${collection.category}`}
              className="group relative h-[420px] md:h-[520px] overflow-hidden bg-[#171717]"
            >

              <img
                src={collection.image}
                alt={collection.name}
                loading="lazy"
                className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
              />

              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

              {/* Collection Content */}
              <div className="absolute inset-0 p-7 md:p-10 flex flex-col justify-between">

                <div className="flex justify-between items-start">
                  <span className="text-white/70 text-xs tracking-[0.2em]">
                    COLLECTION {collection.number}
                  </span>

                  <span className="w-11 h-11 rounded-full border border-white/50 flex items-center justify-center text-white group-hover:bg-[#d6bd91] group-hover:text-black group-hover:border-[#d6bd91] transition">
                    <ArrowUpRight size={20} />
                  </span>
                </div>

                <div>
                  <p className="text-[#d6bd91] text-xs tracking-[0.2em] uppercase mb-3">
                    {collection.subtitle}
                  </p>

                  <h3 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl mb-5">
                    {collection.name}
                  </h3>

                  <span className="inline-block border-b border-[#d6bd91] pb-2 text-xs tracking-[0.2em] uppercase">
                    Explore Collection
                  </span>
                </div>

              </div>

            </Link>
          ))}

        </div>
      </section>

      {/* Bottom Banner */}
      <section className="border-t border-white/10 py-20 px-6 text-center">

        <p className="text-[#d6bd91] text-xs tracking-[0.3em] uppercase mb-5">
          FASHORA Lifestyle
        </p>

        <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-6xl mb-6">
          Style Is A Way Of Life.
        </h2>

        <p className="text-gray-400 text-sm mb-8">
          Find pieces that express who you are.
        </p>

        <Link
          to="/products"
          className="inline-flex items-center gap-3 bg-[#d6bd91] text-black px-8 py-4 text-xs tracking-[0.2em] uppercase hover:bg-white transition"
        >
          Shop All Products
          <ArrowUpRight size={16} />
        </Link>

      </section>

    </main>
  );
}


