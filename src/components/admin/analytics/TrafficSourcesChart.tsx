import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

// Sample data - in production, this would come from Google Analytics API
const trafficData = [
  { name: 'Organic Search', value: 42, color: 'hsl(var(--primary))' },
  { name: 'Direct', value: 28, color: 'hsl(var(--accent))' },
  { name: 'Social', value: 18, color: 'hsl(var(--secondary))' },
  { name: 'Referral', value: 8, color: 'hsl(var(--muted-foreground))' },
  { name: 'Email', value: 4, color: 'hsl(var(--border))' },
];

const chartConfig = {
  'Organic Search': { label: 'Organic Search', color: 'hsl(var(--primary))' },
  'Direct': { label: 'Direct', color: 'hsl(var(--accent))' },
  'Social': { label: 'Social', color: 'hsl(var(--secondary))' },
  'Referral': { label: 'Referral', color: 'hsl(var(--muted-foreground))' },
  'Email': { label: 'Email', color: 'hsl(var(--border))' },
};

interface TrafficSourcesChartProps {
  fullWidth?: boolean;
}

export function TrafficSourcesChart({ fullWidth }: TrafficSourcesChartProps) {
  return (
    <Card className={fullWidth ? 'col-span-full' : ''}>
      <CardHeader>
        <CardTitle>Traffic Sources</CardTitle>
        <CardDescription>Where your visitors are coming from</CardDescription>
      </CardHeader>
      <CardContent>
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
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: source.color }}
                />
                <span className="text-muted-foreground">{source.name}</span>
              </div>
              <span className="font-medium">{source.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
