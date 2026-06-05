import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
}) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-2xl ${alignment}`}>
      {eyebrow && (
        <p className="text-xs uppercase tracking-[0.32em] text-gold mb-3">{eyebrow}</p>
      )}
      <h2 className="font-display text-3xl md:text-5xl text-foreground leading-tight">
        {title}
      </h2>
      {align === "center" && (
        <div className="mx-auto mt-4 h-px w-12 bg-gold-gradient" />
      )}
      {description && (
        <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
