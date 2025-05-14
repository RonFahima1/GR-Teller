import { FormSection, SECTIONS } from '../types/form';

interface FormProgressProps {
  currentSection: FormSection;
}

export function FormProgress({ currentSection }: FormProgressProps) {
  const totalSteps = SECTIONS.length;
  const currentStep = SECTIONS.indexOf(currentSection) + 1;

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-900">Step {currentStep}</span>
        <div className="flex-1 h-0.5 bg-gray-200">
          <div
            className="h-0.5 bg-indigo-600"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-900">{totalSteps}</span>
      </div>
      <span className="text-sm font-medium text-gray-900">
        {currentSection.replace(/([A-Z])/g, ' $1').trim()}
      </span>
    </div>
  );
}
