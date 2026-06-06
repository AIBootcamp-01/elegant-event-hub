import React, { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { doc, setDoc } from "firebase/firestore";
import {
  seedDatabase,
  getSettings,
  updateSettings,
  getHero,
  updateHero,
  getAbout,
  updateAbout,
  getContact,
  updateContact,
  getServices,
  addService,
  updateService,
  deleteService,
  getPackages,
  addPackage,
  updatePackage,
  deletePackage,
  getTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getTeam,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getFAQs,
  addFAQ,
  updateFAQ,
  deleteFAQ,
  getGallery,
  addGalleryItem,
  deleteGalleryItem,
  getActivityLogs,
  logActivity,
  getDBInquiries,
  updateDBInquiryStatus,
  deleteDBInquiry,
  DBInquiry,
  HeroData,
  AboutData,
  ContactData,
  SettingsData,
  ServiceItem,
  PackageItem,
  TestimonialItem,
  TeamItem,
  FAQItem,
  GalleryItem,
  ActivityLog,
} from "@/lib/db";
import {
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  Search,
  Filter,
  Trash2,
  Eye,
  LogOut,
  Download,
  Calendar,
  X,
  Phone,
  Mail,
  ChevronRight,
  Menu,
  Sparkles,
  DollarSign,
  LayoutDashboard,
  Image,
  User,
  Package,
  Layers,
  HelpCircle,
  Settings,
  FileText,
  Lock,
  Plus,
  Edit,
  FolderOpen,
  Bell,
  Check,
  Building,
  MapPin,
  Facebook,
  Instagram,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { toast, Toaster } from "sonner";
import { images as localImages } from "@/lib/site-data";

export const Route = createFileRoute("/admin")({
  component: AdminRoute,
});

function AdminRoute() {
  const { user, role, loading, logout, resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);

  // Auto-upgrade client-side role if the user email matches admin pattern
  useEffect(() => {
    if (user && role !== "admin" && role !== "staff") {
      const emailLower = user.email ? user.email.toLowerCase() : "";
      if (
        emailLower === "admin@auraevents.in" ||
        emailLower.startsWith("admin@") ||
        emailLower.includes("admin")
      ) {
        const upgradeAdmin = async () => {
          try {
            const userRef = doc(db, "users", user.uid);
            await setDoc(
              userRef,
              {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || null,
                photoURL: user.photoURL || null,
                role: "admin",
                lastLoginAt: new Date().toISOString(),
              },
              { merge: true }
            );
            console.log("Admin role successfully upgraded via frontend auto-recovery!");
            // Reload page to re-fetch rules and role
            window.location.reload();
          } catch (e) {
            console.error("Auto-upgrade error:", e);
          }
        };
        upgradeAdmin();
      }
    }
  }, [user, role]);

  // Load rememberMe email
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("aura_remember_email");
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (rememberMe) {
        localStorage.setItem("aura_remember_email", email);
      } else {
        localStorage.removeItem("aura_remember_email");
      }
      toast.success("Welcome to Aura Events CMS dashboard!");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/invalid-credential") {
        setAuthError("Invalid email or password. Please verify credentials.");
      } else {
        setAuthError(err.message || "Authentication failed.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsSubmitting(true);

    try {
      await resetPassword(email);
      toast.success("Password reset email sent! Check your inbox.");
      setForgotPasswordMode(false);
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || "Failed to send reset email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center">
        <div className="h-10 w-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-muted-foreground mt-4 font-sans tracking-wide">Loading Aura Event Hub CMS...</p>
      </div>
    );
  }

  // 2. Auth Screen
  if (!user) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
        <Toaster position="top-right" richColors />
        <div className="max-w-md w-full rounded-3xl bg-card border border-border p-8 shadow-luxe animate-float-up">
          <div className="text-center mb-8">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold-gradient text-gold-foreground font-display text-2xl shadow-soft mb-3">
              A
            </span>
            <h1 className="font-display text-3xl text-foreground">Aura Events</h1>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1 font-sans font-medium">
              CMS Admin Access Portal
            </p>
          </div>

          {authError && (
            <div className="mb-5 p-3.5 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive text-xs leading-relaxed animate-in fade-in duration-200">
              {authError}
            </div>
          )}

          {!forgotPasswordMode ? (
            <form onSubmit={handleLogin} className="space-y-4" noValidate>
              <label className="block">
                <span className="text-xs font-medium text-muted-foreground tracking-wide">Email Address</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
                  placeholder="admin@auraevents.in"
                />
              </label>

              <label className="block">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground tracking-wide">Password</span>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordMode(true)}
                    className="text-xs text-gold hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
                  placeholder="••••••••"
                />
              </label>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 border-input rounded text-gold focus:ring-gold"
                />
                <label htmlFor="remember" className="ml-2 text-xs text-muted-foreground select-none cursor-pointer">
                  Remember my email
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-gold-gradient text-gold-foreground font-medium tracking-wide hover:opacity-90 transition shadow-soft disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? "Signing In..." : "Sign In to Console"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4" noValidate>
              <div className="text-center mb-4 text-xs text-muted-foreground leading-relaxed">
                Provide your email address below, and we'll send you password recovery instructions.
              </div>
              
              <label className="block">
                <span className="text-xs font-medium text-muted-foreground tracking-wide">Email Address</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
                  placeholder="admin@auraevents.in"
                />
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-gold-gradient text-gold-foreground font-medium tracking-wide hover:opacity-90 transition shadow-soft disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? "Processing..." : "Send Recovery Link"}
              </button>

              <button
                type="button"
                onClick={() => setForgotPasswordMode(false)}
                className="w-full text-xs text-muted-foreground hover:text-foreground text-center mt-2 cursor-pointer block"
              >
                Back to Sign In
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground underline transition">
              Back to main website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated Dashboard Content
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Toaster position="top-right" richColors />
      <DashboardCMSLayout onLogout={logout} userEmail={user.email || ""} />
    </div>
  );
}

// ==========================================
// Dashboard Layout & Panels
// ==========================================

function DashboardCMSLayout({ onLogout, userEmail }: { onLogout: () => Promise<void>; userEmail: string }) {
  const [activePanel, setActivePanel] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Seed check on mount
  useEffect(() => {
    seedDatabase();
  }, []);

  const handleLogoutClick = async () => {
    if (confirm("Are you sure you want to sign out?")) {
      await onLogout();
    }
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "hero", label: "Hero Section", icon: Sparkles },
    { id: "about", label: "About Section", icon: FileText },
    { id: "services", label: "Services", icon: Layers },
    { id: "packages", label: "Packages", icon: Package },
    { id: "gallery", label: "Gallery", icon: Image },
    { id: "testimonials", label: "Testimonials", icon: Clock },
    { id: "team", label: "Team Members", icon: User },
    { id: "faq", label: "FAQs", icon: HelpCircle },
    { id: "contact", label: "Contact Info", icon: Phone },
    { id: "settings", label: "Website Settings", icon: Settings },
    { id: "media", label: "Media Library", icon: FolderOpen },
    { id: "profile", label: "Profile Settings", icon: Lock },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside
        className={`hidden lg:flex flex-col bg-primary text-primary-foreground border-r border-border/20 shrink-0 transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="p-4 border-b border-primary-foreground/10 flex items-center justify-between">
          <div className={`flex items-center gap-3 overflow-hidden ${sidebarCollapsed ? "justify-center w-full" : ""}`}>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gold-gradient text-gold-foreground font-display text-lg shadow-soft shrink-0">
              A
            </span>
            {!sidebarCollapsed && <span className="font-display text-xl tracking-wide truncate">Aura Admin</span>}
          </div>
          {!sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(true)}
              className="p-1 rounded-lg text-primary-foreground/60 hover:bg-primary-foreground/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {sidebarCollapsed && (
          <div className="p-2 border-b border-primary-foreground/10 flex justify-center">
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="p-1.5 rounded-lg text-primary-foreground/60 hover:bg-primary-foreground/10 hover:text-white"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        )}

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activePanel === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePanel(item.id)}
                className={`w-full flex items-center rounded-xl text-sm transition ${
                  sidebarCollapsed ? "justify-center py-3 px-0" : "gap-3 px-4 py-2.5"
                } ${
                  active
                    ? "bg-gold text-gold-foreground font-medium"
                    : "hover:bg-primary-foreground/10 text-primary-foreground/80 hover:text-white"
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-primary-foreground/10 space-y-1">
          <Link
            to="/"
            className={`w-full flex items-center rounded-xl text-xs text-primary-foreground/60 hover:text-white transition ${
              sidebarCollapsed ? "justify-center py-2 px-0" : "gap-3 px-4 py-2"
            }`}
          >
            <ChevronRight className={`h-4 w-4 rotate-180 shrink-0`} />
            {!sidebarCollapsed && <span>View Site</span>}
          </Link>
          <button
            onClick={handleLogoutClick}
            className={`w-full flex items-center rounded-xl text-sm text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition cursor-pointer ${
              sidebarCollapsed ? "justify-center py-3 px-0" : "gap-3 px-4 py-2.5"
            }`}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!sidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 w-64 bg-primary text-primary-foreground z-50 flex flex-col transform transition-transform duration-300 ease-in-out border-r border-border/20 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-primary-foreground/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gold-gradient text-gold-foreground font-display text-lg shadow-soft">
              A
            </span>
            <span className="font-display text-xl tracking-wide">Aura Admin</span>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-1 rounded-full text-primary-foreground/75 hover:bg-primary-foreground/15 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activePanel === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePanel(item.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition ${
                  active
                    ? "bg-gold text-gold-foreground font-medium"
                    : "hover:bg-primary-foreground/10 text-primary-foreground/80 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-primary-foreground/10 space-y-1">
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs text-primary-foreground/60 hover:text-white transition"
          >
            <ChevronRight className="h-4 w-4 rotate-180" /> View Site
          </Link>
          <button
            onClick={() => {
              setMobileSidebarOpen(false);
              handleLogoutClick();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Panel Wrapper */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Navbar */}
        <header className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-border text-foreground hover:bg-secondary transition cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h2 className="font-display text-2xl text-foreground capitalize">
                {navItems.find((n) => n.id === activePanel)?.label}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground font-sans hidden sm:inline-block">
              Connected as: <span className="font-medium text-foreground">{userEmail}</span>
            </span>

            <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-foreground border border-border">
              {userEmail.substring(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
          {activePanel === "dashboard" && <OverviewPanel />}
          {activePanel === "hero" && <HeroPanel />}
          {activePanel === "about" && <AboutPanel />}
          {activePanel === "services" && <ServicesPanel />}
          {activePanel === "packages" && <PackagesPanel />}
          {activePanel === "gallery" && <GalleryPanel />}
          {activePanel === "testimonials" && <TestimonialsPanel />}
          {activePanel === "team" && <TeamPanel />}
          {activePanel === "faq" && <FAQPanel />}
          {activePanel === "contact" && <ContactPanel />}
          {activePanel === "settings" && <SettingsPanel />}
          {activePanel === "media" && <MediaLibraryPanel />}
          {activePanel === "profile" && <ProfilePanel />}
        </div>
      </main>
    </div>
  );
}

// ==========================================
// Sub-Panels Implementation
// ==========================================

// --- 1. OVERVIEW PANEL ---
function OverviewPanel() {
  const [inquiries, setInquiries] = useState<DBInquiry[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [counts, setCounts] = useState({
    inquiries: 0,
    services: 0,
    packages: 0,
    testimonials: 0,
    gallery: 0,
    team: 0,
  });
  const [selectedInquiry, setSelectedInquiry] = useState<DBInquiry | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const inqs = await getDBInquiries();
        const svcs = await getServices();
        const pkgs = await getPackages();
        const tms = await getTestimonials();
        const teamMembers = await getTeam();
        const galleryItems = await getGallery();
        const actLogs = await getActivityLogs();

        setInquiries(inqs);
        setLogs(actLogs);
        setCounts({
          inquiries: inqs.length,
          services: svcs.length,
          packages: pkgs.length,
          testimonials: tms.length,
          gallery: galleryItems.length,
          team: teamMembers.length,
        });
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      }
    }
    loadStats();
  }, []);

  const handleStatusChange = async (id: string, status: DBInquiry["status"]) => {
    try {
      await updateDBInquiryStatus(id, status);
      toast.success(`Inquiry status updated to ${status}`);
      setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
      await logActivity(`Updated inquiry ${id} status to ${status}`);
      const freshLogs = await getActivityLogs();
      setLogs(freshLogs);
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this inquiry?")) {
      try {
        await deleteDBInquiry(id);
        toast.success("Inquiry deleted");
        setInquiries((prev) => prev.filter((i) => i.id !== id));
        await logActivity(`Deleted inquiry ${id}`);
        const freshLogs = await getActivityLogs();
        setLogs(freshLogs);
      } catch (e) {
        toast.error("Failed to delete inquiry");
      }
    }
  };

  // Compute charts
  const eventTypes = inquiries.reduce((acc: { [key: string]: number }, cur) => {
    acc[cur.event] = (acc[cur.event] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.keys(eventTypes).map((k) => ({ name: k, value: eventTypes[k] }));

  const COLORS = ["#4D3222", "#D2A26C", "#E3BCA0", "#8D6246", "#F3D8C6"];

  return (
    <div className="space-y-6">
      {/* Dynamic Counter Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Inquiries", val: counts.inquiries, icon: Users, bg: "bg-gold/10 text-gold" },
          { label: "Services", val: counts.services, icon: Layers, bg: "bg-emerald-50 text-emerald-600" },
          { label: "Packages", val: counts.packages, icon: Package, bg: "bg-blue-50 text-blue-600" },
          { label: "Testimonials", val: counts.testimonials, icon: Clock, bg: "bg-purple-50 text-purple-600" },
          { label: "Gallery", val: counts.gallery, icon: Image, bg: "bg-amber-50 text-amber-600" },
          { label: "Team Members", val: counts.team, icon: User, bg: "bg-rose-50 text-rose-600" },
        ].map((card) => (
          <div key={card.label} className="bg-card border border-border rounded-2xl p-4 shadow-soft">
            <div className={`h-9 w-9 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon className="h-5 w-5" />
            </div>
            <p className="text-[10px] uppercase font-medium text-muted-foreground tracking-wide leading-none">{card.label}</p>
            <h3 className="font-display text-2xl text-foreground mt-2">{card.val}</h3>
          </div>
        ))}
      </div>

      {/* Grid section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inquiries Table */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-soft lg:col-span-2 flex flex-col">
          <h3 className="font-display text-lg mb-4 flex items-center justify-between">
            <span>Recent Client Inquiries</span>
            <span className="text-xs text-muted-foreground font-sans">Pending priority</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-foreground divide-y divide-border">
              <thead>
                <tr className="text-muted-foreground uppercase text-[10px] tracking-wider pb-3">
                  <th className="py-2.5 font-semibold">Client</th>
                  <th className="py-2.5 font-semibold">Event</th>
                  <th className="py-2.5 font-semibold">Status</th>
                  <th className="py-2.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {inquiries.slice(0, 5).map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-50/40 transition">
                    <td className="py-3">
                      <div className="font-medium">{inq.name}</div>
                      <div className="text-[10px] text-muted-foreground">{inq.email}</div>
                    </td>
                    <td className="py-3">
                      <div className="font-medium text-gold">{inq.event}</div>
                      <div className="text-[10px] text-muted-foreground">{inq.date || "TBD"}</div>
                    </td>
                    <td className="py-3">
                      <select
                        value={inq.status}
                        onChange={(e) => handleStatusChange(inq.id, e.target.value as DBInquiry["status"])}
                        className="text-[10px] border border-border rounded px-1 py-0.5 bg-background focus:outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Quoted">Quoted</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Declined">Declined</option>
                      </select>
                    </td>
                    <td className="py-3 text-right">
                      <div className="inline-flex items-center gap-1 justify-end">
                        <button
                          onClick={() => setSelectedInquiry(inq)}
                          className="p-1 rounded text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(inq.id)}
                          className="p-1 rounded text-destructive hover:bg-destructive/10 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity log */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-soft">
          <h3 className="font-display text-lg mb-4">Activity Log Feed</h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
            {logs.map((log) => (
              <div key={log.id} className="text-xs flex gap-3 items-start">
                <div className="h-2 w-2 rounded-full bg-gold mt-1.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">{log.action}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    by {log.user} · {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="rounded-2xl bg-card border border-border p-5 shadow-soft">
        <h3 className="font-display text-lg mb-4">Event Interests Graph</h3>
        <div className="h-[250px] flex items-center justify-center">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {pieData.map((e, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground">Insufficient analytics data</p>
          )}
        </div>
      </div>

      {/* Detail view Inquiry modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedInquiry(null)} />
          <div className="relative w-full max-w-md bg-card rounded-2xl shadow-luxe border border-border p-6 animate-float-up">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h4 className="font-display text-lg text-foreground">Client Request Details</h4>
              <button onClick={() => setSelectedInquiry(null)} className="p-1 rounded-full hover:bg-secondary">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="py-4 space-y-3 text-sm">
              <div>
                <span className="text-[10px] uppercase text-muted-foreground font-semibold">Client Name</span>
                <p className="font-medium">{selectedInquiry.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] uppercase text-muted-foreground font-semibold">Phone</span>
                  <p className="font-medium">{selectedInquiry.phone}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-muted-foreground font-semibold">Email</span>
                  <p className="font-medium truncate">{selectedInquiry.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] uppercase text-muted-foreground font-semibold">Event Type</span>
                  <p className="font-medium text-gold">{selectedInquiry.event}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-muted-foreground font-semibold">Budget</span>
                  <p className="font-medium">{selectedInquiry.budget || "N/A"}</p>
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase text-muted-foreground font-semibold">Vision details</span>
                <p className="p-3 bg-secondary/30 rounded-lg text-xs leading-relaxed mt-1">
                  {selectedInquiry.message || "No custom message provided."}
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-border flex justify-end">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-5 py-2 rounded-full bg-gold-gradient text-gold-foreground text-xs font-semibold"
              >
                Close details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- 2. HERO SECTION PANEL ---
function HeroPanel() {
  const [data, setData] = useState<HeroData>({
    headline: "",
    tagline: "",
    imageUrl: "",
    estYear: "",
    estRegion: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const h = await getHero();
      if (h) setData(h);
      setLoading(false);
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateHero(data);
      await logActivity("Updated Hero Banner content details");
      toast.success("Hero section successfully updated!");
    } catch (err) {
      toast.error("Failed to update Hero section.");
    }
  };

  if (loading) return <div className="text-sm text-center py-10 text-muted-foreground">Loading details...</div>;

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 shadow-soft space-y-4">
      <h3 className="font-display text-xl pb-2 border-b border-border">Edit Hero Banner</h3>
      
      <label className="block">
        <span className="text-xs font-medium text-muted-foreground">Main Headline</span>
        <input
          type="text"
          value={data.headline}
          onChange={(e) => setData({ ...data, headline: e.target.value })}
          className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none"
          required
        />
      </label>

      <label className="block">
        <span className="text-xs font-medium text-muted-foreground">Tagline Paragraph</span>
        <textarea
          value={data.tagline}
          rows={3}
          onChange={(e) => setData({ ...data, tagline: e.target.value })}
          className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none"
          required
        />
      </label>

      <label className="block">
        <span className="text-xs font-medium text-muted-foreground">Hero Image URL (leave blank for local template fallback)</span>
        <input
          type="text"
          value={data.imageUrl}
          onChange={(e) => setData({ ...data, imageUrl: e.target.value })}
          className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none"
          placeholder="https://..."
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs font-medium text-muted-foreground">Establishment Year</span>
          <input
            type="text"
            value={data.estYear}
            onChange={(e) => setData({ ...data, estYear: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-muted-foreground">Operational Location</span>
          <input
            type="text"
            value={data.estRegion}
            onChange={(e) => setData({ ...data, estRegion: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none"
          />
        </label>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="px-6 py-3 rounded-full bg-gold-gradient text-gold-foreground text-sm font-medium hover:opacity-90 transition cursor-pointer"
        >
          Save Hero Settings
        </button>
      </div>
    </form>
  );
}

// --- 3. ABOUT SECTION PANEL ---
function AboutPanel() {
  const [data, setData] = useState<AboutData>({
    storyTitle: "",
    storyText1: "",
    storyText2: "",
    aboutImageUrl: "",
    missionTitle: "",
    missionText: "",
    visionTitle: "",
    visionText: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const a = await getAbout();
      if (a) setData(a);
      setLoading(false);
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateAbout(data);
      await logActivity("Updated About Section contents");
      toast.success("About page parameters successfully updated!");
    } catch (err) {
      toast.error("Failed to update About details.");
    }
  };

  if (loading) return <div className="text-sm text-center py-10 text-muted-foreground">Loading details...</div>;

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 shadow-soft space-y-4 max-h-[85vh] overflow-y-auto">
      <h3 className="font-display text-xl pb-2 border-b border-border">Edit About Page Details</h3>

      <div className="space-y-3">
        <h4 className="font-display text-md text-gold">Story Block</h4>
        <label className="block">
          <span className="text-xs font-medium text-muted-foreground">Story Title</span>
          <input
            type="text"
            value={data.storyTitle}
            onChange={(e) => setData({ ...data, storyTitle: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none"
            required
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-muted-foreground">Story Paragraph 1</span>
          <textarea
            value={data.storyText1}
            rows={3}
            onChange={(e) => setData({ ...data, storyText1: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none"
            required
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-muted-foreground">Story Paragraph 2</span>
          <textarea
            value={data.storyText2}
            rows={3}
            onChange={(e) => setData({ ...data, storyText2: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-muted-foreground">Story Image URL (blank for local default)</span>
          <input
            type="text"
            value={data.aboutImageUrl}
            onChange={(e) => setData({ ...data, aboutImageUrl: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3 border-t border-border">
        {/* Mission */}
        <div className="space-y-3">
          <h4 className="font-display text-md text-gold">Mission Block</h4>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Mission Title</span>
            <input
              type="text"
              value={data.missionTitle}
              onChange={(e) => setData({ ...data, missionTitle: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none"
              required
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Mission Description</span>
            <textarea
              value={data.missionText}
              rows={3}
              onChange={(e) => setData({ ...data, missionText: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none"
              required
            />
          </label>
        </div>

        {/* Vision */}
        <div className="space-y-3">
          <h4 className="font-display text-md text-gold">Vision Block</h4>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Vision Title</span>
            <input
              type="text"
              value={data.visionTitle}
              onChange={(e) => setData({ ...data, visionTitle: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none"
              required
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Vision Description</span>
            <textarea
              value={data.visionText}
              rows={3}
              onChange={(e) => setData({ ...data, visionText: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none"
              required
            />
          </label>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="px-6 py-3 rounded-full bg-gold-gradient text-gold-foreground text-sm font-medium hover:opacity-90 transition cursor-pointer"
        >
          Save About Section
        </button>
      </div>
    </form>
  );
}

// --- 4. SERVICES PANEL ---
function ServicesPanel() {
  const [list, setList] = useState<ServiceItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<ServiceItem | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");

  const load = async () => {
    const data = await getServices();
    setList(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleOpenAdd = () => {
    setEditItem(null);
    setTitle("");
    setSlug("");
    setImage("");
    setDescription("");
    setFeatures([]);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: ServiceItem) => {
    setEditItem(item);
    setTitle(item.title);
    setSlug(item.slug);
    setImage(item.image || "");
    setDescription(item.description);
    setFeatures(item.features || []);
    setModalOpen(true);
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const serviceData = { title, slug, image, description, features };

    try {
      if (editItem && editItem.id) {
        await updateService(editItem.id, serviceData);
        await logActivity(`Updated service: ${title}`);
        toast.success("Service updated successfully");
      } else {
        await addService(serviceData);
        await logActivity(`Created new service: ${title}`);
        toast.success("New service added successfully");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error("Failed to save service.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete service "${name}"?`)) {
      try {
        await deleteService(id);
        await logActivity(`Deleted service: ${name}`);
        toast.success("Service deleted");
        load();
      } catch (err) {
        toast.error("Failed to delete service.");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-card border border-border rounded-xl p-4 shadow-soft">
        <span className="text-sm font-medium text-muted-foreground">Manage Offerings & Packages</span>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold-gradient text-gold-foreground text-xs font-semibold hover:opacity-90 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Service
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 border-b border-border text-muted-foreground uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Service Name</th>
              <th className="px-6 py-4 font-semibold">Slug (Path)</th>
              <th className="px-6 py-4 font-semibold">Description</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {list.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/40 transition">
                <td className="px-6 py-4 font-semibold text-foreground">{item.title}</td>
                <td className="px-6 py-4 font-mono text-[11px] text-muted-foreground">{item.slug}</td>
                <td className="px-6 py-4 text-muted-foreground truncate max-w-xs">{item.description}</td>
                <td className="px-6 py-4 text-right">
                  <div className="inline-flex gap-1.5 items-center justify-end">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded border border-border hover:bg-secondary text-foreground cursor-pointer"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => item.id && handleDelete(item.id, item.title)}
                      className="p-1.5 rounded border border-destructive/20 text-destructive hover:bg-destructive/10 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-lg bg-card rounded-2xl shadow-luxe border border-border p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-float-up"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h4 className="font-display text-lg text-foreground">
                {editItem ? "Edit Service Block" : "Add Service Block"}
              </h4>
              <button type="button" onClick={() => setModalOpen(false)} className="p-1 rounded-full hover:bg-secondary">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-medium text-muted-foreground">Service Name</span>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none"
                  required
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-muted-foreground">URL Slug (e.g. birthday-parties)</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none"
                  required
                />
              </label>
            </div>

            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Image Link (optional)</span>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none"
                placeholder="https://..."
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Brief Description</span>
              <textarea
                value={description}
                rows={3}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none"
                required
              />
            </label>

            {/* Features list builder */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground">Featured Attributes</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  className="flex-1 rounded-xl border border-input bg-background px-4 py-2 text-sm focus:outline-none"
                  placeholder="e.g. Florist custom styles"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-4 py-2 rounded-xl bg-secondary hover:bg-slate-200 text-xs font-semibold text-foreground cursor-pointer"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {features.map((f, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs"
                  >
                    {f}
                    <button type="button" onClick={() => handleRemoveFeature(i)} className="text-slate-400 hover:text-rose-500">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-border flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-full border border-border text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-gold-gradient text-gold-foreground text-xs font-semibold hover:opacity-90 cursor-pointer"
              >
                Save service
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// --- 5. PACKAGES PANEL ---
function PackagesPanel() {
  const [list, setList] = useState<PackageItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<PackageItem | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [color, setColor] = useState("bg-secondary");
  const [featured, setFeatured] = useState(false);
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");

  const load = async () => {
    const data = await getPackages();
    setList(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleOpenAdd = () => {
    setEditItem(null);
    setName("");
    setTagline("");
    setPriceFrom("");
    setColor("bg-secondary");
    setFeatured(false);
    setFeatures([]);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: PackageItem) => {
    setEditItem(item);
    setName(item.name);
    setTagline(item.tagline);
    setPriceFrom(item.priceFrom);
    setColor(item.color);
    setFeatured(item.featured || false);
    setFeatures(item.features || []);
    setModalOpen(true);
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pkgData = { name, tagline, priceFrom, color, featured, features };

    try {
      if (editItem && editItem.id) {
        await updatePackage(editItem.id, pkgData);
        await logActivity(`Updated package: ${name}`);
        toast.success("Package details updated");
      } else {
        await addPackage(pkgData);
        await logActivity(`Created new package: ${name}`);
        toast.success("New package created");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error("Failed to save package.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete package "${name}"?`)) {
      try {
        await deletePackage(id);
        await logActivity(`Deleted package: ${name}`);
        toast.success("Package deleted");
        load();
      } catch (err) {
        toast.error("Failed to delete package.");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-card border border-border rounded-xl p-4 shadow-soft">
        <span className="text-sm font-medium text-muted-foreground">Manage Price Tiers</span>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold-gradient text-gold-foreground text-xs font-semibold hover:opacity-90 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Package
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 border-b border-border text-muted-foreground uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Package Tier</th>
              <th className="px-6 py-4 font-semibold">Tagline</th>
              <th className="px-6 py-4 font-semibold">Starts At</th>
              <th className="px-6 py-4 font-semibold">Featured</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {list.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/40 transition">
                <td className="px-6 py-4 font-semibold text-foreground">{item.name}</td>
                <td className="px-6 py-4 text-muted-foreground">{item.tagline}</td>
                <td className="px-6 py-4 font-medium">{item.priceFrom}</td>
                <td className="px-6 py-4">
                  {item.featured ? (
                    <span className="px-2 py-0.5 rounded-full bg-gold/10 text-gold text-[10px] font-semibold border border-gold/20">
                      Featured
                    </span>
                  ) : (
                    <span className="text-muted-foreground/60">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="inline-flex gap-1.5 items-center justify-end">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded border border-border hover:bg-secondary text-foreground cursor-pointer"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => item.id && handleDelete(item.id, item.name)}
                      className="p-1.5 rounded border border-destructive/20 text-destructive hover:bg-destructive/10 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-lg bg-card rounded-2xl shadow-luxe border border-border p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-float-up"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h4 className="font-display text-lg text-foreground">
                {editItem ? "Edit Event Package" : "Add Event Package"}
              </h4>
              <button type="button" onClick={() => setModalOpen(false)} className="p-1 rounded-full hover:bg-secondary">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-medium text-muted-foreground">Package Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none"
                  required
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-muted-foreground">Pricing Level (e.g. ₹5.5L)</span>
                <input
                  type="text"
                  value={priceFrom}
                  onChange={(e) => setPriceFrom(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none"
                  required
                />
              </label>
            </div>

            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Tagline Headline</span>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none"
                required
              />
            </label>

            <div className="grid grid-cols-2 gap-4 items-center">
              <label className="block">
                <span className="text-xs font-medium text-muted-foreground">UI Color Class</span>
                <select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none"
                >
                  <option value="bg-secondary">Ivory / Cream</option>
                  <option value="bg-gold-gradient text-gold-foreground">Gold Gradient</option>
                  <option value="bg-primary text-primary-foreground">Dark Primary</option>
                </select>
              </label>

              <div className="flex items-center pt-5">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 border-input rounded text-gold focus:ring-gold"
                />
                <label htmlFor="featured" className="ml-2 text-xs text-muted-foreground select-none cursor-pointer">
                  Feature prominently (Most Loved)
                </label>
              </div>
            </div>

            {/* Features builder */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground">Package Inclusions</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  className="flex-1 rounded-xl border border-input bg-background px-4 py-2 text-sm focus:outline-none"
                  placeholder="e.g. Day-of event coordination"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-4 py-2 rounded-xl bg-secondary hover:bg-slate-200 text-xs font-semibold text-foreground cursor-pointer"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {features.map((f, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs"
                  >
                    {f}
                    <button type="button" onClick={() => handleRemoveFeature(i)} className="text-slate-400 hover:text-rose-500">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-border flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-full border border-border text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-gold-gradient text-gold-foreground text-xs font-semibold hover:opacity-90 cursor-pointer"
              >
                Save package
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// --- 6. GALLERY PANEL ---
function GalleryPanel() {
  const [list, setList] = useState<GalleryItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [src, setSrc] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Wedding");

  const load = async () => {
    const data = await getGallery();
    setList(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addGalleryItem({ src, title, category });
      await logActivity(`Added portfolio image: ${title}`);
      toast.success("Image added to gallery");
      setModalOpen(false);
      setSrc("");
      setTitle("");
      load();
    } catch (err) {
      toast.error("Failed to add image.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete image "${name}" from gallery?`)) {
      try {
        await deleteGalleryItem(id);
        await logActivity(`Removed portfolio image: ${name}`);
        toast.success("Image removed from gallery");
        load();
      } catch (err) {
        toast.error("Failed to delete image.");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-card border border-border rounded-xl p-4 shadow-soft">
        <span className="text-sm font-medium text-muted-foreground">Manage Portfolio Items</span>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold-gradient text-gold-foreground text-xs font-semibold hover:opacity-90 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Gallery Image
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {list.map((item) => (
          <div key={item.id} className="group relative rounded-xl overflow-hidden border border-border aspect-square bg-card">
            <img
              src={item.src || localImages.heroWedding}
              alt={item.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-200 flex flex-col justify-between p-3 text-white">
              <span className="text-[10px] tracking-wider text-gold uppercase">{item.category}</span>
              <div>
                <p className="font-semibold text-xs truncate">{item.title}</p>
                <button
                  onClick={() => item.id && handleDelete(item.id, item.title)}
                  className="mt-2 text-[10px] text-rose-300 hover:text-rose-100 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-md bg-card rounded-2xl shadow-luxe border border-border p-6 space-y-4 animate-float-up"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h4 className="font-display text-lg text-foreground">Add Portfolio Image</h4>
              <button type="button" onClick={() => setModalOpen(false)} className="p-1 rounded-full hover:bg-secondary">
                <X className="h-4 w-4" />
              </button>
            </div>

            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Image Title</span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none"
                placeholder="e.g. Seaside Mandap setup"
                required
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none"
              >
                <option value="Wedding">Wedding</option>
                <option value="Engagement">Engagement</option>
                <option value="Birthday">Birthday</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Baby Shower">Baby Shower</option>
                <option value="Corporate">Corporate</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Image Direct Link URL</span>
              <input
                type="text"
                value={src}
                onChange={(e) => setSrc(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none"
                placeholder="https://..."
                required
              />
            </label>

            <div className="pt-3 border-t border-border flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-full border border-border text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-gold-gradient text-gold-foreground text-xs font-semibold hover:opacity-90 cursor-pointer"
              >
                Upload to Gallery
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// --- 7. TESTIMONIALS PANEL ---
function TestimonialsPanel() {
  const [list, setList] = useState<TestimonialItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<TestimonialItem | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [event, setEvent] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);

  const load = async () => {
    const data = await getTestimonials();
    setList(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleOpenAdd = () => {
    setEditItem(null);
    setName("");
    setEvent("");
    setQuote("");
    setRating(5);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: TestimonialItem) => {
    setEditItem(item);
    setName(item.name);
    setEvent(item.event);
    setQuote(item.quote);
    setRating(item.rating);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const reviewData = { name, event, quote, rating };

    try {
      if (editItem && editItem.id) {
        await updateTestimonial(editItem.id, reviewData);
        await logActivity(`Updated testimonial from: ${name}`);
        toast.success("Testimonial updated");
      } else {
        await addTestimonial(reviewData);
        await logActivity(`Added testimonial from: ${name}`);
        toast.success("Testimonial added");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error("Failed to save review.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete testimonial from "${name}"?`)) {
      try {
        await deleteTestimonial(id);
        await logActivity(`Deleted testimonial: ${name}`);
        toast.success("Review deleted");
        load();
      } catch (err) {
        toast.error("Failed to delete review.");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-card border border-border rounded-xl p-4 shadow-soft">
        <span className="text-sm font-medium text-muted-foreground">Manage Client Reviews</span>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold-gradient text-gold-foreground text-xs font-semibold hover:opacity-90 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Review
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {list.map((item) => (
          <div key={item.id} className="bg-card border border-border rounded-2xl p-5 shadow-soft flex flex-col justify-between">
            <div>
              <div className="flex text-gold mb-3">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-foreground font-display text-lg italic">
                "{item.quote}"
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <div>
                <p className="font-semibold text-xs">{item.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{item.event}</p>
              </div>
              <div className="inline-flex gap-1">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1 rounded border border-border hover:bg-secondary text-foreground cursor-pointer"
                >
                  <Edit className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => item.id && handleDelete(item.id, item.name)}
                  className="p-1 rounded border border-destructive/20 text-destructive hover:bg-destructive/10 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-md bg-card rounded-2xl shadow-luxe border border-border p-6 space-y-4 animate-float-up"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h4 className="font-display text-lg text-foreground">
                {editItem ? "Edit Review Details" : "Add Client Review"}
              </h4>
              <button type="button" onClick={() => setModalOpen(false)} className="p-1 rounded-full hover:bg-secondary">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-medium text-muted-foreground">Client Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none"
                  required
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-muted-foreground">Event & City</span>
                <input
                  type="text"
                  value={event}
                  onChange={(e) => setEvent(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none"
                  placeholder="e.g. Wedding · Udaipur"
                  required
                />
              </label>
            </div>

            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Rating (1-5 stars)</span>
              <select
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none"
              >
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Review Quote</span>
              <textarea
                value={quote}
                rows={4}
                onChange={(e) => setQuote(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none"
                required
              />
            </label>

            <div className="pt-3 border-t border-border flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-full border border-border text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-gold-gradient text-gold-foreground text-xs font-semibold hover:opacity-90 cursor-pointer"
              >
                Save review
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// --- 8. TEAM MEMBERS PANEL ---
function TeamPanel() {
  const [list, setList] = useState<TeamItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<TeamItem | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [image, setImage] = useState("");

  const load = async () => {
    const data = await getTeam();
    setList(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleOpenAdd = () => {
    setEditItem(null);
    setName("");
    setRole("");
    setImage("");
    setModalOpen(true);
  };

  const handleOpenEdit = (item: TeamItem) => {
    setEditItem(item);
    setName(item.name);
    setRole(item.role);
    setImage(item.image || "");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const teamData = { name, role, image };

    try {
      if (editItem && editItem.id) {
        await updateTeamMember(editItem.id, teamData);
        await logActivity(`Updated team profile: ${name}`);
        toast.success("Team member details updated");
      } else {
        await addTeamMember(teamData);
        await logActivity(`Added team member: ${name}`);
        toast.success("New member added successfully");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error("Failed to save member details.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete team profile "${name}"?`)) {
      try {
        await deleteTeamMember(id);
        await logActivity(`Deleted team profile: ${name}`);
        toast.success("Member profile removed");
        load();
      } catch (err) {
        toast.error("Failed to delete member.");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-card border border-border rounded-xl p-4 shadow-soft">
        <span className="text-sm font-medium text-muted-foreground">Manage Team Members</span>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold-gradient text-gold-foreground text-xs font-semibold hover:opacity-90 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Member
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {list.map((item) => (
          <div key={item.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft text-center flex flex-col justify-between">
            <div className="aspect-[4/5] bg-secondary flex items-center justify-center overflow-hidden">
              <img
                src={item.image || localImages.babyshower}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-4 bg-slate-50/20 border-t border-border flex flex-col justify-between flex-1">
              <div>
                <h4 className="font-display text-lg text-foreground truncate">{item.name}</h4>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{item.role}</p>
              </div>

              <div className="flex gap-2 justify-center mt-3 pt-3 border-t border-border/60">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="px-2.5 py-1 text-[10px] font-semibold rounded border border-border hover:bg-secondary text-foreground flex items-center gap-1 cursor-pointer"
                >
                  <Edit className="h-3 w-3" /> Edit
                </button>
                <button
                  onClick={() => item.id && handleDelete(item.id, item.name)}
                  className="px-2.5 py-1 text-[10px] font-semibold rounded border border-destructive/20 text-destructive hover:bg-destructive/10 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-md bg-card rounded-2xl shadow-luxe border border-border p-6 space-y-4 animate-float-up"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h4 className="font-display text-lg text-foreground">
                {editItem ? "Edit Team Profile" : "Add Team Member"}
              </h4>
              <button type="button" onClick={() => setModalOpen(false)} className="p-1 rounded-full hover:bg-secondary">
                <X className="h-4 w-4" />
              </button>
            </div>

            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Full Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none"
                required
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Role / Designation</span>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none"
                placeholder="e.g. Lead Decor Designer"
                required
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Photo URL (optional)</span>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none"
                placeholder="https://..."
              />
            </label>

            <div className="pt-3 border-t border-border flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-full border border-border text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-gold-gradient text-gold-foreground text-xs font-semibold hover:opacity-90 cursor-pointer"
              >
                Save Member
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// --- 9. FAQS PANEL ---
function FAQPanel() {
  const [list, setList] = useState<FAQItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<FAQItem | null>(null);

  // Form State
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [order, setOrder] = useState(1);

  const load = async () => {
    const data = await getFAQs();
    setList(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleOpenAdd = () => {
    setEditItem(null);
    setQuestion("");
    setAnswer("");
    setOrder(list.length + 1);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: FAQItem) => {
    setEditItem(item);
    setQuestion(item.question);
    setAnswer(item.answer);
    setOrder(item.order);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const faqData = { question, answer, order };

    try {
      if (editItem && editItem.id) {
        await updateFAQ(editItem.id, faqData);
        await logActivity("Updated FAQ list details");
        toast.success("FAQ updated successfully");
      } else {
        await addFAQ(faqData);
        await logActivity("Created new FAQ inquiry");
        toast.success("FAQ created successfully");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error("Failed to save FAQ.");
    }
  };

  const handleDelete = async (id: string, index: number) => {
    if (confirm(`Delete FAQ #${index}?`)) {
      try {
        await deleteFAQ(id);
        await logActivity(`Deleted FAQ item #${index}`);
        toast.success("FAQ deleted successfully");
        load();
      } catch (err) {
        toast.error("Failed to delete FAQ.");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-card border border-border rounded-xl p-4 shadow-soft">
        <span className="text-sm font-medium text-muted-foreground">Manage Frequently Asked Questions</span>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold-gradient text-gold-foreground text-xs font-semibold hover:opacity-90 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add FAQ
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft divide-y divide-border">
        {list.length > 0 ? (
          list.map((item, idx) => (
            <div key={item.id} className="p-5 flex items-start gap-4 hover:bg-slate-50/30 transition">
              <span className="h-6 w-6 rounded-full bg-gold/15 text-gold text-xs font-semibold flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <div className="flex-1 space-y-1">
                <h4 className="font-semibold text-sm text-foreground">{item.question}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.answer}</p>
              </div>
              <div className="inline-flex gap-1 shrink-0">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1 rounded border border-border hover:bg-secondary text-foreground cursor-pointer"
                >
                  <Edit className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => item.id && handleDelete(item.id, idx + 1)}
                  className="p-1 rounded border border-destructive/20 text-destructive hover:bg-destructive/10 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-xs text-muted-foreground">No FAQs currently configured.</div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-md bg-card rounded-2xl shadow-luxe border border-border p-6 space-y-4 animate-float-up"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h4 className="font-display text-lg text-foreground">
                {editItem ? "Edit FAQ details" : "Add FAQ Item"}
              </h4>
              <button type="button" onClick={() => setModalOpen(false)} className="p-1 rounded-full hover:bg-secondary">
                <X className="h-4 w-4" />
              </button>
            </div>

            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Question</span>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none"
                required
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Sort Order Placement</span>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none"
                required
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Answer details</span>
              <textarea
                value={answer}
                rows={4}
                onChange={(e) => setAnswer(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none"
                required
              />
            </label>

            <div className="pt-3 border-t border-border flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-full border border-border text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-gold-gradient text-gold-foreground text-xs font-semibold hover:opacity-90 cursor-pointer"
              >
                Save FAQ
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// --- 10. CONTACT INFO PANEL ---
function ContactPanel() {
  const [data, setData] = useState<ContactData>({
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    instagram: "",
    facebook: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const c = await getContact();
      if (c) setData(c);
      setLoading(false);
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateContact(data);
      await logActivity("Updated Studio Contact Details");
      toast.success("Contact credentials updated successfully!");
    } catch (err) {
      toast.error("Failed to update Contact info.");
    }
  };

  if (loading) return <div className="text-sm text-center py-10 text-muted-foreground">Loading details...</div>;

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 shadow-soft space-y-4">
      <h3 className="font-display text-xl pb-2 border-b border-border">Studio Contact Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-gold" /> Phone Number (Display)</span>
          <input
            type="text"
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none"
            required
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1"><span className="h-3.5 w-3.5 bg-[#25D366] text-white flex items-center justify-center rounded-full text-[8px] font-bold">W</span> WhatsApp Number (Country code + digits)</span>
          <input
            type="text"
            value={data.whatsapp}
            onChange={(e) => setData({ ...data, whatsapp: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none"
            placeholder="e.g. +919876543210"
            required
          />
        </label>
      </div>

      <label className="block">
        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-gold" /> Public Email</span>
        <input
          type="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none"
          required
        />
      </label>

      <label className="block">
        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-gold" /> Studio Address</span>
        <input
          type="text"
          value={data.address}
          onChange={(e) => setData({ ...data, address: e.target.value })}
          className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none"
          required
        />
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border pt-4">
        <label className="block">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1"><Instagram className="h-3.5 w-3.5 text-gold" /> Instagram Profile URL</span>
          <input
            type="text"
            value={data.instagram}
            onChange={(e) => setData({ ...data, instagram: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1"><Facebook className="h-3.5 w-3.5 text-gold" /> Facebook Page URL</span>
          <input
            type="text"
            value={data.facebook}
            onChange={(e) => setData({ ...data, facebook: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none"
          />
        </label>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="px-6 py-3 rounded-full bg-gold-gradient text-gold-foreground text-sm font-medium hover:opacity-90 transition cursor-pointer"
        >
          Save Details
        </button>
      </div>
    </form>
  );
}

// --- 11. WEBSITE SETTINGS PANEL ---
function SettingsPanel() {
  const [data, setData] = useState<SettingsData>({
    siteTitle: "",
    metaDescription: "",
    logoText: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const s = await getSettings();
      if (s) setData(s);
      setLoading(false);
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings(data);
      await logActivity("Updated global SEO parameters");
      toast.success("Site settings successfully saved!");
    } catch (err) {
      toast.error("Failed to save website parameters.");
    }
  };

  if (loading) return <div className="text-sm text-center py-10 text-muted-foreground">Loading details...</div>;

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 shadow-soft space-y-4">
      <h3 className="font-display text-xl pb-2 border-b border-border">Global Website Configuration</h3>

      <label className="block">
        <span className="text-xs font-medium text-muted-foreground">Navbar / Logo Brand Text</span>
        <input
          type="text"
          value={data.logoText}
          onChange={(e) => setData({ ...data, logoText: e.target.value })}
          className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none"
          required
        />
      </label>

      <label className="block">
        <span className="text-xs font-medium text-muted-foreground">HTML Browser Title Tag (SEO)</span>
        <input
          type="text"
          value={data.siteTitle}
          onChange={(e) => setData({ ...data, siteTitle: e.target.value })}
          className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none"
          required
        />
      </label>

      <label className="block">
        <span className="text-xs font-medium text-muted-foreground">Meta Description Tag (Google SEO Snippet)</span>
        <textarea
          value={data.metaDescription}
          rows={3}
          onChange={(e) => setData({ ...data, metaDescription: e.target.value })}
          className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none"
          required
        />
      </label>

      <div className="pt-2">
        <button
          type="submit"
          className="px-6 py-3 rounded-full bg-gold-gradient text-gold-foreground text-sm font-medium hover:opacity-90 transition cursor-pointer"
        >
          Save Website Settings
        </button>
      </div>
    </form>
  );
}

// --- 12. MEDIA LIBRARY ---
function MediaLibraryPanel() {
  const defaultAssets = [
    { name: "heroWedding.jpg", src: localImages.heroWedding },
    { name: "birthday.jpg", src: localImages.birthday },
    { name: "engagement.jpg", src: localImages.engagement },
    { name: "anniversary.jpg", src: localImages.anniversary },
    { name: "babyshower.jpg", src: localImages.babyshower },
    { name: "reception.jpg", src: localImages.reception },
    { name: "haldi.jpg", src: localImages.haldi },
    { name: "corporate.jpg", src: localImages.corporate },
  ];

  const handleCopyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    toast.success("Asset path copied to clipboard!");
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-soft space-y-4">
      <div className="pb-2 border-b border-border">
        <h3 className="font-display text-xl">Event Hub Media Catalog</h3>
        <p className="text-xs text-muted-foreground mt-1 font-sans">
          Quickly access default local media paths. You can copy the references and paste them directly into content image fields!
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {defaultAssets.map((asset) => (
          <div key={asset.name} className="border border-border rounded-xl overflow-hidden bg-background shadow-soft flex flex-col justify-between">
            <div className="aspect-[4/3] overflow-hidden bg-slate-100 flex items-center justify-center">
              <img src={asset.src} alt={asset.name} className="h-full w-full object-cover" />
            </div>
            <div className="p-3 space-y-1">
              <p className="text-xs font-semibold text-foreground truncate">{asset.name}</p>
              <button
                onClick={() => handleCopyPath(asset.src)}
                className="w-full mt-2 py-1 px-3 bg-secondary hover:bg-slate-200 text-[10px] font-semibold text-foreground rounded-lg transition flex items-center justify-center gap-1 cursor-pointer"
              >
                Copy Reference Path
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 13. PROFILE PANEL ---
function ProfilePanel() {
  const { user } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      if (user) {
        // Firebase password update (calls user directly)
        await (user as any).updatePassword(newPassword);
        toast.success("Security password updated successfully!");
        setNewPassword("");
        setConfirmPassword("");
        await logActivity("Updated profile account password");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update password. Re-authentication might be required.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handlePasswordUpdate} className="bg-card border border-border rounded-2xl p-6 shadow-soft space-y-4">
      <h3 className="font-display text-xl pb-2 border-b border-border">Account Profile Settings</h3>

      <label className="block opacity-65">
        <span className="text-xs font-medium text-muted-foreground">Email Profile (Read Only)</span>
        <input
          type="email"
          value={user?.email || ""}
          disabled
          className="mt-1.5 w-full rounded-xl border border-input bg-slate-50 px-4 py-3 text-sm focus:outline-none cursor-not-allowed"
        />
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border pt-4">
        <label className="block">
          <span className="text-xs font-medium text-muted-foreground">New Security Password</span>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none"
            placeholder="••••••••"
            required
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-muted-foreground">Confirm New Password</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none"
            placeholder="••••••••"
            required
          />
        </label>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 rounded-full bg-gold-gradient text-gold-foreground text-sm font-medium hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? "Updating..." : "Update Security Password"}
        </button>
      </div>
    </form>
  );
}
