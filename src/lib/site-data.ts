import heroWedding from "@/assets/hero-wedding.jpg";
import birthday from "@/assets/event-birthday.jpg";
import engagement from "@/assets/event-engagement.jpg";
import anniversary from "@/assets/event-anniversary.jpg";
import babyshower from "@/assets/event-babyshower.jpg";
import reception from "@/assets/event-reception.jpg";
import haldi from "@/assets/event-haldi.jpg";
import corporate from "@/assets/event-corporate.jpg";

export const images = {
  heroWedding, birthday, engagement, anniversary, babyshower, reception, haldi, corporate,
};

export const services = [
  {
    slug: "destination-weddings",
    title: "Destination Weddings",
    image: heroWedding,
    description:
      "From Udaipur palaces to Goa beaches — we orchestrate every ritual, every guest moment, every petal.",
    features: ["Venue scouting across India", "Guest travel & hospitality", "Multi-day ritual planning", "Cinematography & decor"],
  },
  {
    slug: "engagement-ceremonies",
    title: "Engagement Ceremonies",
    image: engagement,
    description: "Intimate roka, ring exchange and sangeet evenings styled with timeless elegance.",
    features: ["Themed mandap & decor", "Choreographed entries", "Live music & MC", "Custom invites"],
  },
  {
    slug: "birthday-parties",
    title: "Birthday Parties",
    image: birthday,
    description: "From first-birthday confetti to milestone soirées — magical experiences for every age.",
    features: ["Kids' theme worlds", "Adult luxury soirées", "Cake & catering", "Entertainment acts"],
  },
  {
    slug: "anniversary-celebrations",
    title: "Anniversary Celebrations",
    image: anniversary,
    description: "Rekindle the romance with a candlelit dinner or a grand vow renewal under the stars.",
    features: ["Private dining setups", "Surprise reveals", "Photography", "Floral installations"],
  },
  {
    slug: "baby-showers",
    title: "Baby Showers & Godh Bharai",
    image: babyshower,
    description: "Soft palettes, gentle florals, and joyful gatherings for the mother-to-be.",
    features: ["Theme styling", "Custom favours", "Games & catering", "Mehndi station"],
  },
  {
    slug: "family-functions",
    title: "Family Functions",
    image: reception,
    description: "Receptions, sangeets, mehendi, and reunions — designed around the family at the heart.",
    features: ["Multi-event coordination", "Logistics & guest mgmt.", "Stage & sound", "Memory keepsakes"],
  },
  {
    slug: "housewarming",
    title: "Housewarming (Griha Pravesh)",
    image: haldi,
    description: "Auspicious puja arrangements, pandit coordination and warm hosting for your new beginning.",
    features: ["Pandit & rituals", "Traditional decor", "Catering & prasad", "Guest seating"],
  },
  {
    slug: "corporate-events",
    title: "Corporate Events",
    image: corporate,
    description: "Annual galas, product launches, and offsites delivered with seamless professionalism.",
    features: ["AV & staging", "Brand-led decor", "Hospitality & MICE", "Awards & gifting"],
  },
];

export const packages = [
  {
    name: "Classic",
    tagline: "Budget-friendly celebrations",
    priceFrom: "₹1.5L",
    color: "bg-secondary",
    features: [
      "Themed basic decoration",
      "Day-of event coordination",
      "Photography support (4 hrs)",
      "Guest welcome & seating",
      "Sound system & basic lighting",
    ],
  },
  {
    name: "Premium",
    tagline: "The most-loved Aura experience",
    priceFrom: "₹4.5L",
    color: "bg-gold-gradient",
    featured: true,
    features: [
      "Customized designer decor",
      "Full event planning & coordination",
      "Professional photo + cinematic video",
      "Entertainment & DJ arrangements",
      "Guest management & hospitality",
      "Catering coordination",
    ],
  },
  {
    name: "Luxury",
    tagline: "End-to-end destination luxury",
    priceFrom: "₹12L",
    color: "bg-primary text-primary-foreground",
    features: [
      "Designer & floral installations",
      "Destination planning & travel",
      "Complete multi-day event mgmt.",
      "Celebrity artist coordination",
      "Premium hospitality & stays",
      "Bespoke invites & favours",
      "Dedicated planner & concierge",
    ],
  },
];

export const stats = [
  { value: "850+", label: "Events Completed" },
  { value: "1.2K", label: "Happy Families" },
  { value: "42", label: "Cities Served" },
  { value: "12+", label: "Years of Experience" },
];

export const testimonials = [
  {
    name: "Aanya & Rohan Mehta",
    event: "Destination Wedding · Udaipur",
    quote:
      "Aura turned our four-day wedding into a fairytale. From the haldi to the pheras, every moment was breathtaking.",
    rating: 5,
  },
  {
    name: "The Kapoor Family",
    event: "60th Birthday · Mumbai",
    quote:
      "We were guests at our own event. Flawless planning, warm hospitality, and decor that made Papa cry happy tears.",
    rating: 5,
  },
  {
    name: "Priya & Arjun Shah",
    event: "Engagement · Goa",
    quote:
      "Beach, candles, fairy lights and zero stress. The Aura team thinks of everything before you can ask.",
    rating: 5,
  },
];

export const portfolio = [
  { src: heroWedding, title: "Royal Mandap · Udaipur", category: "Wedding" },
  { src: reception, title: "Grand Reception · Mumbai", category: "Wedding" },
  { src: engagement, title: "Marigold Engagement", category: "Engagement" },
  { src: birthday, title: "Blush & Gold Birthday", category: "Birthday" },
  { src: anniversary, title: "Garden Anniversary", category: "Anniversary" },
  { src: babyshower, title: "Pastel Baby Shower", category: "Baby Shower" },
  { src: haldi , title: "Sunshine Haldi", category: "Wedding" },
  { src: corporate, title: "Corporate Gala", category: "Corporate" },
];
