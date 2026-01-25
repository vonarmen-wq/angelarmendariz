import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useEssays, useCategories } from '@/hooks/useEssays';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function EssaysPage() {
  const { data: essays, isLoading } = useEssays();
  const { data: categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredEssays = selectedCategory
    ? essays?.filter((essay) => essay.category?.slug === selectedCategory)
    : essays;

  return (
    <Layout
      title="Essays"
      description="Thoughts on technology, strategy, and building enterprises."
    >
      <div className="min-h-screen py-12 md:py-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <header className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
              Essays
            </h1>
            <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Thoughts on technology, strategy, and building enterprises.
            </p>
          </header>

          {/* Category Filter */}
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="font-body uppercase tracking-widest text-xs"
              >
                All
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.slug ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className="font-body uppercase tracking-widest text-xs"
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          )}

          {/* Essays Grid */}
          <div className="max-w-4xl mx-auto">
            {isLoading ? (
              <div className="space-y-12">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse space-y-4">
                    <div className="h-4 bg-muted rounded w-32" />
                    <div className="h-8 bg-muted rounded w-3/4" />
                    <div className="h-16 bg-muted rounded" />
                  </div>
                ))}
              </div>
            ) : filteredEssays && filteredEssays.length > 0 ? (
              <div className="space-y-16">
                {filteredEssays.map((essay, index) => (
                  <article 
                    key={essay.id}
                    className={cn(
                      'group pb-16',
                      index !== filteredEssays.length - 1 && 'border-b border-border'
                    )}
                  >
                    {/* Category & Date */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      {essay.category && (
                        <>
                          <button
                            onClick={() => setSelectedCategory(essay.category!.slug)}
                            className="font-body uppercase tracking-widest hover:text-primary transition-colors"
                          >
                            {essay.category.name}
                          </button>
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
                    <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4 leading-tight">
                      <Link
                        to={`/essays/${essay.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {essay.title}
                      </Link>
                    </h2>

                    {/* Excerpt */}
                    {essay.excerpt && (
                      <p className="font-body text-lg text-muted-foreground leading-relaxed mb-6">
                        {essay.excerpt}
                      </p>
                    )}

                    {/* Read More */}
                    <Link
                      to={`/essays/${essay.slug}`}
                      className="inline-flex items-center font-body text-sm uppercase tracking-widest text-primary hover:text-accent transition-colors group/link"
                    >
                      Read Essay
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="font-body text-lg text-muted-foreground">
                  {selectedCategory
                    ? 'No essays found in this category.'
                    : 'No essays published yet. Check back soon!'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
