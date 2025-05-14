import { Control } from 'react-hook-form';
import { cn } from '../../../lib/utils';
import { NewClientFormData } from '../types/form';

interface PrefixSelectorProps {
  name: string;
  control: Control<NewClientFormData>;
  required?: boolean;
  className?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const PREFIXES = [
  { value: '+972', label: 'Israel (+972)', country: 'IL' },
  { value: '+1', label: 'United States (+1)', country: 'US' },
  { value: '+44', label: 'United Kingdom (+44)', country: 'UK' },
  { value: '+33', label: 'France (+33)', country: 'FR' },
  { value: '+49', label: 'Germany (+49)', country: 'DE' },
  { value: '+39', label: 'Italy (+39)', country: 'IT' },
  { value: '+34', label: 'Spain (+34)', country: 'ES' },
  { value: '+46', label: 'Sweden (+46)', country: 'SE' },
  { value: '+41', label: 'Switzerland (+41)', country: 'CH' },
  { value: '+31', label: 'Netherlands (+31)', country: 'NL' },
  { value: '+32', label: 'Belgium (+32)', country: 'BE' },
  { value: '+358', label: 'Finland (+358)', country: 'FI' },
  { value: '+353', label: 'Ireland (+353)', country: 'IE' },
  { value: '+352', label: 'Luxembourg (+352)', country: 'LU' },
  { value: '+351', label: 'Portugal (+351)', country: 'PT' },
  { value: '+370', label: 'Lithuania (+370)', country: 'LT' },
  { value: '+371', label: 'Latvia (+371)', country: 'LV' },
  { value: '+372', label: 'Estonia (+372)', country: 'EE' },
  { value: '+359', label: 'Bulgaria (+359)', country: 'BG' },
  { value: '+380', label: 'Ukraine (+380)', country: 'UA' },
  { value: '+381', label: 'Serbia (+381)', country: 'RS' },
  { value: '+382', label: 'Montenegro (+382)', country: 'ME' },
  { value: '+383', label: 'Kosovo (+383)', country: 'XK' },
  { value: '+385', label: 'Croatia (+385)', country: 'HR' },
  { value: '+386', label: 'Slovenia (+386)', country: 'SI' },
  { value: '+387', label: 'Bosnia and Herzegovina (+387)', country: 'BA' },
  { value: '+389', label: 'North Macedonia (+389)', country: 'MK' },
  { value: '+373', label: 'Moldova (+373)', country: 'MD' },
  { value: '+374', label: 'Armenia (+374)', country: 'AM' },
  { value: '+375', label: 'Belarus (+375)', country: 'BY' },
  { value: '+377', label: 'Monaco (+377)', country: 'MC' },
  { value: '+378', label: 'San Marino (+378)', country: 'SM' },
  { value: '+382', label: 'Montenegro (+382)', country: 'ME' },
  { value: '+379', label: 'Vatican City (+379)', country: 'VA' },
] as const;

export function PrefixSelector({
  name,
  control,
  required = false,
  className = '',
  ariaLabel,
  ariaDescribedBy,
  onChange,
}: PrefixSelectorProps) {
  const register = control.register;
  const errorState = control._formState.errors[name as keyof NewClientFormData];

  const errorMessage = typeof errorState === 'string' 
    ? errorState 
    : errorState?.message?.toString() || null;

  return (
    <div className="space-y-1.5">
      <select
        {...register(name as keyof NewClientFormData)}
        className={cn(
          'block w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800/30 px-3 py-2.5 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200',
          errorState ? 'border-red-500' : '',
          className
        )}
        aria-label={ariaLabel || 'Phone Prefix'}
        aria-describedby={ariaDescribedBy}
        aria-invalid={!!errorState}
        onChange={onChange}
        defaultValue="+972"
      >
        {PREFIXES.map((prefix) => (
          <option key={prefix.value} value={prefix.value}>
            {prefix.country} {prefix.value}
          </option>
        ))}
      </select>
      {errorMessage && (
        <p className="text-sm text-red-500 dark:text-red-400 mt-1">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
