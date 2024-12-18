import React from 'react';

interface VehicleFormProps {
  formData: {
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear: string;
    vin: string;
    problemDescription: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({ formData, onChange }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1">Vehicle Make</label>
          <input
            type="text"
            name="vehicleMake"
            value={formData.vehicleMake}
            onChange={onChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Model</label>
          <input
            type="text"
            name="vehicleModel"
            value={formData.vehicleModel}
            onChange={onChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Year</label>
          <input
            type="text"
            name="vehicleYear"
            value={formData.vehicleYear}
            onChange={onChange}
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
          onChange={onChange}
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
          onChange={onChange}
          rows={4}
          className="w-full p-2 border rounded"
        />
      </div>
    </>
  );
};