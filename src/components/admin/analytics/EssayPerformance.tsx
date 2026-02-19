import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Eye } from 'lucide-react';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';

const chartConfig = {
  views: { label: 'Views', color: 'hsl(var(--primary))' },
};

export function EssayPerformance() {
  const { data, isLoading } = useAnalyticsData();

  const essayViews = (data?.essayViews || []).map(e => ({
    name: e.path.replace('/essays/', '').replace(/-/g, ' '),
    views: e.views,
    path: e.path,
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Essay Views</CardTitle>
          <CardDescription>Views per essay over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading...</div>
          ) : essayViews.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">No essay views yet.</div>
          ) : (
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={essayViews} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={150}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="views" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {essayViews.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {essayViews.map((essay) => (
            <Card key={essay.path}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium line-clamp-1 capitalize">
                  {essay.name}
                </CardTitle>
                <CardDescription className="text-xs">{essay.path}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <p className="text-lg font-bold">{essay.views.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Views</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
