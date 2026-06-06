import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { X } from "lucide-react";
import { portfolio as defaultPortfolio, images } from "@/lib/site-data";
import { getGallery } from "@/lib/db";

export const Route = createFileRoute("/_site/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Previous Events & Weddings | Aura Events" },
      { name: "description", content: "Browse our portfolio of destination weddings, birthdays, family functions and decor setups across India." },
      { property: "og:url", content: "/portfolio" },
    ],
    links: [{ rel: "canonical", href: "/portfolio" }],
  }),
  component: Portfolio,
});

const categories = ["All", "Wedding", "Engagement", "Birthday", "Anniversary", "Baby Shower", "Corporate"];

function Portfolio() {
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState<number | null>(null);
  const [portfolioData, setPortfolioData] = useState(defaultPortfolio);

  useEffect(() => {
    async function loadData() {
      try {
        const dbGallery = await getGallery();
        if (dbGallery.length > 0) {
          setPortfolioData(
            dbGallery.map((g, i) => ({
              src: g.src || (defaultPortfolio[i % defaultPortfolio.length]?.src || images.heroWedding),
              title: g.title,
              category: g.category,
            }))
          );
        }
      } catch (e) {
        console.error("Failed to load gallery from Firestore, using static defaults:", e);
      }
    }
    loadData();
  }, []);

  const items = filter === "All" ? portfolioData : portfolioData.filter((p) => p.category === filter);

  return (
    <>
      <section className="bg-blush-gradient">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-20 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-gold mb-4">Portfolio</p>
          <h1 className="font-display text-5xl md:text-6xl">Stories we've helped tell</h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-14">
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-2 rounded-full text-sm transition border ${
                filter === c
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
          {items.map((p, i) => (
            <button
              key={p.title + i}
              onClick={() => setActive(i)}
              className="group relative overflow-hidden rounded-2xl aspect-[4/5] text-left cursor-pointer"
            >
              <img src={p.src} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/10 to-transparent opacity-70 group-hover:opacity-100 transition" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold">{p.category}</p>
                <p className="font-display text-lg mt-1">{p.title}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {active !== null && (
        <div
          onClick={() => setActive(null)}
          className="fixed inset-0 z-[60] bg-primary/90 backdrop-blur-sm flex items-center justify-center p-5 animate-float-up cursor-pointer"
        >
          <button className="absolute top-5 right-5 text-white p-2" onClick={() => setActive(null)}>
            <X className="h-6 w-6" />
          </button>
          <div className="max-w-4xl w-full">
            <img src={items[active].src} alt={items[active].title} className="rounded-2xl w-full max-h-[80vh] object-contain" />
            <div className="text-center text-white mt-4">
              <p className="text-xs uppercase tracking-[0.3em] text-gold">{items[active].category}</p>
              <p className="font-display text-2xl mt-1">{items[active].title}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
