import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Essay, Category } from '@/lib/types';

export function useEssays() {
  return useQuery({
    queryKey: ['essays'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('essays')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('published', true)
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      return data as (Essay & { category: Category | null })[];
    },
  });
}

export function useEssayBySlug(slug: string) {
  return useQuery({
    queryKey: ['essay', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('essays')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data as Essay & { category: Category | null };
    },
    enabled: !!slug,
  });
}

export function useFeaturedEssay() {
  return useQuery({
    queryKey: ['featuredEssay'],
    queryFn: async () => {
      // First try to get a featured essay
      let { data, error } = await supabase
        .from('essays')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('published', true)
        .eq('featured', true)
        .order('published_at', { ascending: false })
        .limit(1)
        .single();
      
      // If no featured essay, get the most recent one
      if (error || !data) {
        const result = await supabase
          .from('essays')
          .select(`
            *,
            category:categories(*)
          `)
          .eq('published', true)
          .order('published_at', { ascending: false })
          .limit(1)
          .single();
        
        data = result.data;
        error = result.error;
      }
      
      if (error) return null;
      return data as Essay & { category: Category | null };
    },
  });
}

export function useEssaysByCategory(categorySlug: string) {
  return useQuery({
    queryKey: ['essays', 'category', categorySlug],
    queryFn: async () => {
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .single();
      
      if (!category) return [];
      
      const { data, error } = await supabase
        .from('essays')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('published', true)
        .eq('category_id', category.id)
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      return data as (Essay & { category: Category | null })[];
    },
    enabled: !!categorySlug,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Category[];
    },
  });
}

// Admin mutations
export function useCreateEssay() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (essay: Omit<Essay, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('essays')
        .insert(essay)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['essays'] });
    },
  });
}

export function useUpdateEssay() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...essay }: Partial<Essay> & { id: string }) => {
      const { data, error } = await supabase
        .from('essays')
        .update(essay)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['essays'] });
    },
  });
}

export function useDeleteEssay() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('essays')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['essays'] });
    },
  });
}
