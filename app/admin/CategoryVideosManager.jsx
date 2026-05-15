"use client";

import { useEffect, useMemo, useState } from "react";
import { Film, Pencil, Play, Plus, RefreshCw, Trash2, Upload } from "lucide-react";
import Swal from "sweetalert2";
import { supabase } from "@/lib/supabaseClient";

const VIDEO_BUCKET = "work-videos";
const THUMBNAIL_BUCKET = "thumbnails";
const CATEGORY_VIDEO_BUCKET = "carousel-videos";
const MAX_VIDEO_SIZE = 500 * 1024 * 1024;
const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024;
const preferredCategoryOrder = [1, 4, 18, 14, 16];

const initialForm = {
  title: "",
  video_url: "",
  thumbnail_url: "",
  category_id: "",
};

const initialCategoryForm = {
  name: "",
  carousel_video_url: "",
};

const convertDriveLinkToPreview = (url = "") => {
  const fileId = url.match(/\/file\/d\/([^/]+)/)?.[1];
  return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : url;
};

const sortCategories = (categories) => [
  ...preferredCategoryOrder
    .map((id) => categories.find((category) => category.id === id))
    .filter(Boolean),
  ...categories.filter((category) => !preferredCategoryOrder.includes(category.id)),
];

const CategoryVideosManager = () => {
  const [categories, setCategories] = useState([]);
  const [videos, setVideos] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editCategoryData, setEditCategoryData] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [categoryFormData, setCategoryFormData] = useState(initialCategoryForm);
  const [videoFile, setVideoFile] = useState(null);
  const [categoryVideoFile, setCategoryVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const selectedCategory = categories.find(
    (category) => String(category.id) === String(selectedCategoryId)
  );

  const visibleVideos = useMemo(
    () =>
      videos.filter(
        (video) => String(video.category_id) === String(selectedCategoryId)
      ),
    [videos, selectedCategoryId]
  );

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const [{ data: categoriesData, error: categoriesError }, { data: videosData, error: videosError }] =
        await Promise.all([
          supabase.from("video_categories").select("*").order("id", { ascending: true }),
          supabase.from("videos").select("*").order("created_at", { ascending: false }),
        ]);

      if (categoriesError) throw categoriesError;
      if (videosError) throw videosError;

      const sortedCategories = sortCategories(categoriesData || []);
      setCategories(sortedCategories);
      setVideos(videosData || []);

      if (!selectedCategoryId && sortedCategories.length > 0) {
        setSelectedCategoryId(String(sortedCategories[0].id));
      }
    } catch (err) {
      console.error("Error loading category videos:", err);
      setError(err.message || "Unable to load category videos.");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = (categoryId = selectedCategoryId) => {
    setEditData(null);
    setFormData({
      ...initialForm,
      category_id: categoryId ? String(categoryId) : "",
    });
    setVideoFile(null);
    setThumbnailFile(null);
    setThumbnailPreview("");
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (video) => {
    setEditData(video);
    setFormData({
      title: video.title || "",
      video_url: video.video_url || "",
      thumbnail_url: video.thumbnail_url || "",
      category_id: video.category_id ? String(video.category_id) : "",
    });
    setVideoFile(null);
    setThumbnailFile(null);
    setThumbnailPreview(video.thumbnail_url || "");
    setError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditData(null);
    setFormData(initialForm);
    setVideoFile(null);
    setThumbnailFile(null);
    setThumbnailPreview("");
    setError("");
  };

  const openAddCategoryModal = () => {
    setEditCategoryData(null);
    setCategoryFormData(initialCategoryForm);
    setCategoryVideoFile(null);
    setError("");
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (category = selectedCategory) => {
    if (!category) return;

    setEditCategoryData(category);
    setCategoryFormData({
      name: category.name || "",
      carousel_video_url: category.carousel_video_url || "",
    });
    setCategoryVideoFile(null);
    setError("");
    setIsCategoryModalOpen(true);
  };

  const closeCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setEditCategoryData(null);
    setCategoryFormData(initialCategoryForm);
    setCategoryVideoFile(null);
    setError("");
  };

  const handleVideoSelect = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setError("Please select a video file.");
      return;
    }

    if (file.size > MAX_VIDEO_SIZE) {
      setError("Video file should be less than 500MB.");
      return;
    }

    setVideoFile(file);
    setError("");
  };

  const handleCategoryVideoSelect = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setError("Please select a video file.");
      return;
    }

    if (file.size > MAX_VIDEO_SIZE) {
      setError("Video file should be less than 500MB.");
      return;
    }

    setCategoryVideoFile(file);
    setError("");
  };

  const handleThumbnailSelect = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file for the cover.");
      return;
    }

    if (file.size > MAX_THUMBNAIL_SIZE) {
      setError("Cover image should be less than 5MB.");
      return;
    }

    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
    setError("");
  };

  const uploadFile = async (bucket, file, prefix) => {
    if (!file) return "";

    const fileExt = file.name.split(".").pop();
    const fileName = `${prefix}-${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSave = async () => {
    setError("");

    if (!formData.title.trim()) {
      setError("Please enter a video title.");
      return;
    }

    if (!formData.category_id) {
      setError("Please select a category.");
      return;
    }

    if (!editData && !videoFile && !formData.video_url) {
      setError("Please upload a video or paste a video URL.");
      return;
    }

    if (!editData && !thumbnailFile && !formData.thumbnail_url) {
      setError("Please upload a cover image.");
      return;
    }

    setSaving(true);

    try {
      const uploadedVideoUrl = videoFile
        ? await uploadFile(VIDEO_BUCKET, videoFile, "work-video")
        : convertDriveLinkToPreview(formData.video_url);
      const uploadedThumbnailUrl = thumbnailFile
        ? await uploadFile(THUMBNAIL_BUCKET, thumbnailFile, "work-cover")
        : formData.thumbnail_url;

      const videoData = {
        title: formData.title.trim(),
        video_url: uploadedVideoUrl,
        thumbnail_url: uploadedThumbnailUrl,
        category_id: Number(formData.category_id),
      };

      const { data, error: saveError } = editData
        ? await supabase
            .from("videos")
            .update(videoData)
            .eq("id", editData.id)
            .select()
        : await supabase.from("videos").insert(videoData).select();

      if (saveError) throw saveError;

      const savedVideo = data?.[0] || { ...editData, ...videoData };

      setVideos((current) => {
        if (editData) {
          return current.map((video) =>
            video.id === editData.id ? savedVideo : video
          );
        }

        return [savedVideo, ...current];
      });

      setSelectedCategoryId(String(videoData.category_id));
      closeModal();

      Swal.fire({
        title: "Saved",
        text: `"${videoData.title}" has been updated.`,
        icon: "success",
        timer: 1600,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error saving category video:", err);
      setError(err.message || "Unable to save category video.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (video) => {
    const result = await Swal.fire({
      title: "Delete this video?",
      text: `This removes only "${video.title}" from ${selectedCategory?.name || "this category"}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete video",
    });

    if (!result.isConfirmed) return;

    const { error: deleteError } = await supabase
      .from("videos")
      .delete()
      .eq("id", video.id);

    if (deleteError) {
      Swal.fire("Delete failed", deleteError.message, "error");
      return;
    }

    setVideos((current) => current.filter((item) => item.id !== video.id));
  };

  const handleSaveCategory = async () => {
    setError("");

    if (!categoryFormData.name.trim()) {
      setError("Please enter a category title.");
      return;
    }

    setSaving(true);

    try {
      const uploadedCategoryVideoUrl = categoryVideoFile
        ? await uploadFile(CATEGORY_VIDEO_BUCKET, categoryVideoFile, "category-card")
        : categoryFormData.carousel_video_url;

      const categoryData = {
        name: categoryFormData.name.trim(),
        carousel_video_url: uploadedCategoryVideoUrl || null,
      };

      const { data, error: saveError } = editCategoryData
        ? await supabase
            .from("video_categories")
            .update(categoryData)
            .eq("id", editCategoryData.id)
            .select()
        : await supabase.from("video_categories").insert(categoryData).select();

      if (saveError) throw saveError;

      const savedCategory = data?.[0] || { ...editCategoryData, ...categoryData };

      setCategories((current) => {
        const categoryExists = current.some((category) => category.id === savedCategory.id);
        const nextCategories = categoryExists
          ? current.map((category) =>
              category.id === savedCategory.id ? savedCategory : category
            )
          : [...current, savedCategory];

        return sortCategories(nextCategories);
      });

      setSelectedCategoryId(String(savedCategory.id));
      closeCategoryModal();
    } catch (err) {
      console.error("Error saving Works category card:", err);
      setError(err.message || "Unable to save category.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (category = selectedCategory) => {
    if (!category) return;

    const result = await Swal.fire({
      title: "Delete this category?",
      text: `This removes "${category.name}" from Works. Individual videos with this category id may no longer appear on the public site.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete category",
    });

    if (!result.isConfirmed) return;

    const { error: deleteError } = await supabase
      .from("video_categories")
      .delete()
      .eq("id", category.id);

    if (deleteError) {
      Swal.fire("Delete failed", deleteError.message, "error");
      return;
    }

    setCategories((current) => {
      const nextCategories = current.filter((item) => item.id !== category.id);
      setSelectedCategoryId(nextCategories[0] ? String(nextCategories[0].id) : "");
      return nextCategories;
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-black via-slate-950 to-black p-6 text-white shadow-xl">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.4em] text-red-400">
            Works Manager
          </p>
          <h2 className="mt-2 text-3xl font-black text-white">
            Videos Inside Works Categories
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-white/60">
            Edit one specific video card inside Commercial, Digital Content, or any other category.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={fetchData}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => openAddModal()}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:shadow-lg"
          >
            <Plus size={18} />
            Add Video
          </button>
          <button
            type="button"
            onClick={openAddCategoryModal}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            <Film size={16} />
            Add Category
          </button>
        </div>
      </div>

      {error && !isModalOpen && !isCategoryModalOpen && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => {
          const isSelected = String(category.id) === String(selectedCategoryId);
          const count = videos.filter(
            (video) => String(video.category_id) === String(category.id)
          ).length;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategoryId(String(category.id))}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                isSelected
                  ? "bg-white text-black"
                  : "border border-white/15 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {category.name} ({count})
            </button>
          );
        })}
      </div>

      {selectedCategory && (
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.3em] text-white/40">
                Selected Category
              </p>
              <h3 className="mt-1 text-2xl font-bold text-white">
                {selectedCategory.name}
              </h3>
              <p className="mt-1 text-sm text-white/50">
                Controls /works/{selectedCategory.id} and the main Works category card title.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => openEditCategoryModal()}
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                <Pencil size={16} />
                Edit Category Card
              </button>
              <button
                type="button"
                onClick={() => handleDeleteCategory()}
                className="inline-flex items-center gap-2 rounded-lg border border-red-400/40 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-500/25"
              >
                <Trash2 size={16} />
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p className="py-10 text-center text-sm text-white/50">Loading videos...</p>
      ) : !selectedCategory ? (
        <div className="rounded-2xl border border-dashed border-white/15 py-12 text-center text-white/50">
          No categories found.
        </div>
      ) : visibleVideos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 py-12 text-center">
          <p className="text-white/60">No videos inside {selectedCategory.name} yet.</p>
          <button
            type="button"
            onClick={() => openAddModal(selectedCategory.id)}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black"
          >
            <Plus size={18} />
            Add First Video
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleVideos.map((video, index) => (
            <div
              key={video.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
            >
              <div className="relative aspect-video bg-black">
                {video.thumbnail_url ? (
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.25em] text-white/35">
                    No Cover
                  </div>
                )}
                <div className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white">
                  #{index + 1}
                </div>
                <a
                  href={video.video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition hover:opacity-100"
                >
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-black">
                    <Play size={24} fill="currentColor" />
                  </span>
                </a>
              </div>

              <div className="space-y-4 p-4">
                <div>
                  <h3 className="line-clamp-2 text-lg font-bold text-white">
                    {video.title}
                  </h3>
                  <p className="mt-1 text-xs text-white/45">
                    {selectedCategory.name} video
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(video)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-purple-400/40 bg-purple-500/20 px-4 py-2 text-sm font-semibold text-purple-100 transition hover:bg-purple-500/30"
                  >
                    <Pencil size={16} />
                    Edit / Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(video)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-400/40 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-500/25"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 text-gray-900 shadow-2xl">
            <div className="mb-5">
              <h3 className="text-2xl font-bold">
                {editData ? "Edit / Replace Video" : "Add Category Video"}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                This changes one video card inside the selected Works category.
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Video Title</label>
                <input
                  value={formData.title}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  placeholder="Moonbliss"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Category</label>
                <select
                  value={formData.category_id}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      category_id: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Video File
                </label>
                <input
                  id="category-video-upload"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoSelect}
                />
                <label
                  htmlFor="category-video-upload"
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-7 transition hover:border-purple-400 hover:bg-gray-100"
                >
                  <Upload size={28} className="text-gray-400" />
                  <span className="text-sm font-semibold text-gray-700">
                    {videoFile
                      ? videoFile.name
                      : editData
                        ? "Upload replacement video"
                        : "Upload video"}
                  </span>
                  <span className="text-xs text-gray-400">
                    Original file is stored without compression. Max 500MB.
                  </span>
                </label>
                {editData?.video_url && !videoFile && (
                  <a
                    href={editData.video_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 block text-xs font-medium text-blue-600 underline"
                  >
                    Current video saved
                  </a>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Or Video URL
                </label>
                <input
                  value={formData.video_url}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      video_url: event.target.value,
                    }))
                  }
                  placeholder="Paste existing video link"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Cover Image
                </label>
                <input
                  id="category-video-cover"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleThumbnailSelect}
                />
                <label
                  htmlFor="category-video-cover"
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-7 transition hover:border-purple-400 hover:bg-gray-100"
                >
                  <Upload size={28} className="text-gray-400" />
                  <span className="text-sm font-semibold text-gray-700">
                    {thumbnailFile
                      ? thumbnailFile.name
                      : editData
                        ? "Upload replacement cover"
                        : "Upload cover image"}
                  </span>
                  <span className="text-xs text-gray-400">
                    Shown on the video card. Max 5MB.
                  </span>
                </label>

                {thumbnailPreview && (
                  <img
                    src={thumbnailPreview}
                    alt="Cover preview"
                    className="mt-3 h-40 w-full rounded-lg object-cover"
                  />
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:shadow-lg disabled:opacity-50"
              >
                {saving ? "Saving..." : editData ? "Update Video" : "Add Video"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 text-gray-900 shadow-2xl">
            <div className="mb-5">
              <h3 className="text-2xl font-bold">
                {editCategoryData ? "Edit Category Card" : "Add Category Card"}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                This controls the category title on /works. Preview video is optional.
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Category Title</label>
                <input
                  value={categoryFormData.name}
                  onChange={(event) =>
                    setCategoryFormData((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Commercial"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Optional Category Preview Video
                </label>
                <input
                  id="category-card-video"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleCategoryVideoSelect}
                />
                <label
                  htmlFor="category-card-video"
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-7 transition hover:border-purple-400 hover:bg-gray-100"
                >
                  <Upload size={28} className="text-gray-400" />
                  <span className="text-sm font-semibold text-gray-700">
                    {categoryVideoFile
                      ? categoryVideoFile.name
                      : editCategoryData
                        ? "Upload replacement preview video"
                        : "Upload preview video"}
                  </span>
                  <span className="text-xs text-gray-400">
                    Optional fallback for the main Works carousel card. Max 500MB.
                  </span>
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeCategoryModal}
                disabled={saving}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCategory}
                disabled={saving}
                className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:shadow-lg disabled:opacity-50"
              >
                {saving ? "Saving..." : editCategoryData ? "Update Category" : "Add Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CategoryVideosManager;
