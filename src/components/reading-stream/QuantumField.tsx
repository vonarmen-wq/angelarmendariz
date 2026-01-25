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
      
      // Draw flowing wave lines
      const numLines = 60;
      const lineSpacing = height / numLines;
      
      for (let i = 0; i < numLines; i++) {
        ctx.beginPath();
        
        const baseY = i * lineSpacing;
        const hue = 260 + (i / numLines) * 40; // Purple to pink gradient
        const alpha = 0.15 + (Math.sin(i * 0.1 + time * 0.5) * 0.1);
        
        ctx.strokeStyle = `hsla(${hue}, 70%, 60%, ${alpha})`;
        ctx.lineWidth = 1;
        
        for (let x = 0; x <= width; x += 3) {
          const wave1 = Math.sin(x * 0.008 + time * 0.8 + i * 0.1) * 25;
          const wave2 = Math.sin(x * 0.012 + time * 0.5 - i * 0.05) * 15;
          const wave3 = Math.sin(x * 0.004 + time * 0.3) * 35;
          
          const y = baseY + wave1 + wave2 + wave3;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
      }
      
      time += 0.015;
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
      style={{ background: 'linear-gradient(135deg, hsl(250, 50%, 12%) 0%, hsl(280, 40%, 15%) 50%, hsl(260, 45%, 10%) 100%)' }}
    />
  );
}
