-- Create reading_items table for Reading Stream
CREATE TABLE public.reading_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  source TEXT,
  url TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reading_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Reading items are viewable by everyone"
ON public.reading_items FOR SELECT USING (true);

CREATE POLICY "Only admins can insert reading items"
ON public.reading_items FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update reading items"
ON public.reading_items FOR UPDATE USING (public.is_admin());

CREATE POLICY "Only admins can delete reading items"
ON public.reading_items FOR DELETE USING (public.is_admin());