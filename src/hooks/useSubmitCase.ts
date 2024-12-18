import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { uploadCaseFiles } from '@/utils/fileUpload';
import { validateCaseForm } from '@/utils/formValidation';
import { CaseFormData } from '@/types/case';

export const useSubmitCase = (onSuccess: () => void) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitCase = async (formData: CaseFormData, files: File[]) => {
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
          first_name: formData.firstName,
          last_name: formData.lastName,
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          vehicle: `${formData.vehicleYear} ${formData.vehicleMake} ${formData.vehicleModel}`,
          vehicle_make: formData.vehicleMake,
          vehicle_model: formData.vehicleModel,
          vehicle_year: formData.vehicleYear,
          vin: formData.vin,
          problem_description: formData.problemDescription,
          status: 'New',
          last_updated: new Date().toISOString()
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

  return { submitCase, isSubmitting };
};