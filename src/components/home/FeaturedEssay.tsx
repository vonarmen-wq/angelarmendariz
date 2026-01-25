import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { useFeaturedEssay } from '@/hooks/useEssays';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export function FeaturedEssay() {
  const { data: essay, isLoading } = useFeaturedEssay();

  if (isLoading) {
    return (
      <section className="py-20 md:py-32 bg-card/50">
        <div className="container mx-auto px-6">
          <div className="animate-pulse space-y-8 max-w-4xl mx-auto">
            <div className="h-4 bg-muted rounded w-32" />
            <div className="h-12 bg-muted rounded w-3/4" />
            <div className="h-24 bg-muted rounded" />
          </div>
        </div>
      </section>
    );
  }

  if (!essay) {
    return (
      <section className="py-20 md:py-32 bg-card/50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Essays Coming Soon
          </h2>
          <p className="font-body text-lg text-muted-foreground">
            Check back soon for insights on technology, strategy, and building.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-32 bg-card/50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section Label */}
          <div className="flex items-center gap-4 mb-8">
            <span className="font-body text-xs uppercase tracking-[0.2em] text-accent">
              Featured Essay
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Essay Card */}
          <article className="group">
            {/* Category & Date */}
            <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
              {essay.category && (
                <>
                  <Link 
                    to={`/essays?category=${essay.category.slug}`}
                    className="font-body uppercase tracking-widest hover:text-primary transition-colors"
                  >
                    {essay.category.name}
                  </Link>
                  <span>·</span>
                </>
              )}
              {essay.published_at && (
                <time className="font-body flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5" />
                  {format(new Date(essay.published_at), 'MMMM d, yyyy')}
                </time>
              )}
            </div>

            {/* Title */}
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-6 leading-tight">
              <Link 
                to={`/essays/${essay.slug}`}
                className="hover:text-primary transition-colors"
              >
                {essay.title}
              </Link>
            </h2>

            {/* Excerpt */}
            {essay.excerpt && (
              <p className="font-body text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
                {essay.excerpt}
              </p>
            )}

            {/* Read More */}
            <Button
              variant="ghost"
              asChild
              className="group/btn p-0 h-auto font-body text-primary hover:text-accent hover:bg-transparent"
            >
              <Link to={`/essays/${essay.slug}`}>
                <span className="uppercase tracking-widest text-sm">Read Essay</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </Button>
          </article>

          {/* Ornamental Divider */}
          <div className="mt-16 flex items-center justify-center gap-4">
            <div className="w-12 h-px bg-accent/50" />
            <div className="w-2 h-2 rotate-45 border border-accent/50" />
            <div className="w-12 h-px bg-accent/50" />
          </div>
        </div>
      </div>
    </section>
  );
}
