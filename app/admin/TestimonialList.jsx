'use client';

import { supabase } from '@/lib/supabaseClient';
import { message } from 'antd';
import { Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const TestimonialsList = ({ setEditData,editData }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    if (error) {
      message.error('Failed to fetch testimonials: ' + error.message);
    } else {
      setTestimonials(data || []);
    }
    setLoading(false);
  };

  const itemDelete = async (item) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete testimonial from ${item.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      const { error } = await supabase.from('testimonials').delete().eq('id', item.id);
      if (error) {
        message.error('Failed to delete: ' + error.message);
      } else {
        message.success('Deleted successfully');
        fetchTestimonials();
      }
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [editData]);

  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  const displayedItems = testimonials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      {testimonials.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {displayedItems.map((item, i) => (
            <div
              key={i}
              className="relative flex items-start gap-3 p-3 border rounded-md shadow-sm bg-white text-xs overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="flex-shrink-0">
                <Image
                  src={item.image_url || "/user-placeholder.jpg"}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="object-cover rounded-full w-16 h-16"
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-sm">{item.name}</h3>
                    {item.profession && (
                      <p className="text-gray-500 text-[11px]">{item.profession}</p>
                    )}
                    {item.iglink && (
                      <a
                        href={item.iglink}
                        target="_blank"
                        className="text-blue-600 text-[10px]"
                        rel="noopener noreferrer"
                      >
                        View Instagram
                      </a>
                    )}
                  </div>
                  <span className="flex items-center gap-2 ml-2">
                    <button
                      onClick={() => setEditData(item)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => itemDelete(item)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </span>
                </div>

                <p className="mt-2 text-[11px] text-gray-700 whitespace-pre-line">
                  {item.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <p className="text-center py-8 text-gray-500">
            No testimonials found. Add some to get listed.
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
    </div>
  );
};

export default TestimonialsList;
