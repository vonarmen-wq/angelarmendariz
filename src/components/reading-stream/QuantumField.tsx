import { useRef, useEffect } from 'react';

interface QuantumFieldProps {
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
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
    let particles: Particle[] = [];
    
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      initParticles();
    };
    
    const initParticles = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      particles = [];
      const numParticles = Math.floor((width * height) / 8000);
      
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: Math.random(),
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3 - 0.1,
          size: Math.random() * 2 + 1,
          alpha: Math.random() * 0.6 + 0.2
        });
      }
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    const drawMesh = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      
      // Draw background gradient - warmer, softer depth
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, 'hsl(25, 20%, 12%)');
      bgGradient.addColorStop(0.4, 'hsl(25, 18%, 15%)');
      bgGradient.addColorStop(0.7, 'hsl(350, 15%, 14%)');
      bgGradient.addColorStop(1, 'hsl(25, 22%, 18%)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);
      
      // Add subtle radial glow in center
      const centerGlow = ctx.createRadialGradient(
        width * 0.5, height * 0.6, 0,
        width * 0.5, height * 0.6, width * 0.6
      );
      centerGlow.addColorStop(0, 'hsla(42, 40%, 35%, 0.15)');
      centerGlow.addColorStop(0.5, 'hsla(350, 30%, 25%, 0.08)');
      centerGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = centerGlow;
      ctx.fillRect(0, 0, width, height);
      
      // 3D Mesh Grid with perspective
      const gridSpacingX = 40;
      const gridSpacingY = 25;
      const rows = Math.ceil(height / gridSpacingY) + 10;
      const cols = Math.ceil(width / gridSpacingX) + 2;
      const horizon = height * 0.3;
      
      // Calculate grid points with 3D wave displacement
      const points: { x: number; y: number; z: number }[][] = [];
      
      for (let row = 0; row < rows; row++) {
        points[row] = [];
        const perspectiveScale = 0.3 + (row / rows) * 0.7;
        const baseY = horizon + (row / rows) * (height - horizon) * 1.2;
        
        for (let col = 0; col < cols; col++) {
          const baseX = (col - cols / 2) * gridSpacingX * perspectiveScale + width / 2;
          
          // Multi-layered wave displacement
          const wave1 = Math.sin(col * 0.15 + time * 0.8 + row * 0.1) * 25 * perspectiveScale;
          const wave2 = Math.sin(col * 0.08 - time * 0.5 + row * 0.15) * 35 * perspectiveScale;
          const wave3 = Math.cos(row * 0.12 + time * 0.3) * 20 * perspectiveScale;
          const peakWave = Math.sin(col * 0.1 + time * 0.6) * Math.sin(row * 0.08 + time * 0.4) * 50 * perspectiveScale;
          
          const displacement = wave1 + wave2 + wave3 + peakWave;
          const z = (displacement + 60) / 120; // Normalize for color
          
          points[row][col] = {
            x: baseX,
            y: baseY - displacement,
            z: z
          };
        }
      }
      
      // Draw horizontal grid lines
      for (let row = 0; row < rows; row++) {
        ctx.beginPath();
        const rowProgress = row / rows;
        
        // Color gradient from gold (foreground) to burgundy (distance)
        const hue = 42 - rowProgress * 30; // Gold to burgundy-ish
        const sat = 45 - rowProgress * 15;
        const light = 55 - rowProgress * 20;
        const alpha = 0.25 + (1 - rowProgress) * 0.35;
        
        ctx.strokeStyle = `hsla(${hue}, ${sat}%, ${light}%, ${alpha})`;
        ctx.lineWidth = 0.8 + (1 - rowProgress) * 0.8;
        
        for (let col = 0; col < cols; col++) {
          const point = points[row][col];
          if (col === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        }
        ctx.stroke();
      }
      
      // Draw vertical grid lines
      for (let col = 0; col < cols; col++) {
        ctx.beginPath();
        const colOffset = Math.abs(col - cols / 2) / (cols / 2);
        
        // Burgundy tones for vertical lines
        const hue = 350 + colOffset * 20;
        const alpha = 0.2 + (1 - colOffset) * 0.25;
        
        ctx.strokeStyle = `hsla(${hue}, 35%, 45%, ${alpha})`;
        ctx.lineWidth = 0.6;
        
        for (let row = 0; row < rows; row++) {
          const point = points[row][col];
          if (row === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        }
        ctx.stroke();
      }
      
      // Draw intersection glow points
      for (let row = 0; row < rows; row += 3) {
        for (let col = 0; col < cols; col += 3) {
          const point = points[row][col];
          const rowProgress = row / rows;
          
          if (point.z > 0.6) { // Only on peaks
            const glowSize = (point.z - 0.5) * 6 * (1 - rowProgress * 0.5);
            const glowAlpha = (point.z - 0.5) * 0.8;
            
            ctx.beginPath();
            ctx.arc(point.x, point.y, glowSize, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(42, 60%, 70%, ${glowAlpha})`;
            ctx.fill();
          }
        }
      }
      
      // Draw floating particles
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Wrap around
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;
        
        // Pulsing alpha
        const pulseAlpha = particle.alpha * (0.7 + Math.sin(time * 2 + particle.x * 0.01) * 0.3);
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * particle.z, 0, Math.PI * 2);
        
        // Gold and cream particles
        const isGold = particle.z > 0.5;
        const hue = isGold ? 42 : 35;
        const sat = isGold ? 50 : 30;
        const light = isGold ? 65 : 80;
        
        ctx.fillStyle = `hsla(${hue}, ${sat}%, ${light}%, ${pulseAlpha})`;
        ctx.fill();
      });
      
      time += 0.015;
      animationId = requestAnimationFrame(drawMesh);
    };
    
    drawMesh();
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
    />
  );
}
