import React from 'react';
import { FileUpload } from './FileUpload';

interface FileUploadSectionProps {
  files: File[];
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (index: number) => void;
}

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  files,
  handleFileChange,
  removeFile,
}) => {
  return (
    <div className="space-y-2">
      <div className="border-2 border-dashed border-gray-300 rounded p-4">
        <div className="text-center">
          <button
            type="button"
            onClick={() => document.getElementById('file-upload')?.click()}
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
  );
};