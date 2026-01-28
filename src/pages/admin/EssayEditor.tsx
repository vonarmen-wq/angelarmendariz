import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth, useIsAdmin } from '@/hooks/useAuth';
import { useEssayBySlug, useCategories, useCreateEssay, useUpdateEssay, useDeleteEssay } from '@/hooks/useEssays';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Trash2, Eye } from 'lucide-react';
import { Essay } from '@/lib/types';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default function EssayEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: categories } = useCategories();
  const createEssay = useCreateEssay();
  const updateEssay = useUpdateEssay();
  const deleteEssay = useDeleteEssay();

  const [essay, setEssay] = useState<Partial<Essay>>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    category_id: null,
    published: false,
    featured: false,
    published_at: null,
  });
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing essay
  useEffect(() => {
    if (!isNew && id) {
      const loadEssay = async () => {
        const { data, error } = await supabase
          .from('essays')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          toast({
            title: 'Error',
            description: 'Failed to load essay',
            variant: 'destructive',
          });
          navigate('/admin');
        } else {
          setEssay(data);
        }
        setIsLoading(false);
      };
      loadEssay();
    }
  }, [id, isNew, navigate, toast]);

  // Auth check
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

  const handleTitleChange = (title: string) => {
    setEssay((prev) => ({
      ...prev,
      title,
      slug: isNew ? generateSlug(title) : prev.slug,
    }));
  };

  const handleSave = async () => {
    if (!essay.title?.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Title is required',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);

    try {
      const data = {
        title: essay.title,
        slug: essay.slug || generateSlug(essay.title),
        content: essay.content || '',
        excerpt: essay.excerpt || null,
        featured_image: essay.featured_image || null,
        category_id: essay.category_id || null,
        published: essay.published || false,
        featured: essay.featured || false,
        published_at: essay.published ? (essay.published_at || new Date().toISOString()) : null,
      };

      if (isNew) {
        await createEssay.mutateAsync(data as any);
        toast({ title: 'Success', description: 'Essay created!' });
      } else {
        await updateEssay.mutateAsync({ id: id!, ...data });
        toast({ title: 'Success', description: 'Essay updated!' });
      }

      navigate('/admin');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save essay',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this essay?')) return;

    try {
      await deleteEssay.mutateAsync(id!);
      toast({ title: 'Success', description: 'Essay deleted!' });
      navigate('/admin');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete essay',
        variant: 'destructive',
      });
    }
  };

  if (authLoading || adminLoading || isLoading) {
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
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/admin"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <span className="font-display text-lg font-semibold text-foreground">
                {isNew ? 'New Essay' : 'Edit Essay'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {!isNew && essay.published && (
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/essays/${essay.slug}`} target="_blank">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Link>
                </Button>
              )}
              {!isNew && (
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-8">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="font-body">Title</Label>
              <Input
                id="title"
                value={essay.title || ''}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Essay title"
                className="font-display text-2xl h-14"
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug" className="font-body">Slug</Label>
              <Input
                id="slug"
                value={essay.slug || ''}
                onChange={(e) => setEssay((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="essay-url-slug"
                className="font-body"
              />
              <p className="text-xs text-muted-foreground">
                URL: /essays/{essay.slug || 'your-slug'}
              </p>
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <Label htmlFor="excerpt" className="font-body">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={essay.excerpt || ''}
                onChange={(e) => setEssay((prev) => ({ ...prev, excerpt: e.target.value }))}
                placeholder="A brief summary of the essay..."
                rows={3}
                className="font-body"
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content" className="font-body">Content</Label>
              <Textarea
                id="content"
                value={essay.content || ''}
                onChange={(e) => setEssay((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="Write your essay here using markdown formatting..."
                rows={20}
                className="font-body"
              />
              
              {/* Markdown Help */}
              <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                <p className="font-body text-sm font-medium text-foreground">Markdown Formatting Guide</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground font-body">
                  <div className="space-y-2">
                    <p><code className="bg-muted px-1.5 py-0.5 rounded text-xs">[link text](https://url.com)</code> → clickable link</p>
                    <p><code className="bg-muted px-1.5 py-0.5 rounded text-xs">**bold text**</code> → <strong>bold text</strong></p>
                    <p><code className="bg-muted px-1.5 py-0.5 rounded text-xs">*italic text*</code> → <em>italic text</em></p>
                  </div>
                  <div className="space-y-2">
                    <p><code className="bg-muted px-1.5 py-0.5 rounded text-xs"># Heading 1</code> (use ## for H2, ### for H3)</p>
                    <p><code className="bg-muted px-1.5 py-0.5 rounded text-xs">&gt; quote text</code> → blockquote</p>
                    <p><code className="bg-muted px-1.5 py-0.5 rounded text-xs">- item</code> or <code className="bg-muted px-1.5 py-0.5 rounded text-xs">1. item</code> → lists</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground/70">Tip: Leave a blank line between paragraphs. Add a space after # for headings.</p>
              </div>
            </div>

            {/* Featured Image URL */}
            <div className="space-y-2">
              <Label htmlFor="featured_image" className="font-body">Featured Image URL</Label>
              <Input
                id="featured_image"
                value={essay.featured_image || ''}
                onChange={(e) => setEssay((prev) => ({ ...prev, featured_image: e.target.value }))}
                placeholder="https://example.com/image.jpg"
                className="font-body"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="font-body">Category</Label>
              <Select
                value={essay.category_id || 'none'}
                onValueChange={(value) =>
                  setEssay((prev) => ({
                    ...prev,
                    category_id: value === 'none' ? null : value,
                  }))
                }
              >
                <SelectTrigger className="font-body">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No category</SelectItem>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Publish Settings */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <Label className="font-body">Published</Label>
                  <p className="text-xs text-muted-foreground">
                    Make this essay visible to the public
                  </p>
                </div>
                <Switch
                  checked={essay.published || false}
                  onCheckedChange={(checked) =>
                    setEssay((prev) => ({
                      ...prev,
                      published: checked,
                      published_at: checked && !prev.published_at ? new Date().toISOString() : prev.published_at,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <Label className="font-body">Featured</Label>
                  <p className="text-xs text-muted-foreground">
                    Show this essay on the homepage
                  </p>
                </div>
                <Switch
                  checked={essay.featured || false}
                  onCheckedChange={(checked) =>
                    setEssay((prev) => ({ ...prev, featured: checked }))
                  }
                />
              </div>
            </div>

            {/* Publish Date */}
            {essay.published && (
              <div className="space-y-2">
                <Label htmlFor="published_at" className="font-body">Publish Date</Label>
                <Input
                  id="published_at"
                  type="datetime-local"
                  value={
                    essay.published_at
                      ? new Date(essay.published_at).toISOString().slice(0, 16)
                      : ''
                  }
                  onChange={(e) =>
                    setEssay((prev) => ({
                      ...prev,
                      published_at: e.target.value ? new Date(e.target.value).toISOString() : null,
                    }))
                  }
                  className="font-body"
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
