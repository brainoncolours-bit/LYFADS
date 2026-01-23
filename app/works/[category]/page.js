"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';

const categories = {
  'commercial': { name: 'Commercial', color: 'from-red-500 to-orange-500', icon: '🎬' },
  'corporate': { name: 'Corporate', color: 'from-blue-500 to-cyan-500', icon: '💼' },
  'music-video': { name: 'Music Video', color: 'from-pink-500 to-purple-500', icon: '🎵' },
  'documentary': { name: 'Documentary', color: 'from-green-500 to-teal-500', icon: '🎥' },
  'short-film': { name: 'Short Film', color: 'from-yellow-500 to-red-500', icon: '🎞️' },
  'event': { name: 'Event Coverage', color: 'from-indigo-500 to-purple-500', icon: '🎪' },
  'animation': { name: 'Animation', color: 'from-violet-500 to-fuchsia-500', icon: '✨' },
  'social-media': { name: 'Social Media', color: 'from-cyan-500 to-blue-500', icon: '📱' },
  'brand-film': { name: 'Brand Film', color: 'from-orange-500 to-pink-500', icon: '🏆' },
  'product': { name: 'Product Videos', color: 'from-emerald-500 to-green-500', icon: '📦' },
  'testimonial': { name: 'Testimonials', color: 'from-purple-500 to-pink-500', icon: '💬' },
  'other': { name: 'Other', color: 'from-gray-500 to-slate-500', icon: '🎨' },
};



const CategoryWorksPage = () => {
  

//  take category from url params
  const params = useParams();
  const categoryId = params.category;
  const category = categories[categoryId];
  console.log({ categoryId, category });
  
  
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState(null);

  useEffect(() => {
    if (categoryId) {
      fetchCategoryData();
      fetchVideos();
    }
  }, [categoryId]);

  const fetchCategoryData = async () => {
    try {
      const { data, error } = await supabase
        .from('video_categories')
        .select('*')
        .eq('id', categoryId)
        .single();

      if (error) {
        console.error('Error fetching category:', error);
      } else {
        setCategoryData(data);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
    console.log({categoryData});
    
  };

  const fetchVideos = async () => {
    setLoading(true);
    try {
      // Fetch videos that match the category ID from the URL parameter
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false });
        
      console.log('Fetched videos for category:', categoryId, data);

      if (error) {
        console.error('Error fetching videos:', error);
        setVideos([]);
      } else {
        setVideos(data || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  if (!category && !categoryData) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white pt-24 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Category Not Found</h1>
            <Link href="/works" className="text-purple-400 hover:text-purple-300">
              ← Back to Categories
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white pt-24 pb-16">
        {/* Header */}
        <div className="container mx-auto px-6 mb-12">
          <Link 
            href="/works" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors duration-300"
          >
            <ArrowLeft size={20} />
            <span>Back to Categories</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="text-6xl">{category?.icon || '🎬'}</span>
              <h1 className={`text-6xl md:text-8xl font-black bg-gradient-to-r ${category?.color || 'from-red-500 to-orange-500'} bg-clip-text text-transparent italic`}>
                {categoryData?.name || category?.name || 'Category'}
              </h1>
            </div>
            <p className="text-gray-400 text-xl">
              {videos.length} {videos.length === 1 ? 'video' : 'videos'} in this category
            </p>
            {categoryData?.sub && (
              <p className="text-gray-500 text-sm uppercase tracking-widest mt-2">
                {categoryData.sub}
              </p>
            )}
          </motion.div>
        </div>

        {/* Videos Grid */}
        {(videos.length === 0 && !loading) ? (
          <div className="container mx-auto px-6">
            <p className="text-gray-500 text-center">No videos found in this category.</p>
          </div>
        ) : (
          <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {loading ? (
              <p className="text-gray-500 col-span-full text-center">Loading videos...</p>
            ) : (
              videos.map((video) => (
                <motion.a
                  key={video.id}
                  href={video.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="relative w-full h-48 md:h-64 lg:h-48 xl:h-64">
                    <Image
                      src={video.thumbnail_url}
                      alt={video.title}
                      layout="fill"
                      objectFit="cover"
                      className="group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Play size={48} className="text-white" />
                    </div>
                  </div>
                  <div className="p-4 bg-gray-900">
                    <h2 className="text-lg font-semibold text-white mb-2">{video.title}</h2>
                    <p className="text-gray-400 text-sm">{video.description}</p>
                  </div>
                </motion.a>
              ))
            )}
          </div>
        )}
        
      </div>
      <Footer />
    </>
  );
};

export default CategoryWorksPage;
