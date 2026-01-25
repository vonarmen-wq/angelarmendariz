import { Link } from 'react-router-dom';
import { Linkedin, Twitter } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export function Footer() {
  const { data: settings } = useSiteSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-display text-xl font-semibold text-foreground">
              {settings?.site_name || 'Angel Armendariz'}
            </h3>
            <p className="font-body text-muted-foreground text-sm leading-relaxed">
              {settings?.tagline || 'Enterprise Technology & Strategy'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display text-sm uppercase tracking-widest text-muted-foreground">
              Explore
            </h4>
            <nav className="flex flex-col gap-2">
              <Link to="/essays" className="font-body text-sm text-foreground hover:text-primary transition-colors">
                Essays
              </Link>
              <Link to="/about" className="font-body text-sm text-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/portfolio" className="font-body text-sm text-foreground hover:text-primary transition-colors">
                Portfolio
              </Link>
            </nav>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h4 className="font-display text-sm uppercase tracking-widest text-muted-foreground">
              Connect
            </h4>
            <div className="flex items-center gap-4">
              {settings?.linkedin_url && (
                <a
                  href={settings.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {settings?.twitter_url && (
                <a
                  href={settings.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="X (Twitter)"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {settings?.substack_url && (
                <a
                  href={settings.substack_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-xs uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors"
                >
                  Substack
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-body text-xs text-muted-foreground">
              © {currentYear} {settings?.site_name || 'Angel Armendariz'}. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="ornament-divider w-8" />
              <span className="font-accent italic">Semper Anticus</span>
              <span className="ornament-divider w-8" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
