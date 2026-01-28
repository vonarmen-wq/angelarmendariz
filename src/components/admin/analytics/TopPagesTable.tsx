import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// Sample data - in production, this would come from Google Analytics API
const topPagesData = [
  { path: '/', title: 'Home', views: 4521, avgTime: '1:45', bounceRate: 32, trend: 'up' },
  { path: '/essays', title: 'Essays', views: 2834, avgTime: '2:30', bounceRate: 28, trend: 'up' },
  { path: '/essays/software-not-enough', title: 'Software is Not Enough', views: 1923, avgTime: '4:12', bounceRate: 18, trend: 'up' },
  { path: '/about', title: 'About', views: 1456, avgTime: '1:20', bounceRate: 45, trend: 'stable' },
  { path: '/essays/renaissance-man-ai', title: 'The Renaissance Man in AI Era', views: 1234, avgTime: '3:45', bounceRate: 22, trend: 'down' },
  { path: '/portfolio', title: 'Portfolio', views: 987, avgTime: '1:55', bounceRate: 38, trend: 'stable' },
  { path: '/essays/randomness-growth-strategy', title: 'Randomness as Growth Strategy', views: 856, avgTime: '3:20', bounceRate: 25, trend: 'up' },
  { path: '/reading-stream', title: 'Reading Stream', views: 732, avgTime: '2:10', bounceRate: 35, trend: 'up' },
];

export function TopPagesTable() {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Pages</CardTitle>
        <CardDescription>Most viewed pages on your site</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Page</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right hidden md:table-cell">Avg. Time</TableHead>
              <TableHead className="text-right hidden md:table-cell">Bounce Rate</TableHead>
              <TableHead className="text-center">Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topPagesData.map((page) => (
              <TableRow key={page.path}>
                <TableCell>
                  <div>
                    <p className="font-medium">{page.title}</p>
                    <p className="text-xs text-muted-foreground">{page.path}</p>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {page.views.toLocaleString()}
                </TableCell>
                <TableCell className="text-right hidden md:table-cell">
                  {page.avgTime}
                </TableCell>
                <TableCell className="text-right hidden md:table-cell">
                  {page.bounceRate}%
                </TableCell>
                <TableCell className="text-center">
                  {getTrendIcon(page.trend)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
