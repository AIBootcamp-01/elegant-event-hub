import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MapPin, MessageCircle, Instagram, Facebook } from "lucide-react";
import { QuoteForm } from "@/components/QuoteForm";

export const Route = createFileRoute("/_site/contact")({
  head: () => ({
    meta: [
      { title: "Contact Aura Events — Plan Your Celebration" },
      { name: "description", content: "Get in touch for a free quote, consultation, or destination event planning. WhatsApp, call, or fill our quick inquiry form." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  return (
    <>
      <section className="bg-blush-gradient">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-20 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-gold mb-4">Contact</p>
          <h1 className="font-display text-5xl md:text-6xl">Let's plan something <em className="not-italic text-gold-gradient">beautiful</em></h1>
          <p className="mt-5 max-w-xl mx-auto text-muted-foreground text-lg">
            Reach out via your favourite channel — we typically respond within an hour during business hours.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16 grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          {[
            { icon: Phone, label: "Call us", value: "+91 98765 43210", href: "tel:+919876543210" },
            { icon: MessageCircle, label: "WhatsApp", value: "Chat with a planner", href: "https://wa.me/919876543210" },
            { icon: Mail, label: "Email", value: "hello@auraevents.in", href: "mailto:hello@auraevents.in" },
            { icon: MapPin, label: "Studio", value: "14, Lotus Avenue, Bandra West, Mumbai 400050" },
          ].map(({ icon: Icon, label, value, href }) => (
            <a
              key={label}
              href={href}
              className="flex items-start gap-5 p-6 rounded-2xl bg-card border border-border shadow-soft hover:shadow-luxe transition"
            >
              <div className="h-12 w-12 rounded-full bg-gold-gradient text-gold-foreground inline-flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{label}</p>
                <p className="mt-1 font-display text-xl">{value}</p>
              </div>
            </a>
          ))}

          <div className="flex items-center gap-3 pt-2">
            <a href="#" className="h-11 w-11 rounded-full border border-border inline-flex items-center justify-center hover:bg-gold hover:text-gold-foreground transition"><Instagram className="h-5 w-5" /></a>
            <a href="#" className="h-11 w-11 rounded-full border border-border inline-flex items-center justify-center hover:bg-gold hover:text-gold-foreground transition"><Facebook className="h-5 w-5" /></a>
          </div>

          <div className="rounded-2xl overflow-hidden border border-border shadow-soft aspect-[4/3]">
            <iframe
              title="Aura Events location"
              src="https://www.google.com/maps?q=Bandra%20West%20Mumbai&output=embed"
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="lg:sticky lg:top-28 self-start">
          <QuoteForm />
        </div>
      </section>
    </>
  );
}
