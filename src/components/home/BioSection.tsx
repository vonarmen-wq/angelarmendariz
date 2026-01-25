import { Link } from 'react-router-dom';
import { Linkedin, Twitter, ExternalLink, Rocket, MapPin } from 'lucide-react';
import { useSiteSettings, useMediaMentions } from '@/hooks/useSiteSettings';
import { Button } from '@/components/ui/button';

export function BioSection() {
  const { data: settings } = useSiteSettings();
  const { data: mentions } = useMediaMentions();

  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 max-w-6xl mx-auto">
          {/* Bio */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="font-body text-xs uppercase tracking-[0.2em] text-accent">
                About
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <p className="font-body text-lg md:text-xl text-foreground leading-relaxed">
              {settings?.bio || 'Enterprise technology leader with experience in proptech, fintech, and venture building.'}
            </p>

            <div className="flex items-center gap-4">
              {settings?.linkedin_url && (
                <a
                  href={settings.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="font-body text-sm">LinkedIn</span>
                </a>
              )}
              {settings?.twitter_url && (
                <a
                  href={settings.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                  <span className="font-body text-sm">X</span>
                </a>
              )}
            </div>

            {/* Location with animated rocket */}
            <div className="flex items-center gap-3 pt-2">
              <MapPin className="h-4 w-4 text-accent" />
              <span className="font-body text-sm text-muted-foreground">
                Boston, MA
              </span>
              <div className="relative ml-1">
                <Rocket 
                  className="h-5 w-5 text-accent animate-rocket-launch" 
                  style={{ 
                    filter: 'drop-shadow(0 0 4px hsl(42, 65%, 55%))',
                  }}
                />
                {/* Flame/trail effect */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-3 bg-gradient-to-t from-transparent via-accent/60 to-accent rounded-full animate-flame opacity-80" />
              </div>
            </div>

            <Button variant="outline" asChild>
              <Link to="/about">
                Learn More
              </Link>
            </Button>
          </div>

          {/* Media Mentions */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="font-body text-xs uppercase tracking-[0.2em] text-accent">
                Featured In
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {mentions && mentions.length > 0 ? (
              <div className="space-y-4">
                {mentions.slice(0, 5).map((mention) => (
                  <a
                    key={mention.id}
                    href={mention.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start justify-between p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-card transition-all"
                  >
                    <div>
                      <p className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-1">
                        {mention.source}
                      </p>
                      <p className="font-body text-foreground group-hover:text-primary transition-colors">
                        {mention.title}
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                  </a>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-lg border border-dashed border-border text-center">
                <p className="font-body text-muted-foreground">
                  Media mentions will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
