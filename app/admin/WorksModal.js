"use client";

import { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import { Upload, X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { uploadResumableFile } from "@/lib/supabaseResumableUpload";
import InputField from "@/components/utilities/InputField";
import Image from "next/image";

const initialState = {
  title: "",
  thumbnail_url: "",
  category_id: "",
};

const VIDEO_BUCKET = "work-videos";
const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB
const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024; // 5MB

const WorksModal = ({
  editData,
  setEditData,
  fetchWorks,
  isModalOpen,
  setIsModalOpen,
  categories = [],
  fetchCategories,
  defaultCategoryId = "",
  setDefaultCategoryId,
}) => {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState("");
  const [videoPreviewUrl, setVideoPreviewUrl] = useState("");

  const normalizeFormValue = (value, field) => {
    if (field === "category_id") {
      if (value == null) return "";
      if (typeof value === "object") {
        return value.id ?? value.value ?? "";
      }
      return String(value);
    }
    return value;
  };

  const handleChange = (val, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: normalizeFormValue(val, field),
    }));
  };

  const clearBlobUrls = () => {
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
  };

  const handleClose = () => {
    clearBlobUrls();
    setIsModalOpen(false);
    setFormData(initialState);
    setVideoFile(null);
    setThumbnailFile(null);
    setUploadProgress(0);
    setPreviewUrl("");
    setVideoPreviewUrl("");
    setError("");
    setDefaultCategoryId?.("");
    setEditData?.(null);
  };

  const handleVideoFileSelect = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setError("Please select a valid video file.");
      return;
    }

    if (file.size > MAX_VIDEO_SIZE) {
      setError("Video file size must be under 500MB.");
      return;
    }

    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);

    setVideoFile(file);
    setVideoPreviewUrl(URL.createObjectURL(file));
    setError("");
  };

  const handleRemoveSelectedVideo = () => {
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    setVideoFile(null);
    setVideoPreviewUrl("");
  };

  const handleThumbnailFileSelect = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > MAX_THUMBNAIL_SIZE) {
      setError("Thumbnail image size must be under 5MB.");
      return;
    }

    setThumbnailFile(file);
    setError("");

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadVideo = async () => {
    if (!videoFile) return editData?.video_url || "";

    return await uploadResumableFile({
      bucket: VIDEO_BUCKET,
      file: videoFile,
      prefix: "work-video",
      onProgress: setUploadProgress,
    });
  };

  const uploadThumbnail = async () => {
    if (!thumbnailFile) return formData.thumbnail_url;

    const fileExt = thumbnailFile.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("thumbnails")
      .upload(filePath, thumbnailFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("thumbnails")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async () => {
    setError("");

    const title = formData.title.trim();
    const category_id = normalizeFormValue(formData.category_id, "category_id").trim();

    if (!title) {
      setError("Please enter a video title.");
      return;
    }

    if (!category_id) {
      setError("Please select a category.");
      return;
    }

    if (!videoFile && !editData?.video_url) {
      setError("Please upload a video file.");
      return;
    }

    if (!thumbnailFile && !formData.thumbnail_url) {
      setError("Please select a thumbnail image.");
      return;
    }

    setLoading(true);
    setUploading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("User session expired. Please sign in again.");

      // Run uploads concurrently
      const [uploadedVideoUrl, uploadedThumbnailUrl] = await Promise.all([
        uploadVideo(),
        uploadThumbnail(),
      ]);

      if (!uploadedVideoUrl) throw new Error("Video upload failed.");
      if (!uploadedThumbnailUrl) throw new Error("Thumbnail upload failed.");

      const videoPayload = {
        title,
        video_url: uploadedVideoUrl,
        thumbnail_url: uploadedThumbnailUrl,
        category_id,
      };

      const { error: dbError } = editData
        ? await supabase.from("videos").update(videoPayload).eq("id", editData.id)
        : await supabase.from("videos").insert(videoPayload);

      if (dbError) throw dbError;

      handleClose();
      fetchWorks?.();
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      fetchCategories?.();

      if (editData) {
        setFormData({
          title: editData.title || "",
          thumbnail_url: editData.thumbnail_url || "",
          category_id: editData.category_id || "",
        });
        setPreviewUrl(editData.thumbnail_url || "");
      } else {
        setFormData({
          ...initialState,
          category_id: defaultCategoryId ? String(defaultCategoryId) : "",
        });
        setPreviewUrl("");
      }

      setVideoFile(null);
      setThumbnailFile(null);
      setVideoPreviewUrl("");
      setError("");
    }

    return () => {
      clearBlobUrls();
    };
  }, [defaultCategoryId, editData, isModalOpen]);

  return (
    <Modal
      open={isModalOpen}
      centered
      onCancel={handleClose}
      width={600}
      footer={[
        <Button key="cancel" onClick={handleClose} size="large" disabled={loading || uploading}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading || uploading}
          size="large"
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-none"
          onClick={handleSubmit}
        >
          {uploading ? "Uploading..." : loading ? "Saving..." : editData ? "Update Video" : "Add Video"}
        </Button>,
      ]}
    >
      <div className="py-2">
        <h2 className="text-2xl font-bold mb-1 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          {editData ? "Edit Portfolio Video" : "Add New Portfolio Video"}
        </h2>
        <p className="text-gray-500 text-sm mb-5">
          Upload your production work to showcase in your portfolio
        </p>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <InputField
            label="Video Title"
            value={formData.title}
            onValueChange={(val) => handleChange(val, "title")}
            placeholder="Enter video title"
          />

          {/* Video Upload Section */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Video File</label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoFileSelect}
              className="hidden"
              id="portfolio-video-upload"
            />

            <label
              htmlFor="portfolio-video-upload"
              className="w-full border-2 border-dashed border-gray-300 px-4 py-6 rounded-lg bg-gray-50 hover:bg-gray-100 hover:border-purple-400 transition-all duration-200 flex flex-col items-center justify-center gap-2 cursor-pointer"
            >
              <Upload size={28} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-600 truncate max-w-full px-2">
                {videoFile ? videoFile.name : "Click to select video"}
              </span>
              <span className="text-xs text-gray-400">MP4, MOV, WebM up to 500MB</span>
            </label>

            {videoFile && (
              <div className="mt-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 truncate">{videoFile.name}</span>
                  <button
                    type="button"
                    onClick={handleRemoveSelectedVideo}
                    className="text-xs text-red-500 hover:text-red-700 font-medium inline-flex items-center gap-1"
                  >
                    <X size={14} /> Remove
                  </button>
                </div>
                {videoPreviewUrl && (
                  <div className="rounded-lg overflow-hidden border border-gray-200 bg-black">
                    <video
                      src={videoPreviewUrl}
                      controls
                      className="w-full h-44 object-contain bg-black"
                    />
                  </div>
                )}
              </div>
            )}

            {uploading && videoFile && (
              <div className="mt-3">
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-150"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="mt-1 text-xs font-medium text-gray-500">
                  Uploading video... {uploadProgress}%
                </p>
              </div>
            )}

            {editData?.video_url && !videoFile && (
              <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-600">
                Current video linked. Choose a file above only if replacing.
              </div>
            )}
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Category</label>
            <select
              value={formData.category_id}
              onChange={(e) => handleChange(e.target.value, "category_id")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Thumbnail Section */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Thumbnail Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailFileSelect}
              className="hidden"
              id="thumbnail-upload"
            />

            <label
              htmlFor="thumbnail-upload"
              className="w-full border-2 border-dashed border-gray-300 px-4 py-6 rounded-lg bg-gray-50 hover:bg-gray-100 hover:border-purple-400 transition-all duration-200 flex flex-col items-center justify-center gap-2 cursor-pointer"
            >
              <Upload size={28} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-600 truncate max-w-full px-2">
                {thumbnailFile ? thumbnailFile.name : "Click to select thumbnail"}
              </span>
              <span className="text-xs text-gray-400">16:9 ratio recommended (Max 5MB)</span>
            </label>

            {previewUrl && (
              <div className="mt-3 relative rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={previewUrl}
                  alt="Thumbnail preview"
                  className="w-full h-40 object-cover"
                  width={500}
                  height={280}
                  unoptimized
                />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded">
                  Preview
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WorksModal;