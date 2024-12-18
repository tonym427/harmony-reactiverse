import { supabase } from '@/lib/supabase';

export interface CaseFile {
  name: string;
  size: number;
  url: string;
}

export const uploadCaseFiles = async (caseId: number, files: File[]): Promise<CaseFile[]> => {
  console.log('Starting file upload process for case:', caseId);
  const uploadedFiles: CaseFile[] = [];

  for (const file of files) {
    console.log('Uploading file:', file.name);
    
    try {
      const { error: uploadError, data: uploadData } = await supabase
        .storage
        .from('case-files')
        .upload(`${caseId}/${file.name}`, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw uploadError;
      }

      if (uploadData) {
        const { data: { publicUrl } } = supabase
          .storage
          .from('case-files')
          .getPublicUrl(`${caseId}/${file.name}`);

        uploadedFiles.push({
          name: file.name,
          size: file.size,
          url: publicUrl
        });
        
        console.log('File uploaded successfully:', file.name);
      }
    } catch (error) {
      console.error('Upload process error:', error);
      throw error;
    }
  }

  return uploadedFiles;
};