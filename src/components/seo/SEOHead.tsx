import { useEffect } from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  article?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  canonicalUrl?: string;
}

export function SEOHead({
  title,
  description,
  image,
  article = false,
  publishedTime,
  modifiedTime,
  canonicalUrl,
}: SEOHeadProps) {
  const { data: settings } = useSiteSettings();

  const siteName = settings?.site_name || 'Angel Armendariz';
  const siteDescription = settings?.seo_description || settings?.bio || 'Enterprise Technology & Strategy';
  
  const pageTitle = title ? `${title} | ${siteName}` : siteName;
  const pageDescription = description || siteDescription;
  const pageImage = image || '/og-image.png';
  const url = canonicalUrl || window.location.href;

  useEffect(() => {
    // Update document title
    document.title = pageTitle;

    // Update meta tags
    const updateMeta = (name: string, content: string, property?: boolean) => {
      const attr = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMeta('description', pageDescription);
    updateMeta('author', siteName);

    // Open Graph
    updateMeta('og:title', pageTitle, true);
    updateMeta('og:description', pageDescription, true);
    updateMeta('og:image', pageImage, true);
    updateMeta('og:url', url, true);
    updateMeta('og:site_name', siteName, true);
    updateMeta('og:type', article ? 'article' : 'website', true);

    if (article && publishedTime) {
      updateMeta('article:published_time', publishedTime, true);
    }
    if (article && modifiedTime) {
      updateMeta('article:modified_time', modifiedTime, true);
    }

    // Twitter Card
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', pageTitle);
    updateMeta('twitter:description', pageDescription);
    updateMeta('twitter:image', pageImage);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }, [pageTitle, pageDescription, pageImage, url, article, publishedTime, modifiedTime, siteName]);

  return null;
}

// JSON-LD structured data components
export function PersonSchema() {
  const { data: settings } = useSiteSettings();

  if (!settings) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: settings.site_name,
    description: settings.bio,
    url: window.location.origin,
    sameAs: [
      settings.linkedin_url,
      settings.twitter_url,
      settings.substack_url,
    ].filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ArticleSchema({
  title,
  description,
  publishedTime,
  modifiedTime,
  image,
  authorName,
}: {
  title: string;
  description?: string;
  publishedTime?: string;
  modifiedTime?: string;
  image?: string;
  authorName: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: image,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Person',
      name: authorName,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
