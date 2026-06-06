import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

type LoginSearch = {
  redirect?: string;
};

export const Route = createFileRoute("/_site/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    return {
      redirect: typeof search.redirect === "string" ? search.redirect : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Client Portal & Authentication - Aura Events" },
      { name: "description", content: "Access your client account, check your bookings, view proposals, or register for custom event consultation with Aura Events." },
      { property: "og:url", content: "/login" },
    ],
    links: [{ rel: "canonical", href: "/login" }],
  }),
  component: LoginComponent,
});

const GoogleIcon = () => (
  <svg className="h-5 w-5 mr-3 shrink-0" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
  </svg>
);

function LoginComponent() {
  const { user, role, loginWithEmail, registerWithEmail, loginWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();
  const search = Route.useSearch();

  const [activeTab, setActiveTab] = useState<"signin" | "register">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  // Forgot password flow
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotEmailSent, setForgotEmailSent] = useState(false);

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // If user is already logged in, redirect them
  useEffect(() => {
    if (user) {
      const emailLower = user.email ? user.email.toLowerCase() : "";
      const isAdminEmail = emailLower === "admin@auraevents.in" || 
                           emailLower.startsWith("admin@") || 
                           emailLower.includes("admin");
      const isAdminRole = role === "admin" || role === "staff";

      if (isAdminEmail || isAdminRole) {
        navigate({ to: "/admin" });
      } else {
        navigate({ to: search.redirect || "/" });
      }
    }
  }, [user, role, navigate, search.redirect]);

  const validateForm = () => {
    setError(null);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    if (activeTab === "register" && !name.trim()) {
      setError("Please enter your name.");
      return false;
    }
    return true;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      if (activeTab === "signin") {
        await loginWithEmail(email, password);
        toast.success("Welcome back! Sign in successful.");
      } else {
        await registerWithEmail(email, password, name);
        toast.success("Welcome to Aura Events! Registration successful.");
      }
    } catch (err: any) {
      console.error(err);
      let message = "Authentication failed. Please check your credentials.";
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        message = "Invalid email or password.";
      } else if (err.code === "auth/email-already-in-use") {
        message = "This email is already in use.";
      } else if (err.code === "auth/invalid-credential") {
        message = "Invalid credentials. Please verify and try again.";
      }
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      toast.success("Sign in with Google successful!");
    } catch (err: any) {
      console.error(err);
      if (err.code !== "auth/popup-closed-by-user") {
        const message = err.message || "Failed to sign in with Google.";
        setError(message);
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordEmail) {
      setError("Please enter your email to reset password.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await resetPassword(forgotPasswordEmail);
      setForgotEmailSent(true);
      toast.success("Password reset email sent!");
    } catch (err: any) {
      console.error(err);
      const message = "Failed to send reset email. Please verify the address.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-blush-gradient px-5 py-12 md:py-20">
      <div className="w-full max-w-md animate-float-up">
        {/* Logo and header */}
        <div className="text-center mb-8">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold-gradient text-gold-foreground font-display text-2xl shadow-soft mb-3">
            A
          </span>
          <h2 className="text-3xl font-display tracking-wide text-foreground">
            Aura <span className="text-gold-gradient">Events</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground font-sans">
            Luxury Destination Weddings & Celebrations House
          </p>
        </div>

        {/* Card wrapper */}
        <div className="bg-card border border-border shadow-luxe rounded-2xl overflow-hidden p-6 md:p-8">
          {/* Tabs header */}
          {!showForgotPassword && (
            <div className="flex border-b border-border/60 mb-6">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("signin");
                  setError(null);
                }}
                className={`flex-1 pb-3 text-sm font-medium tracking-wide border-b-2 transition-colors ${
                  activeTab === "signin"
                    ? "border-gold text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("register");
                  setError(null);
                }}
                className={`flex-1 pb-3 text-sm font-medium tracking-wide border-b-2 transition-colors ${
                  activeTab === "register"
                    ? "border-gold text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Form error message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/25 text-destructive text-sm flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Forgot password sent success screen */}
          {showForgotPassword && forgotEmailSent ? (
            <div className="text-center py-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-display text-foreground mb-2">Check Your Inbox</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                We have sent password reset instructions to <strong className="text-foreground">{forgotPasswordEmail}</strong>.
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotEmailSent(false);
                  setForgotPasswordEmail("");
                  setError(null);
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors w-full"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Sign In
              </button>
            </div>
          ) : showForgotPassword ? (
            /* Forgot Password Form */
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <h3 className="text-xl font-display text-foreground mb-1">Reset Password</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <div className="space-y-1">
                <label htmlFor="reset-email" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-foreground">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    id="reset-email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-gold-gradient text-gold-foreground text-sm font-medium hover:opacity-90 transition shadow-soft disabled:opacity-50"
                >
                  {loading ? "Sending link..." : "Send Reset Link"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setError(null);
                  }}
                  className="text-xs text-center text-muted-foreground hover:text-foreground py-2 transition-colors"
                >
                  Cancel and go back
                </button>
              </div>
            </form>
          ) : (
            /* Sign In / Register Forms */
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {activeTab === "register" && (
                <div className="space-y-1 animate-fade-in">
                  <label htmlFor="name" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-foreground">
                      <User className="h-4 w-4" />
                    </span>
                    <input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-foreground">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Password
                  </label>
                  {activeTab === "signin" && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(true);
                        setForgotPasswordEmail(email);
                        setError(null);
                      }}
                      className="text-xs text-gold hover:opacity-85 transition-opacity"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-foreground">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-gold-gradient text-gold-foreground text-sm font-medium hover:opacity-90 transition shadow-soft disabled:opacity-50"
              >
                {loading ? "Please wait..." : activeTab === "signin" ? "Sign In" : "Register"}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/60"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              {/* Google login button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-border bg-background hover:bg-muted text-foreground text-sm font-medium transition disabled:opacity-50"
              >
                <GoogleIcon />
                Sign In with Google
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
