"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { User, Train, MapPin, Calendar, CreditCard, Plus, Minus, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ScheduleDetails {
  _id: string;
  schedule_id?: string;
  train_id: any;
  train_number: string;
  train_name: string;
  train_type: string;
  from_station_name: string;
  to_station_name: string;
  from_city: string;
  to_city: string;
  travel_date: string;
  available_seats: number;
  base_fare: number;
}

interface Passenger {
  name: string;
  age: number;
  gender: string;
}

export default function BookingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const scheduleId = searchParams.get('schedule');
  
  const [schedule, setSchedule] = useState<ScheduleDetails | null>(null);
  const [passengers, setPassengers] = useState<Passenger[]>([{ name: "", age: 0, gender: "Male" }]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!scheduleId) {
      router.push("/search");
      return;
    }

    fetchSchedule();
  }, [router, scheduleId]);

  const fetchSchedule = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/schedules/${scheduleId}`);
      if (response.ok) {
        const data = await response.json();
        setSchedule(data);
      } else {
        router.push("/search");
      }
    } catch (error) {
      console.error("Failed to fetch schedule", error);
    } finally {
      setLoading(false);
    }
  };

  const addPassenger = () => {
    setPassengers([...passengers, { name: "", age: 0, gender: "Male" }]);
  };

  const removePassenger = (index: number) => {
    setPassengers(passengers.filter((_, i) => i !== index));
  };

  const updatePassenger = (index: number, field: keyof Passenger, value: string | number) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const handleBooking = async () => {
    if (!schedule) return;
    
    setBooking(true);
    setError("");
    
    try {
      const seats = passengers.map((p, idx) => ({
        number: `${idx + 1}`,
        class: "General",
        berth_type: "Lower"
      }));

      const profileStr = localStorage.getItem("railx_profile");
      if (!profileStr) {
        throw new Error("No session found. Please login again.");
      }

      const profile = JSON.parse(profileStr);
      
      if (!profile.token) {
        throw new Error("Invalid session. Please login again.");
      }

      const response = await fetch("http://localhost:5001/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${profile.token}`
        },
        body: JSON.stringify({
          schedule_id: schedule._id,
          seats: seats,
          passenger_details: passengers
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        router.push(`/confirmation?pnr=${data.pnr_number}`);
      } else {
        setError(data.message || "Booking failed. Please try again.");
        setBooking(false);
      }
    } catch (err: any) {
      setError(err.message || "Booking failed. Please try again.");
      setBooking(false);
    }
  };

  const totalFare = schedule ? schedule.base_fare * passengers.length : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading schedule...</p>
        </div>
      </div>
    );
  }

  if (!schedule) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold tracking-tighter">
            RAILX
          </Link>
          <Link href="/dashboard" className="px-4 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all">
            Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Complete Your Booking</h1>
          <p className="text-gray-400">Review journey details and add passenger information</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-white/5 border border-white/10 rounded-2xl mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Train className="w-6 h-6" />
            <h2 className="text-xl font-bold">Journey Details</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">Train</p>
              <p className="font-semibold">{schedule.train_name} ({schedule.train_number})</p>
              <p className="text-sm text-gray-400">{schedule.train_type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Travel Date</p>
              <p className="font-semibold">{new Date(schedule.travel_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">From</p>
              <p className="font-semibold">{schedule.from_station_name}</p>
              <p className="text-sm text-gray-400">{schedule.from_city}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">To</p>
              <p className="font-semibold">{schedule.to_station_name}</p>
              <p className="text-sm text-gray-400">{schedule.to_city}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Passenger Details</h2>
            <button
              onClick={addPassenger}
              className="px-4 py-2 border border-white/20 rounded-full text-sm hover:bg-white hover:text-black transition-all flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Passenger
            </button>
          </div>

          <div className="space-y-4">
            {passengers.map((passenger, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-6 bg-white/5 border border-white/10 rounded-2xl relative"
              >
                {passengers.length > 1 && (
                  <button
                    onClick={() => removePassenger(idx)}
                    className="absolute top-4 right-4 p-1 hover:bg-red-500/20 rounded-full transition-all"
                  >
                    <Minus className="w-4 h-4 text-red-400" />
                  </button>
                )}
                <h3 className="font-semibold mb-4">Passenger {idx + 1}</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={passenger.name}
                      onChange={(e) => updatePassenger(idx, "name", e.target.value)}
                      required
                      className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                      placeholder="Enter name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Age</label>
                    <input
                      type="number"
                      value={passenger.age || ""}
                      onChange={(e) => updatePassenger(idx, "age", parseInt(e.target.value))}
                      required
                      className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                      placeholder="Age"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Gender</label>
                    <select
                      value={passenger.gender}
                      onChange={(e) => updatePassenger(idx, "gender", e.target.value)}
                      className="w-full px-4 py-2 bg-black border border-white/10 rounded-lg focus:outline-none focus:border-white/30"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 bg-white/5 border border-white/10 rounded-2xl sticky bottom-4"
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-gray-400">Total Passengers</p>
              <p className="text-2xl font-bold">{passengers.length}</p>
            </div>
            <div>
              <p className="text-gray-400">Total Fare</p>
              <p className="text-2xl font-bold">₹{totalFare}</p>
            </div>
          </div>
          <button
            onClick={handleBooking}
            disabled={booking || passengers.some(p => !p.name || !p.age || !p.age)}
            className="w-full py-3 bg-white text-black rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {booking ? "Processing..." : "Confirm Booking"}
            {!booking && <ArrowRight className="w-4 h-4" />}
          </button>
        </motion.div>
      </main>
    </div>
  );
}