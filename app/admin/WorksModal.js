"use client";
import { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import { Upload } from "lucide-react";
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
const MAX_VIDEO_SIZE = 500 * 1024 * 1024;

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

  const handleClose = () => {
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
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
      setError("Please select a video file.");
      return;
    }

    if (file.size > MAX_VIDEO_SIZE) {
      setError("Video file should be less than 500MB.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoPreviewUrl(previewUrl);
    setError("");
  };

  const handleRemoveSelectedVideo = () => {
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    setVideoFile(null);
    setVideoPreviewUrl("");
    setError("");
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        return;
      }

      setThumbnailFile(file);
      setError("");

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadVideo = async () => {
    if (!videoFile) return "";

    setUploading(true);
    setUploadProgress(0);
    try {
      return await uploadResumableFile({
        bucket: VIDEO_BUCKET,
        file: videoFile,
        prefix: "work-video",
        onProgress: setUploadProgress,
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const uploadThumbnail = async () => {
    if (!thumbnailFile) return formData.thumbnail_url; // Return existing URL if no new file

    setUploading(true);
    try {
      // Generate unique filename
      const fileExt = thumbnailFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { error } = await supabase.storage
        .from('thumbnails')
        .upload(filePath, thumbnailFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const { data } = supabase.storage
        .from('thumbnails')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (err) {
      console.error('Upload error:', err);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    setError("");

    const title = formData.title.trim();
    const categoryId = normalizeFormValue(formData.category_id, "category_id").trim();

    if (!title) {
      setError("Please enter a video title.");
      return;
    }

    if (!categoryId) {
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

    try {
      const category_id = categoryId;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("User is not authenticated.");

      const uploadedVideoUrl = videoFile
        ? await uploadVideo()
        : editData?.video_url || "";
      let thumbnailUrl = formData.thumbnail_url;

      if (thumbnailFile) {
        thumbnailUrl = await uploadThumbnail();
        if (!thumbnailUrl) throw new Error("Thumbnail upload failed.");
      }

      const videoData = { title, video_url: uploadedVideoUrl, thumbnail_url: thumbnailUrl, category_id };

      const { error } = editData
        ? await supabase.from("videos").update(videoData).eq("id", editData.id)
        : await supabase.from("videos").insert(videoData).select();

      if (error) throw error;

      handleClose();
      fetchWorks(); // Refresh the videos list
    } catch (err) {
      setError(err.message || "Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) fetchCategories?.();

    if (editData) {
      setFormData({
        title: editData.title || "",
        video_url: editData.video_url || "",
        thumbnail_url: editData.thumbnail_url || "",
        category_id: editData.category_id || "",
      });
      setPreviewUrl(editData.thumbnail_url || "");
      setVideoFile(null);
    } else if (isModalOpen) {
      setFormData({
        ...initialState,
        category_id: defaultCategoryId ? String(defaultCategoryId) : "",
      });
      setVideoFile(null);
      setThumbnailFile(null);
      setPreviewUrl("");
    }
  }, [defaultCategoryId, editData, isModalOpen]);

  return (
    <>

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
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {editData ? "Edit Portfolio Video" : "Add New Portfolio Video"}
          </h2>
          <p className="text-gray-500 text-sm mb-6">Upload your production work to showcase your portfolio</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

        <form className="grid grid-cols-1 gap-4">
          <InputField
            label="Video Title"
            value={formData.title}
            onValueChange={(val) => handleChange(val, "title")}
            placeholder="Enter video title"
          />

          <div>
            <label className="block text-sm font-medium mb-1">Upload Video</label>

            <input
              type="file"
              accept="video/*"
              onChange={handleVideoFileSelect}
              className="hidden"
              id="portfolio-video-upload"
            />

            <label
              htmlFor="portfolio-video-upload"
              className="w-full border-2 border-dashed border-gray-300 px-4 py-7 rounded-lg bg-gray-50 hover:bg-gray-100 hover:border-purple-400 transition-all duration-200 flex flex-col items-center justify-center gap-2 cursor-pointer"
            >
              <Upload size={30} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-600">
                {videoFile ? videoFile.name : "Click to Upload Video"}
              </span>
              <span className="text-xs text-gray-400">
                Direct upload only. Max 500MB.
              </span>
            </label>

            {videoFile && (
              <div className="mt-3 flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-medium text-gray-700">Selected file:</span>
                  <span className="text-gray-600 truncate">{videoFile.name}</span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveSelectedVideo}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                >
                  Remove
                </button>
                {videoPreviewUrl && (
                  <div className="rounded-lg overflow-hidden border border-gray-200 bg-black">
                    <video
                      src={videoPreviewUrl}
                      controls
                      className="w-full h-48 object-cover bg-black"
                    />
                  </div>
                )}
              </div>
            )}

            {uploading && videoFile && (
              <div className="mt-3">
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="mt-2 text-xs font-medium text-gray-500">
                  Uploading video... {uploadProgress}%
                </p>
              </div>
            )}

            {editData?.video_url && !videoFile && (
              <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
                Current saved video remains until a new file is uploaded.
              </div>
            )}
          </div>
          
          {/* Category Section */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={formData.category_id}
              onChange={(e) => handleChange(e.target.value, "category_id")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Thumbnail Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="thumbnail-upload"
            />

            <label
              htmlFor="thumbnail-upload"
              className="w-full border-2 border-dashed border-gray-300 px-4 py-8 rounded-lg bg-gray-50 hover:bg-gray-100 hover:border-purple-400 transition-all duration-200 flex flex-col items-center justify-center gap-2 cursor-pointer"
            >
              <Upload size={32} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-600">
                {thumbnailFile ? thumbnailFile.name : "Click to Upload Thumbnail"}
              </span>
              <span className="text-xs text-gray-400">
                Recommended: 1920x1080 or 16:9 aspect ratio (Max 5MB)
              </span>
            </label>

            {previewUrl && (
              <div className="mt-4 relative rounded-lg overflow-hidden border-2 border-green-500">
                <Image
                  src={previewUrl}
                  alt="Thumbnail preview"
                  className="w-full h-48 object-cover"
                  width={500}
                  height={300}
                />
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  ✓ Preview
                </div>
              </div>
            )}
          </div>
        </form>
        </div>
      </Modal>
    </>
  );
};

export default WorksModal;
