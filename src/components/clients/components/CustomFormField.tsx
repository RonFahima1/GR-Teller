import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface CustomFormFieldProps {
  className?: string;
  label: string;
  error?: string;
  children?: React.ReactNode;
}

export function CustomFormField({
  className,
  label,
  error,
  children,
}: CustomFormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        {children}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
