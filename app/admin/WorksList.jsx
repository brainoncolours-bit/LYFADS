'use client';

import { supabase } from '@/lib/supabaseClient';
import { Pencil, Trash2, Play, Calendar, Eye, FolderPlus, Plus, Upload } from 'lucide-react';
import { Button, Modal } from 'antd';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import VideoPlayer from '@/components/VideoPlayer';
import { uploadResumableFile } from '@/lib/supabaseResumableUpload';

const CATEGORY_VIDEO_BUCKET = 'carousel-videos';
const MAX_CATEGORY_VIDEO_SIZE = 500 * 1024 * 1024;

const WorksList = ({
  setEditData,
  editData,
  fetchWorks,
  fetchCategories,
  loading,
  videos,
  categories = [],
  onAddWork,
}) => {
  const [localVideos, setLocalVideos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [categorySaving, setCategorySaving] = useState(false);
  const [categoryError, setCategoryError] = useState('');
  const [categoryVideoFile, setCategoryVideoFile] = useState(null);
  const itemsPerPage = 20;

  const displayVideos = videos || localVideos;
  const categoryById = new Map(categories.map((category) => [String(category.id), category]));

  const getCategoryName = (video) =>
    categoryById.get(String(video.category_id))?.name || video.category || 'Uncategorized';

  const visibleVideos =
    selectedCategoryId === 'all'
      ? displayVideos
      : displayVideos.filter((video) => String(video.category_id) === String(selectedCategoryId));

  const fetchWorksData = async () => {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      if (error.code !== '42P01') {
        console.error('Failed to fetch videos:', error.message);
      }
      setLocalVideos([]);
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
        if (error.code === '42P01') {
          console.error('Videos table does not exist. Please contact administrator.');
        } else {
          console.error('Failed to delete:', error.message);
        }
      } else {
        console.log('Deleted successfully');
        fetchWorks?.();
      }
    }
  };

  const openAddCategory = () => {
    setEditingCategory(null);
    setCategoryName('');
    setCategoryVideoFile(null);
    setCategoryError('');
    setIsCategoryModalOpen(true);
  };

  const openEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryName(category.name || '');
    setCategoryVideoFile(null);
    setCategoryError('');
    setIsCategoryModalOpen(true);
  };

  const closeCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
    setCategoryName('');
    setCategoryVideoFile(null);
    setCategoryError('');
  };

  const handleCategoryVideoSelect = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setCategoryError('Please select a video file.');
      return;
    }

    if (file.size > MAX_CATEGORY_VIDEO_SIZE) {
      setCategoryError('Carousel preview video should be less than 500MB.');
      return;
    }

    setCategoryVideoFile(file);
    setCategoryError('');
  };

  const uploadCategoryVideo = async () => {
    if (!categoryVideoFile) return editingCategory?.carousel_video_url || null;

    return uploadResumableFile({
      bucket: CATEGORY_VIDEO_BUCKET,
      file: categoryVideoFile,
      prefix: 'category-card',
    });
  };

  const saveCategory = async () => {
    setCategoryError('');

    if (!categoryName.trim()) {
      setCategoryError('Please enter a category name.');
      return;
    }

    if (!editingCategory && !categoryVideoFile) {
      setCategoryError('Please upload a video for this category.');
      return;
    }

    setCategorySaving(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('User is not authenticated.');

      const carouselVideoUrl = await uploadCategoryVideo();
      const payload = {
        name: categoryName.trim(),
        carousel_video_url: carouselVideoUrl,
      };
      const { error } = editingCategory
        ? await supabase
            .from('video_categories')
            .update(payload)
            .eq('id', editingCategory.id)
        : await supabase.from('video_categories').insert(payload);

      if (error) throw error;

      await fetchCategories?.();
      closeCategoryModal();
    } catch (err) {
      console.error('Failed to save category:', err);
      setCategoryError(err.message || 'Failed to save category.');
    } finally {
      setCategorySaving(false);
    }
  };

  const deleteCategory = async (category) => {
    const usedCount = displayVideos.filter(
      (video) => String(video.category_id) === String(category.id)
    ).length;

    const result = await Swal.fire({
      title: 'Delete this category?',
      text: usedCount
        ? `"${category.name}" is used by ${usedCount} video${usedCount === 1 ? '' : 's'}. Those videos will stay saved, but they need another category to appear correctly.`
        : `This removes "${category.name}" from the category list.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete category',
    });

    if (!result.isConfirmed) return;

    const { error } = await supabase
      .from('video_categories')
      .delete()
      .eq('id', category.id);

    if (error) {
      Swal.fire('Delete failed', error.message, 'error');
      return;
    }

    if (String(selectedCategoryId) === String(category.id)) {
      setSelectedCategoryId('all');
    }
    await fetchCategories?.();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  useEffect(() => {
    if (!videos) {
      fetchWorksData();
    }
  }, [editData, videos]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategoryId, displayVideos.length]);

  const totalPages = Math.ceil(Math.max(visibleVideos.length, 1) / itemsPerPage);
  const displayedItems = visibleVideos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalVideos = displayVideos.length;
  const activeCategoriesCount = categories.length;

  const latestEntry = displayVideos.reduce((latest, video) => {
    if (!video?.created_at) return latest;
    if (!latest) return video;
    return new Date(video.created_at) > new Date(latest.created_at)
      ? video
      : latest;
  }, null);

  const latestVideoDate = latestEntry
    ? formatDate(latestEntry.created_at)
    : 'Awaiting upload';

  return (
    <div className="space-y-10 text-white">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(129,125,255,0.18),_transparent)] bg-black/70 backdrop-blur-sm">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2000)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(12px)',
          }}
        />
        <div className="relative z-10 p-10 md:p-14">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-5">
              <p className="text-sm font-mono uppercase tracking-[0.45em] text-white/60">
                Portfolio Control Room
              </p>
              <h2 className="text-4xl font-black uppercase tracking-tight text-white md:text-6xl">
                Visual Works Library
              </h2>
              <p className="text-lg text-white/70">
                Curate, refine and showcase your production catalogue with a cinematic professional workspace.
              </p>
            </div>
            <div className="grid min-w-[260px] grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.35em] text-white/60">Total Works</p>
                <p className="mt-2 text-3xl font-bold text-white">{totalVideos}</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.35em] text-white/60">Active Categories</p>
                <p className="mt-2 text-3xl font-bold text-white">{activeCategoriesCount}</p>
              </div>
              <div className="col-span-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.35em] text-white/60">Latest Publish</p>
                <p className="mt-2 text-xl font-semibold text-white">{latestVideoDate}</p>
              </div>
              <div className="col-span-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onAddWork}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:shadow-lg"
                >
                  <Plus size={18} />
                  Add Video
                </button>
                <button
                  type="button"
                  onClick={openAddCategory}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  <FolderPlus size={18} />
                  Add Category
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="rounded-3xl border border-white/10 bg-black/80 p-5 shadow-[0_0_30px_rgba(0,0,0,0.25)]">
          <div className="mb-4">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.35em] text-red-300">
                Categories
              </p>
              <h3 className="mt-1 text-xl font-bold text-white">Organize Works</h3>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              type="button"
              onClick={() => setSelectedCategoryId('all')}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedCategoryId === 'all'
                  ? 'bg-white text-black'
                  : 'border border-white/15 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              All ({displayVideos.length})
            </button>
            {categories.map((category) => {
              const count = displayVideos.filter(
                (video) => String(video.category_id) === String(category.id)
              ).length;

              return (
                <div
                  key={category.id}
                  className={`flex shrink-0 items-center overflow-hidden rounded-full border transition ${
                    String(selectedCategoryId) === String(category.id)
                      ? 'border-white bg-white text-black'
                      : 'border-white/15 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedCategoryId(String(category.id))}
                    className="px-4 py-2 text-sm font-semibold"
                  >
                    {category.name} ({count})
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditCategory(category)}
                    className="border-l border-current/15 px-3 py-2 transition hover:bg-black/10"
                    aria-label={`Edit ${category.name}`}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteCategory(category)}
                    className="border-l border-current/15 px-3 py-2 transition hover:bg-red-500/20"
                    aria-label={`Delete ${category.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {visibleVideos.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {displayedItems.map((item, index) => (
            <div
              key={item.id || index}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/15 via-black/40 to-black/80 shadow-[0_0_30px_rgba(0,0,0,0.35)] transition-all duration-300 hover:border-purple-500/50 hover:shadow-[0_0_50px_rgba(126,87,255,0.25)]"
            >
              <div
                onClick={() => setSelectedVideo(item)}
                className="relative h-60 w-full cursor-pointer overflow-hidden"
              >
                <Image
                  src={
                    item.thumbnail_url && !item.thumbnail_url.includes('example.com')
                      ? item.thumbnail_url
                      : '/placeholder-work.jpg'
                  }
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />
                <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white">
                  <Play size={14} className="fill-white text-white" />
                  Video
                </div>
                <div className="absolute top-4 right-4 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold capitalize text-white/80 backdrop-blur">
                  {getCategoryName(item)}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVideo(item);
                  }}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition-all duration-300 hover:bg-white/25"
                >
                  Play
                </button>
              </div>

              <div className="relative space-y-5 p-6">
                <h3 className="min-h-[64px] text-2xl font-semibold leading-tight text-white line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-white/60">
                  {item.description
                    ? `${item.description.slice(0, 140)}${
                        item.description.length > 140 ? '…' : ''
                      }`
                    : 'No description provided for this entry.'}
                </p>

                {item.created_at && (
                  <div className="flex items-center gap-3 text-sm text-white/50">
                    <Calendar size={16} />
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedVideo(item)}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/20 hover:border-white/25"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditData(item)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-purple-500/35 bg-purple-500/20 px-4 py-2 text-sm font-semibold text-purple-100 transition-all duration-300 hover:bg-purple-500/30"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => itemDelete(item)}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-500/35 bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-200 transition-all duration-300 hover:bg-red-500/30"
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
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/8 via-black/70 to-black/90 py-20 text-center">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  'url(https://images.unsplash.com/photo-1525182008055-f88b95ff7980?q=80&w=2000)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(10px)',
              }}
            />
            <div className="relative z-10 flex flex-col items-center justify-center space-y-4 px-6">
              <div className="inline-flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur">
                <Play size={36} className="text-white/60" />
              </div>
              <h3 className="text-3xl font-bold text-white">
                {displayVideos.length > 0 ? 'No Works In This Category' : 'No Works Uploaded Yet'}
              </h3>
              <p className="max-w-xl text-base text-white/60">
                {displayVideos.length > 0
                  ? 'Add the first video to this category.'
                  : 'Begin your cinematic archive by adding your first production. Use the Add Video button above to upload videos with thumbnails, categories and descriptions.'}
              </p>
              <button
                type="button"
                onClick={() =>
                  onAddWork?.(selectedCategoryId === 'all' ? '' : selectedCategoryId)
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:shadow-lg"
              >
                <Plus size={18} />
                Add Video
              </button>
            </div>
          </div>
        )
      )}

      {totalPages > 1 && visibleVideos.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/70 transition-all duration-300 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`h-10 w-10 rounded-full text-sm font-semibold transition-all duration-300 ${
                  currentPage === idx + 1
                    ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-[0_0_20px_rgba(126,87,255,0.4)]'
                    : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/70 transition-all duration-300 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {selectedVideo && (
        <VideoPlayer video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}

      <Modal
        open={isCategoryModalOpen}
        centered
        width={520}
        onCancel={closeCategoryModal}
        footer={[
          <Button key="cancel" onClick={closeCategoryModal} disabled={categorySaving}>
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            loading={categorySaving}
            onClick={saveCategory}
            className="bg-gradient-to-r from-purple-600 to-blue-600"
          >
            {editingCategory ? 'Update Category' : 'Add Category'}
          </Button>,
        ]}
      >
        <div className="py-2">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            {editingCategory ? 'Edit Category' : 'Add Category'}
          </h2>
          <p className="mb-5 text-sm text-gray-500">
            Set the category title and the video used for its Works card.
          </p>

          {categoryError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {categoryError}
            </div>
          )}

          <label className="mb-1 block text-sm font-medium text-gray-700">
            Category Name
          </label>
          <input
            value={categoryName}
            onChange={(event) => setCategoryName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                saveCategory();
              }
            }}
            placeholder="Commercial"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <div className="mt-5">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Upload Video
            </label>
            <input
              id="category-carousel-video"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleCategoryVideoSelect}
            />
            <label
              htmlFor="category-carousel-video"
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-7 transition hover:border-purple-400 hover:bg-gray-100"
            >
              <Upload size={28} className="text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">
                {categoryVideoFile
                  ? categoryVideoFile.name
                  : editingCategory
                    ? 'Upload replacement video'
                    : 'Upload video'}
              </span>
              <span className="text-xs text-gray-400">
                Used as the category card preview. Max 500MB.
              </span>
            </label>

            {editingCategory?.carousel_video_url && !categoryVideoFile && (
              <a
                href={editingCategory.carousel_video_url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 block text-xs font-medium text-blue-600 underline"
              >
                Current video saved
              </a>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WorksList;
