import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LiquidBackgroundProps {
  colorScheme?: 'blue' | 'purple' | 'green' | 'orange' | 'gray';
  variant?: 'default' | 'subtle';
  interactive?: boolean;
  opacity?: number;
  className?: string;
}

export const LiquidBackground: React.FC<LiquidBackgroundProps> = ({
  colorScheme = 'blue',
  variant = 'default',
  interactive = false,
  opacity = 0.1,
  className
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  
  // Define color schemes with better contrast
  const colorSchemes = {
    blue: {
      primary: '#0A84FF',
      secondary: '#5AC8FA',
      tertiary: '#007AFF',
      background: '#F2F7FF'
    },
    purple: {
      primary: '#5E5CE6',
      secondary: '#BF5AF2',
      tertiary: '#7D7AFF',
      background: '#F5F2FF'
    },
    green: {
      primary: '#34C759',
      secondary: '#30D158',
      tertiary: '#28BD4B',
      background: '#F2FFF5'
    },
    orange: {
      primary: '#FF9500',
      secondary: '#FF3B30',
      tertiary: '#FFCC00',
      background: '#FFF9F2'
    },
    gray: {
      primary: '#8E8E93',
      secondary: '#AEAEB2',
      tertiary: '#636366',
      background: '#F6F6F7'
    }
  };
  
  const selectedScheme = colorSchemes[colorScheme];
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Create gradient
    let gradient;
    
    // Blob parameters
    const blobs: Array<{
      x: number;
      y: number;
      radius: number;
      xSpeed: number;
      ySpeed: number;
      color: string;
    }> = [];
    const blobCount = variant === 'subtle' ? 3 : 5;
    
    for (let i = 0; i < blobCount; i++) {
      blobs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 200 + 100,
        xSpeed: (Math.random() - 0.5) * 0.7,
        ySpeed: (Math.random() - 0.5) * 0.7,
        color: i % 3 === 0 ? selectedScheme.primary : 
               i % 3 === 1 ? selectedScheme.secondary : 
               selectedScheme.tertiary
      });
    }
    
    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      if (interactive) {
        const rect = canvas.getBoundingClientRect();
        mousePosition.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
      }
    };
    
    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    // Animation
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create gradient background for better contrast
      gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, selectedScheme.background);
      gradient.addColorStop(1, '#FFFFFF');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw blobs
      blobs.forEach(blob => {
        // Update position
        blob.x += blob.xSpeed;
        blob.y += blob.ySpeed;
        
        // Bounce off edges
        if (blob.x < -blob.radius || blob.x > canvas.width + blob.radius) {
          blob.xSpeed *= -1;
        }
        if (blob.y < -blob.radius || blob.y > canvas.height + blob.radius) {
          blob.ySpeed *= -1;
        }
        
        // Mouse interaction
        if (interactive) {
          const dx = mousePosition.current.x - blob.x;
          const dy = mousePosition.current.y - blob.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < blob.radius + 100) {
            const angle = Math.atan2(dy, dx);
            const force = (blob.radius + 100 - distance) * 0.01;
            blob.x -= Math.cos(angle) * force;
            blob.y -= Math.sin(angle) * force;
          }
        }
        
        // Draw blob
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${blob.color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      cancelAnimationFrame(animationId);
    };
  }, [colorScheme, variant, interactive, opacity]);
  
  return (
    <motion.div
      className={cn(
        "fixed inset-0 -z-10",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
      
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/30 dark:to-gray-900/30" />
    </motion.div>
  );
};
