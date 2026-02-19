import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';

const chartConfig = {
  views: { label: 'Page Views', color: 'hsl(var(--primary))' },
  visitors: { label: 'Visitors', color: 'hsl(var(--accent))' },
};

export function PageViewsChart() {
  const { data, isLoading } = useAnalyticsData();

  const chartData = (data?.dailyData || []).map(d => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Page Views & Visitors</CardTitle>
        <CardDescription>Daily traffic over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading...</div>
        ) : chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">No data yet — views will appear as visitors browse your site.</div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px]">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))' }} className="text-xs" />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorViews)" />
              <Area type="monotone" dataKey="visitors" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorVisitors)" />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
