import { Wallet, Twitter, Github, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-border bg-background pt-16 pb-8">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <Wallet className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-semibold tracking-tight">Splitmate</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Track shared spending, see who owes whom, and settle up cleanly.
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">Product</h3>
            <a href="/#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              How it works
            </a>
            <a href="/#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Features
            </a>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">Company</h3>
            <Link to="/splitmate-about" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              About
            </Link>
            <Link to="/splitmate-contact" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Contact
            </Link>
            <Link to="/splitmate-terms" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Terms & Privacy
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">Connect</h3>
            <div className="flex items-center gap-4">
              <a href="https://twitter.com/splitmate" target="_blank" rel="noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="https://github.com/splitmate" target="_blank" rel="noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="https://linkedin.com/company/splitmate" target="_blank" rel="noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-border/50 pt-8">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Splitmate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
