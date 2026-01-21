'use client';

import { supabase } from '@/lib/supabaseClient';
import { Pencil, Trash2, Play, ExternalLink, Calendar, Eye } from 'lucide-react';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import VideoPlayer from '@/components/VideoPlayer';

const WorksList = ({ setEditData, editData, fetchWorks, loading, videos }) => {
  const [localVideos, setLocalVideos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const itemsPerPage = 20;

  // Use videos prop if provided, otherwise fetch
  const displayVideos = videos || localVideos;

  // Only fetch if videos prop is not provided
  const fetchWorksData = async () => {
    const { data, error } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
    if (error) {
      // Check if it's a relation (table) does not exist error
      if (error.code !== '42P01') {
        console.error('Failed to fetch videos:', error.message);
      }
      setLocalVideos([]); // Set empty array if there's an error
    } else {
      setLocalVideos(data || []);
    }
  };

  const itemDelete = async (item) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete video: ${item.title}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      const { error } = await supabase.from('videos').delete().eq('id', item.id);
      if (error) {
        // Check if it's a relation (table) does not exist error
        if (error.code === '42P01') {
          console.error('Videos table does not exist. Please contact administrator.');
        } else {
          console.error('Failed to delete:', error.message);
        }
      } else {
        console.log('Deleted successfully');
        fetchWorks(); // Refresh the videos list
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Only fetch if videos prop is not provided
  useEffect(() => {
    if (!videos) {
      fetchWorksData();
    }
  }, [editData, videos]);

  const totalPages = Math.ceil(displayVideos.length / itemsPerPage);
  const displayedItems = displayVideos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      {displayVideos.length > 0 && (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold mb-2">Portfolio Videos</h3>
          <p className="text-purple-100">Total Videos: {displayVideos.length} items</p>
        </div>
      )}

      {displayVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedItems.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 group"
            >
              {/* Video Thumbnail */}
              <div
                onClick={() => setSelectedVideo(item)}
                className="relative block w-full h-48 bg-gray-200 overflow-hidden cursor-pointer"
              >
                <Image
                  src={item.thumbnail_url && !item.thumbnail_url.includes('example.com') ? item.thumbnail_url : "/placeholder-work.jpg"}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                  <div className="bg-white bg-opacity-95 rounded-full p-5 transform scale-90 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                    <Play size={40} className="text-purple-600 fill-purple-600" />
                  </div>
                </div>

                {/* Video Badge */}
                <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                  <Play size={12} fill="white" />
                  Video
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2 min-h-[56px]">
                  {item.title}
                </h3>

                {/* Date */}
                {item.created_at && (
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                    <Calendar size={14} />
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                )}

                {/* View Video Button */}
                <button
                  onClick={() => setSelectedVideo(item)}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium mb-4 group/link"
                >
                  <Eye size={16} className="group-hover/link:translate-x-0.5 transition-transform" />
                  View Video
                </button>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => setEditData(item)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-lg transition-colors font-medium text-sm"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => itemDelete(item)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg transition-colors font-medium text-sm"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mb-6">
              <Play size={48} className="text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Videos Yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Start building your portfolio by adding your video. Click the + icon above to add your first video.
            </p>
          </div>
        )
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors"
          >
            Previous
          </button>
          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${
                  currentPage === idx + 1
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayer
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};

export default WorksList;