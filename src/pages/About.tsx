import { Users, ShieldCheck, Sparkles, HandCoins, Globe } from "lucide-react";
import LandingNavbar from "@/components/LandingNavbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[640px] bg-glow" />

      <LandingNavbar />

      <main className="relative z-10 mx-auto max-w-6xl px-6 pt-32 md:pt-40 pb-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center gap-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" /> Built for shared moments
          </span>
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            About Splitmate
          </h1>
          <p className="mx-auto max-w-2xl text-balance text-base text-muted-foreground">
            Splitmate helps friends, roommates, and teams stay on the same page when money moves fast. 
            We turn messy group spending into a clear, calm snapshot of who paid, who owes, and what’s next.
          </p>
        </div>

        <section className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: HandCoins,
              title: "Clear balances",
              body: "See exactly who owes whom at a glance, without awkward back-and-forth.",
            },
            {
              icon: Users,
              title: "Built for groups",
              body: "Create focused spaces for trips, apartments, or recurring events.",
            },
            {
              icon: ShieldCheck,
              title: "Trust-first design",
              body: "Your data stays protected with thoughtful defaults and transparent flows.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-6 shadow-card transition-smooth hover:border-primary/40"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-sm font-semibold">{title}</div>
              <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </section>

        <section className="mt-16 grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-border bg-gradient-surface p-6 shadow-card">
            <h2 className="text-2xl font-semibold tracking-tight">Why we built Splitmate</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              We wanted a clean, modern way to manage shared spending without spreadsheets or guilt. 
              Splitmate balances structure with flexibility so groups can track expenses, agree on splits, 
              and settle up quickly—without losing the fun of the moment.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              From weekend trips to shared apartments, Splitmate stays lightweight, fast, and easy to trust 
              so you can focus on the people, not the math.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Globe className="h-4 w-4 text-primary" /> What matters to us
            </div>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>Simple, honest tracking that reduces friction between friends.</li>
              <li>Privacy-respecting defaults and clear controls over your data.</li>
              <li>Design that feels calm, modern, and reliable on any device.</li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
