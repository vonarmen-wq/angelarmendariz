import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, useIsAdmin } from '@/hooks/useAuth';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LogOut, 
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  MousePointerClick,
  Globe,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { GA_MEASUREMENT_ID } from '@/lib/analytics';
import { AnalyticsOverview } from '@/components/admin/analytics/AnalyticsOverview';
import { TrafficSourcesChart } from '@/components/admin/analytics/TrafficSourcesChart';
import { PageViewsChart } from '@/components/admin/analytics/PageViewsChart';
import { TopPagesTable } from '@/components/admin/analytics/TopPagesTable';
import { EssayPerformance } from '@/components/admin/analytics/EssayPerformance';

export default function AdminAnalytics() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: settings } = useSiteSettings();
  const navigate = useNavigate();

  const isGAConfigured = Boolean(GA_MEASUREMENT_ID && GA_MEASUREMENT_ID.startsWith('G-'));

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!adminLoading && isAdmin === false) {
      navigate('/');
    }
  }, [isAdmin, adminLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="font-body text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/admin" className="font-display text-xl font-semibold text-foreground">
                {settings?.site_name || 'Admin'}
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="font-body text-sm text-muted-foreground">Analytics</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
                View Site
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Website Analytics
            </h1>
            <p className="font-body text-muted-foreground">
              Track your website performance, traffic sources, and content engagement
            </p>
          </div>
          {isGAConfigured && (
            <Button variant="outline" asChild>
              <a 
                href={`https://analytics.google.com/analytics/web/?authuser=0#/p${GA_MEASUREMENT_ID.replace('G-', '')}/reports/intellligencehome`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Google Analytics
              </a>
            </Button>
          )}
        </div>

        {!isGAConfigured ? (
          <Card className="border-amber-500/50 bg-amber-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="h-5 w-5" />
                Google Analytics Not Configured
              </CardTitle>
              <CardDescription>
                To enable analytics tracking, you need to add your Google Analytics 4 Measurement ID.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="font-body text-sm text-muted-foreground space-y-2">
                <p><strong>Steps to configure:</strong></p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Go to <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Analytics</a> and create a GA4 property</li>
                  <li>Copy your Measurement ID (format: G-XXXXXXXXXX)</li>
                  <li>Replace the placeholder in <code className="bg-muted px-1 rounded">index.html</code> and <code className="bg-muted px-1 rounded">src/lib/analytics.ts</code></li>
                </ol>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-mono text-sm">
                  Current ID: <span className="text-muted-foreground">{GA_MEASUREMENT_ID}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="traffic" className="gap-2">
                <Globe className="h-4 w-4" />
                Traffic Sources
              </TabsTrigger>
              <TabsTrigger value="pages" className="gap-2">
                <FileText className="h-4 w-4" />
                Top Pages
              </TabsTrigger>
              <TabsTrigger value="essays" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Essay Performance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <AnalyticsOverview />
              <div className="grid gap-6 md:grid-cols-2">
                <PageViewsChart />
                <TrafficSourcesChart />
              </div>
            </TabsContent>

            <TabsContent value="traffic" className="space-y-6">
              <TrafficSourcesChart fullWidth />
            </TabsContent>

            <TabsContent value="pages" className="space-y-6">
              <TopPagesTable />
            </TabsContent>

            <TabsContent value="essays" className="space-y-6">
              <EssayPerformance />
            </TabsContent>
          </Tabs>
        )}

        {/* Info Card about GA4 API */}
        <Card className="mt-8 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-base">About This Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="font-body text-sm text-muted-foreground space-y-2">
            <p>
              This dashboard displays sample data to show you what analytics will look like once configured.
              Real data will appear after:
            </p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>Your GA4 Measurement ID is configured</li>
              <li>Visitors start interacting with your site</li>
              <li>Data is collected (may take 24-48 hours for initial data)</li>
            </ul>
            <p className="mt-4">
              For full analytics capabilities, visit your{' '}
              <a 
                href="https://analytics.google.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google Analytics Dashboard
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
