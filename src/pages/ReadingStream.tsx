import { Layout } from '@/components/layout/Layout';
import { useReadingItems } from '@/hooks/useReadingItems';
import { ExternalLink, BookOpen } from 'lucide-react';

export default function ReadingStreamPage() {
  const { data: items, isLoading } = useReadingItems();

  return (
    <Layout
      title="Reading Stream"
      description="A curated collection of books, essays, and ideas that have shaped my thinking."
    >
      <div className="min-h-screen py-12 md:py-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <header className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
              Reading Stream
            </h1>
            <p className="font-body text-lg text-muted-foreground">
              A curated collection of books, essays, and ideas that have shaped my thinking.
            </p>
          </header>

          {/* Content */}
          <div className="max-w-3xl mx-auto">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-card animate-pulse rounded-lg" />
                ))}
              </div>
            ) : items && items.length > 0 ? (
              <div className="space-y-6">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="group p-6 rounded-lg border border-border hover:border-primary/50 hover:bg-card/50 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h2 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                              {item.title}
                            </h2>
                            {item.author && (
                              <p className="font-body text-sm text-muted-foreground mt-1">
                                by {item.author}
                              </p>
                            )}
                          </div>
                          {item.url && (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-shrink-0 text-muted-foreground hover:text-primary transition-colors"
                              aria-label={`Read ${item.title}`}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                        {item.source && (
                          <p className="font-body text-xs uppercase tracking-widest text-accent mt-2">
                            {item.source}
                          </p>
                        )}
                        {item.description && (
                          <p className="font-body text-muted-foreground mt-3 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="font-body text-muted-foreground">
                  Reading recommendations coming soon.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
