import { Layout } from '@/components/layout/Layout';
import { useSiteSettings, useMediaMentions } from '@/hooks/useSiteSettings';
import { Linkedin, Twitter, ExternalLink } from 'lucide-react';
import { SubstackCTA } from '@/components/home/SubstackCTA';
import { format } from 'date-fns';

export default function AboutPage() {
  const { data: settings } = useSiteSettings();
  const { data: mentions } = useMediaMentions();

  return (
    <Layout
      title="About"
      description={settings?.bio || 'Enterprise technology leader with experience in proptech, fintech, and venture building.'}
    >
      <div className="min-h-screen py-12 md:py-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <header className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
              About
            </h1>
            <div className="flex justify-center gap-6">
              {settings?.linkedin_url && (
                <a
                  href={settings.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-6 w-6" />
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
                  <Twitter className="h-6 w-6" />
                </a>
              )}
            </div>
          </header>

          {/* Bio Content */}
          <div className="max-w-3xl mx-auto">
            <div className="prose-renaissance space-y-6">
              {settings?.about_content ? (
                settings.about_content.split('\n\n').map((para, i) => (
                  <p key={i} className="font-body text-lg leading-relaxed text-foreground">
                    {para}
                  </p>
                ))
              ) : (
                <p className="font-body text-lg leading-relaxed text-foreground">
                  {settings?.bio || 'Enterprise technology leader with experience in proptech, fintech, and venture building.'}
                </p>
              )}
            </div>

            {/* Ornamental Divider */}
            <div className="my-16 flex items-center justify-center gap-4">
              <div className="w-12 h-px bg-accent/50" />
              <div className="w-2 h-2 rotate-45 border border-accent/50" />
              <div className="w-12 h-px bg-accent/50" />
            </div>

            {/* Media Mentions */}
            {mentions && mentions.length > 0 && (
              <section>
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-8">
                  Featured In
                </h2>
                <div className="grid gap-4">
                  {mentions.map((mention) => (
                    <a
                      key={mention.id}
                      href={mention.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start justify-between p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-card transition-all"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-body text-xs uppercase tracking-widest text-muted-foreground">
                            {mention.source}
                          </p>
                          {mention.mention_date && (
                            <>
                              <span className="text-muted-foreground">·</span>
                              <p className="font-body text-xs text-muted-foreground">
                                {format(new Date(mention.mention_date), 'MMM yyyy')}
                              </p>
                            </>
                          )}
                        </div>
                        <p className="font-body text-foreground group-hover:text-primary transition-colors">
                          {mention.title}
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                    </a>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      <SubstackCTA />
    </Layout>
  );
}
