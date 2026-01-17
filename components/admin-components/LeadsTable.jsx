"use client";

import { supabase } from "@/lib/supabaseClient";
import { IconBrandWhatsappFilled } from "@tabler/icons-react";
import { Trash2,PhoneCall,Calendar, Gauge, User, Mail, Fuel, Settings } from "lucide-react";
import { useState } from "react";
import SheetButton from "./SheetButton";
import Swal from "sweetalert2";
import { useToast } from "../ToastProvider";

const LeadsCards = ({ type,cardsData,loading,fetchSellEnquiries}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 
  const toast=useToast();
  // Calculate pagination
  const totalPages = Math.ceil(cardsData.length / itemsPerPage);
  const currentData = cardsData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Function to handle card deletion
  const handleDelete = async(item) => {
    const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Delete ${item.firstName} request?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
          });
       if (result.isConfirmed) {
          toast.loading('Deleting ...',"delete");
        const { error } = await supabase.from('selldetails').delete().eq('id', item.id);
  
        if (error) {
          toast.error('Failed to delete item: ' + error.message,"delete");
        } else {
          toast.success('Request deleted ',"delete");
          fetchSellEnquiries();
        }
      }
  };

  // Render a single card
  const renderCard = (record) => {
    const fullMobile = `${record.code}${record.mobile}`;
    
    return (
      <div key={record.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all hover:shadow-lg">
        {/* Card Header with Name and Quick Actions */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 flex justify-between items-center">
          <h3 className="font-semibold text-lg truncate">{record.firstName || "Unknown"}</h3>
          <div className="flex space-x-2">
            <a
              href={`https://wa.me/${fullMobile}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 p-2 rounded-full transition-colors"
              title="WhatsApp"
            >
              <IconBrandWhatsappFilled size={18} />
            </a>
            <a
              href={`tel:${fullMobile}`}
              className="bg-blue-700 hover:bg-blue-800 p-2 rounded-full transition-colors"
              title="Call"
            >
              <PhoneCall size={18} />
            </a>
            <button
              className="bg-red-500 hover:bg-red-600 p-2 rounded-full transition-colors"
              title="Delete"
              type="button"
              onClick={() => handleDelete(record)}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        
        {/* Car Details Section */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center mb-2">
            <div className="font-medium">
              <span className="capitalize">{record.brand?.replace(/-/g, ' ') || "N/A"}</span>
              {record.model && record.variant && (
                <span> - {record.model} {record.variant}</span>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar size={14} className="mr-1 text-gray-500" /> 
              <span>{record.year || "N/A"}</span>
            </div>
            <div className="flex items-center">
              <User size={14} className="mr-1 text-gray-500" /> 
              <span>{record.owners || "N/A"} Owner{record.owners !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center">
              <Gauge size={14} className="mr-1 text-gray-500" /> 
              <span>{record.kilometers || "N/A"} km</span>
            </div>
            <div className="flex items-center">
              <Fuel size={14} className="mr-1 text-gray-500" /> 
              <span>{record.fueltype || "N/A"}</span>
            </div>
            <div className="flex items-center col-span-2">
              <Settings size={14} className="mr-1 text-gray-500" /> 
              <span>{record.transmission || "N/A"}</span>
            </div>
          </div>
        </div>
        
        {/* Contact Section */}
        <div className="p-4">
          <div className="flex items-center mb-2">
            <Mail size={16} className="text-blue-600 mr-2" />
            <a href={`mailto:${record.email}`} className="text-blue-600 hover:underline truncate">
              {record.email || "N/A"}
            </a>
          </div>
          <div className="flex items-center">
            <PhoneCall size={16} className="text-blue-600 mr-2" />
            <a href={`tel:${fullMobile}`} className="text-blue-600 hover:underline">
              {fullMobile || "N/A"}
            </a>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <SheetButton data={cardsData} type={type} />
      </div>
      
      {cardsData.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-500">No leads found.</p>
        </div>
      ) : (
        <>
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentData.map(record => renderCard(record))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="inline-flex rounded-md shadow">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border-t border-b border-gray-300">
                  Page {currentPage} of {totalPages}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LeadsCards;