export interface Inquiry {
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

const STORAGE_KEY = "aura_inquiries";

const DEFAULT_INQUIRIES: Inquiry[] = [
  {
    id: "inq-1",
    name: "Rohit Sharma",
    phone: "+91 98765 54321",
    email: "rohit@example.com",
    event: "Destination Wedding",
    date: "2026-11-20",
    budget: "₹50L+",
    message: "Looking to plan a palace wedding in Udaipur for 200 guests. Need catering and decor included.",
    status: "Pending",
    timestamp: "2026-06-05T10:30:00.000Z",
  },
  {
    id: "inq-2",
    name: "Sneha Patel",
    phone: "+91 99988 77766",
    email: "sneha.patel@gmail.com",
    event: "Birthday",
    date: "2026-07-15",
    budget: "₹2L – ₹5L",
    message: "1st birthday party decoration for my daughter. Pastel theme, balloon arch, and face painting.",
    status: "Contacted",
    timestamp: "2026-06-04T16:15:00.000Z",
  },
  {
    id: "inq-3",
    name: "Vikram Malhotra",
    phone: "+91 91234 56789",
    email: "vikram@malhotrainsurance.com",
    event: "Corporate",
    date: "2026-08-30",
    budget: "₹15L – ₹50L",
    message: "Annual corporate award ceremony and dinner for 400 employees. Need stage, lighting, AV, and hospitality.",
    status: "Quoted",
    timestamp: "2026-06-03T11:45:00.000Z",
  },
  {
    id: "inq-4",
    name: "Aisha Sen",
    phone: "+91 98123 45678",
    email: "aisha.sen@outlook.com",
    event: "Baby Shower",
    date: "2026-06-25",
    budget: "Under ₹2L",
    message: "Intimate family gathering for godh bharai at home. Traditional marigold and yellow theme.",
    status: "Confirmed",
    timestamp: "2026-06-02T14:20:00.000Z",
  },
  {
    id: "inq-5",
    name: "Kabir & Riya",
    phone: "+91 97777 66666",
    email: "kabir.riya@gmail.com",
    event: "Engagement",
    date: "2026-09-12",
    budget: "₹5L – ₹15L",
    message: "Sundowner engagement party in Goa. Decor should be modern rustic with fairy lights.",
    status: "Declined",
    timestamp: "2026-05-28T09:00:00.000Z",
  },
];

// Load from localStorage with SSR safety
export function getInquiries(): Inquiry[] {
  if (typeof window === "undefined") {
    return DEFAULT_INQUIRIES;
  }
  
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_INQUIRIES));
    return DEFAULT_INQUIRIES;
  }
  
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to parse inquiries, resetting to default", e);
    return DEFAULT_INQUIRIES;
  }
}

// Save to localStorage with SSR safety
export function saveInquiries(inquiries: Inquiry[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inquiries));
  }
}

// Add a new inquiry
export function addInquiry(inquiryData: Omit<Inquiry, "id" | "status" | "timestamp">): Inquiry {
  const newInquiry: Inquiry = {
    ...inquiryData,
    id: `inq-${Date.now()}`,
    status: "Pending",
    timestamp: new Date().toISOString(),
  };

  const current = getInquiries();
  const updated = [newInquiry, ...current];
  saveInquiries(updated);
  return newInquiry;
}

// Update an inquiry status
export function updateInquiryStatus(id: string, status: Inquiry["status"]): Inquiry[] {
  const current = getInquiries();
  const updated = current.map((inq) =>
    inq.id === id ? { ...inq, status } : inq
  );
  saveInquiries(updated);
  return updated;
}

// Delete an inquiry
export function deleteInquiry(id: string): Inquiry[] {
  const current = getInquiries();
  const updated = current.filter((inq) => inq.id !== id);
  saveInquiries(updated);
  return updated;
}
