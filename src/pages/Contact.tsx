import { Mail, MessageCircle, ShieldAlert, Clock } from "lucide-react";
import LandingNavbar from "@/components/LandingNavbar";
import Footer from "@/components/Footer";

const Contact = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[640px] bg-glow" />

      <LandingNavbar />

      <main className="relative z-10 mx-auto max-w-6xl px-6 pt-32 md:pt-40 pb-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center gap-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <MessageCircle className="h-3 w-3 text-primary" /> We’re here to help
          </span>
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            Contact Splitmate
          </h1>
          <p className="mx-auto max-w-2xl text-balance text-base text-muted-foreground">
            Reach out for support, feedback, or partnership questions. We respond quickly and keep communication simple.
          </p>
        </div>

        <section className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Mail,
              title: "Support",
              body: "support@splitmate.app",
              note: "Account help, billing questions, and general issues.",
            },
            {
              icon: MessageCircle,
              title: "Partnerships",
              body: "hello@splitmate.app",
              note: "For teams, creators, or community collaborations.",
            },
            {
              icon: ShieldAlert,
              title: "Security",
              body: "security@splitmate.app",
              note: "Report vulnerabilities or privacy concerns responsibly.",
            },
          ].map(({ icon: Icon, title, body, note }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-6 shadow-card transition-smooth hover:border-primary/40"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-sm font-semibold">{title}</div>
              <p className="mt-2 text-sm font-medium text-foreground">{body}</p>
              <p className="mt-2 text-sm text-muted-foreground">{note}</p>
            </div>
          ))}
        </section>

        <section className="mt-16 grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-border bg-gradient-surface p-6 shadow-card">
            <h2 className="text-2xl font-semibold tracking-tight">What to include</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              To help us resolve your request fast, share the email tied to your account, the group name, 
              and a short summary of what you’re trying to do. Screenshots or steps to reproduce are always helpful.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Clock className="h-4 w-4 text-primary" /> Response times
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Most requests are answered within 24 hours on weekdays. Priority issues are handled sooner when possible.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
