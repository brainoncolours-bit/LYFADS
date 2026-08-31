"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { hasSupabaseConfig, supabase } from '@/lib/supabaseClient';
import VideoPlayer from '@/components/VideoPlayer';
const FALLBACK_CATEGORIES_MAP = {
  'fallback-1': { id: 'fallback-1', name: 'Commercial', sub: 'Film', color: 'from-red-500 to-orange-500', icon: '🎬' },
  'fallback-2': { id: 'fallback-2', name: 'Digital', sub: 'Campaign', color: 'from-blue-500 to-cyan-500', icon: '📱' },
  'fallback-3': { id: 'fallback-3', name: 'Corporate', sub: 'Branding', color: 'from-blue-500 to-cyan-500', icon: '💼' },
  'fallback-4': { id: 'fallback-4', name: 'AI Video', sub: 'Content', color: 'from-violet-500 to-fuchsia-500', icon: '✨' },
  'fallback-5': { id: 'fallback-5', name: 'Cinematic', sub: 'Production', color: 'from-yellow-500 to-red-500', icon: '🎞️' },
};

const CATEGORIES_BY_SLUG = {
  '1': { id: 1, name: 'Commercial', sub: 'Film', color: 'from-red-500 to-orange-500' },
  '4': { id: 4, name: 'Digital', sub: 'Campaign', color: 'from-blue-500 to-cyan-500' },
  '18': { id: 18, name: 'Corporate', sub: 'Branding', color: 'from-blue-500 to-cyan-500' },
  '16': { id: 16, name: 'AI Video', sub: 'Content', color: 'from-violet-500 to-fuchsia-500' },
  '14': { id: 14, name: 'Brand Film', sub: 'Production', color: 'from-orange-500 to-pink-500' },
  'commercial': { id: 1, name: 'Commercial', color: 'from-red-500 to-orange-500' },
  'corporate': { id: 18, name: 'Corporate', color: 'from-blue-500 to-cyan-500' },
  'digital': { id: 4, name: 'Digital', color: 'from-blue-500 to-cyan-500' },
  'music-video': { name: 'Music Video', color: 'from-pink-500 to-purple-500' },
  'documentary': { name: 'Documentary', color: 'from-green-500 to-teal-500' },
  'short-film': { name: 'Short Film', color: 'from-yellow-500 to-red-500' },
  'event': { name: 'Event Coverage', color: 'from-indigo-500 to-purple-500' },
  'animation': { name: 'Animation', color: 'from-violet-500 to-fuchsia-500' },
  'social-media': { name: 'Social Media', color: 'from-cyan-500 to-blue-500' },
  'brand-film': { id: 14, name: 'Brand Film', color: 'from-orange-500 to-pink-500' },
  'product': { name: 'Product Videos', color: 'from-emerald-500 to-green-500' },
  'testimonial': { name: 'Testimonials', color: 'from-purple-500 to-pink-500' },
  'ai-video': { id: 16, name: 'AI Video', color: 'from-violet-500 to-fuchsia-500' },
  'cinematic': { name: 'Cinematic', color: 'from-yellow-500 to-red-500' },
  'other': { name: 'Other', color: 'from-gray-500 to-slate-500' },
};

const resolveCategory = (catIdParam, dbCatData) => {
  if (dbCatData && dbCatData.name) {
    const key = String(dbCatData.name).toLowerCase().replace(/\s+/g, '-');
    const defaults = CATEGORIES_BY_SLUG[key] || CATEGORIES_BY_SLUG[String(dbCatData.id)] || {};
    return {
      id: dbCatData.id,
      name: dbCatData.name,
      sub: dbCatData.sub || defaults.sub || '',
      color: defaults.color || 'from-red-500 to-orange-500',
      icon: defaults.icon || '🎬',
    };
  }

  if (!catIdParam) return null;

  const paramStr = String(catIdParam);

  if (FALLBACK_CATEGORIES_MAP[paramStr]) {
    return FALLBACK_CATEGORIES_MAP[paramStr];
  }

  const lowerParam = paramStr.toLowerCase().trim();
  if (CATEGORIES_BY_SLUG[lowerParam]) {
    return CATEGORIES_BY_SLUG[lowerParam];
  }

  const matchByName = Object.values(CATEGORIES_BY_SLUG).find(
    (c) => c.name.toLowerCase() === lowerParam || String(c.id) === paramStr
  );
  if (matchByName) return matchByName;

  return {
    id: catIdParam,
    name: String(catIdParam).replace(/[-_]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    color: 'from-red-500 to-orange-500',
    icon: '🎬',
  };
};

const CategoryWorksPage = () => {
  const params = useParams();
  const rawCategoryId = params?.category;

  const [categoryData, setCategoryData] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rawCategoryId) return;

    let isMounted = true;
    setLoading(true);

    const loadData = async () => {
      let fetchedCat = null;
      let allDbCategories = [];

      if (hasSupabaseConfig) {
        try {
          const { data: dbCategories, error: catError } = await supabase
            .from('video_categories')
            .select('*');

          if (!catError && dbCategories && dbCategories.length > 0) {
            allDbCategories = dbCategories;
          }

          // Try finding the current category in DB by ID
          fetchedCat = allDbCategories.find(
            (c) => String(c.id).toLowerCase().trim() === String(rawCategoryId).toLowerCase().trim()
          );

          // If not found by ID, try matching by name or fallback mapping
          if (!fetchedCat) {
            const fallbackDef =
              FALLBACK_CATEGORIES_MAP[String(rawCategoryId).toLowerCase()] ||
              CATEGORIES_BY_SLUG[String(rawCategoryId).toLowerCase()];
            const targetName = fallbackDef?.name || rawCategoryId;

            fetchedCat = allDbCategories.find(
              (c) =>
                c.name &&
                c.name.toLowerCase().trim() === String(targetName).toLowerCase().trim()
            );
          }
        } catch (err) {
          console.error('[Works] Error fetching category data:', err);
        }
      }

      if (!isMounted) return;
      setCategoryData(fetchedCat);

      const currentCat = resolveCategory(rawCategoryId, fetchedCat);

      if (hasSupabaseConfig) {
        try {
          // Collect all potential match keys (IDs and Names) for this category
          const matchIds = new Set();
          const matchNames = new Set();

          const addId = (id) => {
            if (id != null && String(id).trim() !== '') {
              matchIds.add(String(id).toLowerCase().trim());
            }
          };

          const addName = (name) => {
            if (name != null && String(name).trim() !== '') {
              matchNames.add(String(name).toLowerCase().trim());
            }
          };

          addId(rawCategoryId);
          if (fetchedCat?.id != null) addId(fetchedCat.id);
          if (currentCat?.id != null) addId(currentCat.id);
          if (fetchedCat?.name) addName(fetchedCat.name);
          if (currentCat?.name) addName(currentCat.name);

          // Category alias maps for robust matching
          const categoryAliases = {
            'fallback-1': { ids: ['1', 'fallback-1', 'commercial'], names: ['commercial', 'commercials', 'ad', 'ads', 'brand spot', 'film'] },
            'fallback-2': { ids: ['2', '4', 'fallback-2', 'digital'], names: ['digital', 'campaign', 'digital campaign', 'digital ads', 'social media', 'reels', 'social'] },
            'fallback-3': { ids: ['3', '18', 'fallback-3', 'corporate'], names: ['corporate', 'branding', 'corporate film', 'corporate brand', 'business'] },
            'fallback-4': { ids: ['4', '16', 'fallback-4', 'ai-video', 'ai'], names: ['ai video', 'ai', 'aivideo', 'synthetic', 'vfx', '3d', 'content'] },
            'fallback-5': { ids: ['5', '14', 'fallback-5', 'cinematic', 'brand-film'], names: ['cinematic', 'brand film', 'brand films', 'narrative', 'production'] },
          };

          const currentKey = String(rawCategoryId).toLowerCase().trim();
          if (categoryAliases[currentKey]) {
            categoryAliases[currentKey].ids.forEach(addId);
            categoryAliases[currentKey].names.forEach(addName);
          }

          // Check CATEGORIES_BY_SLUG
          const slugMapping = CATEGORIES_BY_SLUG[currentKey];
          if (slugMapping) {
            if (slugMapping.id) addId(slugMapping.id);
            if (slugMapping.name) addName(slugMapping.name);
          }

          // Check by resolved category name
          const catNameLower = (currentCat?.name || '').toLowerCase().trim();
          Object.values(categoryAliases).forEach((aliasObj) => {
            if (aliasObj.names.includes(catNameLower) || aliasObj.ids.includes(catNameLower)) {
              aliasObj.ids.forEach(addId);
              aliasObj.names.forEach(addName);
            }
          });

          // Map from all DB categories
          allDbCategories.forEach((c) => {
            const cName = c.name ? c.name.toLowerCase().trim() : '';
            const cId = c.id != null ? String(c.id).toLowerCase().trim() : '';
            if (cName && (matchNames.has(cName) || cName.includes(catNameLower) || catNameLower.includes(cName))) {
              addId(cId);
              addName(cName);
            }
            if (cId && matchIds.has(cId)) {
              addName(cName);
            }
          });

          // Fetch all videos uploaded by the admin from Supabase videos table
          const { data: allVideos, error: videosError } = await supabase
            .from('videos')
            .select('*')
            .order('created_at', { ascending: false });

          console.log('[Works] Category:', currentCat?.name, 'Match IDs:', Array.from(matchIds), 'Match Names:', Array.from(matchNames));
          console.log('[Works] Supabase Videos:', allVideos, 'Error:', videosError);

          if (!videosError && allVideos) {
            const matchedVideos = allVideos.filter((v) => {
              const vCatId = v.category_id != null ? String(v.category_id).toLowerCase().trim() : '';
              const vCatName = v.category ? String(v.category).toLowerCase().trim() : '';

              if (vCatId && matchIds.has(vCatId)) return true;
              if (vCatId && matchNames.has(vCatId)) return true;
              if (vCatName && matchNames.has(vCatName)) return true;
              if (vCatName && matchIds.has(vCatName)) return true;

              // Check against dbCategories
              if (vCatId) {
                const dbCat = allDbCategories.find(
                  (c) => String(c.id).toLowerCase().trim() === vCatId
                );
                if (dbCat?.name) {
                  const dbName = dbCat.name.toLowerCase().trim();
                  if (matchNames.has(dbName) || dbName.includes(catNameLower) || catNameLower.includes(dbName)) {
                    return true;
                  }
                }
              }

              // Keyword check against category name
              if (catNameLower) {
                if (vCatId.includes(catNameLower) || vCatName.includes(catNameLower)) return true;
              }

              return false;
            });

            console.log('[Works] Matched Videos for', currentCat?.name, ':', matchedVideos);

            if (isMounted) {
              setVideos(matchedVideos);
              setLoading(false);
            }
            return;
          }
        } catch (err) {
          console.error('[Works] Error fetching videos from Supabase:', err);
        }
      }

      if (isMounted) {
        setVideos([]);
        setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [rawCategoryId]);

  const category = resolveCategory(rawCategoryId, categoryData);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white text-neutral-900 pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto mb-4" />
            <p className="text-neutral-500 font-mono text-xs tracking-widest uppercase font-bold">Loading Category...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!category) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white text-neutral-900 pt-24 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-black uppercase italic tracking-tight text-neutral-950">Category Not Found</h1>
            <Link href="/works" className="text-red-600 hover:text-neutral-950 transition-colors font-mono uppercase text-xs font-bold tracking-wider inline-block">
              ← Back to Categories
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white text-neutral-900 selection:bg-red-600 selection:text-white flex flex-col justify-between">
      <Navbar />
      
      <main className="w-full pt-28 sm:pt-32 pb-28 md:pb-24 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 sm:space-y-12 flex-grow">
        {/* Header */}
        <div className="space-y-3 sm:space-y-4 text-left">
          <Link 
            href="/works" 
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-red-600 mb-1 sm:mb-2 transition-colors duration-300 text-xs font-mono uppercase tracking-widest font-bold"
          >
            <ArrowLeft size={16} />
            <span>Back to Categories</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-2 sm:space-y-3"
          >
            <div>
              <span className="text-[10px] sm:text-xs font-mono font-bold text-red-600 uppercase tracking-[0.3em] block">
                {category.sub || "PORTFOLIO CATEGORY"}
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black uppercase italic tracking-tight text-neutral-950 leading-[0.95]">
              {category.name}
            </h1>

            <p className="text-xs sm:text-base text-neutral-600 font-normal pt-1">
              {videos.length} {videos.length === 1 ? 'production work' : 'production works'} in this category
            </p>
          </motion.div>
        </div>

        {/* Videos Grid / Real Admin Uploads */}
        {videos.length === 0 ? (
          <div className="w-full py-16 text-center">
            <div className="max-w-md mx-auto space-y-5 bg-[#f8f9fa] border border-neutral-200/80 rounded-3xl p-8 sm:p-10 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-white border border-neutral-200 flex items-center justify-center mx-auto text-neutral-400 shadow-sm">
                <Play size={26} className="ml-1 fill-neutral-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-neutral-950 uppercase italic tracking-tight">
                  No Works In This Category
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  No production works have been uploaded to {category.name} yet. Videos published from the admin panel will appear here automatically.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/works"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-950 text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-red-600 transition-all shadow-md hover:scale-105"
                >
                  <ArrowLeft size={14} />
                  <span>Explore Other Categories</span>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {videos.map((video) => (
              <motion.button
                key={video.id}
                type="button"
                onClick={() => setSelectedVideo(video)}
                className="group block overflow-hidden rounded-[24px] bg-white border border-neutral-200/90 text-left shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative w-full h-48 md:h-56 bg-neutral-950 overflow-hidden">
                  {video.thumbnail_url ? (
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : video.video_url ? (
                    <video
                      src={video.video_url}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      muted
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-zinc-500 uppercase tracking-widest font-mono">
                      No Preview
                    </div>
                  )}
                  
                  {/* Subtle Dark Vignette on Video */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-md border border-white flex items-center justify-center text-neutral-950 shadow-lg group-hover:scale-110 transition-transform">
                      <Play size={24} className="fill-neutral-950 ml-1" />
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-white space-y-2 border-t border-neutral-100">
                  <h2 className="text-base sm:text-lg font-black text-neutral-950 leading-snug group-hover:text-red-600 transition-colors line-clamp-1 uppercase tracking-tight">
                    {video.title}
                  </h2>
                  {video.description ? (
                    <p className="text-neutral-600 text-xs line-clamp-2 leading-relaxed font-normal">
                      {video.description}
                    </p>
                  ) : (
                    <p className="text-neutral-400 text-xs font-mono uppercase tracking-wider">
                      Click to play production video
                    </p>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </main>

      {selectedVideo && (
        <VideoPlayer video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
      
      <Footer />
    </div>
  );
};

export default CategoryWorksPage;