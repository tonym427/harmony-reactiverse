import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, ChevronDown } from 'lucide-react';

const CaseManagement = () => {
  const [view, setView] = useState('form');
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [formData, setFormData] = useState({
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
  const [files, setFiles] = useState([]);

  const handleSubmit = () => {
    const newCase = {
      id: Date.now(),
      name: `${formData.firstName} ${formData.lastName}`,
      vehicle: `${formData.vehicleYear} ${formData.vehicleMake} ${formData.vehicleModel}`,
      status: 'New',
      lastUpdated: new Date().toLocaleDateString(),
      files: files.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file)
      })),
      ...formData
    };
    
    setCases(prev => [...prev, newCase]);
    console.log('New case added:', newCase);
    setView('success');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (indexToRemove) => {
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  if (view === 'success') {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="p-6">
            <div className="bg-green-50 p-4 rounded mb-4">
              Form submitted successfully! Reference: {Date.now().toString(36).toUpperCase()}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setFormData({
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
                  setFiles([]);
                  setView('form');
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Submit Another Case
              </button>
              <button
                onClick={() => setView('database')}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                View All Cases
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (view === 'database') {
    return (
      <div className="p-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>AJ's Lemonade - Case Database ({cases.length} total cases)</CardTitle>
              <button
                onClick={() => setView('form')}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Back to Form
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search cases..."
                  className="w-full pl-10 p-2 border rounded"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <select className="pl-10 pr-8 p-2 border rounded appearance-none">
                  <option>All Status</option>
                  <option>New</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            {cases.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No cases submitted yet
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Vehicle</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Files</th>
                    <th className="p-2 text-left">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map(case_ => (
                    <React.Fragment key={case_.id}>
                      <tr 
                        onClick={() => setSelectedCase(selectedCase === case_.id ? null : case_.id)}
                        className="border-b hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="p-2">{case_.name}</td>
                        <td className="p-2">{case_.vehicle}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            case_.status === 'New' ? 'bg-green-100 text-green-800' :
                            case_.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {case_.status}
                          </span>
                        </td>
                        <td className="p-2">{case_.files.length} files</td>
                        <td className="p-2">{case_.lastUpdated}</td>
                      </tr>
                      {selectedCase === case_.id && (
                        <tr className="bg-gray-50">
                          <td colSpan="5" className="p-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h3 className="font-semibold mb-2">Contact Information</h3>
                                <p>Email: {case_.email}</p>
                                <p>Phone: {case_.phone}</p>
                              </div>
                              <div>
                                <h3 className="font-semibold mb-2">Vehicle Information</h3>
                                <p>Make: {case_.vehicleMake}</p>
                                <p>Model: {case_.vehicleModel}</p>
                                <p>Year: {case_.vehicleYear}</p>
                                {case_.vin && <p>VIN: {case_.vin}</p>}
                              </div>
                              <div className="col-span-2">
                                <h3 className="font-semibold mb-2">Problem Description</h3>
                                <p>{case_.problemDescription}</p>
                              </div>
                              {case_.files.length > 0 && (
                                <div className="col-span-2">
                                  <h3 className="font-semibold mb-2">Uploaded Files</h3>
                                  <div className="space-y-2">
                                    {case_.files.map((file, index) => (
                                      <div key={index} className="flex items-center space-x-2 p-2 bg-white rounded border">
                                        <span className="flex-1">{file.name}</span>
                                        <span className="text-sm text-gray-500">
                                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                        </span>
                                        <a
                                          href={file.url}
                                          download={file.name}
                                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          Download
                                        </a>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>AJ's Lemonade - Lemon Law Intake</CardTitle>
            <button
              onClick={() => setView('database')}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Access Database ({cases.length})
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
                  type="number"
                  name="vehicleYear"
                  value={formData.vehicleYear}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
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
    </div>
  );
};

export default CaseManagement;
