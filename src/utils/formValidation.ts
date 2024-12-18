export const validateCaseForm = (formData: any) => {
  const errors: string[] = [];
  
  if (!formData.firstName?.trim()) errors.push('First name is required');
  if (!formData.lastName?.trim()) errors.push('Last name is required');
  if (!formData.email?.trim()) errors.push('Email is required');
  if (!formData.phone?.trim()) errors.push('Phone is required');
  if (!formData.vehicleMake?.trim()) errors.push('Vehicle make is required');
  if (!formData.vehicleModel?.trim()) errors.push('Vehicle model is required');
  if (!formData.vehicleYear?.trim()) errors.push('Vehicle year is required');
  if (!formData.vin?.trim()) errors.push('VIN is required');
  if (!formData.problemDescription?.trim()) errors.push('Problem description is required');

  return errors;
};