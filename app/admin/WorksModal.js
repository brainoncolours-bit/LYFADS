"use client";
import { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import { Upload } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import InputField from "@/components/utilities/InputField";
import Image from "next/image";

const initialState = {
  title: "",
  video_url: "",
  thumbnail_url: "",
};

const WorksModal = ({ editData, setEditData, fetchWorks, isModalOpen, setIsModalOpen }) => {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleChange = (val, field) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setFormData(initialState);
    setThumbnailFile(null);
    setPreviewUrl("");
    setError("");
    setEditData?.(null);
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
    setLoading(true);

    try {
      const { title, video_url } = formData;

      if (!title || !video_url) {
        throw new Error("Please fill in title and video URL.");
      }

      if (!editData && !thumbnailFile) {
        throw new Error("Please select a thumbnail image.");
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("User is not authenticated.");

      let thumbnailUrl = formData.thumbnail_url;

      if (thumbnailFile) {
        thumbnailUrl = await uploadThumbnail();
        if (!thumbnailUrl) throw new Error("Thumbnail upload failed.");
      }

      const videoData = { title, video_url, thumbnail_url: thumbnailUrl };

      const { error } = editData
        ? await supabase.from("videos").update(videoData).eq("id", editData.id)
        : await supabase.from("videos").insert(videoData).select();

      if (error) throw error;

      handleClose();
      fetchWorks(); // Refresh the videos list
    } catch (err) {
      console.error(err);
      setError(err.message || "Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title || "",
        video_url: editData.video_url || "",
        thumbnail_url: editData.thumbnail_url || "",
      });
      setPreviewUrl(editData.thumbnail_url || "");
    }
  }, [editData]);

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

        <form className="grid grid-cols-1 gap-4">
          <InputField
            label="Video Title"
            value={formData.title}
            onValueChange={(val) => handleChange(val, "title")}
            placeholder="Enter video title"
          />
          <InputField
            label="Video URL"
            value={formData.video_url}
            onValueChange={(val) => handleChange(val, "video_url")}
            placeholder="Enter video URL"
          />
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