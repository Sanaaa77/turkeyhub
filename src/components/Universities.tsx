import React from "react";
import { Star, MapPin } from "lucide-react";

const universities = [
  { name: "دانشگاه باهچه‌شهیر", city: "استانبول", rank: "Top 500", img: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800" },
  { name: "دانشگاه کوچ", city: "استانبول", rank: "Top 400", img: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800" },
  { name: "دانشگاه بیلکنت", city: "آنکارا", rank: "Top 600", img: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=800" },
];

export const Universities = () => {
  return (
    <section className="py-24 px-6 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">دانشگاه‌های برتر</h2>
            <p className="opacity-60">انتخاب از میان معتبرترین مراکز آموزشی ترکیه</p>
          </div>
          <button className="text-primary font-bold hover:underline">مشاهده همه دانشگاه‌ها</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {universities.map((uni, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="relative h-64 rounded-3xl overflow-hidden mb-6">
                <img
                  src={uni.img}
                  alt={uni.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full text-xs font-bold">
                  {uni.rank}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{uni.name}</h3>
              <div className="flex items-center gap-2 opacity-60 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{uni.city}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
