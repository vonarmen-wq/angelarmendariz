import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, useIsAdmin } from '@/hooks/useAuth';
import { useReadingItems, useCreateReadingItem, useUpdateReadingItem, useDeleteReadingItem } from '@/hooks/useReadingItems';
import { useSiteSettings } from '@/hooks/useSiteSettings';
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
  X,
  BookOpen
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

interface ReadingItemForm {
  title: string;
  author: string;
  source: string;
  url: string;
  description: string;
  display_order: number;
}

const emptyForm: ReadingItemForm = {
  title: '',
  author: '',
  source: '',
  url: '',
  description: '',
  display_order: 0,
};

export default function AdminReadingItems() {
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: items, isLoading: itemsLoading } = useReadingItems();
  const { data: settings } = useSiteSettings();
  const createItem = useCreateReadingItem();
  const updateItem = useUpdateReadingItem();
  const deleteItem = useDeleteReadingItem();
  const navigate = useNavigate();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<ReadingItemForm>(emptyForm);

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
      display_order: (items?.length || 0) + 1,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      author: item.author || '',
      source: item.source || '',
      url: item.url || '',
      description: item.description || '',
      display_order: item.display_order || 0,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      if (editingId) {
        await updateItem.mutateAsync({
          id: editingId,
          title: form.title.trim(),
          author: form.author.trim() || null,
          source: form.source.trim() || null,
          url: form.url.trim() || null,
          description: form.description.trim() || null,
          display_order: form.display_order,
        });
        toast.success('Reading item updated');
      } else {
        await createItem.mutateAsync({
          title: form.title.trim(),
          author: form.author.trim() || null,
          source: form.source.trim() || null,
          url: form.url.trim() || null,
          description: form.description.trim() || null,
          display_order: form.display_order,
        });
        toast.success('Reading item created');
      }
      setIsDialogOpen(false);
      setForm(emptyForm);
    } catch (error) {
      toast.error('Failed to save reading item');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      await deleteItem.mutateAsync(deleteId);
      toast.success('Reading item deleted');
      setDeleteId(null);
    } catch (error) {
      toast.error('Failed to delete reading item');
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
              <span className="font-body text-sm text-muted-foreground">Reading Items</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/reading-stream" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
                View Thinking Machines
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
            <div>
              <h1 className="font-display text-2xl font-semibold text-foreground">
                Thinking Machines
              </h1>
              <p className="font-body text-sm text-muted-foreground">
                Manage your reading recommendations
              </p>
            </div>
          </div>
          <Button onClick={handleOpenCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        {itemsLoading ? (
          <div className="text-center py-12">
            <p className="font-body text-muted-foreground">Loading items...</p>
          </div>
        ) : items && items.length > 0 ? (
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="font-body text-xs uppercase tracking-widest text-muted-foreground text-left px-6 py-3 w-12">
                    #
                  </th>
                  <th className="font-body text-xs uppercase tracking-widest text-muted-foreground text-left px-6 py-3">
                    Title
                  </th>
                  <th className="font-body text-xs uppercase tracking-widest text-muted-foreground text-left px-6 py-3 hidden md:table-cell">
                    Author
                  </th>
                  <th className="font-body text-xs uppercase tracking-widest text-muted-foreground text-left px-6 py-3 hidden lg:table-cell">
                    Source
                  </th>
                  <th className="font-body text-xs uppercase tracking-widest text-muted-foreground text-left px-6 py-3 hidden md:table-cell">
                    Link
                  </th>
                  <th className="font-body text-xs uppercase tracking-widest text-muted-foreground text-right px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <GripVertical className="h-4 w-4" />
                        <span className="font-mono text-sm">{item.display_order ?? index + 1}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-accent flex-shrink-0" />
                        <p className="font-body font-medium text-foreground">{item.title}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="font-body text-sm text-muted-foreground">
                        {item.author || '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <p className="font-body text-sm text-muted-foreground">
                        {item.source || '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      {item.url ? (
                        <a
                          href={item.url}
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
                        <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteId(item.id)}>
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
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="font-body text-muted-foreground mb-4">
              No reading items yet. Add your first recommendation!
            </p>
            <Button onClick={handleOpenCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        )}
      </main>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingId ? 'Edit Reading Item' : 'Add Reading Item'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Book or article title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  placeholder="Author name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                  placeholder="e.g., Book, Article, Essay"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://example.com/book"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Why this is worth reading..."
                rows={3}
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
              <Button type="submit" disabled={createItem.isPending || updateItem.isPending}>
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
            <AlertDialogTitle>Delete Reading Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this reading item? This action cannot be undone.
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
