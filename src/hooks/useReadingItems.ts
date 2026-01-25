import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ReadingItem {
  id: string;
  title: string;
  author: string | null;
  source: string | null;
  url: string | null;
  description: string | null;
  display_order: number | null;
  created_at: string;
}

export function useReadingItems() {
  return useQuery({
    queryKey: ['readingItems'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reading_items')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ReadingItem[];
    },
  });
}
