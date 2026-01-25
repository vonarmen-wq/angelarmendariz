import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/essays', label: 'Essays' },
  { href: '/reading-stream', label: 'Thinking Machines' },
  { href: '/about', label: 'About' },
  { href: '/portfolio', label: 'Portfolio' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: settings } = useSiteSettings();
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-6">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="font-display text-xl md:text-2xl font-semibold text-foreground hover:text-primary transition-colors"
          >
            {settings?.site_name || 'Angel Armendariz'}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'font-body text-sm uppercase tracking-widest transition-colors',
                  isActive(link.href)
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social Links - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {settings?.substack_url && (
              <a
                href={settings.substack_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-xs uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors"
              >
                Subscribe
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'font-body text-sm uppercase tracking-widest py-2 transition-colors',
                    isActive(link.href)
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {settings?.substack_url && (
                <a
                  href={settings.substack_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm uppercase tracking-widest py-2 text-accent"
                >
                  Subscribe
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
