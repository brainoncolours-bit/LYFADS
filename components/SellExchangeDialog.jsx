"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Modal, DatePicker, Button, Row, Col, message } from "antd";
import { motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { poppins } from "@/lib/font";
import Image from "next/image";
import InputField from "./utilities/InputField";
import AutoCompleteInput from "./utilities/AutocompleteInput";
import { useJsonOptions } from "./hooks/useJsonOptions";
import dayjs from "dayjs";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft } from "lucide-react";

const today = dayjs();

const MotionDiv = motion.div;

export default function SellExchangeDialog({ open, setOpen }) {
  const countryCodeList = useJsonOptions("/JSON/countryCode.json");
  const brandOptions = useJsonOptions("/JSON/carBrand.json");

  const modelsFullList = useJsonOptions("/JSON/carModels.json");
  const carsFullList = useJsonOptions("/JSON/carData.json");
  const carsTransmissionList = useJsonOptions(
    "/JSON/carTransmissionOptions.json"
  );

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
  const [messageApi, contextHolder] = message.useMessage();
  const [isMobile, setIsMobile] = useState(false);

  const formDataInitial = { type: open === "Sell" ? 0 : 1 }
  const [formData, setFormData] = useState(formDataInitial);
  
  const lenis = useLenis();
  const inputClassName = "!bg-[#1f1f1f] text-white placeholder-white hover:bg-[#1f1f1f] focus:bg-[#1f1f1f] focus:border-white focus-within:bg-[#1f1f1f] border border-transparent";
  
  // Check if device is mobile on mount and window resize
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIsMobile();
    
    // Listen for resize events
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // This function was causing scrolling issues - simplified
  useEffect(() => {
    if (open) {
      if (lenis) lenis.stop();
      // Don't manipulate DOM styles directly
    } else {
      if (lenis) lenis.start();
    }
    
    return () => {
      if (lenis) lenis.start();
    };
  }, [open, lenis]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
        };
      } else {
        updatedFormData = {
          ...updatedFormData,
          fueltype: "",
          transmission: "",
        };
      }
    }

    // Update state once at the end
    setFormData(updatedFormData);
    if (field === "brand") {
      const modifiedModels = modelsFullList?.filter(
        (item) => item.brand === finalValue
      );
      setModelsOptions(modifiedModels);
    }
  };

  const errorMessage = (message) => {
    messageApi.open({
      type: 'error',  
      content: message,
    });
  }

  const validateFormData = (formData) => {
    const {
      brand,
      model,
      variant,
      fueltype,
      transmission,
      firstName,
      lastName,
      email,
      code,
      mobile,
      year,
      kilometers,
      owners
    } = formData;

    if (!firstName?.trim()) return errorMessage("First name is required");

    // Simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return errorMessage("Enter a valid email address");
    }

    // Validate code (should start with +)
    if (!code || !code.startsWith("+")) {
      return errorMessage("Country code must start with +");
    }

    // Mobile must be numeric and at least 6 digits
    const mobileRegex = /^[0-9]{6,}$/;
    if (!mobile || !mobileRegex.test(mobile)) {
      return errorMessage("Enter a valid mobile number");
    }

    if (!brand) return errorMessage("Brand is required");
    if (!model) return errorMessage("Model is required");
    if (!variant) return errorMessage("Variant is required");
    if (!fueltype) return errorMessage("Fuel type is required");
    if (!transmission) return errorMessage("Transmission is required");
    if (!year) return errorMessage("Manufacturing year is required");
    if (!kilometers) return errorMessage("Kilometers driven is required");
    if (!owners) return errorMessage("Number of owners is required");

    // ✅ If all passed
    return true;
  };

  const handleSubmit = async () => {
    const isValid = validateFormData(formData);
    if (!isValid) return;

    const key = 'submit';

    messageApi.open({
      type: 'loading',
      content: 'Submitting your form...',
      duration: 0,
      key,
    });

    const { error } = await supabase
      .from("selldetails")
      .insert([formData]);

    if (error) {
      messageApi.open({
        type: 'error',
        content: `Submission failed: ${error.message}`,
        key,
        duration: 3,
      });
      return;
    }

    // After successful DB insert — send email
    const { email, firstName, variant } = formData;

    const subject = 'Sell Enquiry Received - Shameer Cars';
    const html = `
    <div style="background-color:#f5f5f5;padding:20px 0;font-family:Arial,sans-serif;">
      <table align="center" width="600" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
        <tr>
          <td style="text-align:center;background-color:#001529;padding:20px;">
          </td>
        </tr>
        <tr>
          <td style="padding:30px;">
            <h2 style="color:#333;">Hi ${firstName},</h2>
            <p style="font-size:16px;color:#555;">
              Thank you for showing interest in selling your <strong>${variant}</strong> with <strong>Shameer Cars</strong>.
            </p>
            <p style="font-size:16px;color:#555;">
              Our team has received your enquiry and will contact you shortly to discuss the next steps.
            </p>
            <p style="font-size:16px;color:#555;">
              Meanwhile, explore our premium car collection:
            </p>
            <p style="text-align:center;margin:30px 0;">
              <a href="https://shameercars.vercel.app/car-details" style="background-color:#1890ff;color:#fff;padding:12px 24px;border-radius:4px;text-decoration:none;font-size:16px;">
                Browse Car Collection
              </a>
            </p>
            <p style="font-size:16px;color:#555;">
              We look forward to doing business with you.
            </p>
            <p style="font-size:16px;color:#555;">Best regards,<br/>Shameer Cars Team</p>
          </td>
        </tr>
        <tr>
          <td style="background-color:#fafafa;padding:20px;text-align:center;">
            <p style="margin:0;color:#666;font-size:14px;">
              📞 <strong>+91 98765 43210</strong> &nbsp; | &nbsp; 📧 <a href="mailto:support@shameercars.in" style="color:#1890ff;text-decoration:none;">support@shameercars.in</a>
            </p>
            <p style="margin:8px 0;color:#666;font-size:14px;">
              📍 <strong>Shameer Cars</strong>, Main Road, Ernakulam, Kerala - 682001
            </p>
            <div style="margin-top:10px;">
              <a href="https://facebook.com/shameercars" style="margin:0 8px;"><img src="https://img.icons8.com/ios-filled/24/000000/facebook--v1.png" alt="Facebook" /></a>
              <a href="https://instagram.com/shameercars" style="margin:0 8px;"><img src="https://img.icons8.com/ios-filled/24/000000/instagram-new.png" alt="Instagram" /></a>
              <a href="https://wa.me/919876543210" style="margin:0 8px;"><img src="https://img.icons8.com/ios-filled/24/000000/whatsapp.png" alt="WhatsApp" /></a>
            </div>
          </td>
        </tr>
        <tr>
          <td style="background-color:#f0f0f0;text-align:center;padding:12px;color:#999;font-size:12px;">
            © ${new Date().getFullYear()} Shameer Cars. All rights reserved.
          </td>
        </tr>
      </table>
    </div>
  `;

    await fetch('/api/sendSellMail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, subject, html }),
    });

    messageApi.open({
      type: 'success',
      content: 'Form submitted successfully!',
      key,
      duration: 2,
    });

    setFormData(formDataInitial); // Reset form
    setOpen(false);               // Close modal
  };

  const filteredOptions = useMemo(() => {
    return carsFullList.filter((item) => item.car === formData.model);
  }, [carsFullList, formData.model]);

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      closable={false}
      centered
      destroyOnClose
      width="100%"
      className="max-w-[1024px] mobile-modal-fix"
      styles={{
        content: {
          background: "linear-gradient(135deg, #0f0f0f, #1a1a1a)",
        },
        mask: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
        },
        body: {
          maxHeight: '100vh',
          overflowY: 'auto',
          padding: 0,
          WebkitOverflowScrolling: 'touch',
        }
      }}
      modalRender={(modal) => (
        <div className="w-full h-full sm:h-auto sm:rounded-lg overflow-y-auto">{modal}</div>
      )}
    >
      {contextHolder}
      <MotionDiv
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className={`relative w-full h-full px-6 py-8 md:px-12 ${poppins.className}`}
        style={{
          background: "linear-gradient(135deg, #0f0f0f, #1a1a1a)",
          color: "#fff",
          borderRadius: 16,
        }}
      >
        {/* Background PNG */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <Image
            src={"/overlaycar.png"}
            alt="background"
            layout="fill"
            objectFit="cover"
            quality={80}
            className="rounded-xl"
          />
        </div>

        {/* Mobile Back Arrow */}
        {isMobile && (
          <div className="relative z-20 mb-4">
            <Button 
              icon={<ArrowLeft size={20} />} 
              onClick={() => setOpen(false)}
              className="flex items-center justify-center bg-transparent border-none shadow-none text-white hover:text-gray-300"
            />
          </div>
        )}

        {/* Header */}
        <div className="relative text-center mb-10 z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            <span className="text-brand-color">{open}</span>&nbsp; with
            Confidence
          </h2>
          <p className="text-gray-400 mt-2 text-sm md:text-base max-w-xl mx-auto">
            Let&apos;s get started. Fill in a few details and we&apos;ll handle
            the rest — fast quotes, verified listings, and peace of mind.
          </p>
        </div>

        {/* Personal Info */}
        <Row gutter={[16, 16]} className="relative z-10 text-gray-400">
          <Col xs={24} sm={12}>
            <InputField
              label={"First Name"}
              value={formData.firstName}
              onValueChange={(value) => handleChange("firstName", value)}
              type="text"
              inputClassName={inputClassName}
            />
          </Col>
          <Col xs={24} sm={12}>
            <InputField
              label={"Last Name"}
              value={formData.lastName}
              onValueChange={(value) => handleChange("lastName", value)}
              type="text"
              inputClassName={inputClassName}
            />
          </Col>
          <Col xs={24} sm={12}>
            <InputField
              label={"Email"}
              value={formData.email}
              onValueChange={(value) => handleChange("email", value)}
              type="email"
              inputClassName={inputClassName}
            />
          </Col>
          <Col xs={6} sm={3}>
            <AutoCompleteInput
              label={"Code"}
              options={countryCodeList}
              inputClassName={true}
              onValueChange={(value) => handleSelectChange(value, "code")}
              value={formData.code}
            />
          </Col>
          <Col xs={18} sm={9}>
            <InputField
              label={"Mobile"}
              value={formData.mobile}
              onValueChange={(value) => handleChange("mobile", value)}
              type="number"
              inputClassName={inputClassName}
            />
          </Col>
        </Row>

        {/* Car Details */}
        <h3 className="relative text-lg font-semibold mt-10 text-white z-10">
          Car Details
        </h3>
        <Row gutter={[16, 16]} className="mt-2 relative z-10">
          <Col xs={24} sm={12} md={6}>
            <AutoCompleteInput
              label={"Brand"}
              options={brandOptions}
              onValueChange={(value) => handleSelectChange(value, "brand")}
              value={formData.brand}
              inputClassName={true}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <AutoCompleteInput
              label={"Model"}
              options={
                modelsOptions?.length === 0 ? modelsFullList : modelsOptions
              }
              onValueChange={(value) =>
                handleSelectChange(value, "model", "car")
              }
              value={formData.model}
              keyMap={{ label: "car", value: "car" }}
              inputClassName={true}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <AutoCompleteInput
              label={"Variant"}
              options={filteredOptions}
              onValueChange={(value) =>
                handleSelectChange(value, "variant", "variant")
              }
              value={formData.variant}
              keyMap={{ label: "variant", value: "variant" }}
              inputClassName={true}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <AutoCompleteInput
              label={"Transmission"}
              options={carsTransmissionList}
              onValueChange={(value) =>
                handleSelectChange(value, "transmission")
              }
              value={formData.transmission}
              keyMap={{ label: "variant", value: "variant" }}
              inputClassName={true}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <AutoCompleteInput
              label={"Fuel Type"}
              options={fuelOptions}
              onValueChange={(value) => handleSelectChange(value, "fueltype")}
              value={formData.fueltype}
              inputClassName={true}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div>
              <label className="block text-sm font-medium mb-2">{"Year"}</label>
              <DatePicker
                picker="year"
                style={{ width: "100%" }}
                className={inputClassName}
                onChange={(date, dateString) =>
                  handleChange("year", dateString)
                }
                value={formData.year ? dayjs(formData.year, "YYYY") : null}
                disabledDate={(current) => {
                  return current && current > today.endOf("day");
                }}
              />
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
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
              onValueChange={(value) => handleSelectChange(value, "kilometers")}
              value={formData.kilometers}
              inputClassName={true}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <AutoCompleteInput
              label={"No of owners"}
              options={["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
              onValueChange={(value) => handleSelectChange(value, "owners")}
              value={formData.owners}
              inputClassName={true}
            />
          </Col>
          <Col xs={24} sm={12} md={9}>
            <div>
              <label className="block text-sm font-medium mb-2">Additional info</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full px-4 py-2 border-none rounded-lg bg-[#1f1f1f] text-white placeholder-white"
                rows="3"
              />
            </div>
          </Col>
        </Row>

        {/* Submit Buttons */}
        <div className="relative mt-10 text-center z-10 pb-6">
          <Button
            type="primary"
            className="bg-orange-500 border-none text-white px-6 py-2 rounded-md font-medium hover:opacity-90"
            onClick={handleSubmit}
          >
            Submit
          </Button>
          <Button
            onClick={() => setOpen(false)}
            className="ml-4 bg-neutral-600 border-none text-white px-6 py-2 rounded-md hover:bg-neutral-500"
          >
            Cancel
          </Button>
        </div>
      </MotionDiv>
    </Modal>
  );
}