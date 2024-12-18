import React from 'react';

interface ProblemDescriptionSectionProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const ProblemDescriptionSection: React.FC<ProblemDescriptionSectionProps> = ({
  value,
  onChange,
}) => {
  return (
    <div>
      <label className="block mb-1">Problem Description</label>
      <textarea
        name="problemDescription"
        value={value}
        onChange={onChange}
        rows={4}
        className="w-full p-2 border rounded"
        required
      />
    </div>
  );
};

export default ProblemDescriptionSection;