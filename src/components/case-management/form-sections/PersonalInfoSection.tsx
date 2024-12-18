import React from 'react';

interface PersonalInfoProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalInfoSection: React.FC<PersonalInfoProps> = ({
  firstName,
  lastName,
  email,
  phone,
  onChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block mb-1">First Name</label>
        <input
          type="text"
          name="firstName"
          value={firstName}
          onChange={onChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block mb-1">Last Name</label>
        <input
          type="text"
          name="lastName"
          value={lastName}
          onChange={onChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block mb-1">Phone</label>
        <input
          type="tel"
          name="phone"
          value={phone}
          onChange={onChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
    </div>
  );
};

export default PersonalInfoSection;