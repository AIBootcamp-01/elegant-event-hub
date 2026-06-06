import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Heart, Award, Users, Star, ArrowRight, Check } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { QuoteForm } from "@/components/QuoteForm";
import { images, services, packages, stats, testimonials, portfolio } from "@/lib/site-data";
import { getHero, getServices, getPackages, getGallery, getTestimonials } from "@/lib/db";

export const Route = createFileRoute("/_site/")({
  head: () => ({
    meta: [
      { title: "Aura Events — Creating Unforgettable Celebrations" },
      { name: "description", content: "Luxury destination weddings, birthdays, engagements and family events planned end-to-end across India." },
      { property: "og:title", content: "Aura Events — Creating Unforgettable Celebrations" },
      { property: "og:description", content: "Luxury destination weddings and celebrations planned across India." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  const [hero, setHero] = useState({
    headline: "Creating Unforgettable Celebrations",
    tagline: "From intimate family gatherings to grand destination weddings, we bring your dream events to life — with elegance, soul, and flawless detail.",
    imageUrl: images.heroWedding,
  });
  const [servicesData, setServicesData] = useState(services);
  const [packagesData, setPackagesData] = useState(packages);
  const [portfolioData, setPortfolioData] = useState(portfolio);
  const [testimonialsData, setTestimonialsData] = useState(testimonials);

  useEffect(() => {
    async function loadData() {
      try {
        const dbHero = await getHero();
        if (dbHero) {
          setHero({
            headline: dbHero.headline,
            tagline: dbHero.tagline,
            imageUrl: dbHero.imageUrl || images.heroWedding,
          });
        }

        const dbServices = await getServices();
        if (dbServices.length > 0) {
          setServicesData(
            dbServices.map((s) => ({
              ...s,
              image: s.image || (services.find((ds) => ds.slug === s.slug)?.image || images.heroWedding),
            }))
          );
        }

        const dbPackages = await getPackages();
        if (dbPackages.length > 0) {
          setPackagesData(dbPackages);
        }

        const dbGallery = await getGallery();
        if (dbGallery.length > 0) {
          setPortfolioData(
            dbGallery.map((g, i) => ({
              src: g.src || (portfolio[i % portfolio.length]?.src || images.heroWedding),
              title: g.title,
              category: g.category,
            }))
          );
        }

        const dbTestimonials = await getTestimonials();
        if (dbTestimonials.length > 0) {
          setTestimonialsData(dbTestimonials);
        }
      } catch (e) {
        console.error("Failed to load firestore data, using static defaults:", e);
      }
    }
    loadData();
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[88vh] -mt-20 flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={hero.imageUrl}
            alt="Indian destination wedding mandap"
            className="h-full w-full object-cover animate-slow-zoom"
            width={1920}
            height={1280}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/20 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/50 via-transparent to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 pt-32 pb-24 w-full">
          <div className="max-w-2xl text-primary-foreground animate-float-up">
            <p className="text-xs uppercase tracking-[0.4em] text-gold mb-5">Est. 2012 · India</p>
            <h1 className="font-display text-5xl md:text-7xl leading-[1.05] text-white">
              {hero.headline.split(" ").map((w, idx, arr) => 
                idx === arr.length - 2 ? <span key={idx}><em className="not-italic text-gold-gradient">{w} </em></span> : w + " "
              )}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/85 leading-relaxed max-w-xl">
              {hero.tagline}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-gold-gradient text-gold-foreground font-medium tracking-wide shadow-luxe hover:opacity-90 transition"
              >
                Get a Free Quote <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/packages"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-white/40 text-white backdrop-blur-sm hover:bg-white/10 transition"
              >
                View Packages
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-6 text-white/80">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-9 w-9 rounded-full border-2 border-white bg-gradient-to-br from-blush to-gold" />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-gold">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="text-sm mt-0.5">Rated 4.9 by 850+ happy families</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-blush-gradient">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-4xl md:text-5xl text-gold-gradient">{s.value}</div>
              <div className="mt-2 text-xs md:text-sm uppercase tracking-[0.2em] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20 md:py-28">
        <SectionHeading
          eyebrow="Why Choose Aura"
          title={<>Where every detail <em className="not-italic text-gold-gradient">feels personal</em></>}
          description="For over a decade, we've designed celebrations that families remember for a lifetime. Our work is rooted in trust, taste, and tireless craft."
        />
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {[
            { icon: Sparkles, title: "Designer-Led Decor", text: "Every event is styled by our in-house design studio — never templated." },
            { icon: Heart, title: "Family-First Hospitality", text: "We treat your guests like our own. From welcome hampers to farewell hugs." },
            { icon: Award, title: "Pan-India Execution", text: "42 cities and counting. Wherever you dream, we deliver — flawlessly." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="group rounded-2xl bg-card border border-border p-8 shadow-soft hover:shadow-luxe transition-all hover:-translate-y-1">
              <div className="h-12 w-12 rounded-full bg-gold-gradient text-gold-foreground inline-flex items-center justify-center mb-5">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-2xl text-foreground">{title}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES OVERVIEW */}
      <section className="bg-secondary/60">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-20 md:py-28">
          <SectionHeading eyebrow="Our Services" title="A celebration for every milestone" />
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {servicesData.slice(0, 8).map((s) => (
              <Link
                key={s.slug}
                to="/services"
                className="group relative overflow-hidden rounded-2xl aspect-[3/4] block shadow-soft hover:shadow-luxe transition-shadow"
              >
                <img
                  src={s.image}
                  alt={s.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/30 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-5 text-primary-foreground">
                  <h3 className="font-display text-xl">{s.title}</h3>
                  <span className="text-xs text-gold inline-flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition">
                    Discover <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PACKAGES */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20 md:py-28">
        <SectionHeading
          eyebrow="Featured Packages"
          title="Crafted for every kind of celebration"
          description="Transparent pricing. Fully customizable. Pick a starting point and we'll tailor every detail."
        />
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {packagesData.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-3xl p-8 shadow-soft hover:shadow-luxe transition flex flex-col ${
                p.featured
                  ? "bg-gold-gradient text-gold-foreground md:-translate-y-4 md:scale-[1.02]"
                  : p.name === "Luxury"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-foreground"
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
              <p className="font-display text-4xl">{p.priceFrom}</p>
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
                  p.featured
                    ? "bg-primary text-primary-foreground"
                    : p.name === "Luxury"
                    ? "bg-gold-gradient text-gold-foreground"
                    : "bg-gold-gradient text-gold-foreground"
                }`}
              >
                Request Quotation
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section className="bg-secondary/60">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-20 md:py-28">
          <SectionHeading eyebrow="Previous Events" title="A glimpse into our world" />
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {portfolioData.map((p, i) => (
              <div
                key={p.title}
                className={`relative overflow-hidden rounded-2xl group ${
                  i === 0 || i === 5 ? "md:row-span-2 md:aspect-[3/4]" : "aspect-square"
                }`}
              >
                <img src={p.src} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition" />
                <div className="absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition">
                  <p className="text-xs text-gold uppercase tracking-wider">{p.category}</p>
                  <p className="font-display text-lg">{p.title}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/portfolio" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-foreground/20 text-foreground hover:bg-foreground hover:text-background transition">
              View Full Portfolio <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20 md:py-28">
        <SectionHeading eyebrow="Kind Words" title="Loved by families across India" />
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {testimonialsData.map((t) => (
            <figure key={t.name} className="rounded-2xl bg-card border border-border p-7 shadow-soft">
              <div className="flex text-gold mb-4">
                {[...Array(t.rating)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <blockquote className="font-display text-xl leading-relaxed text-foreground">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-5 pt-5 border-t border-border">
                <p className="font-medium">{t.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t.event}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={images.reception} alt="" className="h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-primary/85" />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 py-20 md:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-primary-foreground">
            <p className="text-xs uppercase tracking-[0.32em] text-gold mb-4">Let's begin</p>
            <h2 className="font-display text-4xl md:text-5xl leading-tight text-white">
              Your celebration deserves to be <em className="not-italic text-gold-gradient">unforgettable</em>.
            </h2>
            <p className="mt-5 text-white/80 text-lg max-w-md">
              Share your vision with our planners. We'll respond within 24 hours with ideas, options, and a personalized quote.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="tel:+919876543210" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold-gradient text-gold-foreground font-medium">
                <Users className="h-4 w-4" /> Schedule Consultation
              </a>
            </div>
          </div>
          <div>
            <QuoteForm />
          </div>
        </div>
      </section>
    </>
  );
}
