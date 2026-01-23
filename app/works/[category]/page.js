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
  const params = useParams();
  const categoryId = params.category;
  const category = categories[categoryId];

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, [categoryId]);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('category', categoryId)
        .order('created_at', { ascending: false });

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

  if (!category) {
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
              <span className="text-6xl">{category.icon}</span>
              <h1 className={`text-6xl md:text-8xl font-black bg-gradient-to-r ${category.color} bg-clip-text text-transparent italic`}>
                {category.name}
              </h1>
            </div>
            <p className="text-gray-400 text-xl">
              {videos.length} {videos.length === 1 ? 'video' : 'videos'} in this category
            </p>
          </motion.div>
        </div>

        {/* Videos Grid */}
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-video bg-gray-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                >
                  <Link href={`/works/${categoryId}/${video.id}`}>
                    <div className="group relative aspect-video rounded-xl overflow-hidden border border-gray-800 hover:border-transparent cursor-pointer transition-all duration-300">
                      {/* Thumbnail */}
                      <Image
                        src={video.thumbnail_url || '/placeholder-work.jpg'}
                        alt={video.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                      {/* Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-5 transform scale-0 group-hover:scale-100 transition-transform duration-300 shadow-2xl">
                          <Play size={32} className="text-black fill-black" />
                        </div>
                      </div>

                      {/* Title */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-bold text-lg line-clamp-2">
                          {video.title}
                        </h3>
                      </div>

                      {/* Hover Border Glow */}
                      <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r ${category.color} blur-xl`} style={{ zIndex: -1 }} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r ${category.color} bg-opacity-20 rounded-full mb-6`}>
                <span className="text-6xl">{category.icon}</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">No Videos Yet</h3>
              <p className="text-gray-400 mb-8">
                We haven't added any {category.name.toLowerCase()} videos yet. Check back soon!
              </p>
              <Link 
                href="/works"
                className={`inline-block px-8 py-4 bg-gradient-to-r ${category.color} text-white font-semibold rounded-full hover:shadow-2xl transition-all duration-300`}
              >
                Explore Other Categories
              </Link>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CategoryWorksPage;
