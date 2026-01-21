"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LucideLogOut,
  LucideVideo,
  LucidePlus,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Card, Skeleton } from "antd";
import WorksModal from "./WorksModal";
import WorksList from "./WorksList";

const AdminDashboard = () => {
  const router = useRouter();

  const [error, setError] = useState("");
  const [editData,setEditData] = useState(null);
  const [works, setWorks] = useState([]);
  const [worksLoading, setWorksLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  

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

  const fetchWorks = async () => {
    setWorksLoading(true);
    setError("");

    try {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData?.session) {
        setError("User is not authenticated.");
        setWorksLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        if (error.code === '42P01') {
          console.warn("Videos table does not exist yet. Creating empty state.");
          setWorks([]);
        } else {
          setError("Error fetching videos: " + error.message);
        }
      } else {
        setWorks(data || []);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      setError("An error occurred while fetching videos.");
    } finally {
      setWorksLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        router.push("/admin/login");
      } else {
        fetchWorks();
      }
    };

    checkAuth();
  }, [router]);
  return (
    <div className="p-6 w-full mx-auto min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Works Management
          </h1>
          <p className="text-gray-600 text-sm mt-2">Manage your works and showcase your projects</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 flex items-center rounded-xl hover:shadow-xl transition-all transform hover:scale-105 font-medium"
        >
          <LucideLogOut size={20} className="mr-2" />
          Logout
        </button>
      </div>
      
      {/* Stats Card */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-purple-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-6 rounded-2xl shadow-lg">
              <LucideVideo size={48} className="text-white" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Total Works</p>
              <p className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {works.length}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 flex items-center gap-3 rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 font-semibold text-lg"
          >
            <LucidePlus size={24} />
            Add New Work
          </button>
        </div>
      </div>

      {/* Works Modal */}
      <WorksModal
        editData={editData}
        setEditData={setEditData}
        fetchWorks={fetchWorks}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />

      {/* Loading State */}
      {worksLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="rounded-xl">
              <Skeleton active paragraph={{ rows: 3 }} />
            </Card>
          ))}
        </div>
      ) : (
        <>
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 mb-6 flex items-center gap-3">
              <div className="w-2 h-12 bg-red-500 rounded"></div>
              <p className="text-red-600 font-medium text-lg">{error}</p>
            </div>
          )}

          {/* Works List */}
          <WorksList
            setEditData={(data) => {
              setEditData(data);
              setIsModalOpen(true);
            }}
            editData={editData}
            fetchWorks={fetchWorks}
            loading={worksLoading}
            videos={works}
          />
        </>
      )}
    </div>
  );
};

export default AdminDashboard;