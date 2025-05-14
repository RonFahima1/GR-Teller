import { FormSection, SECTIONS } from '../../types/form';

interface FormActionsProps {
  currentSection: FormSection;
  onSubmit: () => void;
  onBack?: () => void;
  isSubmitting: boolean;
  isValid: boolean;
}

export function FormActions({
  currentSection,
  onSubmit,
  onBack,
  isSubmitting,
  isValid,
}: FormActionsProps) {
  const isLastSection = currentSection === SECTIONS[SECTIONS.length - 1];
  const isInvalid = !isValid && !isSubmitting;

  return (
    <div className="flex justify-between items-center mt-8">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          Back
        </button>
      )}
      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting || !isValid}
        className={`px-6 py-2 rounded-md transition-colors duration-200 ${
          isSubmitting
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : isInvalid
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        {isLastSection
          ? isSubmitting
            ? 'Submitting...'
            : 'Submit'
          : isSubmitting
          ? 'Saving...'
          : 'Next'}
      </button>
    </div>
  );
}
