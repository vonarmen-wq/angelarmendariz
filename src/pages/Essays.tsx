import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useEssays, useCategories } from '@/hooks/useEssays';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useState } from 'react';

// Default placeholder for essays without images
const defaultEssayImage = '/placeholder.svg';

export default function EssaysPage() {
  const { data: essays, isLoading } = useEssays();
  const { data: categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredEssays = selectedCategory
    ? essays?.filter((essay) => essay.category?.slug === selectedCategory)
    : essays;

  // Estimate reading time based on content length (roughly 200 words per minute)
  const getReadingTime = (content: string) => {
    const wordCount = content?.split(/\s+/).length || 0;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    return `${minutes} min read`;
  };

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
          <div className="max-w-6xl mx-auto">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/2] bg-muted rounded-lg mb-4" />
                    <div className="h-4 bg-muted rounded w-24 mb-3" />
                    <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-16 bg-muted rounded" />
                  </div>
                ))}
              </div>
            ) : filteredEssays && filteredEssays.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                {filteredEssays.map((essay) => (
                  <article 
                    key={essay.id}
                    className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-elegant transition-all duration-300"
                  >
                    {/* Featured Image */}
                    <Link to={`/essays/${essay.slug}`} className="block overflow-hidden">
                      <div className="aspect-[3/2] overflow-hidden">
                        <img
                          src={essay.featured_image || defaultEssayImage}
                          alt={essay.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="p-6">
                      {/* Metadata: Date & Read Time */}
                      <div className="flex items-center gap-3 mb-3 text-sm text-muted-foreground">
                        {essay.published_at && (
                          <time className="font-body flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {format(new Date(essay.published_at), 'MMM d, yyyy')}
                          </time>
                        )}
                        <span className="text-border">·</span>
                        <span className="font-body flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {getReadingTime(essay.content)}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-3 leading-tight line-clamp-2">
                        <Link
                          to={`/essays/${essay.slug}`}
                          className="hover:text-primary transition-colors"
                        >
                          {essay.title}
                        </Link>
                      </h2>

                      {/* Excerpt */}
                      {essay.excerpt && (
                        <p className="font-body text-muted-foreground leading-relaxed line-clamp-3">
                          {essay.excerpt}
                        </p>
                      )}
                    </div>
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
