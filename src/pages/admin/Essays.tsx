import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, useIsAdmin } from '@/hooks/useAuth';
import { useEssays, useCategories, useDeleteEssay } from '@/hooks/useEssays';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { 
  ArrowLeft,
  Plus,
  Edit,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminEssays() {
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: essays, isLoading: essaysLoading } = useEssays();
  const { data: categories } = useCategories();
  const { data: settings } = useSiteSettings();
  const deleteEssay = useDeleteEssay();
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

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      await deleteEssay.mutateAsync(id);
      toast.success('Essay deleted successfully');
    } catch (error) {
      toast.error('Failed to delete essay');
    }
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
              <span className="font-body text-sm text-muted-foreground">Essays</span>
            </div>
            <Link to="/" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
              View Site
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Back Link & Actions */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <Button asChild>
            <Link to="/admin/essays/new">
              <Plus className="h-4 w-4 mr-2" />
              New Essay
            </Link>
          </Button>
        </div>

        {/* Page Title */}
        <h1 className="font-display text-3xl font-semibold text-foreground mb-8">
          All Essays
        </h1>

        {/* Essays Table */}
        {essaysLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded" />
            ))}
          </div>
        ) : essays && essays.length > 0 ? (
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
                {essays.map((essay) => (
                  <tr key={essay.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-body text-foreground">{essay.title}</p>
                      {essay.excerpt && (
                        <p className="font-body text-sm text-muted-foreground line-clamp-1 mt-1">
                          {essay.excerpt}
                        </p>
                      )}
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
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {essay.published && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={`/essays/${essay.slug}`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/admin/essays/${essay.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(essay.id, essay.title)}
                          disabled={deleteEssay.isPending}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
      </main>
    </div>
  );
}
