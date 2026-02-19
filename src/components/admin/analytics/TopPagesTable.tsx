import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';

export function TopPagesTable() {
  const { data, isLoading } = useAnalyticsData();

  const topPages = data?.topPages || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Pages</CardTitle>
        <CardDescription>Most viewed pages on your site</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : topPages.length === 0 ? (
          <p className="text-muted-foreground">No page view data yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page</TableHead>
                <TableHead className="text-right">Views</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topPages.map((page) => (
                <TableRow key={page.path}>
                  <TableCell>
                    <p className="font-medium">{page.path}</p>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {page.views.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
