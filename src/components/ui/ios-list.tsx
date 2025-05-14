import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { iosListItem } from '@/lib/animations';

interface IOSListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
  className?: string;
  itemClassName?: string;
  grouped?: boolean;
}

export function IOSList<T>({
  items,
  renderItem,
  keyExtractor,
  className,
  itemClassName,
  grouped = false
}: IOSListProps<T>) {
  return (
    <motion.ul
      className={cn(
        'space-y-2',
        grouped && 'divide-y divide-gray-200 dark:divide-gray-700',
        className
      )}
    >
      <AnimatePresence initial={false}>
        {items.map((item, index) => (
          <motion.li
            key={keyExtractor(item)}
            variants={iosListItem}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'rounded-lg',
              !grouped && 'bg-white dark:bg-gray-800 shadow-sm',
              itemClassName
            )}
          >
            {renderItem(item, index)}
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
} 