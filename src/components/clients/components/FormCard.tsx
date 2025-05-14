import { ReactNode } from 'react';

interface FormCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function FormCard({ title, children, className = '' }: FormCardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-600 p-4 ${className} flex flex-col`}>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
