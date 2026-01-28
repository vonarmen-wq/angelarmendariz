import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

// Sample data - in production, this would come from Google Analytics API
const pageViewsData = [
  { date: 'Jan 1', views: 420, visitors: 280 },
  { date: 'Jan 2', views: 380, visitors: 250 },
  { date: 'Jan 3', views: 510, visitors: 340 },
  { date: 'Jan 4', views: 620, visitors: 420 },
  { date: 'Jan 5', views: 480, visitors: 310 },
  { date: 'Jan 6', views: 350, visitors: 220 },
  { date: 'Jan 7', views: 390, visitors: 260 },
  { date: 'Jan 8', views: 450, visitors: 300 },
  { date: 'Jan 9', views: 520, visitors: 350 },
  { date: 'Jan 10', views: 680, visitors: 460 },
  { date: 'Jan 11', views: 720, visitors: 490 },
  { date: 'Jan 12', views: 590, visitors: 390 },
  { date: 'Jan 13', views: 410, visitors: 270 },
  { date: 'Jan 14', views: 380, visitors: 240 },
];

const chartConfig = {
  views: { label: 'Page Views', color: 'hsl(var(--primary))' },
  visitors: { label: 'Visitors', color: 'hsl(var(--accent))' },
};

export function PageViewsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Page Views & Visitors</CardTitle>
        <CardDescription>Daily traffic over the last 14 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <AreaChart data={pageViewsData}>
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
            <XAxis 
              dataKey="date" 
              className="text-xs" 
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs" 
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="views"
              stroke="hsl(var(--primary))"
              fillOpacity={1}
              fill="url(#colorViews)"
            />
            <Area
              type="monotone"
              dataKey="visitors"
              stroke="hsl(var(--accent))"
              fillOpacity={1}
              fill="url(#colorVisitors)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
