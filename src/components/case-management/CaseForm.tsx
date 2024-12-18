import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { FileUploadSection } from './FileUploadSection';
import { uploadCaseFiles } from '@/utils/fileUpload';
import { validateCaseForm } from '@/utils/formValidation';
import PersonalInfoSection from './form-sections/PersonalInfoSection';
import VehicleInfoSection from './form-sections/VehicleInfoSection';
import ProblemDescriptionSection from './form-sections/ProblemDescriptionSection';
import SubmitButton from './form-sections/SubmitButton';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  vin: string;
  problemDescription: string;
}

const CaseForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) {
      console.log('Form submission prevented - already submitting');
      return;
    }
    
    console.log('Starting form submission with data:', formData);
    console.log('Files to upload:', files);

    const validationErrors = validateCaseForm(formData);
    if (validationErrors.length > 0) {
      console.error('Validation errors:', validationErrors);
      toast({
        title: "Form Validation Error",
        description: validationErrors.join(', '),
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Inserting case into database...');
      const { data, error } = await supabase
        .from('cases')
        .insert([{
          name: `${formData.firstName} ${formData.lastName}`,
          vehicle: `${formData.vehicleYear} ${formData.vehicleMake} ${formData.vehicleModel}`,
          status: 'New',
          last_updated: new Date().toISOString(),
          ...formData
        }])
        .select();

      if (error) {
        console.error('Database insertion error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data || data.length === 0) {
        console.error('No data returned from case insertion');
        throw new Error('No data returned from case insertion');
      }

      const caseId = data[0].id;
      console.log('Case created successfully with ID:', caseId);

      if (files.length > 0) {
        console.log('Starting file upload process for files:', files);
        try {
          const uploadedFiles = await uploadCaseFiles(caseId, files);
          console.log('Files uploaded successfully:', uploadedFiles);

          const { error: updateError } = await supabase
            .from('cases')
            .update({ files: uploadedFiles })
            .eq('id', caseId);

          if (updateError) {
            console.error('Error updating case with files:', updateError);
            throw new Error(`File update error: ${updateError.message}`);
          }
        } catch (uploadError: any) {
          console.error('File upload error:', uploadError);
          throw new Error(`File upload failed: ${uploadError.message}`);
        }
      }

      toast({
        title: "Success",
        description: "Case submitted successfully!",
      });
      
      onSuccess();
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: `Failed to submit case: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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