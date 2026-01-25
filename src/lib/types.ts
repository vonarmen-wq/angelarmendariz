export interface Essay {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  category_id: string | null;
  published: boolean;
  featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  tagline: string | null;
  bio: string | null;
  about_content: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  substack_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  url: string | null;
  image: string | null;
  display_order: number;
  created_at: string;
}

export interface MediaMention {
  id: string;
  source: string;
  title: string;
  url: string | null;
  mention_date: string | null;
  display_order: number;
  created_at: string;
}
