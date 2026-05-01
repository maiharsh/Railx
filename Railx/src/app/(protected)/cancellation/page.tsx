"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Trash2, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CancellationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking");

  const [booking, setBooking] = useState<any>(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, []);

  const fetchBooking = async () => {
    try {
      const profile = JSON.parse(localStorage.getItem("railx_profile") || "{}");
      const response = await fetch(
        `http://localhost:5001/api/bookings/my-bookings`,
        {
          headers: { Authorization: `Bearer ${profile.token}` },
        }
      );

      if (response.ok) {
        const bookings = await response.json();
        const found = bookings.find((b: any) => b._id === bookingId);
        setBooking(found);
      }
    } catch (err) {
      console.error("Failed to fetch booking:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    setCancelling(true);
    setError("");

    try {
      const profile = JSON.parse(localStorage.getItem("railx_profile") || "{}");
      const response = await fetch(
        `http://localhost:5001/api/cancellations/cancel/${bookingId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${profile.token}`,
          },
          body: JSON.stringify({
            cancellation_reason: reason,
          }),
        }
      );

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.message || "Cancellation failed");
      }
    } catch (err: any) {
      setError(err.message || "Cancellation failed");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Booking Cancelled!</h2>
          <p className="text-gray-400">
            Refund will be processed within 5-7 business days
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="text-2xl font-bold">Cancel Booking</h1>
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

        {booking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {}
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <h2 className="text-xl font-bold mb-4">Booking Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">PNR Number:</span>
                  <span className="font-bold">{booking.pnr_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Route:</span>
                  <span className="font-bold">
                    {booking.from_station_name} → {booking.to_station_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Travel Date:</span>
                  <span className="font-bold">
                    {new Date(booking.travel_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Fare:</span>
                  <span className="font-bold">₹{booking.total_fare}</span>
                </div>
              </div>
            </div>

            {}
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <h2 className="text-xl font-bold mb-4">Cancellation Policy</h2>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• <span className="text-gray-400">Within 24 hours:</span> No refund</li>
                <li>• <span className="text-gray-400">1-7 days before:</span> 50% refund</li>
                <li>• <span className="text-gray-400">More than 7 days:</span> 90% refund</li>
              </ul>
            </div>

            {}
            <form onSubmit={handleCancel} className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">
                  Reason for Cancellation *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  placeholder="Please tell us why you want to cancel this booking..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white/40 resize-none"
                  rows={4}
                />
              </div>

              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-sm text-yellow-200">
                  ⚠️ This action cannot be undone. Your refund will be processed
                  as per our cancellation policy.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={cancelling || !reason}
                  className="flex-1 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {cancelling ? "Cancelling..." : "Cancel Booking"}
                </button>
                <Link href="/dashboard">
                  <button
                    type="button"
                    className="flex-1 py-3 border border-white/20 rounded-lg font-semibold hover:bg-white/10 transition-all"
                  >
                    Keep Booking
                  </button>
                </Link>
              </div>
            </form>
          </motion.div>
        )}
      </main>
    </div>
  );
}
