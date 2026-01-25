import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

export function SubstackCTA() {
  const { data: settings } = useSiteSettings();

  if (!settings?.substack_url) return null;

  return (
    <section className="py-20 md:py-32 bg-primary text-primary-foreground">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Ornament */}
          <div className="flex justify-center">
            <Mail className="h-10 w-10 text-accent" />
          </div>

          <h2 className="font-display text-3xl md:text-4xl font-semibold">
            Join the Newsletter
          </h2>

          <p className="font-body text-lg text-primary-foreground/80 max-w-xl mx-auto">
            Get essays on technology, strategy, and building delivered directly to your inbox.
          </p>

          <Button
            asChild
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-body uppercase tracking-widest"
          >
            <a
              href={settings.substack_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Subscribe on Substack
            </a>
          </Button>

          <p className="font-body text-sm text-primary-foreground/60">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
