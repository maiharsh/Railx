"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle, Save, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function AdminTrainPage() {
  const router = useRouter();
  const params = useParams();
  const trainId = params?.id as string;

  const [formData, setFormData] = useState({
    train_name: "",
    train_number: "",
    train_type: "Express",
    total_seats: 500,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (trainId && trainId !== "new") {
      fetchTrain();
    }
  }, []);

  const fetchTrain = async () => {
    try {
      const profile = JSON.parse(localStorage.getItem("railx_admin_profile") || "{}");
      const response = await fetch(
        `http://localhost:5001/api/admin/trains/${trainId}`,
        {
          headers: { Authorization: `Bearer ${profile.token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFormData(data);
      }
    } catch (err) {
      console.error("Failed to fetch train:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const profile = JSON.parse(localStorage.getItem("railx_admin_profile") || "{}");
      const method = trainId && trainId !== "new" ? "PUT" : "POST";
      const url =
        trainId && trainId !== "new"
          ? `http://localhost:5001/api/admin/trains/${trainId}`
          : "http://localhost:5001/api/admin/trains";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${profile.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(
          trainId && trainId !== "new"
            ? "Train updated successfully"
            : "Train created successfully"
        );
        setTimeout(() => {
          router.push("/admin/dashboard?tab=trains");
        }, 1500);
      } else {
        const data = await response.json();
        setError(data.message || "Failed to save train");
      }
    } catch (err: any) {
      setError(err.message || "Failed to save train");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/admin/dashboard">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="text-2xl font-bold">
            {trainId && trainId !== "new" ? "Edit Train" : "Add Train"}
          </h1>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-3 mb-6"
          >
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-200 text-sm">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm mb-6"
          >
            {success}
          </motion.div>
        )}

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-6 p-6 bg-white/5 border border-white/10 rounded-2xl"
        >
          <div>
            <label className="block text-sm font-medium mb-2">Train Name *</label>
            <input
              type="text"
              value={formData.train_name}
              onChange={(e) =>
                setFormData({ ...formData, train_name: e.target.value })
              }
              required
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white/40"
              placeholder="e.g., Rajdhani Express"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Train Number *</label>
            <input
              type="text"
              value={formData.train_number}
              onChange={(e) =>
                setFormData({ ...formData, train_number: e.target.value })
              }
              required
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white/40"
              placeholder="e.g., 12345"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Train Type *</label>
            <select
              value={formData.train_type}
              onChange={(e) =>
                setFormData({ ...formData, train_type: e.target.value })
              }
              required
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white/40"
            >
              <option value="Express">Express</option>
              <option value="Superfast">Superfast</option>
              <option value="Local">Local</option>
              <option value="Rajdhani">Rajdhani</option>
              <option value="Shatabdi">Shatabdi</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Total Seats *</label>
            <input
              type="number"
              value={formData.total_seats}
              onChange={(e) =>
                setFormData({ ...formData, total_seats: parseInt(e.target.value) })
              }
              required
              min="1"
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white/40"
              placeholder="e.g., 500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? "Saving..." : "Save Train"}
          </button>
        </motion.form>
      </main>
    </div>
  );
}
