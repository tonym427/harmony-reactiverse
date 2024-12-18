import React from 'react';

interface FileUploadProps {
  files: File[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ files, onFileChange, onRemoveFile }) => {
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
            onChange={onFileChange}
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
                onClick={() => onRemoveFile(index)}
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