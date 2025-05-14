import React from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

/**
 * A reusable section component with title and content container
 */
export function Section({ title, children }: SectionProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div className="bg-white rounded-lg border p-4">{children}</div>
    </div>
  );
}
