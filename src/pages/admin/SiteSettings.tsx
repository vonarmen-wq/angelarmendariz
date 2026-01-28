import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, useIsAdmin } from '@/hooks/useAuth';
import { useSiteSettings, useUpdateSiteSettings } from '@/hooks/useSiteSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { SiteSettings as SiteSettingsType } from '@/lib/types';

type FormData = Omit<SiteSettingsType, 'id' | 'updated_at'>;

export default function SiteSettings() {
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: settings, isLoading: settingsLoading } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { register, handleSubmit, reset, formState: { isDirty } } = useForm<FormData>();

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

  useEffect(() => {
    if (settings) {
      reset({
        site_name: settings.site_name,
        tagline: settings.tagline,
        bio: settings.bio,
        about_content: settings.about_content,
        linkedin_url: settings.linkedin_url,
        twitter_url: settings.twitter_url,
        substack_url: settings.substack_url,
        seo_title: settings.seo_title,
        seo_description: settings.seo_description,
      });
    }
  }, [settings, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await updateSettings.mutateAsync(data);
      toast({
        title: 'Settings saved',
        description: 'Your site settings have been updated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (authLoading || adminLoading || settingsLoading) {
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
              <span className="font-body text-sm text-muted-foreground">Site Settings</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-3xl">
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* General Settings */}
          <section className="bg-card rounded-lg border border-border p-6">
            <h2 className="font-display text-lg font-semibold text-foreground mb-6">
              General Settings
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="site_name">Site Name</Label>
                <Input
                  id="site_name"
                  {...register('site_name')}
                  placeholder="Your site name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  {...register('tagline')}
                  placeholder="A brief tagline for your site"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  {...register('bio')}
                  placeholder="A short bio that appears on the homepage"
                  rows={3}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="about_content">About Page Content</Label>
                <Textarea
                  id="about_content"
                  {...register('about_content')}
                  placeholder="Content for your about page (supports markdown)"
                  rows={8}
                  className="mt-1"
                />
              </div>
            </div>
          </section>

          {/* Social Links */}
          <section className="bg-card rounded-lg border border-border p-6">
            <h2 className="font-display text-lg font-semibold text-foreground mb-6">
              Social Links
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <Input
                  id="linkedin_url"
                  {...register('linkedin_url')}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="twitter_url">Twitter/X URL</Label>
                <Input
                  id="twitter_url"
                  {...register('twitter_url')}
                  placeholder="https://twitter.com/yourhandle"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="substack_url">Substack URL</Label>
                <Input
                  id="substack_url"
                  {...register('substack_url')}
                  placeholder="https://yourname.substack.com"
                  className="mt-1"
                />
              </div>
            </div>
          </section>

          {/* SEO Settings */}
          <section className="bg-card rounded-lg border border-border p-6">
            <h2 className="font-display text-lg font-semibold text-foreground mb-6">
              SEO Settings
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="seo_title">SEO Title</Label>
                <Input
                  id="seo_title"
                  {...register('seo_title')}
                  placeholder="Page title for search engines"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: under 60 characters
                </p>
              </div>
              <div>
                <Label htmlFor="seo_description">SEO Description</Label>
                <Textarea
                  id="seo_description"
                  {...register('seo_description')}
                  placeholder="Meta description for search engines"
                  rows={3}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: under 160 characters
                </p>
              </div>
            </div>
          </section>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={!isDirty || updateSettings.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
