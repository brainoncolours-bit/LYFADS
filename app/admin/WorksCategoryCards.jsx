"use client";

import { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import { Film, Pencil, Plus, RotateCcw, Trash2, Upload } from "lucide-react";
import Swal from "sweetalert2";
import { supabase } from "@/lib/supabaseClient";

const STORAGE_BUCKET = "carousel-videos";
const MAX_VIDEO_SIZE = 500 * 1024 * 1024;

const fallbackVideos = [
  "/assets/cat/comm.mp4",
  "/assets/cat/digi.mp4",
  "/assets/cat/cover photos ad.mp4",
  "/assets/cat/copo.mp4",
  "/assets/cat/aivdo.mp4",
  "/assets/cat/cover photos ad.mp4",
];

const preferredCardOrder = [1, 4, 18, 14, 16];

const initialForm = {
  name: "",
  carousel_video_url: "",
};

const WorksCategoryCards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [videoFile, setVideoFile] = useState(null);

  const fetchCards = async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error: fetchError } = await supabase
        .from("video_categories")
        .select("*")
        .order("id", { ascending: true });

      if (fetchError) throw fetchError;
      const sortedCards = [
        ...preferredCardOrder
          .map((id) => data?.find((card) => card.id === id))
          .filter(Boolean),
        ...(data || []).filter((card) => !preferredCardOrder.includes(card.id)),
      ];
      setCards(sortedCards);
    } catch (err) {
      console.error("Error fetching works category cards:", err);
      setError(err.message || "Unable to load Works category cards.");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditData(null);
    setFormData(initialForm);
    setVideoFile(null);
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (card) => {
    setEditData(card);
    setFormData({
      name: card.name || "",
      carousel_video_url: card.carousel_video_url || "",
    });
    setVideoFile(null);
    setError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditData(null);
    setFormData(initialForm);
    setVideoFile(null);
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

  const uploadVideo = async () => {
    if (!videoFile) return formData.carousel_video_url;

    const fileExt = videoFile.name.split(".").pop();
    const fileName = `category-card-${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, videoFile, {
        cacheControl: "3600",
        upsert: false,
        contentType: videoFile.type,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSave = async () => {
    setError("");

    if (!formData.name.trim()) {
      setError("Please enter a video title.");
      return;
    }

    if (!editData && !videoFile) {
      setError("Please upload a video.");
      return;
    }

    setSaving(true);

    try {
      const videoUrl = await uploadVideo();

      if (!videoUrl) {
        throw new Error("Please upload a video.");
      }

      const cardData = {
        name: formData.name.trim(),
        carousel_video_url: videoUrl,
      };

      const { error: saveError } = editData
        ? await supabase
            .from("video_categories")
            .update(cardData)
            .eq("id", editData.id)
        : await supabase.from("video_categories").insert(cardData);

      if (saveError) throw saveError;

      const savedCard = editData
        ? { ...editData, ...cardData }
        : null;

      if (savedCard) {
        setCards((current) =>
          current.map((card) => (card.id === savedCard.id ? savedCard : card))
        );
      } else {
        await fetchCards();
      }

      closeModal();
      Swal.fire({
        title: "Saved",
        text: `"${cardData.name}" has been updated.`,
        icon: "success",
        timer: 1600,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error saving Works category card:", err);
      setError(err.message || "Unable to save Works category card.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (card) => {
    const result = await Swal.fire({
      title: "Delete this card?",
      text: `This removes "${card.name}" and its /works/${card.id} category card. Use Remove Video if you only want to restore the fallback video.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete",
    });

    if (!result.isConfirmed) return;

    const { error: deleteError } = await supabase
      .from("video_categories")
      .delete()
      .eq("id", card.id);

    if (deleteError) {
      Swal.fire("Delete failed", deleteError.message, "error");
      return;
    }

    fetchCards();
  };

  const handleClearVideo = async (card) => {
    const result = await Swal.fire({
      title: "Remove uploaded video?",
      text: `"${card.name}" will return to the current fallback video.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, remove video",
    });

    if (!result.isConfirmed) return;

    const { error: updateError } = await supabase
      .from("video_categories")
      .update({ carousel_video_url: null })
      .eq("id", card.id);

    if (updateError) {
      Swal.fire("Remove failed", updateError.message, "error");
      return;
    }

    fetchCards();
  };

  useEffect(() => {
    fetchCards();
  }, []);

  return (
    <section className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-black to-slate-900 p-6 text-white shadow-xl">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 p-4 text-white shadow-lg">
            <Film size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              Works Category Cards
            </h2>
            <p className="text-sm text-white/60">
              Manage the title and video shown on the main Works carousel.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-3 font-semibold text-white transition-all hover:shadow-lg"
        >
          <Plus size={20} />
          Add Card
        </button>
      </div>

      {error && !isModalOpen && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="py-6 text-sm text-gray-500">Loading Works cards...</p>
      ) : cards.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-10 text-center">
          <p className="text-sm font-medium text-gray-600">
            No Works category cards yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {cards.map((card, index) => {
            const displayVideo = card.carousel_video_url || fallbackVideos[index % fallbackVideos.length];
            const isUploaded = Boolean(card.carousel_video_url);

            return (
            <div
              key={card.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_30px_rgba(0,0,0,0.25)]"
            >
              <div className="relative aspect-video bg-black">
                {displayVideo ? (
                  <video
                    src={displayVideo}
                    className="h-full w-full object-cover"
                    muted
                    loop
                    playsInline
                    controls
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
                    No Video
                  </div>
                )}
                <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
                  {isUploaded ? "Uploaded" : "Current"}
                </div>
              </div>

              <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h3 className="truncate text-xl font-bold text-white">
                    {card.name}
                  </h3>
                  <p className="mt-1 text-xs text-white/50">
                    Opens /works/{card.id}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => openEditModal(card)}
                    className="inline-flex items-center gap-2 border-white/15 bg-white/10 text-white hover:bg-white/20"
                  >
                    <Pencil size={16} />
                    Edit Video
                  </Button>
                  {isUploaded && (
                    <Button
                      onClick={() => handleClearVideo(card)}
                      className="inline-flex items-center gap-2 border-white/15 bg-white/10 text-white hover:bg-white/20"
                    >
                      <RotateCcw size={16} />
                      Remove Video
                    </Button>
                  )}
                  <Button
                    danger
                    onClick={() => handleDelete(card)}
                    className="inline-flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}

      <Modal
        open={isModalOpen}
        centered
        width={560}
        onCancel={closeModal}
        footer={[
          <Button key="cancel" onClick={closeModal} disabled={saving}>
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            loading={saving}
            onClick={handleSave}
            className="bg-gradient-to-r from-purple-600 to-blue-600"
          >
            {editData ? "Update Card" : "Add Card"}
          </Button>,
        ]}
      >
        <div className="py-2">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            {editData ? `Edit ${editData.name} Video` : "Add Works Card"}
          </h2>
          <p className="mb-6 text-sm text-gray-500">
            Change the title or upload a replacement video for this one card.
          </p>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Video Title
              </label>
              <input
                value={formData.name}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="Commercial"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Video
              </label>
              <input
                id="works-card-video"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleVideoSelect}
              />
              <label
                htmlFor="works-card-video"
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 transition-all hover:border-purple-400 hover:bg-gray-100"
              >
                <Upload size={30} className="text-gray-400" />
                <span className="text-sm font-semibold text-gray-700">
                  {videoFile ? videoFile.name : editData ? "Upload replacement video" : "Upload video"}
                </span>
                <span className="text-xs text-gray-400">
                  Original file is stored without compression. Max 500MB.
                </span>
              </label>

              {editData?.carousel_video_url && !videoFile && (
                <a
                  href={editData.carousel_video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block text-xs font-medium text-blue-600 underline"
                >
                  Current video saved
                </a>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default WorksCategoryCards;
