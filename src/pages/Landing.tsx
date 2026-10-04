import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Wallet, Sparkles, Receipt, Users, UserPlus, FileText, CheckCircle, Minimize2, Maximize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import LandingNavbar from "@/components/LandingNavbar";
import Footer from "@/components/Footer";
import LandingDemoVideo from "@/components/LandingDemoVideo";

const Landing = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isDemoMinimized, setIsDemoMinimized] = useState(false);
  const [isDemoMaximized, setIsDemoMaximized] = useState(false);
  const demoVideoUrl = "https://www.youtube.com/embed/";

  useEffect(() => {
    if (isAuthenticated) {
      if (user && !user.isOnboarded) {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, user, navigate]);

  const openDemo = () => {
    setIsDemoOpen(true);
    setIsDemoMinimized(false);
    setIsDemoMaximized(false);
  };

  const closeDemo = () => {
    setIsDemoOpen(false);
    setIsDemoMinimized(false);
    setIsDemoMaximized(false);
  };

  const minimizeDemo = () => {
    setIsDemoMinimized(true);
    setIsDemoMaximized(false);
  };

  const toggleMaximizeDemo = () => {
    setIsDemoMaximized((prev) => !prev);
    setIsDemoMinimized(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[640px] bg-glow" />

      <LandingNavbar />

      <main className="relative z-10 mx-auto max-w-6xl px-6 pt-32 md:pt-40 pb-20 flex flex-col items-center gap-16">
        
        {/* Hero Section */}
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center gap-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" /> Built for friends, roommates & trips
          </span>
          <h1 className="text-balance text-5xl font-semibold tracking-tight md:text-6xl">
            Split expenses.<br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">Skip the awkward math.</span>
          </h1>
          <p className="mx-auto max-w-xl text-balance text-base text-muted-foreground">
            Track shared spending, see who owes whom in seconds, and settle up cleanly — all in one quietly powerful workspace.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
                Start splitting <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <LandingDemoVideo videoUrl={demoVideoUrl} />
            <Button size="lg" variant="outline" onClick={openDemo}>
              View demo
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="w-full max-w-5xl mt-12 scroll-mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold tracking-tight">Why choose Splitmate?</h2>
            <p className="text-muted-foreground mt-2">Everything you need to manage shared expenses without the headache.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Users,   title: "Groups",   body: "Bundle friends, roommates, or trip buddies into focused spaces." },
              { icon: Receipt, title: "Expenses", body: "Add an expense in seconds — split equally or with custom shares." },
              { icon: Wallet,  title: "Settle",   body: "See exactly who owes whom and resolve balances cleanly." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-6 shadow-card transition-smooth hover:border-primary/40">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-sm font-semibold">{title}</div>
                <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full max-w-5xl mt-12 scroll-mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold tracking-tight">How it works</h2>
            <p className="text-muted-foreground mt-2">Settle up in three simple steps.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { 
                step: "1", 
                title: "Create a Group", 
                body: "Start a group for your apartment, weekend trip, or dinner party and invite your friends.",
                icon: UserPlus 
              },
              { 
                step: "2", 
                title: "Add Expenses", 
                body: "Log what you paid for. Split equally or enter custom amounts for exact shares.",
                icon: FileText 
              },
              { 
                step: "3", 
                title: "Settle Up", 
                body: "See exactly who owes whom instantly, and resolve balances cleanly with one tap.",
                icon: CheckCircle 
              },
            ].map(({ step, title, body, icon: Icon }) => (
              <div key={step} className="flex flex-col items-center text-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl relative">
                  <Icon className="absolute opacity-20 h-8 w-8" />
                  {step}
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      {isDemoOpen && !isDemoMinimized && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm p-4">
          <div
            role="dialog"
            aria-modal="true"
            className={`rounded-2xl border border-border bg-card/95 shadow-elevated backdrop-blur transition-smooth ${isDemoMaximized ? "w-[min(96vw,1280px)]" : "w-[min(92vw,960px)]"}`}
          >
            <div className="flex items-center justify-between border-b border-border bg-gradient-surface px-4 py-3">
              <div className="text-sm font-semibold">Splitmate demo</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={minimizeDemo}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-smooth hover:text-foreground"
                  aria-label="Minimize demo video"
                >
                  <Minimize2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={toggleMaximizeDemo}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-smooth hover:text-foreground"
                  aria-label={isDemoMaximized ? "Restore demo video size" : "Maximize demo video"}
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={closeDemo}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-smooth hover:text-foreground"
                  aria-label="Close demo video"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-3 sm:p-4">
              <div className="aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted/20">
                <iframe
                  className="h-full w-full"
                  src={demoVideoUrl}
                  title="Splitmate demo video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {isDemoOpen && isDemoMinimized && (
        <div className="fixed bottom-4 right-4 z-50 w-[min(90vw,320px)] rounded-2xl border border-border bg-card/95 shadow-elevated backdrop-blur">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="text-sm font-semibold">Splitmate demo</div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground/40"
                aria-label="Demo video minimized"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={toggleMaximizeDemo}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-smooth hover:text-foreground"
                aria-label="Restore demo video"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={closeDemo}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-smooth hover:text-foreground"
                aria-label="Close demo video"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Landing;
