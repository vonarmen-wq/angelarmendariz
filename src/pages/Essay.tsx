import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Linkedin, Twitter } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useEssayBySlug } from '@/hooks/useEssays';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { ArticleSchema } from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { SubstackCTA } from '@/components/home/SubstackCTA';

// Simple markdown-like rendering
function renderContent(content: string) {
  if (!content) return null;
  
  // Split into paragraphs
  const paragraphs = content.split(/\n\n+/);
  
  return paragraphs.map((para, i) => {
    const trimmed = para.trim();
    if (!trimmed) return null;
    
    // Check for headers
    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={i} className="font-display text-xl md:text-2xl font-semibold text-foreground mt-8 mb-4">
          {trimmed.slice(4)}
        </h3>
      );
    }
    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={i} className="font-display text-2xl md:text-3xl font-semibold text-foreground mt-10 mb-4">
          {trimmed.slice(3)}
        </h2>
      );
    }
    if (trimmed.startsWith('# ')) {
      return (
        <h1 key={i} className="font-display text-3xl md:text-4xl font-semibold text-foreground mt-12 mb-6">
          {trimmed.slice(2)}
        </h1>
      );
    }
    
    // Check for blockquotes
    if (trimmed.startsWith('> ')) {
      return (
        <blockquote key={i} className="border-l-3 border-accent pl-6 my-6 font-accent text-lg italic text-muted-foreground">
          {trimmed.slice(2)}
        </blockquote>
      );
    }
    
    // Regular paragraph
    return (
      <p key={i} className="font-body text-lg leading-relaxed text-foreground mb-6">
        {trimmed}
      </p>
    );
  });
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export default function EssayPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: essay, isLoading, error } = useEssayBySlug(slug || '');
  const { data: settings } = useSiteSettings();

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen py-20">
          <div className="container mx-auto px-6 max-w-3xl">
            <div className="animate-pulse space-y-8">
              <div className="h-4 bg-muted rounded w-32" />
              <div className="h-12 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-48" />
              <div className="space-y-4 pt-8">
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !essay) {
    return (
      <Layout title="Essay Not Found">
        <div className="min-h-screen py-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-4xl font-semibold text-foreground mb-4">
              Essay Not Found
            </h1>
            <p className="font-body text-muted-foreground mb-8">
              The essay you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/essays">View All Essays</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const readingTime = calculateReadingTime(essay.content);
  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(essay.title);

  return (
    <Layout
      title={essay.title}
      description={essay.excerpt || undefined}
      image={essay.featured_image || undefined}
      article
      publishedTime={essay.published_at || undefined}
      modifiedTime={essay.updated_at}
    >
      <ArticleSchema
        title={essay.title}
        description={essay.excerpt || undefined}
        publishedTime={essay.published_at || undefined}
        modifiedTime={essay.updated_at}
        image={essay.featured_image || undefined}
        authorName={settings?.site_name || 'Angel Armendariz'}
      />

      <article className="min-h-screen py-12 md:py-20">
        <div className="container mx-auto px-6">
          {/* Back Link */}
          <div className="max-w-3xl mx-auto mb-8">
            <Link
              to="/essays"
              className="inline-flex items-center font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Essays
            </Link>
          </div>

          {/* Header */}
          <header className="max-w-3xl mx-auto text-center mb-12">
            {/* Category */}
            {essay.category && (
              <Link
                to={`/essays?category=${essay.category.slug}`}
                className="inline-block font-body text-xs uppercase tracking-[0.2em] text-accent hover:text-primary transition-colors mb-4"
              >
                {essay.category.name}
              </Link>
            )}

            {/* Title */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-6 leading-tight">
              {essay.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              {essay.published_at && (
                <time className="font-body flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5" />
                  {format(new Date(essay.published_at), 'MMMM d, yyyy')}
                </time>
              )}
              <span>·</span>
              <span className="font-body">{readingTime} min read</span>
            </div>
          </header>

          {/* Featured Image */}
          {essay.featured_image && (
            <div className="max-w-4xl mx-auto mb-12">
              <img
                src={essay.featured_image}
                alt={essay.title}
                className="w-full h-auto rounded-lg shadow-elegant"
              />
            </div>
          )}

          {/* Content */}
          <div className="max-w-3xl mx-auto prose-renaissance">
            {renderContent(essay.content)}
          </div>

          {/* Share */}
          <div className="max-w-3xl mx-auto mt-16 pt-8 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="font-body text-sm uppercase tracking-widest text-muted-foreground">
                Share
              </span>
              <div className="flex items-center gap-4">
                <a
                  href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Share on X"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>

      <SubstackCTA />
    </Layout>
  );
}
