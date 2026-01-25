import { useState, useEffect, useRef } from 'react';
import { ExternalLink } from 'lucide-react';
import type { ReadingItem } from '@/hooks/useReadingItems';

interface ReadingOrbProps {
  item: ReadingItem;
  index: number;
  totalItems: number;
}

export function ReadingOrb({ item, index, totalItems }: ReadingOrbProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  
  // Wave-based motion synced with background lattice pace
  useEffect(() => {
    let time = Math.random() * 100; // Random start phase
    
    const animate = () => {
      // Match the background wave timing (time += 0.015)
      time += 0.015;
      
      // Use similar wave frequencies as background (0.3-0.8 range)
      const waveX = Math.sin(time * 0.6 + index * 0.8) * 12 + 
                    Math.sin(time * 0.35 + index * 1.2) * 8;
      const waveY = Math.cos(time * 0.5 + index * 0.9) * 10 + 
                    Math.cos(time * 0.25 + index * 1.5) * 6;
      
      setOffset({ x: waveX, y: waveY });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [index]);
  
  // Calculate base position in a more organic scattered pattern
  const getPosition = () => {
    const cols = Math.ceil(Math.sqrt(totalItems * 1.5));
    const row = Math.floor(index / cols);
    const col = index % cols;
    
    // Base position with staggering
    const baseX = (col + 0.5) / cols * 100;
    const baseY = (row + 0.5) / Math.ceil(totalItems / cols) * 100;
    
    // Add organic offset based on index
    const offsetX = Math.sin(index * 1.7) * 8;
    const offsetY = Math.cos(index * 2.3) * 6;
    
    return {
      left: Math.max(10, Math.min(90, baseX + offsetX)),
      top: Math.max(10, Math.min(90, baseY + offsetY)),
    };
  };
  
  const basePosition = getPosition();
  
  // Vary orb sizes slightly
  const baseSize = 100 + (index % 3) * 20;
  const size = isHovered ? baseSize * 1.8 : baseSize;
  
  // Alternate between gold and cream orbs for variety
  const isGoldOrb = index % 3 === 0;
  
  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-[width,height,box-shadow] duration-500 ease-out"
      style={{
        left: `calc(${basePosition.left}% + ${offset.x}px)`,
        top: `calc(${basePosition.top}% + ${offset.y}px)`,
        width: size,
        height: size,
        zIndex: isHovered ? 50 : 10 + index,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Orb with Renaissance aesthetic */}
      <div
        className="absolute inset-0 rounded-full transition-all duration-500 pointer-events-none"
        style={{
          background: isGoldOrb
            ? `radial-gradient(circle at 30% 30%, 
                hsl(45, 70%, 75%) 0%, 
                hsl(42, 65%, 55%) 40%, 
                hsl(38, 55%, 40%) 70%, 
                hsl(35, 45%, 30%) 100%)`
            : `radial-gradient(circle at 30% 30%, 
                hsl(40, 35%, 92%) 0%, 
                hsl(38, 30%, 80%) 40%, 
                hsl(35, 25%, 65%) 70%, 
                hsl(30, 20%, 50%) 100%)`,
          boxShadow: isHovered 
            ? `0 0 50px hsla(42, 65%, 55%, 0.5), 
               0 0 100px hsla(42, 55%, 45%, 0.25), 
               inset 0 0 25px hsla(45, 60%, 85%, 0.4)`
            : `0 0 25px hsla(42, 65%, 55%, 0.25), 
               0 0 50px hsla(42, 55%, 45%, 0.1)`,
        }}
      />
      
      {/* Orb content - visible on hover */}
      <div 
        className={`absolute inset-0 flex flex-col items-center justify-center p-4 text-center transition-all duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h3 
          className="font-display text-sm font-semibold leading-tight mb-1"
          style={{ color: 'hsl(25, 40%, 15%)' }}
        >
          {item.title}
        </h3>
        {item.author && (
          <p 
            className="font-body text-xs italic mb-2"
            style={{ color: 'hsl(25, 30%, 30%)' }}
          >
            {item.author}
          </p>
        )}
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-display font-medium px-3 py-1.5 rounded-full transition-all hover:scale-105"
            style={{ 
              background: 'hsl(350, 45%, 30%)',
              color: 'hsl(40, 30%, 96%)',
            }}
            onClick={(e) => {
              e.stopPropagation();
              // Some browsers/previews can be picky about target=_blank; force open on user gesture.
              window.open(item.url!, '_blank', 'noopener,noreferrer');
            }}
          >
            Read <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
      
      {/* Mini label when not hovered */}
      <div 
        className={`absolute inset-0 flex items-center justify-center p-2 transition-all duration-300 ${
          isHovered ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
        }`}
      >
        <span 
          className="font-display text-xs font-medium text-center leading-tight line-clamp-2"
          style={{ color: 'hsl(25, 40%, 15%)' }}
        >
          {item.title.length > 30 ? item.title.substring(0, 27) + '...' : item.title}
        </span>
      </div>
    </div>
  );
}
