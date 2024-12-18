import React, { useState } from 'react';
import CaseForm from './case-management/CaseForm';
import CaseDatabase from './case-management/CaseDatabase';

const CaseManagement = () => {
  const [view, setView] = useState<'form' | 'database' | 'success'>('form');

  if (view === 'success') {
    return (
      <div className="p-4">
        <div className="bg-green-50 p-4 rounded mb-4">
          Form submitted successfully!
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setView('form')}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Submit Another Case
          </button>
          <button
            onClick={() => setView('database')}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            View All Cases
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {view === 'form' ? (
        <CaseForm onSuccess={() => setView('database')} />
      ) : (
        <CaseDatabase onBack={() => setView('form')} />
      )}
    </div>
  );
};

export default CaseManagement;