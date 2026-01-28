import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, Eye, MousePointerClick, Clock } from 'lucide-react';

// Sample data - in production, this would come from Google Analytics API
const stats = [
  {
    title: 'Page Views',
    value: '12,543',
    change: '+12.5%',
    trend: 'up',
    icon: Eye,
    description: 'Last 30 days',
  },
  {
    title: 'Unique Visitors',
    value: '4,721',
    change: '+8.2%',
    trend: 'up',
    icon: Users,
    description: 'Last 30 days',
  },
  {
    title: 'Click Events',
    value: '2,156',
    change: '-3.1%',
    trend: 'down',
    icon: MousePointerClick,
    description: 'Last 30 days',
  },
  {
    title: 'Avg. Session Duration',
    value: '2m 34s',
    change: '+5.7%',
    trend: 'up',
    icon: Clock,
    description: 'Last 30 days',
  },
];

export function AnalyticsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center gap-1 text-xs">
              {stat.trend === 'up' ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                {stat.change}
              </span>
              <span className="text-muted-foreground">{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
