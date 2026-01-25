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
  
  // Free-roaming motion across the quantum field
  useEffect(() => {
    let time = Math.random() * 100; // Random start phase
    
    // Unique random seeds per orb for organic variation
    const seedA = Math.random() * Math.PI * 2;
    const seedB = Math.random() * Math.PI * 2;
    const seedC = Math.random() * Math.PI * 2;
    const seedD = Math.random() * Math.PI * 2;
    const freqVariance = 0.7 + Math.random() * 0.6; // 0.7-1.3 multiplier
    
    // Large-scale drift parameters (roaming across the field)
    const driftAmpX = 80 + Math.random() * 120; // 80-200px drift range
    const driftAmpY = 60 + Math.random() * 100; // 60-160px drift range
    const driftFreqX = 0.02 + Math.random() * 0.03; // Very slow drift
    const driftFreqY = 0.015 + Math.random() * 0.025;
    
    // Small-scale oscillation (local jitter)
    const jitterAmpX = 8 + Math.random() * 10;
    const jitterAmpY = 6 + Math.random() * 8;
    
    const animate = () => {
      // Match the background wave timing (time += 0.015)
      time += 0.015;
      
      // Large slow drift across the space (roaming)
      const driftX = Math.sin(time * driftFreqX * freqVariance + seedA) * driftAmpX +
                     Math.cos(time * driftFreqX * 0.7 + seedB) * (driftAmpX * 0.5);
      const driftY = Math.cos(time * driftFreqY * freqVariance + seedC) * driftAmpY +
                     Math.sin(time * driftFreqY * 0.6 + seedD) * (driftAmpY * 0.4);
      
      // Small rapid oscillation layered on top
      const jitterX = Math.sin(time * 0.8 + seedA + index * 0.5) * jitterAmpX +
                      Math.sin(time * 1.2 + seedB) * (jitterAmpX * 0.4);
      const jitterY = Math.cos(time * 0.7 + seedC + index * 0.6) * jitterAmpY +
                      Math.cos(time * 1.1 + seedD) * (jitterAmpY * 0.35);
      
      setOffset({ x: driftX + jitterX, y: driftY + jitterY });
      
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
        className={`absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-center transition-all duration-500 ${
          isHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
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
        className={`absolute inset-0 z-0 flex items-center justify-center p-2 transition-all duration-300 ${
          isHovered ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100 pointer-events-auto'
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
