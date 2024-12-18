import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { FileUploadSection } from './FileUploadSection';
import { uploadCaseFiles } from '@/utils/fileUpload';
import type { CaseFile } from '@/utils/fileUpload';

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

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    console.log('Starting form submission');

    try {
      // First, insert the case
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
        console.error('Error inserting case:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('No data returned from case insertion');
      }

      const caseId = data[0].id;
      console.log('Case created successfully with ID:', caseId);

      // Then handle file uploads if there are any
      if (files.length > 0) {
        console.log('Starting file upload process');
        const uploadedFiles = await uploadCaseFiles(caseId, files);

        // Update the case with the uploaded files
        const { error: updateError } = await supabase
          .from('cases')
          .update({ files: uploadedFiles })
          .eq('id', caseId);

        if (updateError) {
          console.error('Error updating case with files:', updateError);
          throw updateError;
        }
      }

      toast({
        title: "Success",
        description: "Case submitted successfully!",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error in form submission:', error);
      toast({
        title: "Error",
        description: "Failed to submit case. Please try again.",
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
          <button
            onClick={() => onSuccess()}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Access Database
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1">Vehicle Make</label>
              <input
                type="text"
                name="vehicleMake"
                value={formData.vehicleMake}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Model</label>
              <input
                type="text"
                name="vehicleModel"
                value={formData.vehicleModel}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Year</label>
              <input
                type="text"
                name="vehicleYear"
                value={formData.vehicleYear}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                pattern="\d{4}"
                maxLength={4}
                placeholder="YYYY"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">VIN</label>
            <input
              type="text"
              name="vin"
              value={formData.vin}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              maxLength={17}
              placeholder="Vehicle Identification Number"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Problem Description</label>
            <textarea
              name="problemDescription"
              value={formData.problemDescription}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <FileUploadSection
            files={files}
            handleFileChange={handleFileChange}
            removeFile={removeFile}
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${
                isSubmitting ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
              } text-white px-6 py-2 rounded transition-colors`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Form'}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CaseForm;