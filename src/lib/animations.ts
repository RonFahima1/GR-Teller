import { Variants } from 'framer-motion';

// iOS-inspired spring configurations
export const springs = {
  light: {
    type: 'spring',
    damping: 20,
    stiffness: 300,
    mass: 0.5
  },
  medium: {
    type: 'spring',
    damping: 25,
    stiffness: 200,
    mass: 0.8
  },
  heavy: {
    type: 'spring',
    damping: 30,
    stiffness: 150,
    mass: 1
  }
};

// macOS window/dialog animation
export const macOSWindow: Variants = {
  hidden: { 
    scale: 0.95,
    opacity: 0,
    y: 10
  },
  visible: { 
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      ...springs.medium,
      staggerChildren: 0.05
    }
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    transition: {
      ...springs.medium,
      staggerChildren: 0.02
    }
  }
};

// iOS list item animation
export const iosListItem: Variants = {
  hidden: { 
    opacity: 0,
    x: -20
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: springs.light
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.2
    }
  }
};

// iOS button/press animation
export const iosPress: Variants = {
  initial: { scale: 1 },
  pressed: { 
    scale: 0.97,
    transition: springs.light
  },
  hover: { 
    scale: 1.02,
    transition: springs.light
  }
};

// iOS page transition
export const iosPage: Variants = {
  hidden: { 
    opacity: 0,
    x: 20,
    transition: springs.medium
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      ...springs.medium,
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: springs.medium
  }
};

// iOS modal/sheet animation
export const iosSheet: Variants = {
  hidden: { 
    y: '100%',
    opacity: 0,
    transition: springs.heavy
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: springs.heavy
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: springs.heavy
  }
};

// iOS card expansion
export const iosExpand: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: springs.medium
  },
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: {
      ...springs.medium,
      staggerChildren: 0.05
    }
  }
};

// iOS icon animation
export const iosIcon: Variants = {
  initial: { scale: 0.5, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      ...springs.light,
      duration: 0.4
    }
  },
  exit: { 
    scale: 0.5, 
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
};

// Blur effect values
export const blurValues = {
  light: 'blur(10px)',
  medium: 'blur(20px)',
  heavy: 'blur(30px)'
};

// Aspect ratios
export const aspectRatios = {
  card: 1.586,
  banner: 2.165,
  icon: 1,
  feature: 1.91
}; 