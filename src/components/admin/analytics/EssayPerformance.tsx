import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Eye, Clock, Share2, ArrowUpRight } from 'lucide-react';

// Sample data - in production, this would come from Google Analytics API
const essayData = [
  { title: 'Software is Not Enough', views: 1923, avgReadTime: '4:12', shares: 45, slug: 'software-not-enough' },
  { title: 'Renaissance Man in AI Era', views: 1234, avgReadTime: '3:45', shares: 32, slug: 'renaissance-man-ai' },
  { title: 'Randomness as Growth Strategy', views: 856, avgReadTime: '3:20', shares: 28, slug: 'randomness-growth-strategy' },
  { title: 'Sales Playbook AI', views: 645, avgReadTime: '2:55', shares: 18, slug: 'sales-playbook-ai' },
];

const chartData = essayData.map(essay => ({
  name: essay.title.length > 20 ? essay.title.substring(0, 20) + '...' : essay.title,
  views: essay.views,
}));

const chartConfig = {
  views: { label: 'Views', color: 'hsl(var(--primary))' },
};

export function EssayPerformance() {
  return (
    <div className="space-y-6">
      {/* Essay Views Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Essay Views Comparison</CardTitle>
          <CardDescription>Views per essay over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
              <XAxis 
                type="number" 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={150}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey="views" 
                fill="hsl(var(--primary))" 
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Detailed Essay Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        {essayData.map((essay) => (
          <Card key={essay.slug}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium line-clamp-1">
                {essay.title}
              </CardTitle>
              <CardDescription className="text-xs">
                /essays/{essay.slug}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-lg font-bold">{essay.views.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Views</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-lg font-bold">{essay.avgReadTime}</p>
                    <p className="text-xs text-muted-foreground">Avg. Read</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-lg font-bold">{essay.shares}</p>
                    <p className="text-xs text-muted-foreground">Shares</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
