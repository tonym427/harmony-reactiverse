import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

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

interface CaseFile {
  name: string;
  size: number;
  url: string;
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

  const handleSubmit = async () => {
    try {
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

      if (error) throw error;

      if (files.length > 0 && data) {
        const caseId = data[0].id;
        for (const file of files) {
          const { error: uploadError } = await supabase
            .storage
            .from('case-files')
            .upload(`${caseId}/${file.name}`, file);
          
          if (uploadError) {
            console.error('Error uploading file:', uploadError);
          }
        }
      }

      toast({
        title: "Success",
        description: "Case submitted successfully!",
      });
      onSuccess();
    } catch (error) {
      console.error('Error submitting case:', error);
      toast({
        title: "Error",
        description: "Failed to submit case. Please try again.",
        variant: "destructive"
      });
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
        <div className="flex justify-between items-center">
          <CardTitle>JnJ's Lemonaid - Lemon Law Intake</CardTitle>
          <button
            onClick={() => onSuccess()}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Access Database
          </button>
        </div>
      </CardHeader>
      <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
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
              />
            </div>

            <div>
              <label className="block mb-1">Problem Description</label>
              <textarea
                name="problemDescription"
                value={formData.problemDescription}
                onChange={handleChange}
                rows="4"
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="space-y-2">
              <div className="border-2 border-dashed border-gray-300 rounded p-4">
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => document.getElementById('file-upload').click()}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Upload Files
                  </button>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept=".pdf,image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Upload repair documents, photos, or any other relevant files
                  </p>
                </div>
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  <h4>Uploaded Files:</h4>
                  {files.map((file, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>{file.name}</span>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                Submit Form
              </button>
            </div>
          </div>
      </CardContent>
    </Card>
  );
};

export default CaseForm;
