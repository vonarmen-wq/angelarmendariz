import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, useIsAdmin } from '@/hooks/useAuth';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject, useSiteSettings } from '@/hooks/useSiteSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  GripVertical,
  ExternalLink,
  Save,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ProjectForm {
  name: string;
  description: string;
  url: string;
  display_order: number;
}

const emptyForm: ProjectForm = {
  name: '',
  description: '',
  url: '',
  display_order: 0,
};

export default function AdminProjects() {
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: settings } = useSiteSettings();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const navigate = useNavigate();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectForm>(emptyForm);

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

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      display_order: (projects?.length || 0) + 1,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (project: any) => {
    setEditingId(project.id);
    setForm({
      name: project.name,
      description: project.description || '',
      url: project.url || '',
      display_order: project.display_order || 0,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name.trim()) {
      toast.error('Project name is required');
      return;
    }

    try {
      if (editingId) {
        await updateProject.mutateAsync({
          id: editingId,
          name: form.name.trim(),
          description: form.description.trim() || null,
          url: form.url.trim() || null,
          display_order: form.display_order,
        });
        toast.success('Project updated');
      } else {
        await createProject.mutateAsync({
          name: form.name.trim(),
          description: form.description.trim() || null,
          url: form.url.trim() || null,
          image: null,
          display_order: form.display_order,
        });
        toast.success('Project created');
      }
      setIsDialogOpen(false);
      setForm(emptyForm);
    } catch (error) {
      toast.error('Failed to save project');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      await deleteProject.mutateAsync(deleteId);
      toast.success('Project deleted');
      setDeleteId(null);
    } catch (error) {
      toast.error('Failed to delete project');
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
              <Link to="/" className="font-display text-xl font-semibold text-foreground">
                {settings?.site_name || 'Admin'}
              </Link>
              <span className="text-muted-foreground">/</span>
              <Link to="/admin" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="font-body text-sm text-muted-foreground">Projects</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/portfolio" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
                View Portfolio
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <h1 className="font-display text-2xl font-semibold text-foreground">
              Manage Projects
            </h1>
          </div>
          <Button onClick={handleOpenCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>

        {projectsLoading ? (
          <div className="text-center py-12">
            <p className="font-body text-muted-foreground">Loading projects...</p>
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="font-body text-xs uppercase tracking-widest text-muted-foreground text-left px-6 py-3 w-12">
                    Order
                  </th>
                  <th className="font-body text-xs uppercase tracking-widest text-muted-foreground text-left px-6 py-3">
                    Name
                  </th>
                  <th className="font-body text-xs uppercase tracking-widest text-muted-foreground text-left px-6 py-3 hidden md:table-cell">
                    Description
                  </th>
                  <th className="font-body text-xs uppercase tracking-widest text-muted-foreground text-left px-6 py-3 hidden md:table-cell">
                    URL
                  </th>
                  <th className="font-body text-xs uppercase tracking-widest text-muted-foreground text-right px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <GripVertical className="h-4 w-4" />
                        <span className="font-mono text-sm">{project.display_order}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-body font-medium text-foreground">{project.name}</p>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="font-body text-sm text-muted-foreground line-clamp-2 max-w-md">
                        {project.description || '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      {project.url ? (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-body text-sm text-primary hover:text-accent transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Link
                        </a>
                      ) : (
                        <span className="font-body text-sm text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(project)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteId(project.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
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
              No projects yet. Add your first one!
            </p>
            <Button onClick={handleOpenCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </div>
        )}
      </main>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingId ? 'Edit Project' : 'Add Project'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Project name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description of the project"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                value={form.display_order}
                onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" disabled={createProject.isPending || updateProject.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {editingId ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
