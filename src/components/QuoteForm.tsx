import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check } from "lucide-react";
import { addDBInquiry } from "@/lib/db";

const phoneRegex = /^[+]?[0-9\s-]{10,15}$/;

const quoteSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(phoneRegex, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address"),
  event: z.string().min(1, "Please select an event type"),
  date: z.string().optional().or(z.literal("")),
  budget: z.string().optional().or(z.literal("")),
  message: z
    .string()
    .max(500, "Message cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

export function QuoteForm({ compact = false }: { compact?: boolean }) {
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      event: "",
      date: "",
      budget: "",
      message: "",
    },
  });

  const onSubmit = async (data: QuoteFormValues) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    try {
      await addDBInquiry({
        name: data.name,
        phone: data.phone,
        email: data.email,
        event: data.event,
        date: data.date || "",
        budget: data.budget || "",
        message: data.message || "",
      });
    } catch (err) {
      console.error("Failed to save inquiry to Firestore:", err);
    }

    setDone(true);
  };

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
      onSubmit={handleSubmit(onSubmit)}
      className={`rounded-2xl bg-card border border-border shadow-soft ${
        compact ? "p-5" : "p-6 md:p-8"
      }`}
      noValidate
    >
      <h3 className="font-display text-2xl text-foreground">Request a Free Quote</h3>
      <p className="text-sm text-muted-foreground mt-1">
        Tell us about your event — we'll do the rest.
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <Input
          label="Full Name"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Phone / WhatsApp"
          placeholder="e.g. +91 98765 43210"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <Input
          label="Email"
          type="email"
          placeholder="e.g. hello@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Select
          label="Event Type"
          error={errors.event?.message}
          options={[
            "Destination Wedding",
            "Engagement",
            "Birthday",
            "Anniversary",
            "Baby Shower",
            "Family Function",
            "Housewarming",
            "Corporate",
          ]}
          {...register("event")}
        />
        <Input
          label="Event Date"
          type="date"
          error={errors.date?.message}
          {...register("date")}
        />
        <Select
          label="Estimated Budget"
          error={errors.budget?.message}
          options={[
            "Under ₹2L",
            "₹2L – ₹5L",
            "₹5L – ₹15L",
            "₹15L – ₹50L",
            "₹50L+",
          ]}
          {...register("budget")}
        />
      </div>

      <Textarea
        label="Tell us your vision"
        error={errors.message?.message}
        rows={3}
        placeholder="Theme, city, guest count, anything special..."
        className="mt-3"
        {...register("message")}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 w-full inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-gold-gradient text-gold-foreground font-medium tracking-wide hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-soft"
      >
        {isSubmitting ? "Sending Inquiry..." : "Send My Inquiry"}
      </button>
      <p className="mt-3 text-[11px] text-center text-muted-foreground">
        We respect your privacy. No spam — ever.
      </p>
    </form>
  );
}

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }
>(({ label, error, ...props }, ref) => {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground tracking-wide">
        {label}
      </span>
      <input
        ref={ref}
        {...props}
        className={`mt-1.5 w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
          error
            ? "border-destructive focus:ring-destructive/30"
            : "border-input focus:ring-gold/40"
        }`}
      />
      {error && (
        <span className="text-xs text-destructive mt-1 block animate-float-up">
          {error}
        </span>
      )}
    </label>
  );
});
Input.displayName = "Input";

const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    label: string;
    options: string[];
    error?: string;
  }
>(({ label, options, error, ...props }, ref) => {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground tracking-wide">
        {label}
      </span>
      <select
        ref={ref}
        {...props}
        className={`mt-1.5 w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
          error
            ? "border-destructive focus:ring-destructive/30"
            : "border-input focus:ring-gold/40"
        }`}
      >
        <option value="">Select...</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-xs text-destructive mt-1 block animate-float-up">
          {error}
        </span>
      )}
    </label>
  );
});
Select.displayName = "Select";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
    error?: string;
  }
>(({ label, error, className = "", ...props }, ref) => {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-medium text-muted-foreground tracking-wide">
        {label}
      </span>
      <textarea
        ref={ref}
        {...props}
        className={`mt-1.5 w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
          error
            ? "border-destructive focus:ring-destructive/30"
            : "border-input focus:ring-gold/40"
        }`}
      />
      {error && (
        <span className="text-xs text-destructive mt-1 block animate-float-up">
          {error}
        </span>
      )}
    </label>
  );
});
Textarea.displayName = "Textarea";
