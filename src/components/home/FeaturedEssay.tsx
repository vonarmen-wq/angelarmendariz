import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { useFeaturedEssay } from '@/hooks/useEssays';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import baroqueFrame from '@/assets/baroque-frame.png';

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
            {/* Featured Image with Ornate Frame - Painting Effect */}
            {essay.featured_image && (
              <Link to={`/essays/${essay.slug}`} className="block mb-8">
                <div className="relative max-w-2xl mx-auto">
                  {/* Frame Shell - controls aspect ratio and contains all layers */}
                  <div className="relative w-full aspect-[4/3] shadow-lg">
                    {/* Frame background layer - faded frame, behind photo */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 pointer-events-none opacity-50 z-0"
                      style={{
                        backgroundImage: `url(${baroqueFrame})`,
                        backgroundSize: '100% 100%',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                      }}
                    />
                    
                    {/* Inner window - transparent opening where the photo sits */}
                    <div className="absolute inset-[9%] overflow-hidden z-10">
                      {/* Photo - fully opaque, fills the window */}
                      <img
                        src={essay.featured_image}
                        alt={essay.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            )}

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

            {/* Antique Ornamental Divider with Circular Elements */}
            <div className="flex items-center justify-center gap-3 mb-8 opacity-40">
              {/* Left scrollwork */}
              <div className="flex items-center gap-1">
                <div className="w-8 h-px bg-gradient-to-r from-transparent to-accent/60" />
                <div className="w-2 h-2 rounded-full border border-accent/50" />
                <div className="w-3 h-3 rounded-full border border-accent/60 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-accent/40" />
                </div>
              </div>
              
              {/* Left curved flourish */}
              <div className="w-12 h-4 relative">
                <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-accent/30 to-accent/50" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-accent/40 rounded-tr-full" />
              </div>
              
              {/* Center medallion */}
              <div className="relative">
                <div className="w-6 h-6 rounded-full border-2 border-accent/50 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full border border-accent/40 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent/30" />
                  </div>
                </div>
                {/* Small accent circles */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent/30" />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent/30" />
              </div>
              
              {/* Right curved flourish */}
              <div className="w-12 h-4 relative">
                <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-l from-accent/30 to-accent/50" />
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-accent/40 rounded-tl-full" />
              </div>
              
              {/* Right scrollwork */}
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full border border-accent/60 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-accent/40" />
                </div>
                <div className="w-2 h-2 rounded-full border border-accent/50" />
                <div className="w-8 h-px bg-gradient-to-l from-transparent to-accent/60" />
              </div>
            </div>

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
