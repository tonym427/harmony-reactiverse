import React from 'react';

interface SubmitButtonProps {
  isSubmitting: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting }) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={`${
        isSubmitting ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
      } text-white px-6 py-2 rounded transition-colors w-full md:w-auto`}
    >
      {isSubmitting ? 'Submitting...' : 'Submit Form'}
    </button>
  );
};

export default SubmitButton;