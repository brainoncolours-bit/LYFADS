"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LucideLogOut,
  LucideCar,
  LucidePhoneCall,
  LucideShieldAlert,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import AddProductModal from "@/components/AddProductModal";
import CarsList from "@/components/admin-components/CarsList";
import LeadsTable from "@/components/admin-components/LeadsTable";
import { Card, Skeleton } from "antd";
import TestimonialModal from "./TestimonialModal";
import TestimonialsList from "./TestimonialList";
import FeedBackList from "./FeedBackList";

const AdminDashboard = () => {
  const router = useRouter();

  const [view, setView] = useState("cars");

  const [items, setItems] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editData,setEditData] = useState(null);
  const [sellData,setSellData] = useState([]);
  const [sellCount,setSellCount] = useState(0);
  const [sellLoading,setSellLoading] = useState(false);
  

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error logging out:", error);
      } else {
        router.push("/admin/login");
      }
    }
  };



  // Function to fetch products
  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Get the session token
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData?.session) {
        setError("User is not authenticated.");
        setLoading(false);
        return;
      }
      
      // Use Supabase client directly instead of API route
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        setError("Error fetching products: " + error.message);
      } else {
        setItems(data || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("An error occurred while fetching products.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSellEnquiries = async () => {
    setSellLoading(true);
    
    try {
      const { data, error } = await supabase
        .from("selldetails")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        alert("Error fetching data: " + error.message);
      } else {
        let filterData = data.filter((item) => view === "sales" ? item.type === 0 : item.type === 1);
        setSellData(filterData || []);
        setSellCount(data.length);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setSellLoading(false);
    }
  };
  const fetchCarEnquiries = async () => {
    
    try {
      // Get the session token
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData?.session) {
        setError("User is not authenticated.");
        setLoading(false);
        return;
      }
      
      // Use Supabase client directly instead of API route
      const { data, error } = await supabase
        .from("enquiries")
        .select("*")
      
      if (error) {
        setError("Error fetching enquiries: " + error.message);
      } else {
        setEnquiries(data || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("An error occurred while fetching products.");
    } finally {
      setLoading(false);
    }
  };

  const tabLabels = [
    { label: "Cars", value: "cars" },
    { label: "Sales", value: "sales" },
    { label: "Exchange", value: "exchange"},
    { label: "Messages", value: "messages" },
    { label: "Testimonials", value: "testimonials" },
  ]



  useEffect(() => {
    
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        router.push("/admin/login");
      } else {
        // If authenticated, fetch products
        fetchProducts();
        fetchCarEnquiries();
        fetchSellEnquiries();
      }
    };

    checkAuth();
  }, [router]);
  return (
    <div className="p-6  w-full mx-auto min-h-[80vh] flex flex-col justify-start">
      {/* Dashboard Summary Cards */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold mb-4">Admin 
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 flex items-center rounded-lg hover:bg-red-700 transition-all"
        >
          <LucideLogOut size={20} className="mr-2" />
          Logout
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-white">
        <div className="bg-blue-600 p-4 flex items-center rounded">
          <LucideCar size={32} />
          <div className="ml-4">Total Cars: {items.length}</div>
        </div>
        <div className="bg-green-600 p-4 flex items-center rounded">
          <LucidePhoneCall size={32} />
          <div className="ml-4">Pending Enquiries: {enquiries.length}</div>
        </div>
        <div className="bg-yellow-600 p-4 flex items-center rounded">
          <LucideShieldAlert size={32} />
          <div className="ml-4">Sell/Exchange: {sellCount}</div>
        </div>
      </div>

      {/* Toggle Switch */}
      <div className="flex items-center justify-between my-6 flex-wrap gap-2">
  {/* Tab Buttons with Action */}
  <div className="flex flex-wrap gap-2">
    {tabLabels.map(({ label, value }) => (
      <div key={value} className="relative w-fit">
        <button
          onClick={() =>{
            if(view === value) return;
            setView(value)
            if(value==="cars"){
               fetchProducts();
               fetchCarEnquiries();
            }else if(value==="sales" || value==="exchange"){
              fetchSellEnquiries();
            }

          }}
          className={`px-4 py-2  rounded flex items-center gap-2 relative ${
            view === value ? "bg-blue-600 text-white" : "bg-gray-200"
          } ${view==="cars" && value==="cars" || view==="testimonials" && value==="testimonials" ? "pr-10":"pr-auto"}`}
        >
          {label}

          {/* Action Icon inside button */}
          {value === "cars" && (
            view === "cars" && (
              <div className="absolute right-2">
                <AddProductModal
                  fetchProducts={fetchProducts}
                  editData={editData}
                  setEditData={setEditData}
                />
              </div>
            )
          ) }
          {value === "testimonials" && (
            view === "testimonials" && (
              <div className="absolute right-2">
                <TestimonialModal
                   editData={editData}
                  setEditData={setEditData}
                />
              </div>
            )
          ) }
        </button>
      </div>
    ))}
  </div>
</div>

      {/* Loading and Error States */}
      {loading ?
    
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <Card key={i} style={{ width: '100%' }}>
         <Skeleton active paragraph={{ rows: 2 }} />
      </Card>
    ))}
  </div>
  
  :<>
  {error && <p className="text-red-500 text-center py-4">{error}</p>}
  
  <div className="mt-2">
        {view === "cars" ? (
          <CarsList items={items} loading={loading} setEditData={setEditData} fetchProducts={fetchProducts} enquiryData={enquiries} fetchCarEnquiries={fetchCarEnquiries}/>
        ) :
        (view==="sales" || view==="exchange") ? (
          <LeadsTable loading={sellLoading} cardsData={sellData} type={view} fetchSellEnquiries={fetchSellEnquiries}/>
        ):
        (view==="testimonials") ? (
                   
          <TestimonialsList  setEditData={setEditData} editData={editData}/>
        ):
        <FeedBackList/>
        }
      </div>
    </>
      }
    </div>
  );
};

export default AdminDashboard;