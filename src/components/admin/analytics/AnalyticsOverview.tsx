import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Eye } from 'lucide-react';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';

export function AnalyticsOverview() {
  const { data, isLoading } = useAnalyticsData();

  const stats = [
    {
      title: 'Page Views',
      value: data?.totalPageViews?.toLocaleString() ?? '—',
      icon: Eye,
      description: 'Last 30 days',
    },
    {
      title: 'Unique Sessions',
      value: data?.uniqueSessions?.toLocaleString() ?? '—',
      icon: Users,
      description: 'Last 30 days',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stat.value}
            </div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
