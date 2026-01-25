import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { SEOHead } from '@/components/seo/SEOHead';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  image?: string;
  article?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}

export function Layout({
  children,
  title,
  description,
  image,
  article = false,
  publishedTime,
  modifiedTime,
}: LayoutProps) {
  return (
    <>
      <SEOHead
        title={title}
        description={description}
        image={image}
        article={article}
        publishedTime={publishedTime}
        modifiedTime={modifiedTime}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 pt-16 md:pt-20">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
