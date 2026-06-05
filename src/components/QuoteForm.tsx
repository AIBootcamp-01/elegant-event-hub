import { useState } from "react";
import { Check } from "lucide-react";

export function QuoteForm({ compact = false }: { compact?: boolean }) {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="rounded-2xl bg-card p-8 text-center shadow-soft border border-border">
        <div className="mx-auto h-12 w-12 rounded-full bg-gold-gradient inline-flex items-center justify-center text-gold-foreground">
          <Check className="h-6 w-6" />
        </div>
        <h3 className="mt-4 font-display text-2xl">Thank you!</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Our planner will reach out within 24 hours to design your celebration.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
      className={`rounded-2xl bg-card border border-border shadow-soft ${
        compact ? "p-5" : "p-6 md:p-8"
      }`}
    >
      <h3 className="font-display text-2xl text-foreground">Request a Free Quote</h3>
      <p className="text-sm text-muted-foreground mt-1">Tell us about your event — we'll do the rest.</p>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <Input label="Full Name" name="name" required />
        <Input label="Phone / WhatsApp" name="phone" required />
        <Input label="Email" type="email" name="email" required />
        <Select label="Event Type" name="event" options={[
          "Destination Wedding", "Engagement", "Birthday", "Anniversary",
          "Baby Shower", "Family Function", "Housewarming", "Corporate",
        ]} />
        <Input label="Event Date" type="date" name="date" />
        <Select label="Estimated Budget" name="budget" options={[
          "Under ₹2L", "₹2L – ₹5L", "₹5L – ₹15L", "₹15L – ₹50L", "₹50L+",
        ]} />
      </div>

      <label className="block mt-3">
        <span className="text-xs font-medium text-muted-foreground tracking-wide">Tell us your vision</span>
        <textarea
          name="message"
          rows={3}
          className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
          placeholder="Theme, city, guest count, anything special..."
        />
      </label>

      <button
        type="submit"
        className="mt-5 w-full inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-gold-gradient text-gold-foreground font-medium tracking-wide hover:opacity-90 transition shadow-soft"
      >
        Send My Inquiry
      </button>
      <p className="mt-3 text-[11px] text-center text-muted-foreground">
        We respect your privacy. No spam — ever.
      </p>
    </form>
  );
}

function Input({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground tracking-wide">{label}</span>
      <input
        {...props}
        className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
      />
    </label>
  );
}

function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground tracking-wide">{label}</span>
      <select
        name={name}
        className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
      >
        <option value="">Select...</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
