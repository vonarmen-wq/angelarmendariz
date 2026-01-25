import { useRef, useEffect } from 'react';

interface QuantumFieldProps {
  className?: string;
}

export function QuantumField({ className = '' }: QuantumFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationId: number;
    let time = 0;
    
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    const drawWaves = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      
      ctx.clearRect(0, 0, width, height);
      
      // Draw flowing wave lines in Renaissance gold/burgundy tones
      const numLines = 50;
      const lineSpacing = height / numLines;
      
      for (let i = 0; i < numLines; i++) {
        ctx.beginPath();
        
        const baseY = i * lineSpacing;
        // Alternate between gold (42°) and burgundy (350°) hues
        const isGold = i % 3 === 0;
        const hue = isGold ? 42 : 350;
        const saturation = isGold ? 55 : 35;
        const lightness = isGold ? 55 : 35;
        const alpha = 0.12 + (Math.sin(i * 0.15 + time * 0.4) * 0.06);
        
        ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
        ctx.lineWidth = 1;
        
        for (let x = 0; x <= width; x += 3) {
          const wave1 = Math.sin(x * 0.006 + time * 0.6 + i * 0.08) * 20;
          const wave2 = Math.sin(x * 0.01 + time * 0.4 - i * 0.04) * 12;
          const wave3 = Math.sin(x * 0.003 + time * 0.25) * 30;
          
          const y = baseY + wave1 + wave2 + wave3;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
      }
      
      time += 0.012;
      animationId = requestAnimationFrame(drawWaves);
    };
    
    drawWaves();
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ 
        background: 'linear-gradient(180deg, hsl(25 25% 10%) 0%, hsl(25 22% 14%) 50%, hsl(25 20% 12%) 100%)' 
      }}
    />
  );
}
