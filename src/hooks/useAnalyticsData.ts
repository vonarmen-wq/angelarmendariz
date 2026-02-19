import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsData {
  totalPageViews: number;
  uniqueSessions: number;
  topPages: { path: string; views: number }[];
  dailyData: { date: string; views: number; visitors: number }[];
  trafficSources: { name: string; value: number }[];
  essayViews: { path: string; views: number }[];
}

export function useAnalyticsData(days = 30) {
  return useQuery<AnalyticsData>({
    queryKey: ['analytics', days],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/getanalytics?days=${days}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!res.ok) {
        throw new Error('Failed to fetch analytics');
      }

      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
