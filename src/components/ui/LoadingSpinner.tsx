import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

export const LoadingSpinner = ({ 
  size = 24, 
  color = 'currentColor', 
  className = '' 
}: LoadingSpinnerProps) => {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0"
        style={{ 
          borderTopColor: 'transparent',
          borderLeftColor: 'transparent',
          borderBottomColor: color,
          borderRightColor: color,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0" style={{ borderTop: `${size/8}px solid ${color}` }}></div>
      </motion.div>
    </div>
  );
};
