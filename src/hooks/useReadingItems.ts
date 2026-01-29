import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

export function useCreateReadingItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (item: Omit<ReadingItem, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('reading_items')
        .insert(item)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['readingItems'] });
    },
  });
}

export function useUpdateReadingItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...item }: Partial<ReadingItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('reading_items')
        .update(item)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['readingItems'] });
    },
  });
}

export function useDeleteReadingItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('reading_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['readingItems'] });
    },
  });
}
