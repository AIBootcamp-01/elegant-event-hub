import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { testimonials as defaultTestimonials, images } from "@/lib/site-data";
import { getTestimonials } from "@/lib/db";

export const Route = createFileRoute("/_site/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials — Client Stories | Aura Events" },
      { name: "description", content: "Real stories from families who trusted Aura Events with their most precious milestones." },
      { property: "og:url", content: "/testimonials" },
    ],
    links: [{ rel: "canonical", href: "/testimonials" }],
  }),
  component: Testimonials,
});

const defaultExtended = [
  ...defaultTestimonials,
  { name: "Sneha & Karan Iyer", event: "Sangeet · Jaipur", quote: "We danced till 3 AM. Everyone is still talking about the decor and the food.", rating: 5 },
  { name: "The Reddy Family", event: "Baby Shower · Hyderabad", quote: "So thoughtful with every detail — even our grandparents felt looked after.", rating: 5 },
  { name: "Vikram Singh", event: "50th Birthday · Delhi", quote: "Aura made my wife's surprise birthday a moment we'll never forget.", rating: 5 },
];

function Testimonials() {
  const [testimonialsData, setTestimonialsData] = useState(defaultExtended);

  useEffect(() => {
    async function loadData() {
      try {
        const dbTestimonials = await getTestimonials();
        if (dbTestimonials.length > 0) {
          setTestimonialsData(dbTestimonials);
        }
      } catch (e) {
        console.error("Failed to load testimonials from Firestore, using static defaults:", e);
      }
    }
    loadData();
  }, []);

  return (
    <>
      <section className="bg-blush-gradient">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-20 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-gold mb-4">Testimonials</p>
          <h1 className="font-display text-5xl md:text-6xl">Kind words from kind families</h1>
          <div className="mt-6 inline-flex items-center gap-2 text-gold">
            {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
            <span className="text-foreground ml-2 font-medium">4.9 / 5 · 850+ reviews</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonialsData.map((t, i) => (
          <figure key={t.name + i} className="rounded-2xl bg-card border border-border p-7 shadow-soft">
            <div className="flex text-gold mb-4">
              {[...Array(t.rating)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
            </div>
            <blockquote className="font-display text-xl leading-relaxed">"{t.quote}"</blockquote>
            <figcaption className="mt-5 pt-5 border-t border-border flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blush to-gold" />
              <div>
                <p className="font-medium text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.event}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </section>

      <section className="relative overflow-hidden mb-20">
        <img src={images.heroWedding} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-primary/85" />
        <div className="relative mx-auto max-w-3xl px-5 lg:px-8 py-20 text-center text-white">
          <h2 className="font-display text-3xl md:text-4xl">Be our next happy story.</h2>
          <p className="mt-3 text-white/80">Let's plan a celebration your family will talk about for years.</p>
        </div>
      </section>
    </>
  );
}
