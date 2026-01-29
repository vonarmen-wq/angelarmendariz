import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, useIsAdmin } from '@/hooks/useAuth';
import { useEssays, useCategories } from '@/hooks/useEssays';
import { useProjects, useMediaMentions, useSiteSettings } from '@/hooks/useSiteSettings';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { 
  FileText, 
  FolderOpen, 
  Briefcase, 
  Newspaper, 
  Settings, 
  LogOut,
  Plus,
  Edit,
  Eye,
  EyeOff,
  BarChart3
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: essays } = useEssays();
  const { data: categories } = useCategories();
  const { data: projects } = useProjects();
  const { data: mentions } = useMediaMentions();
  const { data: settings } = useSiteSettings();
  const navigate = useNavigate();

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

  const stats = [
    { label: 'Essays', value: essays?.length || 0, icon: FileText },
    { label: 'Categories', value: categories?.length || 0, icon: FolderOpen },
    { label: 'Projects', value: projects?.length || 0, icon: Briefcase },
    { label: 'Media Mentions', value: mentions?.length || 0, icon: Newspaper },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="font-display text-xl font-semibold text-foreground">
                {settings?.site_name || 'Admin'}
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="font-body text-sm text-muted-foreground">Dashboard</span>
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
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card rounded-lg border border-border p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <stat.icon className="h-5 w-5 text-accent" />
                <span className="font-body text-sm text-muted-foreground">
                  {stat.label}
                </span>
              </div>
              <p className="font-display text-3xl font-semibold text-foreground">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-12">
          <h2 className="font-display text-xl font-semibold text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link to="/admin/essays/new">
                <Plus className="h-4 w-4 mr-2" />
                New Essay
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/admin/projects">
                <Briefcase className="h-4 w-4 mr-2" />
                Projects
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/admin/reading-items">
                <FileText className="h-4 w-4 mr-2" />
                Thinking Machines
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/admin/analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/admin/settings">
                <Settings className="h-4 w-4 mr-2" />
                Site Settings
              </Link>
            </Button>
          </div>
        </div>

        {/* Recent Essays */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Recent Essays
            </h2>
            <Link
              to="/admin/essays"
              className="font-body text-sm text-primary hover:text-accent transition-colors"
            >
              View All
            </Link>
          </div>
          
          {essays && essays.length > 0 ? (
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="font-body text-xs uppercase tracking-widest text-muted-foreground text-left px-6 py-3">
                      Title
                    </th>
                    <th className="font-body text-xs uppercase tracking-widest text-muted-foreground text-left px-6 py-3 hidden md:table-cell">
                      Category
                    </th>
                    <th className="font-body text-xs uppercase tracking-widest text-muted-foreground text-left px-6 py-3 hidden md:table-cell">
                      Status
                    </th>
                    <th className="font-body text-xs uppercase tracking-widest text-muted-foreground text-left px-6 py-3 hidden md:table-cell">
                      Published
                    </th>
                    <th className="font-body text-xs uppercase tracking-widest text-muted-foreground text-right px-6 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {essays.slice(0, 5).map((essay) => (
                    <tr key={essay.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-body text-foreground">{essay.title}</p>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="font-body text-sm text-muted-foreground">
                          {essay.category?.name || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        {essay.published ? (
                          <span className="inline-flex items-center gap-1 font-body text-xs text-green-600">
                            <Eye className="h-3 w-3" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-body text-xs text-muted-foreground">
                            <EyeOff className="h-3 w-3" />
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="font-body text-sm text-muted-foreground">
                          {essay.published_at
                            ? format(new Date(essay.published_at), 'MMM d, yyyy')
                            : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/admin/essays/${essay.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-card rounded-lg border border-dashed border-border p-12 text-center">
              <p className="font-body text-muted-foreground mb-4">
                No essays yet. Create your first one!
              </p>
              <Button asChild>
                <Link to="/admin/essays/new">
                  <Plus className="h-4 w-4 mr-2" />
                  New Essay
                </Link>
              </Button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
