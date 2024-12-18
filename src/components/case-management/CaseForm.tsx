import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUploadSection } from './FileUploadSection';
import PersonalInfoSection from './form-sections/PersonalInfoSection';
import VehicleInfoSection from './form-sections/VehicleInfoSection';
import ProblemDescriptionSection from './form-sections/ProblemDescriptionSection';
import SubmitButton from './form-sections/SubmitButton';
import { useSubmitCase } from '@/hooks/useSubmitCase';
import { CaseFormData } from '@/types/case';

const CaseForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [formData, setFormData] = useState<CaseFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    vin: '',
    problemDescription: ''
  });
  const [files, setFiles] = useState<File[]>([]);
  const { submitCase, isSubmitting } = useSubmitCase(onSuccess);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitCase(formData, files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      console.log('Files selected:', e.target.files);
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col items-center space-y-4 mb-4">
          <img 
            src="/lovable-uploads/b9564315-bfbd-4e0e-81a0-0a8691166159.png" 
            alt="Rocky the dog" 
            className="w-32 h-32 rounded-full object-cover mb-2"
          />
          <div className="text-center">
            <CardTitle className="text-2xl font-bold">Rocky's Lemonade - Lemon Law Intake</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <PersonalInfoSection
            firstName={formData.firstName}
            lastName={formData.lastName}
            email={formData.email}
            phone={formData.phone}
            onChange={handleChange}
          />

          <VehicleInfoSection
            vehicleMake={formData.vehicleMake}
            vehicleModel={formData.vehicleModel}
            vehicleYear={formData.vehicleYear}
            vin={formData.vin}
            onChange={handleChange}
          />

          <ProblemDescriptionSection
            value={formData.problemDescription}
            onChange={handleChange}
          />

          <FileUploadSection
            files={files}
            handleFileChange={handleFileChange}
            removeFile={removeFile}
          />

          <div className="flex justify-end">
            <SubmitButton isSubmitting={isSubmitting} />
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CaseForm;