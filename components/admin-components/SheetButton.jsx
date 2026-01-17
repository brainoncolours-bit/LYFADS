'use client';
import { useState } from 'react';
import { useToast } from '../ToastProvider';

export default function SheetButton({ data,type }) {
  const [loading, setLoading] = useState(false);
const toast = useToast();
  const handleSend = async () => {
    setLoading(true);
    toast.loading('Exporting ...',"submit");
    try {
        const spreadsheetId =
        type==="sales"?
        '11QaUFoWv3ekP9z0wWiHvPl3Ly2lfPgOamilKN1elpuM':
        type==="feedback"?
        '1Ulowm8bt5hKBTlEOddd99w7zDnrF9SUvnPqZr8TJYOA':
        '1yXdyKWhjt7NdRYwRSe11BRxpcILFSO7OyEq5Ib_B0CI'
        
        const res = await fetch('/api/sheet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data:data?.reverse(),spreadsheetId }),
        });

         const result = await res.json();

         if (!res.ok) {
           throw new Error(result.error || "Failed to update sheet");
         }
        toast.success('Google sheet updated succesfully',"submit");
        
    } catch (error) {
        toast.error('Export failed !!',"submit");
    }
    finally{
        setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleSend} disabled={loading} className="bg-green-700 text-white px-4 py-2 rounded mb-4">
        {loading ? 'Exporting...' : 'Export to Google Sheets'}
      </button>
    </div>
  );
}
