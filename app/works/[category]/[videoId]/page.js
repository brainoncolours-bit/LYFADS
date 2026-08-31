"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Tag, Play, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { hasSupabaseConfig, supabase } from '@/lib/supabaseClient';
import { getPlayableVideoUrl, isDirectVideoSource } from '@/lib/videoUrls';

const FALLBACK_CATEGORIES_MAP = {
  'fallback-1': { id: 'fallback-1', name: 'Commercial', sub: 'Film', color: 'from-red-500 to-orange-500', icon: '🎬' },
  'fallback-2': { id: 'fallback-2', name: 'Digital', sub: 'Campaign', color: 'from-blue-500 to-cyan-500', icon: '📱' },
  'fallback-3': { id: 'fallback-3', name: 'Corporate', sub: 'Branding', color: 'from-blue-500 to-cyan-500', icon: '💼' },
  'fallback-4': { id: 'fallback-4', name: 'AI Video', sub: 'Content', color: 'from-violet-500 to-fuchsia-500', icon: '✨' },
  'fallback-5': { id: 'fallback-5', name: 'Cinematic', sub: 'Production', color: 'from-yellow-500 to-red-500', icon: '🎞️' },
};

const CATEGORIES_BY_SLUG = {
  '1': { id: 1, name: 'Commercial', color: 'from-red-500 to-orange-500', icon: '🎬' },
  '4': { id: 4, name: 'Digital', color: 'from-blue-500 to-cyan-500', icon: '📱' },
  '18': { id: 18, name: 'Corporate', color: 'from-blue-500 to-cyan-500', icon: '💼' },
  '16': { id: 16, name: 'AI Video', color: 'from-violet-500 to-fuchsia-500', icon: '✨' },
  '14': { id: 14, name: 'Brand Film', color: 'from-orange-500 to-pink-500', icon: '🏆' },
  'commercial': { id: 1, name: 'Commercial', color: 'from-red-500 to-orange-500', icon: '🎬' },
  'corporate': { id: 18, name: 'Corporate', color: 'from-blue-500 to-cyan-500', icon: '💼' },
  'digital': { id: 4, name: 'Digital', color: 'from-blue-500 to-cyan-500', icon: '📱' },
  'music-video': { name: 'Music Video', color: 'from-pink-500 to-purple-500', icon: '🎵' },
  'documentary': { name: 'Documentary', color: 'from-green-500 to-teal-500', icon: '🎥' },
  'short-film': { name: 'Short Film', color: 'from-yellow-500 to-red-500', icon: '🎞️' },
  'event': { name: 'Event Coverage', color: 'from-indigo-500 to-purple-500', icon: '🎪' },
  'animation': { name: 'Animation', color: 'from-violet-500 to-fuchsia-500', icon: '✨' },
  'social-media': { name: 'Social Media', color: 'from-cyan-500 to-blue-500', icon: '📱' },
  'brand-film': { id: 14, name: 'Brand Film', color: 'from-orange-500 to-pink-500', icon: '🏆' },
  'product': { name: 'Product Videos', color: 'from-emerald-500 to-green-500', icon: '📦' },
  'testimonial': { name: 'Testimonials', color: 'from-purple-500 to-pink-500', icon: '💬' },
  'ai-video': { id: 16, name: 'AI Video', color: 'from-violet-500 to-fuchsia-500', icon: '✨' },
  'cinematic': { name: 'Cinematic', color: 'from-yellow-500 to-red-500', icon: '🎞️' },
  'other': { name: 'Other', color: 'from-gray-500 to-slate-500', icon: '🎨' },
};

const resolveCategory = (catIdParam) => {
  if (!catIdParam) return { name: 'Category', color: 'from-red-500 to-orange-500', icon: '🎬' };
  const paramStr = String(catIdParam);
  if (FALLBACK_CATEGORIES_MAP[paramStr]) return FALLBACK_CATEGORIES_MAP[paramStr];
  const lowerParam = paramStr.toLowerCase().trim();
  if (CATEGORIES_BY_SLUG[lowerParam]) return CATEGORIES_BY_SLUG[lowerParam];
  const matchByName = Object.values(CATEGORIES_BY_SLUG).find(
    (c) => c.name.toLowerCase() === lowerParam || String(c.id) === paramStr
  );
  return matchByName || { name: 'Category', color: 'from-red-500 to-orange-500', icon: '🎬' };
};

const VideoDetailPage = () => {
  const params = useParams();
  const categoryId = params?.category;
  const videoId = params?.videoId;
  const category = resolveCategory(categoryId);

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedVideos, setRelatedVideos] = useState([]);

  const fetchVideo = async () => {
    setLoading(true);
    try {
      if (hasSupabaseConfig && videoId) {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .eq('id', videoId)
          .maybeSingle();

        if (!error && data) {
          setVideo(data);
          setLoading(false);
          return;
        }
      }
      setVideo(null);
    } catch (err) {
      console.error('Unexpected error fetching video:', err);
      setVideo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideo();
    fetchRelatedVideos();
  }, [videoId]);

  const fetchRelatedVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('category_id', categoryId)
        .neq('id', videoId)
        .limit(4)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setRelatedVideos(data);
      }
    } catch (err) {
      console.error('Error fetching related videos:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const playableVideoUrl = getPlayableVideoUrl(video?.video_url);
  const isDirectVideo = isDirectVideoSource(playableVideoUrl);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading video...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!video) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white pt-24 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Video Not Found</h1>
            <Link href={`/works/${categoryId}`} className="text-purple-400 hover:text-purple-300">
              ← Back to {category?.name || 'Category'}
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
        {/* Navigation */}
        <div className="container mx-auto px-6 mb-8">
          <div className="flex items-center gap-4 text-sm">
            <Link href="/works" className="text-gray-400 hover:text-white transition-colors">
              Categories
            </Link>
            <span className="text-gray-600">/</span>
            <Link href={`/works/${categoryId}`} className="text-gray-400 hover:text-white transition-colors">
              {category?.name}
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-white">{video.title}</span>
          </div>
        </div>

        {/* Split Layout: Description (Left) & Video (Right) */}
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* LEFT SIDE - Description */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 lg:pr-8"
            >
              {/* Title */}
              <div>
                <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
                  {video.title}
                </h1>
                
                {/* Category Badge */}
                {category && (
                  <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${category.color} rounded-full text-white font-semibold mb-4`}>
                    <span>{category.name}</span>
                  </div>
                )}
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 text-gray-400">
                {video.created_at && (
                  <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <span>{formatDate(video.created_at)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Tag size={18} />
                  <span className="capitalize">{categoryId.replace('-', ' ')}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">About This Video</h2>
                <div className="text-gray-300 text-lg leading-relaxed">
                  {video.description ? (
                    <p className="whitespace-pre-wrap">{video.description}</p>
                  ) : (
                    <p className="text-gray-500 italic">
                      No description available for this video. This {category?.name.toLowerCase()} showcases our creative production work.
                    </p>
                  )}
                </div>
              </div>

              {/* Additional Details */}
              <div className="border-t border-gray-800 pt-6">
                <h3 className="text-xl font-bold mb-4">Project Details</h3>
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-start gap-3">
                    <span className="text-purple-400 font-semibold min-w-[120px]">Category:</span>
                    <span className="capitalize">{category?.name}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-purple-400 font-semibold min-w-[120px]">Production:</span>
                    <span>LYF.ADS</span>
                  </div>
                  {video.created_at && (
                    <div className="flex items-start gap-3">
                      <span className="text-purple-400 font-semibold min-w-[120px]">Published:</span>
                      <span>{formatDate(video.created_at)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-6">
                <Link 
                  href={`/works/${categoryId}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-300"
                >
                  <ArrowLeft size={20} />
                  Back to {category?.name}
                </Link>
                {video.video_url && (
                  <a 
                    href={video.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${category?.color || 'from-purple-600 to-blue-600'} text-white rounded-lg hover:shadow-2xl transition-all duration-300`}
                  >
                    <ExternalLink size={20} />
                    Open Original
                  </a>
                )}
              </div>
            </motion.div>

            {/* RIGHT SIDE - Video Player */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:sticky lg:top-24 h-fit"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl">
                {video.video_url ? (
                  isDirectVideo ? (
                    <video
                      src={playableVideoUrl}
                      className="absolute inset-0 h-full w-full bg-black"
                      controls
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <iframe
                      src={playableVideoUrl}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Play size={64} className="mx-auto mb-4 text-gray-600" />
                      <p className="text-gray-500">Video not available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Controls/Info */}
              <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Quality: HD</span>
                  <span className="text-gray-400 text-sm">Fullscreen Available</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Related Videos */}
          {relatedVideos.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-20"
            >
              <h2 className="text-3xl font-black mb-8">More from {category?.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedVideos.map((relatedVideo, index) => (
                  <Link key={relatedVideo.id} href={`/works/${categoryId}/${relatedVideo.id}`}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative aspect-video rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500 cursor-pointer transition-all duration-300"
                    >
                      <img
                        src={relatedVideo.thumbnail_url || '/placeholder-work.jpg'}
                        alt={relatedVideo.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="text-white font-semibold text-sm line-clamp-2">
                          {relatedVideo.title}
                        </h3>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default VideoDetailPage;
