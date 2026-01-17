"use client";
import { EnquiryBadge } from '@/app/admin/EnquirieBadge';
import { supabase } from '@/lib/supabaseClient';
import { IconStarFilled } from '@tabler/icons-react';
import { message } from 'antd';
import { Beaker, Calendar, Fuel, Gauge, Star, Trash2, User } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import Swal from 'sweetalert2';

const CarsList = ({ items, loading, setEditData, fetchProducts,fetchCarEnquiries, enquiryData = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const displayedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const itemsClick = (item) => {
    setEditData(item);
  };

  const itemDelete = async (item) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete variant: ${item.variant}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      const { error } = await supabase.from('cars').delete().eq('id', item.id);

      if (error) {
        message.error('Failed to delete item: ' + error.message);
      } else {
        message.success('Item deleted successfully');
        fetchProducts();
      }
    }
  };

  const itemFeature = async (item) => {
    const { error } = await supabase
      .from('cars')
      .update({ featured: !item.featured })
      .eq('id', item.id);

    if (error) {
      message.error('Failed to update item: ' + error.message);
    } else {
      message.success('Item updated successfully');
      fetchProducts();
    }
  };

  // Helper to count enquiries
  const getEnquiryCount = (carId) =>
    enquiryData.filter((e) => e.car_id === carId).length;

  const sortedItems = [...displayedItems].sort((a, b) => {
  return getEnquiryCount(b.id) - getEnquiryCount(a.id);
});
  return (
    <div>
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sortedItems.map((item, i) => {
            const enquiryCount = getEnquiryCount(item.id);
            return (
              <div
                onClick={() => itemsClick(item)}
                key={i}
                className="relative flex items-start gap-3 p-3 border rounded-md shadow-sm bg-white text-xs cursor-pointer overflow-hidden"
              >
                {/* Ribbon if Enquiry Exists */}
                {enquiryCount > 0 && (
                <div
                onClick={(e)=>{
                  e.stopPropagation();
                  setIsModalOpen(item.id)
                }}
                className="absolute bottom-2 left-2 bg-green-600 text-white text-[10px] px-2 py-1 rounded-full shadow-md z-10 font-medium">
                  Enquiries ({enquiryCount})
                </div>
)}
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                  <Image
                    src={item.image_url || "/car1.jpg"}
                    alt={item.model || "Car"}
                    width={64}
                    height={48}
                    className="object-cover rounded w-16 h-12"
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-sm truncate overflow-hidden whitespace-nowrap max-w-[180px]">
                      {item.variant}
                    </h3>
                    <span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          itemFeature(item);
                        }}
                        className="mx-[5px]"
                      >
                        {item.featured ? (
                          <IconStarFilled
                            size={16}
                            className="text-brand-color hover:text-red-700"
                          />
                        ) : (
                          <Star size={16} className="text-gray-400 hover:text-red-700" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          itemDelete(item);
                        }}
                      >
                        <Trash2 size={16} className="text-red-500 hover:text-red-700" />
                      </button>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} /> {item.year || "---"}
                    </div>
                    <div className="flex items-center gap-1">
                      <User size={12} /> {item.owners || "---"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Gauge size={12} /> {item.kilometers || "---"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Fuel size={12} /> {item.fueltype || "---"}
                    </div>
                    <div className="flex items-center gap-1 col-span-2">
                      <Beaker size={12} /> {item.transmission || "---"}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        !loading && (
          <p className="text-center py-8 text-gray-500">
            No cars found. Add some cars to get listed.
          </p>
        )
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      <EnquiryBadge
        enquiries={enquiryData}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        fetchProducts={fetchProducts}
        fetchCarEnquiries={fetchCarEnquiries}
      />
    </div>
  );
};

export default CarsList;
