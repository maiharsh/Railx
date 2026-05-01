"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle, Save, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function AdminSchedulePage() {
  const router = useRouter();
  const params = useParams();
  const scheduleId = params?.id as string;

  const [formData, setFormData] = useState({
    train_id: "",
    from_station: "",
    to_station: "",
    travel_date: "",
    available_seats: 500,
    base_fare: 500,
  });

  const [trains, setTrains] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchData();
    if (scheduleId && scheduleId !== "new") {
      fetchSchedule();
    }
  }, []);

  const fetchData = async () => {
    try {
      const profile = JSON.parse(localStorage.getItem("railx_admin_profile") || "{}");
      const [trainsRes, stationsRes] = await Promise.all([
        fetch("http://localhost:5001/api/admin/trains", {
          headers: { Authorization: `Bearer ${profile.token}` },
        }),
        fetch("http://localhost:5001/api/stations", {
          headers: { Authorization: `Bearer ${profile.token}` },
        }),
      ]);

      if (trainsRes.ok) {
        const trainsData = await trainsRes.json();
        setTrains(trainsData.trains || []);
      }

      if (stationsRes.ok) {
        const stationsData = await stationsRes.json();
        setStations(stationsData);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  const fetchSchedule = async () => {
    try {
      const profile = JSON.parse(localStorage.getItem("railx_admin_profile") || "{}");
      const response = await fetch(
        `http://localhost:5001/api/admin/schedules/${scheduleId}`,
        {
          headers: { Authorization: `Bearer ${profile.token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFormData({
          ...data,
          train_id: data.train_id._id || data.train_id,
          from_station: data.from_station._id || data.from_station,
          to_station: data.to_station._id || data.to_station,
          travel_date: data.travel_date.split("T")[0],
        });
      }
    } catch (err) {
      console.error("Failed to fetch schedule:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const profile = JSON.parse(localStorage.getItem("railx_admin_profile") || "{}");
      const method = scheduleId && scheduleId !== "new" ? "PUT" : "POST";
      const url =
        scheduleId && scheduleId !== "new"
          ? `http://localhost:5001/api/admin/schedules/${scheduleId}`
          : "http://localhost:5001/api/admin/schedules";

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
          scheduleId && scheduleId !== "new"
            ? "Schedule updated successfully"
            : "Schedule created successfully"
        );
        setTimeout(() => {
          router.push("/admin/dashboard?tab=schedules");
        }, 1500);
      } else {
        const data = await response.json();
        setError(data.message || "Failed to save schedule");
      }
    } catch (err: any) {
      setError(err.message || "Failed to save schedule");
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
            {scheduleId && scheduleId !== "new" ? "Edit Schedule" : "Add Schedule"}
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
            <label className="block text-sm font-medium mb-2">Train *</label>
            <select
              value={formData.train_id}
              onChange={(e) =>
                setFormData({ ...formData, train_id: e.target.value })
              }
              required
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white/40"
            >
              <option value="">Select Train</option>
              {trains.map((train) => (
                <option key={train._id} value={train._id}>
                  {train.train_name} ({train.train_number})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">From Station *</label>
              <select
                value={formData.from_station}
                onChange={(e) =>
                  setFormData({ ...formData, from_station: e.target.value })
                }
                required
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white/40"
              >
                <option value="">Select Station</option>
                {stations.map((station) => (
                  <option key={station._id} value={station._id}>
                    {station.station_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">To Station *</label>
              <select
                value={formData.to_station}
                onChange={(e) =>
                  setFormData({ ...formData, to_station: e.target.value })
                }
                required
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white/40"
              >
                <option value="">Select Station</option>
                {stations.map((station) => (
                  <option key={station._id} value={station._id}>
                    {station.station_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Travel Date *</label>
              <input
                type="date"
                value={formData.travel_date}
                onChange={(e) =>
                  setFormData({ ...formData, travel_date: e.target.value })
                }
                required
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Base Fare (₹) *</label>
              <input
                type="number"
                value={formData.base_fare}
                onChange={(e) =>
                  setFormData({ ...formData, base_fare: parseInt(e.target.value) })
                }
                required
                min="1"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white/40"
                placeholder="e.g., 500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Available Seats *
            </label>
            <input
              type="number"
              value={formData.available_seats}
              onChange={(e) =>
                setFormData({ ...formData, available_seats: parseInt(e.target.value) })
              }
              required
              min="0"
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
            {loading ? "Saving..." : "Save Schedule"}
          </button>
        </motion.form>
      </main>
    </div>
  );
}
