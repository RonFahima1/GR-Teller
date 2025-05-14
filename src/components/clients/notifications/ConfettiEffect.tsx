import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiEffectProps {
  isActive: boolean;
}

const ConfettiEffect: React.FC<ConfettiEffectProps> = ({ isActive }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && containerRef.current) {
      const container = containerRef.current;
      const confettiCount = 50;
      const colors = ['#4299E1', '#48BB78', '#F6AD55', '#E53E3E'];

      for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[i % colors.length];
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.position = 'absolute';
        confetti.style.borderRadius = '50%';

        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 2 + 1;

        confetti.style.left = `${x}%`;
        confetti.style.animation = `confetti ${duration}s ease-in-out forwards`;
        confetti.style.transform = `translateY(${y}%)`;

        container.appendChild(confetti);

        setTimeout(() => {
          confetti.remove();
        }, duration * 1000);
      }
    }
  }, [isActive]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 30,
      }}
    />
  );
};

export default ConfettiEffect;
