"use client";
import { useEffect, useMemo, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { supabase } from "@/lib/supabaseClient";
import { Button, DatePicker, Modal } from "antd";
import { PlusCircle } from "lucide-react";
import AutoCompleteInput from "./utilities/AutocompleteInput";
import InputField from "./utilities/InputField";
import { useJsonOptions } from "./hooks/useJsonOptions";
import dayjs from "dayjs";
import Image from "next/image";

const AddProductModal = ({ fetchProducts,editData,setEditData }) => {
  const formDataInitial = {
    brand: "",
    model: "",
    variant: "",
    fueltype: "",
    transmission: "",
    price: "",
    image_url: "",
    description: "",
    kilometers: "",
    year: "",
    owners: "",
    images: [],
    featured:true
  };
  const [formData, setFormData] = useState(formDataInitial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  const brandOptions = useJsonOptions("/JSON/carBrand.json");

  const modelsFullList = useJsonOptions("/JSON/carModels.json");
  const carsFullList = useJsonOptions("/JSON/carData.json");
  const carsTransmissionList = useJsonOptions("/JSON/carTransmissionOptions.json");

  const fuelOptions = [
    "Petrol",
    "CNG",
    "Mild Hybrid(Electric + Petrol)",
    "Hybrid (Electric + Petrol)",
    "Diesel",
    "Electric",
    "Mild Hybrid (Electric + Diesel)",
    "Plug-in Hybrid (Electric + Petrol)",
  ];

  const [modelsOptions, setModelsOptions] = useState(modelsFullList || []);

  const handleChange = (value, field) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    // Validate required fields
    const isFormValid = Object.values(formData).every((val) => val !== "");
    if (!isFormValid) {
      setError("Please fill in all required fields.");
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
  
      const payload = { ...formData, images: formData.images || [] };
  
      const query = editData
        ? supabase.from("cars").update(payload).eq("id", editData.id).select()
        : supabase.from("cars").insert([payload]).select();
  
      const { data, error } = await query;
  
      if (error) {
        console.error(error);
        setError("Error saving car: " + error.message);
      } else {
        fetchProducts()
        handleClose()
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleSelectChange = (value, field, label = "value") => {
    const isObject = typeof value === "object" && value !== null;
    const finalValue = isObject ? value[label] : value;

    // Base form update
    let updatedFormData = { ...formData, [field]: finalValue };

    // Field-specific logic
    if (field === "variant") {
      if (isObject) {
        updatedFormData = {
          ...updatedFormData,
          fueltype: value?.fuelType || "",
          transmission: value?.transmission || "",
          description: value?.description || "",
        };
      } else {
        updatedFormData = {
          ...updatedFormData,
          fueltype: "",
          transmission: "",
          description: "",
        };
      }
    }

    // Update state once at the end
    setFormData(updatedFormData);

    // Update models if brand is changed
    if (field === "brand") {
      const modifiedModels = modelsFullList?.filter(
        (item) => item.brand === finalValue
      );
      setModelsOptions(modifiedModels);
    }
  };

  const filteredOptions = useMemo(() => {
    return carsFullList.filter((item) => item.car === formData.model);
  }, [carsFullList, formData.model]);


  const handleClose=() =>{
    setIsModalOpen(false);
    setFormData(formDataInitial); 
    setError(""); 
    setEditData(null); 
  }


  useEffect(()=>{
    if(!editData) return;
    setFormData(editData)
    setIsModalOpen(true)
  },[editData])

  return (
    <>
      {/* Button to open the modal */}
      <PlusCircle
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer"
        size={24}
      />

      {/* Modal */}
      <Modal
        open={isModalOpen}
        centered
        onClose={handleClose}
        onCancel={handleClose}
        footer={[
          <Button key="cancel" onClick={handleClose}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? "Adding..." :editData?"Edit" :"Add Car"}
          </Button>,
        ]}
      >
        {/* <div className="bg-white p-6 rounded-lg shadow-lg w-96"> */}
        <h2 className="text-xl font-bold mb-4">Add New</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(360px,1fr))] md:grid-cols-2"
        >
          <AutoCompleteInput
            label={"Brand"}
            options={brandOptions}
            placeholder="Select car brand"
            onValueChange={(value) => handleSelectChange(value, "brand")}
            value={formData.brand}
          />
          <AutoCompleteInput
            label={"Model"}
            options={
              modelsOptions?.length === 0 ? modelsFullList : modelsOptions
            }
            placeholder="Select car brand"
            onValueChange={(value) => handleSelectChange(value, "model", "car")}
            value={formData.model}
            keyMap={{ label: "car", value: "car" }}
          />
          <AutoCompleteInput
            label={"Variant"}
            options={filteredOptions}
            placeholder="Select car variant"
            onValueChange={(value) =>
              handleSelectChange(value, "variant", "variant")
            }
            value={formData.variant}
            keyMap={{ label: "variant", value: "variant" }}
          />
          <AutoCompleteInput
            label={"Transmission"}
            options={carsTransmissionList}
            placeholder="Select transmission type"
            onValueChange={(value) => handleSelectChange(value, "transmission")}
            value={formData.transmission}
          />
          <AutoCompleteInput
            label={"Fuel Type"}
            options={fuelOptions}
            placeholder="Select fuel type"
            onValueChange={(value) => handleSelectChange(value, "fueltype")}
            value={formData.fueltype}
          />
          <div>
            <label className="block text-sm font-medium mb-2">{"Year"}</label>

            <DatePicker
              picker="year"
              style={{ width: "100%" }}
              onChange={(date, dateString) => handleChange(dateString, "year")}
              value={formData.year ? dayjs(formData.year, "YYYY") : null}
            />
          </div>

          <InputField
            label={"Price"}
            onValueChange={(value) => handleChange(value, "price")}
            value={formData.price}
            type="text"
            placeholder="Enter price in lakhs : eg:2.3L"
          />

          <AutoCompleteInput
            label={"Kilometers"}
            options={[
              "0-10000",
              "10000-20000",
              "20000-30000",
              "30000-40000",
              "40000-50000",
              "50000-60000",
              "60000-70000",
              "70000-80000",
              "80000-90000",
              "90000-100000",
              "100000+",
            ]}
            placeholder="Select kilometers"
            onValueChange={(value) => handleSelectChange(value, "kilometers")}
            value={formData.kilometers}
          />
          <AutoCompleteInput
            label={"No of owners"}
            options={["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
            placeholder="Select number of owners"
            onValueChange={(value) => handleSelectChange(value, "owners")}
            value={formData.owners}
          />
          <div>
            <label className="block text-sm font-medium">Images</label>
            <CldUploadWidget
              uploadPreset="ml_default"
              options={{ sources: ["local", "url", "camera"] }}
              onSuccess={(result) => {
                if (result.event === "success") {
                  setFormData((prev) => {
                    const newImages = [...(prev.images || [])];

                    if (newImages.length >= 3) return prev; // prevent more than 3

                    newImages.push(result.info.secure_url);

                    return {
                      ...prev,
                      images: newImages,
                      image_url: newImages[0], // always set the first image
                    };
                  });
                }
              }}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => {
                    if ((formData.images?.length || 0) < 3) open();
                  }}
                  className="w-full border p-2 rounded cursor-pointer focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
                  disabled={(formData.images?.length || 0) >= 3}
                >
                  {(formData.images?.length || 0) >= 3
                    ? "Limit Reached"
                    : "Upload Image"}
                </button>
              )}
            </CldUploadWidget>

            {formData.images?.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {formData.images.map((url, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={url}
                      alt={`Image ${index + 1}`}
                      width={200} // Adjust the width to suit your layout
                      height={200} // Adjust the height to suit your layout
                      objectFit="cover" // Ensures the image is resized correctly
                      className="rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newImages = formData.images.filter(
                          (_, i) => i !== index
                        );
                        setFormData((prev) => ({ ...prev, images: newImages }));
                      }}
                      className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 py-0.5 rounded"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) => handleChange(e.target.value, "description")}
              placeholder="Enter description"
              className="w-full px-4 py-2 border rounded-lg"
              rows="3"
            />
          </div>
        </form>
        {/* </div> */}
      </Modal>
    </>
  );
};

export default AddProductModal;
