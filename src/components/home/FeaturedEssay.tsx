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
            {/* Featured Image with Baroque-inspired CSS Frame */}
            {essay.featured_image && (
              <Link to={`/essays/${essay.slug}`} className="block mb-8">
                <div className="relative max-w-2xl mx-auto">
                  {/* Baroque frame structure */}
                  <div className="relative p-5 md:p-7">
                    {/* Main frame background with carved effect */}
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(145deg, hsl(35 30% 35%) 0%, hsl(25 25% 25%) 50%, hsl(35 30% 30%) 100%)',
                        boxShadow: '0 8px 32px hsl(var(--foreground)/0.2), inset 0 2px 4px hsl(40 30% 50%/0.3), inset 0 -2px 4px hsl(20 20% 15%/0.5)'
                      }}
                    />
                    
                    {/* Inner carved border */}
                    <div 
                      className="absolute inset-2 md:inset-3"
                      style={{
                        border: '3px solid hsl(35 35% 40%)',
                        boxShadow: 'inset 0 1px 2px hsl(40 30% 55%/0.4), inset 0 -1px 2px hsl(20 20% 15%/0.4)'
                      }}
                    />
                    
                    {/* Innermost border detail */}
                    <div 
                      className="absolute inset-3 md:inset-4"
                      style={{
                        border: '1px solid hsl(35 25% 45%/0.6)'
                      }}
                    />
                    
                    {/* Top center ornament */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center">
                      <div className="w-6 h-3 rounded-t-full" style={{ background: 'linear-gradient(to bottom, hsl(35 35% 45%), hsl(25 25% 30%))' }} />
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45" style={{ background: 'linear-gradient(135deg, hsl(40 35% 50%), hsl(30 30% 35%))', boxShadow: '0 2px 4px hsl(0 0% 0%/0.3)' }} />
                    </div>
                    
                    {/* Bottom center ornament */}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center">
                      <div className="w-6 h-3 rounded-b-full" style={{ background: 'linear-gradient(to top, hsl(35 35% 45%), hsl(25 25% 30%))' }} />
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45" style={{ background: 'linear-gradient(135deg, hsl(40 35% 50%), hsl(30 30% 35%))', boxShadow: '0 2px 4px hsl(0 0% 0%/0.3)' }} />
                    </div>
                    
                    {/* Corner flourishes - Top Left */}
                    <div className="absolute -top-2 -left-2">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-tl-lg" style={{ background: 'linear-gradient(135deg, hsl(40 35% 50%) 0%, hsl(30 30% 35%) 50%, hsl(25 25% 28%) 100%)', boxShadow: '2px 2px 6px hsl(0 0% 0%/0.3)' }} />
                      <div className="absolute top-1 left-1 w-6 h-6 md:w-8 md:h-8 rounded-tl" style={{ background: 'linear-gradient(135deg, hsl(35 30% 55%), hsl(30 25% 40%))' }} />
                      {/* Scroll detail */}
                      <div className="absolute top-3 left-8 md:left-10 w-4 h-1.5 rounded-full" style={{ background: 'linear-gradient(90deg, hsl(35 35% 45%), transparent)' }} />
                      <div className="absolute top-8 md:top-10 left-3 w-1.5 h-4 rounded-full" style={{ background: 'linear-gradient(180deg, hsl(35 35% 45%), transparent)' }} />
                    </div>
                    
                    {/* Corner flourishes - Top Right */}
                    <div className="absolute -top-2 -right-2">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-tr-lg" style={{ background: 'linear-gradient(-135deg, hsl(40 35% 50%) 0%, hsl(30 30% 35%) 50%, hsl(25 25% 28%) 100%)', boxShadow: '-2px 2px 6px hsl(0 0% 0%/0.3)' }} />
                      <div className="absolute top-1 right-1 w-6 h-6 md:w-8 md:h-8 rounded-tr" style={{ background: 'linear-gradient(-135deg, hsl(35 30% 55%), hsl(30 25% 40%))' }} />
                      <div className="absolute top-3 right-8 md:right-10 w-4 h-1.5 rounded-full" style={{ background: 'linear-gradient(-90deg, hsl(35 35% 45%), transparent)' }} />
                      <div className="absolute top-8 md:top-10 right-3 w-1.5 h-4 rounded-full" style={{ background: 'linear-gradient(180deg, hsl(35 35% 45%), transparent)' }} />
                    </div>
                    
                    {/* Corner flourishes - Bottom Left */}
                    <div className="absolute -bottom-2 -left-2">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-bl-lg" style={{ background: 'linear-gradient(45deg, hsl(40 35% 50%) 0%, hsl(30 30% 35%) 50%, hsl(25 25% 28%) 100%)', boxShadow: '2px -2px 6px hsl(0 0% 0%/0.3)' }} />
                      <div className="absolute bottom-1 left-1 w-6 h-6 md:w-8 md:h-8 rounded-bl" style={{ background: 'linear-gradient(45deg, hsl(35 30% 55%), hsl(30 25% 40%))' }} />
                      <div className="absolute bottom-3 left-8 md:left-10 w-4 h-1.5 rounded-full" style={{ background: 'linear-gradient(90deg, hsl(35 35% 45%), transparent)' }} />
                      <div className="absolute bottom-8 md:bottom-10 left-3 w-1.5 h-4 rounded-full" style={{ background: 'linear-gradient(0deg, hsl(35 35% 45%), transparent)' }} />
                    </div>
                    
                    {/* Corner flourishes - Bottom Right */}
                    <div className="absolute -bottom-2 -right-2">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-br-lg" style={{ background: 'linear-gradient(-45deg, hsl(40 35% 50%) 0%, hsl(30 30% 35%) 50%, hsl(25 25% 28%) 100%)', boxShadow: '-2px -2px 6px hsl(0 0% 0%/0.3)' }} />
                      <div className="absolute bottom-1 right-1 w-6 h-6 md:w-8 md:h-8 rounded-br" style={{ background: 'linear-gradient(-45deg, hsl(35 30% 55%), hsl(30 25% 40%))' }} />
                      <div className="absolute bottom-3 right-8 md:right-10 w-4 h-1.5 rounded-full" style={{ background: 'linear-gradient(-90deg, hsl(35 35% 45%), transparent)' }} />
                      <div className="absolute bottom-8 md:bottom-10 right-3 w-1.5 h-4 rounded-full" style={{ background: 'linear-gradient(0deg, hsl(35 35% 45%), transparent)' }} />
                    </div>
                    
                    {/* Side ornaments */}
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-20 rounded-full" style={{ background: 'linear-gradient(to bottom, transparent, hsl(35 35% 45%) 30%, hsl(35 35% 45%) 70%, transparent)' }} />
                    <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-20 rounded-full" style={{ background: 'linear-gradient(to bottom, transparent, hsl(35 35% 45%) 30%, hsl(35 35% 45%) 70%, transparent)' }} />
                    
                    {/* Image container */}
                    <div className="relative" style={{ boxShadow: 'inset 0 2px 8px hsl(0 0% 0%/0.4)' }}>
                      <img
                        src={essay.featured_image}
                        alt={essay.title}
                        className="w-full h-auto max-h-[450px] object-cover transition-transform duration-500 group-hover:scale-[1.01]"
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
