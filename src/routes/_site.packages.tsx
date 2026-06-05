import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { packages } from "@/lib/site-data";
import { SectionHeading } from "@/components/SectionHeading";

export const Route = createFileRoute("/_site/packages")({
  head: () => ({
    meta: [
      { title: "Event Packages — Classic, Premium & Luxury | Aura Events" },
      { name: "description", content: "Transparent, customizable packages for every celebration — from budget-friendly to luxury destination events." },
      { property: "og:url", content: "/packages" },
    ],
    links: [{ rel: "canonical", href: "/packages" }],
  }),
  component: Packages,
});

const comparison = [
  { feature: "Senior Planner", classic: true, premium: true, luxury: true },
  { feature: "Themed Decoration", classic: "Basic", premium: "Custom Design", luxury: "Designer Installations" },
  { feature: "Photography", classic: "4 hrs", premium: "Photo + Video", luxury: "Cinematic Crew" },
  { feature: "Entertainment", classic: false, premium: "DJ", luxury: "Celebrity Artists" },
  { feature: "Guest Management", classic: false, premium: true, luxury: true },
  { feature: "Destination Planning", classic: false, premium: false, luxury: true },
  { feature: "Hospitality & Stay", classic: false, premium: "Coordination", luxury: "Premium" },
  { feature: "Custom Invites & Favours", classic: false, premium: "Standard", luxury: "Bespoke" },
];

export default function Packages() {
  return (
    <>
      <section className="bg-blush-gradient">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-20 md:py-28 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-gold mb-4">Packages</p>
          <h1 className="font-display text-5xl md:text-6xl">Crafted for every kind of celebration</h1>
          <p className="mt-5 max-w-2xl mx-auto text-muted-foreground text-lg">
            Choose a starting point — we'll tailor every detail to your family, story and budget.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20 grid md:grid-cols-3 gap-6">
        {packages.map((p) => (
          <div
            key={p.name}
            className={`relative rounded-3xl p-8 shadow-soft hover:shadow-luxe transition flex flex-col ${
              p.featured
                ? "bg-gold-gradient text-gold-foreground md:-translate-y-4 md:scale-[1.02]"
                : p.name === "Luxury"
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border"
            }`}
          >
            {p.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full">
                Most Loved
              </span>
            )}
            <p className="text-xs uppercase tracking-[0.3em] opacity-70">{p.name}</p>
            <h3 className="font-display text-3xl mt-2">{p.tagline}</h3>
            <p className="mt-4 text-sm opacity-80">Starting from</p>
            <p className="font-display text-5xl">{p.priceFrom}</p>
            <ul className="mt-6 space-y-2.5 text-sm flex-1">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="h-4 w-4 mt-0.5 shrink-0 opacity-80" /> {f}
                </li>
              ))}
            </ul>
            <Link
              to="/contact"
              className={`mt-7 inline-flex items-center justify-center px-5 py-3 rounded-full font-medium text-sm ${
                p.featured ? "bg-primary text-primary-foreground" : "bg-gold-gradient text-gold-foreground"
              }`}
            >
              Request Quotation
            </Link>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-5 lg:px-8 pb-20">
        <SectionHeading eyebrow="Compare" title="What's included in each package" />
        <div className="mt-10 overflow-x-auto rounded-2xl border border-border shadow-soft bg-card">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left p-4 font-medium">Feature</th>
                <th className="p-4 font-medium">Classic</th>
                <th className="p-4 font-medium bg-gold/10">Premium</th>
                <th className="p-4 font-medium">Luxury</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row, i) => (
                <tr key={row.feature} className={i % 2 ? "bg-secondary/40" : ""}>
                  <td className="p-4 font-medium">{row.feature}</td>
                  <Cell value={row.classic} />
                  <Cell value={row.premium} highlight />
                  <Cell value={row.luxury} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 lg:px-8 pb-24 text-center">
        <div className="rounded-3xl bg-primary text-primary-foreground p-10 md:p-14 shadow-luxe">
          <h2 className="font-display text-3xl md:text-4xl text-white">Want something completely custom?</h2>
          <p className="mt-3 text-white/80">Build your own package — we'll work to your budget and vision.</p>
          <Link to="/contact" className="mt-7 inline-flex px-7 py-3.5 rounded-full bg-gold-gradient text-gold-foreground font-medium">
            Customize Your Package
          </Link>
        </div>
      </section>
    </>
  );
}

function Cell({ value, highlight }: { value: boolean | string; highlight?: boolean }) {
  return (
    <td className={`p-4 text-center ${highlight ? "bg-gold/5" : ""}`}>
      {typeof value === "string" ? (
        <span className="text-sm">{value}</span>
      ) : value ? (
        <Check className="h-4 w-4 text-gold mx-auto" />
      ) : (
        <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />
      )}
    </td>
  );
}
