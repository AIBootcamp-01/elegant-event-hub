import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Phone, MessageCircle, Instagram, Facebook, Mail, MapPin } from "lucide-react";

const WHATSAPP = "+919876543210";
const PHONE = "+91 98765 43210";
const EMAIL = "hello@auraevents.in";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/packages", label: "Packages" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteLayout() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { location } = useRouterState();

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 bg-background/95 backdrop-blur-md border-b border-border/60 ${
          scrolled
            ? "py-3"
            : "py-5"
        }`}
      >
        <div className="mx-auto max-w-7xl px-5 lg:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gold-gradient text-gold-foreground font-display text-lg shadow-soft">
              A
            </span>
            <span className="font-display text-xl tracking-wide text-foreground">
              Aura <span className="text-gold-gradient">Events</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((n) => {
              const active = location.pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`px-4 py-2 text-sm tracking-wide transition-colors relative ${
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {n.label}
                  {active && (
                    <span className="absolute left-1/2 -bottom-0.5 -translate-x-1/2 h-px w-6 bg-gold-gradient" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${WHATSAPP}`}
              className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
            >
              <Phone className="h-4 w-4" /> {PHONE}
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-gold-gradient text-gold-foreground text-sm font-medium tracking-wide hover:opacity-90 transition shadow-soft"
            >
              Get a Quote
            </Link>
          </div>

          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center rounded-full p-2 text-foreground"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden mx-5 mt-3 rounded-2xl bg-card border border-border shadow-luxe p-4 animate-float-up">
            <nav className="flex flex-col">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className="px-3 py-3 text-base text-foreground border-b border-border/60 last:border-0"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <a
                href={`tel:${WHATSAPP}`}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-full border border-border text-sm"
              >
                <Phone className="h-4 w-4" /> Call
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-full bg-gold-gradient text-gold-foreground text-sm"
              >
                Get Quote
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 pt-20">
        <Outlet />
      </main>

      <footer className="bg-primary text-primary-foreground mt-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gold-gradient text-gold-foreground font-display text-lg">
                A
              </span>
              <span className="font-display text-xl">Aura Events</span>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              India's premier destination wedding & celebrations house. Crafting
              unforgettable moments since 2012.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="#" className="h-9 w-9 rounded-full border border-primary-foreground/20 inline-flex items-center justify-center hover:bg-gold hover:text-gold-foreground transition">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 rounded-full border border-primary-foreground/20 inline-flex items-center justify-center hover:bg-gold hover:text-gold-foreground transition">
                <Facebook className="h-4 w-4" />
              </a>
              <a href={`https://wa.me/${WHATSAPP.replace(/\D/g, "")}`} className="h-9 w-9 rounded-full border border-primary-foreground/20 inline-flex items-center justify-center hover:bg-gold hover:text-gold-foreground transition">
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-[0.2em] text-gold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              {nav.map((n) => (
                <li key={n.to}><Link to={n.to} className="hover:text-gold transition">{n.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-[0.2em] text-gold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>Destination Weddings</li>
              <li>Engagement & Sangeet</li>
              <li>Birthday Celebrations</li>
              <li>Anniversary & Baby Showers</li>
              <li>Corporate Events</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-[0.2em] text-gold mb-4">Reach Us</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-gold" /> 14, Lotus Avenue, Bandra West, Mumbai 400050</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" /> {PHONE}</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /> {EMAIL}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10">
          <div className="mx-auto max-w-7xl px-5 lg:px-8 py-5 text-xs text-primary-foreground/60 flex flex-wrap items-center justify-between gap-2">
            <p>© {new Date().getFullYear()} Aura Events. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <span>Crafted with love across India.</span>
              <span className="text-primary-foreground/25">|</span>
              <Link to="/admin" className="hover:text-gold transition">Staff Portal</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href={`https://wa.me/${WHATSAPP.replace(/\D/g, "")}?text=Hi%20Aura%20Events%2C%20I%27d%20like%20to%20plan%20an%20event.`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full bg-[#25D366] text-white inline-flex items-center justify-center shadow-luxe hover:scale-105 transition"
      >
        <MessageCircle className="h-7 w-7" />
        <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping" />
      </a>

      {/* Mobile Call button */}
      <a
        href={`tel:${WHATSAPP}`}
        aria-label="Call now"
        className="lg:hidden fixed bottom-5 left-5 z-50 h-14 w-14 rounded-full bg-gold-gradient text-gold-foreground inline-flex items-center justify-center shadow-luxe"
      >
        <Phone className="h-6 w-6" />
      </a>
    </div>
  );
}
