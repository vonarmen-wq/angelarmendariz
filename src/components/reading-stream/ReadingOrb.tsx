import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import type { ReadingItem } from '@/hooks/useReadingItems';

interface ReadingOrbProps {
  item: ReadingItem;
  index: number;
  totalItems: number;
}

export function ReadingOrb({ item, index, totalItems }: ReadingOrbProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate position in a more organic scattered pattern
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
      left: `${Math.max(10, Math.min(90, baseX + offsetX))}%`,
      top: `${Math.max(10, Math.min(90, baseY + offsetY))}%`,
    };
  };
  
  const position = getPosition();
  
  // Vary orb sizes slightly
  const baseSize = 100 + (index % 3) * 20;
  const size = isHovered ? baseSize * 1.8 : baseSize;
  
  // Animation delay based on index for staggered floating
  const animationDelay = (index * 0.3) % 5;
  
  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-500 ease-out"
      style={{
        ...position,
        width: size,
        height: size,
        zIndex: isHovered ? 50 : 10 + index,
        animation: `float ${4 + (index % 3)}s ease-in-out infinite`,
        animationDelay: `${animationDelay}s`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Orb glow effect */}
      <div
        className="absolute inset-0 rounded-full transition-all duration-500"
        style={{
          background: `radial-gradient(circle at 30% 30%, 
            hsla(200, 80%, 85%, ${isHovered ? 0.95 : 0.8}) 0%, 
            hsla(220, 70%, 70%, ${isHovered ? 0.85 : 0.6}) 30%, 
            hsla(260, 60%, 55%, ${isHovered ? 0.7 : 0.4}) 70%, 
            hsla(280, 50%, 40%, ${isHovered ? 0.5 : 0.2}) 100%)`,
          boxShadow: isHovered 
            ? '0 0 60px hsla(220, 80%, 70%, 0.6), 0 0 120px hsla(260, 70%, 60%, 0.3), inset 0 0 30px hsla(200, 80%, 90%, 0.3)'
            : '0 0 30px hsla(220, 70%, 60%, 0.3), 0 0 60px hsla(260, 60%, 50%, 0.15)',
          transform: isHovered ? 'scale(1)' : 'scale(1)',
        }}
      />
      
      {/* Orb content */}
      <div 
        className={`absolute inset-0 flex flex-col items-center justify-center p-4 text-center transition-all duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h3 
          className="font-display text-sm font-semibold leading-tight mb-1"
          style={{ color: 'hsl(250, 30%, 15%)' }}
        >
          {item.title}
        </h3>
        {item.author && (
          <p 
            className="text-xs mb-2"
            style={{ color: 'hsl(260, 25%, 30%)' }}
          >
            {item.author}
          </p>
        )}
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full transition-all hover:scale-105"
            style={{ 
              background: 'hsla(260, 50%, 25%, 0.9)',
              color: 'hsl(200, 80%, 90%)',
            }}
            onClick={(e) => e.stopPropagation()}
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
          style={{ color: 'hsl(250, 25%, 20%)' }}
        >
          {item.title.length > 30 ? item.title.substring(0, 27) + '...' : item.title}
        </span>
      </div>
    </div>
  );
}
