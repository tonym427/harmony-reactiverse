export interface CaseFormData {
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

export interface CaseFile {
  name: string;
  size: number;
  url: string;
}