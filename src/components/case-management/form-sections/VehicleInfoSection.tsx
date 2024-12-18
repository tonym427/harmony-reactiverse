import React from 'react';

interface VehicleInfoProps {
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  vin: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const VehicleInfoSection: React.FC<VehicleInfoProps> = ({
  vehicleMake,
  vehicleModel,
  vehicleYear,
  vin,
  onChange,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1">Vehicle Make</label>
          <input
            type="text"
            name="vehicleMake"
            value={vehicleMake}
            onChange={onChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Model</label>
          <input
            type="text"
            name="vehicleModel"
            value={vehicleModel}
            onChange={onChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Year</label>
          <input
            type="text"
            name="vehicleYear"
            value={vehicleYear}
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
          value={vin}
          onChange={onChange}
          className="w-full p-2 border rounded"
          maxLength={17}
          placeholder="Vehicle Identification Number"
        />
      </div>
    </>
  );
};

export default VehicleInfoSection;