import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  services as defaultServices,
  packages as defaultPackages,
  testimonials as defaultTestimonials,
  portfolio as defaultPortfolio,
  stats as defaultStats,
} from "./site-data";

// ==========================================
// Types
// ==========================================

export interface HeroData {
  headline: string;
  tagline: string;
  imageUrl: string;
  estYear: string;
  estRegion: string;
}

export interface AboutData {
  storyTitle: string;
  storyText1: string;
  storyText2: string;
  aboutImageUrl: string;
  missionTitle: string;
  missionText: string;
  visionTitle: string;
  visionText: string;
}

export interface ContactData {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  instagram: string;
  facebook: string;
}

export interface SettingsData {
  siteTitle: string;
  metaDescription: string;
  logoText: string;
}

export interface ServiceItem {
  id?: string;
  slug: string;
  title: string;
  image: string; // URL string or path
  description: string;
  features: string[];
}

export interface PackageItem {
  id?: string;
  name: string;
  tagline: string;
  priceFrom: string;
  color: string;
  featured?: boolean;
  features: string[];
}

export interface TestimonialItem {
  id?: string;
  name: string;
  event: string;
  quote: string;
  rating: number;
}

export interface TeamItem {
  id?: string;
  name: string;
  role: string;
  image: string;
}

export interface FAQItem {
  id?: string;
  question: string;
  answer: string;
  order: number;
}

export interface GalleryItem {
  id?: string;
  src: string;
  title: string;
  category: string;
}

export interface ActivityLog {
  id?: string;
  action: string;
  timestamp: string;
  user: string;
}

export interface DBInquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  event: string;
  date: string;
  budget: string;
  message: string;
  status: "Pending" | "Contacted" | "Quoted" | "Confirmed" | "Declined";
  timestamp: string;
}

// ==========================================
// Seeding & Content Init Helper
// ==========================================

export async function seedDatabase() {
  try {
    // Check if seeding is already done by checking the "settings" collection
    const settingsDoc = await getDoc(doc(db, "settings", "general"));
    if (settingsDoc.exists()) {
      return; // Already seeded
    }

    console.log("Seeding Firestore with default website content...");

    // 1. Seed Settings
    await setDoc(doc(db, "settings", "general"), {
      siteTitle: "Aura Events — Luxury Wedding & Event Planners in India",
      metaDescription: "End-to-end destination wedding, birthday, engagement and family event planning across India.",
      logoText: "Aura Events",
    });

    // 2. Seed Hero Section
    await setDoc(doc(db, "content", "hero"), {
      headline: "Creating Unforgettable Celebrations",
      tagline: "From intimate family gatherings to grand destination weddings, we bring your dream events to life — with elegance, soul, and flawless detail.",
      imageUrl: "", // We can fall back to local assets if empty, keeping it clean
      estYear: "2012",
      estRegion: "India",
    });

    // 3. Seed About Section
    await setDoc(doc(db, "content", "about"), {
      storyTitle: "Born from a love for bringing people together.",
      storyText1: "Aura Events began in a small Mumbai studio in 2012 with one belief — that every family's joyful moment deserves a stage of its own. Twelve years on, we've designed weddings in Udaipur palaces, birthdays in Goa beach houses, and engagements under Himalayan skies.",
      storyText2: "What hasn't changed is the quiet promise behind every event: that your family will be heard, your vision honored, and your guests cared for like our own.",
      aboutImageUrl: "", // Local fallback
      missionTitle: "Our Mission",
      missionText: "To turn life's milestones into stories worth retelling — through thoughtful design, warm hospitality and joyful execution.",
      visionTitle: "Our Vision",
      visionText: "To be India's most loved name in celebrations — synonymous with elegance, trust, and unforgettable memories.",
    });

    // 4. Seed Contact Information
    await setDoc(doc(db, "content", "contact"), {
      phone: "+91 98765 43210",
      whatsapp: "+919876543210",
      email: "hello@auraevents.in",
      address: "14, Lotus Avenue, Bandra West, Mumbai 400050",
      instagram: "#",
      facebook: "#",
    });

    // 5. Seed Services
    for (const service of defaultServices) {
      await addDoc(collection(db, "services"), {
        slug: service.slug,
        title: service.title,
        image: "", // Local fallback
        description: service.description,
        features: service.features,
      });
    }

    // 6. Seed Packages
    for (const pkg of defaultPackages) {
      await addDoc(collection(db, "packages"), {
        name: pkg.name,
        tagline: pkg.tagline,
        priceFrom: pkg.priceFrom,
        color: pkg.color,
        featured: pkg.featured || false,
        features: pkg.features,
      });
    }

    // 7. Seed Testimonials
    for (const testimonial of defaultTestimonials) {
      await addDoc(collection(db, "testimonials"), {
        name: testimonial.name,
        event: testimonial.event,
        quote: testimonial.quote,
        rating: testimonial.rating,
      });
    }

    // 8. Seed Team Members
    const defaultTeam = [
      { name: "Ishita Verma", role: "Founder & Creative Director", image: "" },
      { name: "Raghav Iyer", role: "Head of Production", image: "" },
      { name: "Meher Khanna", role: "Lead Designer", image: "" },
      { name: "Aditya Rao", role: "Destination Specialist", image: "" },
    ];
    for (const tm of defaultTeam) {
      await addDoc(collection(db, "team"), tm);
    }

    // 9. Seed FAQs
    const defaultFAQs = [
      { question: "What is your planning process?", answer: "We begin with a detailed consultation to understand your budget, vision, and scale, followed by design blueprinting and vendor sourcing.", order: 1 },
      { question: "Do you plan destination weddings?", answer: "Yes! We specialize in destination weddings, especially in Udaipur, Jaipur, Goa, and international beach destinations.", order: 2 },
      { question: "Can we customize packages?", answer: "Absolutely. All packages act as starting points. We fully customize them according to your exact requirements and design selections.", order: 3 },
    ];
    for (const faq of defaultFAQs) {
      await addDoc(collection(db, "faqs"), faq);
    }

    // 10. Seed Gallery/Portfolio
    for (const port of defaultPortfolio) {
      await addDoc(collection(db, "gallery"), {
        src: "", // Local fallback
        title: port.title,
        category: port.category,
      });
    }

    // 11. Add initial seed log
    await addDoc(collection(db, "activity_log"), {
      action: "Database initialized with template data",
      timestamp: new Date().toISOString(),
      user: "System",
    });

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Database seeding failed:", error);
  }
}

// ==========================================
// Firestore Actions
// ==========================================

// --- Settings ---
export async function getSettings(): Promise<SettingsData> {
  const docRef = doc(db, "settings", "general");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as SettingsData;
  }
  return {
    siteTitle: "Aura Events — Luxury Wedding & Event Planners",
    metaDescription: "Luxury event organizers",
    logoText: "Aura Events",
  };
}

export async function updateSettings(data: SettingsData): Promise<void> {
  await setDoc(doc(db, "settings", "general"), data, { merge: true });
}

// --- Hero ---
export async function getHero(): Promise<HeroData | null> {
  const docSnap = await getDoc(doc(db, "content", "hero"));
  return docSnap.exists() ? (docSnap.data() as HeroData) : null;
}

export async function updateHero(data: HeroData): Promise<void> {
  await setDoc(doc(db, "content", "hero"), data, { merge: true });
}

// --- About ---
export async function getAbout(): Promise<AboutData | null> {
  const docSnap = await getDoc(doc(db, "content", "about"));
  return docSnap.exists() ? (docSnap.data() as AboutData) : null;
}

export async function updateAbout(data: AboutData): Promise<void> {
  await setDoc(doc(db, "content", "about"), data, { merge: true });
}

// --- Contact ---
export async function getContact(): Promise<ContactData | null> {
  const docSnap = await getDoc(doc(db, "content", "contact"));
  return docSnap.exists() ? (docSnap.data() as ContactData) : null;
}

export async function updateContact(data: ContactData): Promise<void> {
  await setDoc(doc(db, "content", "contact"), data, { merge: true });
}

// --- Services CRUD ---
export async function getServices(): Promise<ServiceItem[]> {
  const querySnapshot = await getDocs(collection(db, "services"));
  return querySnapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as ServiceItem[];
}

export async function addService(data: Omit<ServiceItem, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "services"), data);
  return docRef.id;
}

export async function updateService(id: string, data: Partial<ServiceItem>): Promise<void> {
  await updateDoc(doc(db, "services", id), data);
}

export async function deleteService(id: string): Promise<void> {
  await deleteDoc(doc(db, "services", id));
}

// --- Packages CRUD ---
export async function getPackages(): Promise<PackageItem[]> {
  const querySnapshot = await getDocs(collection(db, "packages"));
  return querySnapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as PackageItem[];
}

export async function addPackage(data: Omit<PackageItem, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "packages"), data);
  return docRef.id;
}

export async function updatePackage(id: string, data: Partial<PackageItem>): Promise<void> {
  await updateDoc(doc(db, "packages", id), data);
}

export async function deletePackage(id: string): Promise<void> {
  await deleteDoc(doc(db, "packages", id));
}

// --- Testimonials CRUD ---
export async function getTestimonials(): Promise<TestimonialItem[]> {
  const querySnapshot = await getDocs(collection(db, "testimonials"));
  return querySnapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as TestimonialItem[];
}

export async function addTestimonial(data: Omit<TestimonialItem, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "testimonials"), data);
  return docRef.id;
}

export async function updateTestimonial(id: string, data: Partial<TestimonialItem>): Promise<void> {
  await updateDoc(doc(db, "testimonials", id), data);
}

export async function deleteTestimonial(id: string): Promise<void> {
  await deleteDoc(doc(db, "testimonials", id));
}

// --- Team CRUD ---
export async function getTeam(): Promise<TeamItem[]> {
  const querySnapshot = await getDocs(collection(db, "team"));
  return querySnapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as TeamItem[];
}

export async function addTeamMember(data: Omit<TeamItem, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "team"), data);
  return docRef.id;
}

export async function updateTeamMember(id: string, data: Partial<TeamItem>): Promise<void> {
  await updateDoc(doc(db, "team", id), data);
}

export async function deleteTeamMember(id: string): Promise<void> {
  await deleteDoc(doc(db, "team", id));
}

// --- FAQs CRUD ---
export async function getFAQs(): Promise<FAQItem[]> {
  const q = query(collection(db, "faqs"), orderBy("order", "asc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as FAQItem[];
}

export async function addFAQ(data: Omit<FAQItem, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "faqs"), data);
  return docRef.id;
}

export async function updateFAQ(id: string, data: Partial<FAQItem>): Promise<void> {
  await updateDoc(doc(db, "faqs", id), data);
}

export async function deleteFAQ(id: string): Promise<void> {
  await deleteDoc(doc(db, "faqs", id));
}

// --- Gallery CRUD ---
export async function getGallery(): Promise<GalleryItem[]> {
  const querySnapshot = await getDocs(collection(db, "gallery"));
  return querySnapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as GalleryItem[];
}

export async function addGalleryItem(data: Omit<GalleryItem, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "gallery"), data);
  return docRef.id;
}

export async function deleteGalleryItem(id: string): Promise<void> {
  await deleteDoc(doc(db, "gallery", id));
}

// --- Activity Logs ---
export async function getActivityLogs(): Promise<ActivityLog[]> {
  const q = query(collection(db, "activity_log"), orderBy("timestamp", "desc"), limit(15));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as ActivityLog[];
}

export async function logActivity(action: string, user: string = "Admin"): Promise<void> {
  await addDoc(collection(db, "activity_log"), {
    action,
    timestamp: new Date().toISOString(),
    user,
  });
}

// --- Inquiries ---
export async function getDBInquiries(): Promise<DBInquiry[]> {
  const querySnapshot = await getDocs(collection(db, "inquiries"));
  return querySnapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as DBInquiry[];
}

export async function addDBInquiry(inquiryData: Omit<DBInquiry, "id" | "status" | "timestamp">): Promise<string> {
  const docRef = await addDoc(collection(db, "inquiries"), {
    ...inquiryData,
    status: "Pending",
    timestamp: new Date().toISOString(),
  });
  return docRef.id;
}

export async function updateDBInquiryStatus(id: string, status: DBInquiry["status"]): Promise<void> {
  await updateDoc(doc(db, "inquiries", id), { status });
}

export async function deleteDBInquiry(id: string): Promise<void> {
  await deleteDoc(doc(db, "inquiries", id));
}
