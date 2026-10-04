import { FileText, ShieldCheck, Sliders } from "lucide-react";
import LandingNavbar from "@/components/LandingNavbar";
import Footer from "@/components/Footer";

const TermsPrivacy = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[640px] bg-glow" />

      <LandingNavbar />

      <main className="relative z-10 mx-auto max-w-6xl px-6 pt-32 md:pt-40 pb-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center gap-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <ShieldCheck className="h-3 w-3 text-primary" /> Transparency first
          </span>
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            Terms & Privacy
          </h1>
          <p className="mx-auto max-w-2xl text-balance text-base text-muted-foreground">
            This page summarizes how Splitmate works and how we protect your information. 
            We keep it simple, readable, and aligned with the way people actually use the platform.
          </p>
        </div>

        <section className="mt-14 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <FileText className="h-4 w-4 text-primary" /> Terms of use
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Splitmate is designed for shared expenses among people who trust one another. 
              By using the app, you agree to provide accurate information and avoid misuse of the service.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Keep your account secure and only share data you’re comfortable with.</li>
              <li>Use Splitmate for lawful, personal, or small-team expense tracking.</li>
              <li>Respect group members by keeping entries truthful and timely.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck className="h-4 w-4 text-primary" /> Privacy overview
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              We collect only what we need to keep your groups organized—basic account details, group data, 
              and expense records. We never sell personal information.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Data is used to calculate balances, sync groups, and provide insights.</li>
              <li>We keep analytics minimal to improve stability and performance.</li>
              <li>You can request deletion of your account and data at any time.</li>
            </ul>
          </div>
        </section>

        <section className="mt-16 grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-border bg-gradient-surface p-6 shadow-card">
            <h2 className="text-2xl font-semibold tracking-tight">Your controls</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              You’re in charge of your information. Splitmate provides simple controls to export data, 
              leave groups, and delete your account when you no longer need the service.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sliders className="h-4 w-4 text-primary" /> Updates & changes
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              We may update these terms as Splitmate grows. When changes are significant, we’ll highlight them in-app 
              so you always know what’s new.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TermsPrivacy;
