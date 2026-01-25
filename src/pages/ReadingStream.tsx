import { Layout } from '@/components/layout/Layout';
import { useReadingItems } from '@/hooks/useReadingItems';
import { QuantumField } from '@/components/reading-stream/QuantumField';
import { ReadingOrb } from '@/components/reading-stream/ReadingOrb';
import { BookOpen, Loader2 } from 'lucide-react';

export default function ReadingStreamPage() {
  const { data: items, isLoading } = useReadingItems();

  return (
    <Layout
      title="Reading Stream"
      description="A curated collection of books, essays, and ideas that have shaped my thinking."
    >
      <div className="min-h-screen relative overflow-hidden">
        {/* Quantum field background */}
        <QuantumField />
        
        {/* Header overlay */}
        <header className="relative z-20 pt-16 pb-8 text-center">
          <h1 
            className="font-display text-4xl md:text-5xl lg:text-6xl font-light mb-4"
            style={{ color: 'hsl(200, 80%, 90%)' }}
          >
            Reading Stream
          </h1>
          <p 
            className="font-body text-lg max-w-xl mx-auto px-6"
            style={{ color: 'hsla(220, 60%, 80%, 0.8)' }}
          >
            A curated collection of books, essays, and ideas that have shaped my thinking.
            <br />
            <span className="text-sm italic">Hover over an orb to explore.</span>
          </p>
        </header>

        {/* Orbs container */}
        <div 
          className="relative z-10 w-full"
          style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}
        >
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 
                className="h-12 w-12 animate-spin" 
                style={{ color: 'hsl(220, 70%, 70%)' }}
              />
            </div>
          ) : items && items.length > 0 ? (
            <div className="relative w-full h-full">
              {items.map((item, index) => (
                <ReadingOrb
                  key={item.id}
                  item={item}
                  index={index}
                  totalItems={items.length}
                />
              ))}
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <BookOpen 
                className="h-16 w-16 mb-4" 
                style={{ color: 'hsla(220, 60%, 70%, 0.5)' }}
              />
              <p 
                className="font-body text-lg"
                style={{ color: 'hsla(220, 60%, 80%, 0.7)' }}
              >
                Reading recommendations coming soon.
              </p>
            </div>
          )}
        </div>
        
        {/* Floating animation keyframes */}
        <style>{`
          @keyframes float {
            0%, 100% {
              transform: translate(-50%, -50%) translateY(0px);
            }
            50% {
              transform: translate(-50%, -50%) translateY(-15px);
            }
          }
        `}</style>
      </div>
    </Layout>
  );
}
