import { Variants } from 'framer-motion';

// Base spring configurations
export const springs = {
  soft: {
    type: 'spring',
    damping: 15,
    stiffness: 200,
    mass: 0.2
  },
  medium: {
    type: 'spring',
    damping: 20,
    stiffness: 300,
    mass: 0.5
  },
  stiff: {
    type: 'spring',
    damping: 30,
    stiffness: 400,
    mass: 0.8
  }
};

// Morphing animations
export const morphTransition = {
  duration: 0.5,
  ease: [0.4, 0, 0.2, 1]
};

// Liquid motion effect
export const liquidMotion: Variants = {
  initial: { 
    borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%'
  },
  animate: {
    borderRadius: ['30% 70% 70% 30% / 30% 30% 70% 70%', '70% 30% 30% 70% / 70% 70% 30% 30%'],
    transition: {
      duration: 6,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

// Gradient animation
export const gradientMotion: Variants = {
  initial: { 
    backgroundPosition: '0% 50%'
  },
  animate: { 
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 10,
      ease: "linear",
      repeat: Infinity
    }
  }
};

// Self-drawing SVG animation
export const drawSVG: Variants = {
  hidden: { 
    pathLength: 0,
    opacity: 0
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { type: "spring", duration: 1.5, bounce: 0 },
      opacity: { duration: 0.01 }
    }
  }
};

// Glassmorphism card effect
export const glassCard: Variants = {
  initial: { 
    opacity: 0,
    backdropFilter: 'blur(0px)',
    y: 20
  },
  animate: {
    opacity: 1,
    backdropFilter: 'blur(10px)',
    y: 0,
    transition: springs.soft
  },
  hover: {
    y: -5,
    transition: springs.soft
  }
};

// Neumorphic button effect
export const neuButton: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { 
    scale: 0.98,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 400
    }
  }
};

// Page transitions
export const pageTransitions = {
  fade: {
    initial: { opacity: 0 },
    enter: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slide: {
    initial: { x: 20, opacity: 0 },
    enter: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 }
  },
  scale: {
    initial: { scale: 0.96, opacity: 0 },
    enter: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 }
  }
};

// Microinteractions
export const microInteractions = {
  tap: {
    scale: 0.98,
    transition: springs.stiff
  },
  hover: {
    scale: 1.02,
    transition: springs.soft
  },
  focus: {
    scale: 1.02,
    boxShadow: '0 0 0 2px rgba(66, 153, 225, 0.6)'
  }
};

// Loading states
export const loadingStates = {
  skeleton: {
    initial: { opacity: 0.4 },
    animate: {
      opacity: [0.4, 0.7, 0.4],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }
    }
  },
  pulse: {
    scale: [1, 1.02, 1],
    opacity: [0.7, 0.9, 0.7],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Scroll-triggered animations
export const scrollAnimations = {
  fadeUp: {
    initial: { y: 20, opacity: 0 },
    animate: { 
      y: 0,
      opacity: 1,
      transition: springs.medium
    }
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  },
  scaleUp: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { 
      scale: 1,
      opacity: 1,
      transition: springs.soft
    }
  }
}; 