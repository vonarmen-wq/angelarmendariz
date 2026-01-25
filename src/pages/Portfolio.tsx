import { Layout } from '@/components/layout/Layout';
import { useProjects } from '@/hooks/useSiteSettings';
import { ExternalLink } from 'lucide-react';
import { SubstackCTA } from '@/components/home/SubstackCTA';

export default function PortfolioPage() {
  const { data: projects, isLoading } = useProjects();

  return (
    <Layout
      title="Portfolio"
      description="Things I've built and companies I've founded."
    >
      <div className="min-h-screen py-12 md:py-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <header className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
              Portfolio
            </h1>
            <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Things I've built and companies I've founded.
            </p>
          </header>

          {/* Projects Grid */}
          <div className="max-w-5xl mx-auto">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-video bg-muted rounded-lg mb-4" />
                    <div className="h-6 bg-muted rounded w-1/2 mb-2" />
                    <div className="h-16 bg-muted rounded" />
                  </div>
                ))}
              </div>
            ) : projects && projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.map((project) => (
                  <article
                    key={project.id}
                    className="group bg-card rounded-lg border border-border overflow-hidden hover:border-primary/50 transition-all"
                  >
                    {/* Image */}
                    {project.image ? (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-muted flex items-center justify-center">
                        <span className="font-display text-4xl text-muted-foreground/30">
                          {project.name.charAt(0)}
                        </span>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <h2 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                          {project.url ? (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {project.name}
                            </a>
                          ) : (
                            project.name
                          )}
                        </h2>
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
                            aria-label={`Visit ${project.name}`}
                          >
                            <ExternalLink className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                      {project.description && (
                        <p className="font-body text-muted-foreground mt-3 leading-relaxed">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="font-body text-lg text-muted-foreground">
                  Projects will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <SubstackCTA />
    </Layout>
  );
}
