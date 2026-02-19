import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell } from 'recharts';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(var(--secondary))',
  'hsl(var(--muted-foreground))',
  'hsl(var(--border))',
];

interface TrafficSourcesChartProps {
  fullWidth?: boolean;
}

export function TrafficSourcesChart({ fullWidth }: TrafficSourcesChartProps) {
  const { data, isLoading } = useAnalyticsData();

  const trafficData = (data?.trafficSources || []).map((s, i) => ({
    ...s,
    color: COLORS[i % COLORS.length],
  }));

  const chartConfig = Object.fromEntries(
    trafficData.map(s => [s.name, { label: s.name, color: s.color }])
  );

  return (
    <Card className={fullWidth ? 'col-span-full' : ''}>
      <CardHeader>
        <CardTitle>Traffic Sources</CardTitle>
        <CardDescription>Where your visitors are coming from</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading...</div>
        ) : trafficData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">No traffic data yet.</div>
        ) : (
          <>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <PieChart>
                <Pie
                  data={trafficData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelLine={false}
                >
                  {trafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>

            <div className="mt-4 space-y-2">
              {trafficData.map((source) => (
                <div key={source.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                    <span className="text-muted-foreground">{source.name}</span>
                  </div>
                  <span className="font-medium">{source.value}%</span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
