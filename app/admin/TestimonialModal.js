"use client";
import { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import { PlusCircle } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { supabase } from "@/lib/supabaseClient";
import InputField from "@/components/utilities/InputField";
import Image from "next/image";

const initialState = {
  name: "",
  message: "",
  iglink: "",
  profession: "",
  image_url: "",
};

const TestimonialModal = ({ editData, setEditData }) => {
  const [formData, setFormData] = useState(initialState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (val, field) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setFormData(initialState);
    setError("");
    setEditData?.(null);
  };

  const handleSubmit = async () => {
    setError("");

    const { name, message, profession, image_url } = formData;
    if (!name || !message || !profession || !image_url) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        setError("User is not authenticated.");
        return;
      }

      const query = editData
        ? supabase.from("testimonials").update(formData).eq("id", editData.id)
        : supabase.from("testimonials").insert([formData]);

      const { error: dbError } = await query;

      if (dbError) {
        setError("Failed to save testimonial.");
        console.error(dbError);
      } else {
        handleClose();
        setEditData(false)
      }
    } catch (err) {
      console.error(err);
      setError("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editData) {
      setFormData(editData);
      setIsModalOpen(true);
    }
  }, [editData]);

  return (
    <>
      <PlusCircle
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer"
        size={24}
      />

      <Modal
        open={isModalOpen}
        centered
        onCancel={handleClose}
        footer={[
          <Button key="cancel" onClick={handleClose}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            className="bg-blue-600 text-white"
            onClick={handleSubmit}
          >
            {editData ? "Update" : "Add"}
          </Button>,
        ]}
      >
        <h2 className="text-xl font-bold mb-4">
          {editData ? "Edit Testimonial" : "Add New Testimonial"}
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form className="grid grid-cols-1 gap-4">
          <InputField
            label="Name"
            value={formData.name}
            onValueChange={(val) => handleChange(val, "name")}
            placeholder="Enter name"
          />
          <InputField
            label="Profession"
            value={formData.profession}
            onValueChange={(val) => handleChange(val, "profession")}
            placeholder="Enter profession"
          />
          <InputField
            label="Instagram Link (optional)"
            value={formData.iglink}
            onValueChange={(val) => handleChange(val, "iglink")}
            placeholder="https://instagram.com/..."
          />
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => handleChange(e.target.value, "message")}
              rows={3}
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter testimonial message"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Upload Image</label>
            <CldUploadWidget
              uploadPreset="ml_default"
              options={{ sources: ["local", "camera", "url"] }}
              onSuccess={(result) => {
                if (result.event === "success") {
                  setFormData((prev) => ({
                    ...prev,
                    image_url: result.info.secure_url,
                  }));
                }
              }}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  className="w-full border px-4 py-2 rounded bg-white hover:bg-gray-100"
                >
                  {formData.image_url ? "Change Image" : "Upload Image"}
                </button>
              )}
            </CldUploadWidget>
            {formData.image_url && (
              <Image
                src={formData.image_url}
                alt="Uploaded"
                className="mt-2 h-32 object-cover rounded"
                 width={200} // Adjust the width to suit your layout
                height={200}
              />
            )}
          </div>
        </form>
      </Modal>
    </>
  );
};

export default TestimonialModal;
