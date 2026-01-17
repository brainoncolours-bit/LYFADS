"use client"
import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ToastProvider";
import { supabase } from "@/lib/supabaseClient";

// Example dial code list, you can replace this with your imported JSON or array
const dialcodeJson = [
  "+91",
  "+971",   
  "+1",     
  "+44",    
  "+61",    
  "+81",    
  "+49",
  "+33",    
  "+966",   
  "+880",   
  "+92",
  "+965", 
  "+974", 
  "+973",
  "+968"      
]; 

const EnquiryForm = ({ carModel }) => {
  const toast  = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
    testDriveDate: "",
    testDriveTime: "",
    dialCode: dialcodeJson[0],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isTestDriveDateValid = () => {
  if (!formData.testDriveDate) return true; // no date = valid (optional)

  const selectedDate = new Date(formData.testDriveDate);
  selectedDate.setHours(0, 0, 0, 0); // reset time to start of day

  const today = new Date();
  today.setHours(0, 0, 0, 0); // reset time to start of day

  return selectedDate >= today;
};

  const handleSubmit = async (e) => {
    e.preventDefault();
      toast.loading("Submitting","submit");

    if (!isTestDriveDateValid()) {
      toast.error("Please select a valid future date.","submit");
      return;
    }

    // Concatenate dial code and mobile
    const fullMobile = `${formData.dialCode}${formData.mobile}`;

    // Prepare the data to insert
    const enquiryData = {
      car_id: carModel.id,
      model_name: carModel.variant,
      year: carModel.year,
      fuel_type: carModel.fuelType,
      kilometers: carModel.kilometers,
      owners: carModel.owners,
      transmission: carModel.transmission,
      price: carModel.price,
      user_name: formData.name,
      user_email: formData.email,
      user_mobile: fullMobile,
      message: formData.message,
      test_drive_date: formData.testDriveDate,
      test_drive_time: formData.testDriveTime || null,
      attended: false,
      notes:[]
    };

    const { data, error } = await supabase.from("enquiries").insert([enquiryData]);

    if (error) {
      console.error("Error submitting enquiry:", error);
      toast.error("Failed to submit your enquiry. Please try again.","submit");
      return;
    }

// After successful DB insert — send email
const { user_email, user_name, model_name, test_drive_date, test_drive_time } = enquiryData;

const subject = 'Car Enquiry Received - Shameer Cars';
const html = `
  <div style="background-color:#f5f5f5;padding:20px 0;font-family:Arial,sans-serif;">
    <table align="center" width="600" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
      <tr>
        <td style="text-align:center;background-color:#001529;padding:20px;">
          <img src="http://res.cloudinary.com/dtyojyr94/image/upload/v1747421154/brandLogo_ntzxbe.png" alt="Shameer Cars" style="max-width:100%;height:auto;" />
        </td>
      </tr>
      <tr>
        <td style="padding:30px;">
          <h2 style="color:#333;">Hi ${user_name},</h2>
          <p style="font-size:16px;color:#555;">
            Thank you for your enquiry about the <strong>${model_name}</strong> with <strong>Shameer Cars</strong>.
          </p>
          <p style="font-size:16px;color:#555;">
            We have received your message and will get back to you shortly.
          </p>
          ${
            test_drive_date && test_drive_time
              ? `<p style="font-size:16px;color:#555;">
                   You requested a test drive on <strong>${test_drive_date}</strong> at <strong>${test_drive_time}</strong>.
                 </p>`
              : ''
          }
          <p style="font-size:16px;color:#555;">
            Meanwhile, feel free to browse our premium car collection:
          </p>
          <p style="text-align:center;margin:30px 0;">
            <a href="https://shameercars.vercel.app/car-details" style="background-color:#1890ff;color:#fff;padding:12px 24px;border-radius:4px;text-decoration:none;font-size:16px;">
              Browse Car Collection
            </a>
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
  body: JSON.stringify({ email: user_email, subject, html }),
});



    toast.success(`We've received your enquiry about the ${carModel.variant}. We'll get back to you soon.`,"submit");

    setFormData({
      name: "",
      email: "",
      mobile: "",
      message: "",
      testDriveDate: "",
      testDriveTime: "",
      dialCode: dialcodeJson[0],
    });
  };

  const todayDate = new Date().toISOString().split("T")[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-zinc-900 rounded-lg p-6 mt-10 max-w-screen-md mx-auto"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Enquire About This Car</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#ea942a]"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#ea942a]"
          />
        </div>

        {/* Mobile with Dial Code */}
        <div>
          <label htmlFor="mobile" className="block text-sm font-medium text-gray-300 mb-1">
            Mobile
          </label>
          <div className="flex">
            <select
              name="dialCode"
              value={formData.dialCode}
              onChange={handleChange}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-l-md text-white focus:outline-none focus:ring-2 focus:ring-[#ea942a]"
            >
              {dialcodeJson.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              className="flex-grow px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-r-md text-white focus:outline-none focus:ring-2 focus:ring-[#ea942a]"
              placeholder="Enter your number"
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#ea942a]"
          ></textarea>
        </div>

        {/* Test Drive Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="testDriveDate" className="block text-sm font-medium text-gray-300 mb-1">
              Preferred Test Drive Date
            </label>
            <input
              type="date"
              id="testDriveDate"
              name="testDriveDate"
              value={formData.testDriveDate}
              onChange={handleChange}
              min={todayDate}
              required
              className="w-full min-w-24 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#ea942a]"
            />
          </div>
          <div>
            <label htmlFor="testDriveTime" className="block text-sm font-medium text-gray-300 mb-1">
              Preferred Test Drive Time
            </label>
            <input
              type="time"
              id="testDriveTime"
              name="testDriveTime"
              value={formData.testDriveTime}
              onChange={handleChange}
              className="w-full min-w-24 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#ea942a]"
            />
          </div>
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 mt-2 bg-brand-color hover:bg-[#ea942a] text-white font-medium rounded-md transition-colors"
        >
          Submit Enquiry
        </motion.button>
      </form>
    </motion.div>
  );
};

export default EnquiryForm;
