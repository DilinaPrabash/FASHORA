
const categories = [
  {
    name: "Women",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800",
  },
  {
    name: "Men",
    image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800",
  },
  {
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800",
  },
];

export default function CategorySection() {
  return (
    <section className="bg-[#0b0b0b] text-white px-6 md:px-10 py-24">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-14">
          <p className="text-[#d6bd91] uppercase tracking-[0.3em] text-xs mb-4">
            Discover Your Style
          </p>

          <h2 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl">
            Shop by Category
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {categories.map((category) => (
            <div
              key={category.name}
              className="relative h-[420px] overflow-hidden group cursor-pointer"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition" />

              <div className="absolute bottom-10 left-8">
                <h3 className="font-['Cormorant_Garamond'] text-4xl mb-3">
                  {category.name}
                </h3>

                <span className="text-xs tracking-[0.2em] uppercase border-b border-[#d6bd91] pb-2">
                  Explore Collection →
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
