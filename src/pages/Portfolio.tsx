import { Layout } from '@/components/layout/Layout';
import { useProjects } from '@/hooks/useSiteSettings';
import { ExternalLink, ArrowUpRight, Building2, Rocket, BookOpen, Cpu } from 'lucide-react';
import { SubstackCTA } from '@/components/home/SubstackCTA';

const projectIcons: Record<string, React.ReactNode> = {
  'Nawkr': <Rocket className="h-6 w-6" />,
  'Dallasyte': <Building2 className="h-6 w-6" />,
  'Forward Deployed Selling': <BookOpen className="h-6 w-6" />,
  'Caerus Alpha': <ArrowUpRight className="h-6 w-6" />,
  'Amazon Web Services': <Cpu className="h-6 w-6" />,
};

export default function PortfolioPage() {
  const { data: projects, isLoading } = useProjects();

  return (
    <Layout
      title="Portfolio"
      description="Ventures, companies, and initiatives I've built and contributed to."
    >
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <span className="font-body text-xs uppercase tracking-[0.3em] text-accent mb-6 block">
                Things I've Built
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6">
                Portfolio
              </h1>
              <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Ventures, companies, and initiatives spanning technology, strategy, and innovation.
              </p>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              {isLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse p-8 border border-border rounded-xl">
                      <div className="h-8 bg-muted rounded w-1/3 mb-4" />
                      <div className="h-20 bg-muted rounded" />
                    </div>
                  ))}
                </div>
              ) : projects && projects.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  {projects.map((project, index) => (
                    <article
                      key={project.id}
                      className={`group relative bg-card border border-border rounded-xl overflow-hidden hover:border-accent/50 transition-all duration-300 ${
                        index === 0 ? 'lg:col-span-2' : ''
                      }`}
                    >
                      {/* Accent Line */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className={`p-8 md:p-10 ${index === 0 ? 'lg:flex lg:items-center lg:gap-12' : ''}`}>
                        {/* Icon */}
                        <div className={`mb-6 ${index === 0 ? 'lg:mb-0 lg:flex-shrink-0' : ''}`}>
                          <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-all">
                            {projectIcons[project.name] || <Building2 className="h-6 w-6" />}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground group-hover:text-primary transition-colors">
                              {project.url ? (
                                <a
                                  href={project.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2"
                                >
                                  {project.name}
                                  <ExternalLink className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                              ) : (
                                project.name
                              )}
                            </h2>
                          </div>

                          {/* Description */}
                          {project.description && (
                            <p className="font-body text-muted-foreground leading-relaxed text-lg">
                              {project.description}
                            </p>
                          )}

                          {/* Link */}
                          {project.url && (
                            <div className="mt-6 pt-6 border-t border-border/50">
                              <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-body uppercase tracking-widest text-accent hover:text-primary transition-colors"
                              >
                                Visit Project
                                <ArrowUpRight className="h-4 w-4" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-card/50 rounded-xl border border-dashed border-border">
                  <Building2 className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="font-body text-lg text-muted-foreground">
                    Projects will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Ornamental Divider */}
        <div className="flex items-center justify-center gap-4 py-8">
          <div className="w-16 h-px bg-accent/30" />
          <div className="w-2 h-2 rotate-45 border border-accent/50" />
          <div className="w-16 h-px bg-accent/30" />
        </div>
      </div>

      <SubstackCTA />
    </Layout>
  );
}
