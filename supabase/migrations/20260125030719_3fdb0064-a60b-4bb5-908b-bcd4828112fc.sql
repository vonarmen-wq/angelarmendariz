-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create essays table
CREATE TABLE public.essays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL DEFAULT '',
  excerpt TEXT,
  featured_image TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  published BOOLEAN NOT NULL DEFAULT false,
  featured BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create site_settings table (single row for site config)
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name TEXT NOT NULL DEFAULT 'Angel Armendariz',
  tagline TEXT,
  bio TEXT,
  about_content TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  substack_url TEXT,
  seo_title TEXT,
  seo_description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  url TEXT,
  image TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create media_mentions table
CREATE TABLE public.media_mentions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT,
  mention_date DATE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_users table to track who is an admin
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_essays_updated_at
BEFORE UPDATE ON public.essays
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.essays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_mentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Categories are viewable by everyone"
ON public.categories FOR SELECT USING (true);

CREATE POLICY "Only admins can insert categories"
ON public.categories FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update categories"
ON public.categories FOR UPDATE USING (public.is_admin());

CREATE POLICY "Only admins can delete categories"
ON public.categories FOR DELETE USING (public.is_admin());

-- Essays policies
CREATE POLICY "Published essays are viewable by everyone"
ON public.essays FOR SELECT USING (published = true OR public.is_admin());

CREATE POLICY "Only admins can insert essays"
ON public.essays FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update essays"
ON public.essays FOR UPDATE USING (public.is_admin());

CREATE POLICY "Only admins can delete essays"
ON public.essays FOR DELETE USING (public.is_admin());

-- Site settings policies
CREATE POLICY "Site settings are viewable by everyone"
ON public.site_settings FOR SELECT USING (true);

CREATE POLICY "Only admins can update site settings"
ON public.site_settings FOR UPDATE USING (public.is_admin());

CREATE POLICY "Only admins can insert site settings"
ON public.site_settings FOR INSERT WITH CHECK (public.is_admin());

-- Projects policies
CREATE POLICY "Projects are viewable by everyone"
ON public.projects FOR SELECT USING (true);

CREATE POLICY "Only admins can insert projects"
ON public.projects FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update projects"
ON public.projects FOR UPDATE USING (public.is_admin());

CREATE POLICY "Only admins can delete projects"
ON public.projects FOR DELETE USING (public.is_admin());

-- Media mentions policies
CREATE POLICY "Media mentions are viewable by everyone"
ON public.media_mentions FOR SELECT USING (true);

CREATE POLICY "Only admins can insert media mentions"
ON public.media_mentions FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update media mentions"
ON public.media_mentions FOR UPDATE USING (public.is_admin());

CREATE POLICY "Only admins can delete media mentions"
ON public.media_mentions FOR DELETE USING (public.is_admin());

-- Admin users policies (only admins can see/manage admin list)
CREATE POLICY "Only admins can view admin users"
ON public.admin_users FOR SELECT USING (public.is_admin());

-- Insert default categories
INSERT INTO public.categories (name, slug) VALUES
('Strategy', 'strategy'),
('Technology', 'technology'),
('Sales', 'sales');

-- Insert default site settings
INSERT INTO public.site_settings (site_name, tagline, bio, linkedin_url, twitter_url, substack_url) VALUES
('Angel Armendariz', 'Enterprise Technology & Strategy', 'Angel Armendariz is an enterprise technology leader with experience in proptech, fintech, and venture building.', 'https://linkedin.com/in/angelarmendariz', 'https://x.com/AngelArmendariz', 'https://angelarmendariz.substack.com');

-- Create indexes for performance
CREATE INDEX idx_essays_published ON public.essays(published);
CREATE INDEX idx_essays_slug ON public.essays(slug);
CREATE INDEX idx_essays_category ON public.essays(category_id);
CREATE INDEX idx_essays_published_at ON public.essays(published_at DESC);