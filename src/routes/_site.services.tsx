import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/SectionHeading";
import { services } from "@/lib/site-data";
import { Check, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_site/services")({
  head: () => ({
    meta: [
      { title: "Our Services — Destination Weddings, Birthdays & More | Aura Events" },
      { name: "description", content: "End-to-end planning for destination weddings, engagements, birthdays, anniversaries, baby showers, and corporate events across India." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: Services,
});

function Services() {
  return (
    <>
      <section className="bg-blush-gradient">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-20 md:py-28 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-gold mb-4">Our Services</p>
          <h1 className="font-display text-5xl md:text-6xl">A celebration for every chapter of life</h1>
          <p className="mt-5 max-w-2xl mx-auto text-muted-foreground text-lg">
            From the first roka to milestone birthdays — every event is led by a
            senior planner and styled by our in-house design studio.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20 md:py-24 space-y-20">
        {services.map((s, i) => (
          <article key={s.slug} className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
            <div className="relative">
              <img src={s.image} alt={s.title} loading="lazy" className="rounded-3xl shadow-luxe aspect-[4/5] object-cover w-full" />
              <div className="absolute -bottom-5 -right-5 h-24 w-24 rounded-2xl bg-gold-gradient hidden md:block" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3">0{i + 1}</p>
              <h2 className="font-display text-3xl md:text-5xl leading-tight">{s.title}</h2>
              <p className="mt-5 text-muted-foreground leading-relaxed text-lg">{s.description}</p>
              <ul className="mt-6 grid sm:grid-cols-2 gap-3">
                {s.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 mt-0.5 text-gold shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="mt-7 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold-gradient text-gold-foreground font-medium">
                Inquire about {s.title.split(" ")[0]} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
