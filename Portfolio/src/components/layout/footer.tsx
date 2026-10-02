import Link from "next/link";
import { cn } from "@/lib/utils";
import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { portfolioData } from "@/lib/portfolio-data";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-muted/30" role="contentinfo">
      <div className="container-wide py-12 lg:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-display font-bold text-foreground mb-4"
              aria-label="Eshwar - Home"
            >
              <span className="text-primary">Eshwar</span>
            </Link>
            <p className="text-muted-foreground text-body-md max-w-xs mb-6">
              {portfolioData.tagline}
            </p>
            <div className="flex flex-wrap gap-2">
              {portfolioData.summary.products.map((product) => (
                <span
                  key={product}
                  className="badge-neutral text-xs"
                >
                  {product}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="heading-sm text-foreground mb-4">Connect</h3>
            <ul className="space-y-3" role="list">
              {[
                { icon: Github, label: "GitHub", href: portfolioData.social.github },
                { icon: Linkedin, label: "LinkedIn", href: portfolioData.social.linkedin },
                { icon: Mail, label: "Email", href: `mailto:${portfolioData.email}` },
                { icon: Phone, label: "Phone", href: `tel:${portfolioData.phone}` },
              ].map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <Icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" aria-hidden="true" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="heading-sm text-foreground mb-4">Location</h3>
            <address className="not-italic text-sm text-muted-foreground space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>{portfolioData.location}</span>
              </div>
              <p className="text-body-sm">Open to opportunities</p>
              <p className="text-body-sm">Remote / Hybrid / On-site</p>
            </address>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Eshwar. Built with Next.js, TypeScript, and Tailwind CSS.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <span className="text-primary font-mono">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}