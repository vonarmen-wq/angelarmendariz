import { useSiteSettings } from '@/hooks/useSiteSettings';
import heroVideo from '@/assets/book-emerging.mp4';

export function VideoHero() {
  const { data: settings } = useSiteSettings();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />

      {/* Content - positioned lower, below the book animation */}
      <div className="relative z-10 container mx-auto px-6 text-center flex flex-col justify-end pb-16 md:pb-24 min-h-screen">
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
          {/* Name */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-foreground tracking-tight">
            {settings?.site_name || 'Angel Armendariz'}
          </h1>

          {/* Tagline */}
          <p className="font-accent text-xl sm:text-2xl md:text-3xl italic text-muted-foreground">
            {settings?.tagline || 'Enterprise Technology & Strategy'}
          </p>

          {/* Whitehead Quote */}
          <blockquote className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto pt-4">
            <p className="italic">
              "The art of progress is to preserve order amid change and to preserve change amid order."
            </p>
            <footer className="mt-4 text-sm uppercase tracking-widest text-accent">
              — A.N. Whitehead
            </footer>
          </blockquote>

          {/* Scroll indicator */}
          <div className="pt-8 animate-bounce">
            <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full mx-auto flex justify-center pt-2">
              <div className="w-1 h-3 bg-accent rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
