import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { iosPage } from '@/lib/animations';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = ''
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={iosPage}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}; 