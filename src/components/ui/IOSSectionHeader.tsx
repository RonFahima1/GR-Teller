import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface IOSSectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  animateEntrance?: boolean;
}

export const IOSSectionHeader: React.FC<IOSSectionHeaderProps> = ({
  title,
  subtitle,
  centered = false,
  className,
  titleClassName,
  subtitleClassName,
  animateEntrance = true
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  const Container = animateEntrance ? motion.div : 'div';
  const Title = animateEntrance ? motion.h2 : 'h2';
  const Subtitle = animateEntrance ? motion.p : 'p';
  
  const animationProps = animateEntrance ? {
    variants: containerVariants,
    initial: "hidden",
    animate: "visible"
  } : {};
  
  const childAnimationProps = animateEntrance ? {
    variants: itemVariants
  } : {};
  
  return (
    <Container 
      className={cn(
        'mb-6',
        centered ? 'text-center' : '',
        className
      )}
      {...animationProps}
    >
      <Title
        className={cn(
          'text-2xl font-bold text-gray-900 dark:text-gray-100',
          titleClassName
        )}
        {...childAnimationProps}
      >
        {title}
      </Title>
      
      {subtitle && (
        <Subtitle
          className={cn(
            'mt-1 text-base text-gray-500 dark:text-gray-400',
            subtitleClassName
          )}
          {...childAnimationProps}
        >
          {subtitle}
        </Subtitle>
      )}
    </Container>
  );
};
