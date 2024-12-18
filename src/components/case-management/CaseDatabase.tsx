import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

interface CaseFile {
  name: string;
  size: number;  // Explicitly define size as number
  url: string;
}

const CaseDatabase = ({ onBack }: { onBack: () => void }) => {
  const { toast } = useToast();
  const [cases, setCases] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchCases = async () => {
      const { data, error } = await supabase.from('cases').select('*');
      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch cases.",
          variant: "destructive"
        });
      } else {
        setCases(data);
      }
    };

    fetchCases();
  }, [toast]);

  return (
    <div className="p-4">
      <button onClick={onBack} className="bg-gray-500 text-white px-4 py-2 rounded mb-4">
        Back
      </button>
      <h2 className="text-xl font-bold mb-4">Case Database</h2>
      <div className="space-y-4">
        {cases.map((caseItem) => (
          <div key={caseItem.id} className="border p-4 rounded">
            <h3 className="font-semibold">{caseItem.name}</h3>
            <p>Status: {caseItem.status}</p>
            <p>Last Updated: {new Date(caseItem.last_updated).toLocaleString()}</p>
            {caseItem.files && caseItem.files.length > 0 && (
              <div className="mt-2">
                <h4 className="font-medium">Uploaded Files:</h4>
                {caseItem.files.map((file: CaseFile, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                      {file.name}
                    </a>
                    <span className="text-sm text-gray-500">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaseDatabase;
