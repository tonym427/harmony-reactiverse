import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface CaseFile {
  name: string;
  size: number;
  url: string;
}

interface Case {
  id: number;
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  vin: string;
  problemDescription: string;
  status: string;
  lastUpdated: string;
  files: CaseFile[];
}

const CaseDatabase = ({ onBack }: { onBack: () => void }) => {
  const [selectedCase, setSelectedCase] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const { data: cases = [], isLoading } = useQuery({
    queryKey: ['cases', searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('cases')
        .select('*')
        .order('last_updated', { ascending: false });

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,vehicle.ilike.%${searchTerm}%`);
      }

      if (statusFilter !== 'All Status') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as Case[];
    }
  });

  if (isLoading) {
    return <div>Loading cases...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>JnJ's Lemonaid - Case Database ({cases.length} total cases)</CardTitle>
          <button
            onClick={onBack}
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <select 
              className="pl-10 pr-8 p-2 border rounded appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
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
  );
};

export default CaseDatabase;
