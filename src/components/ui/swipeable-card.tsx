import { motion, PanInfo } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface SwipeableCardProps {
  children: ReactNode;
  onSwipe?: (direction: 'left' | 'right') => void;
  className?: string;
}

export function SwipeableCard({ children, onSwipe, className }: SwipeableCardProps) {
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50; // minimum distance for a swipe
    const velocity = 0.5; // minimum velocity for a swipe

    if (Math.abs(info.velocity.x) > velocity) {
      if (info.offset.x > threshold) {
        onSwipe?.('right');
      } else if (info.offset.x < -threshold) {
        onSwipe?.('left');
      }
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      className={cn('touch-pan-y', className)}
      whileTap={{ cursor: 'grabbing' }}
    >
      <Card className={className}>
        {children}
      </Card>
    </motion.div>
  );
} 