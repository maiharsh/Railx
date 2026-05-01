"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Train, Calendar, MapPin, Ticket, LogOut, Bell, User, Trash2 } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  interface Booking {
    pnr_number: string;
    from_station_name: string;
    to_station_name: string;
    travel_date: string;
    booking_date?: string;
    total_fare: number;
    base_fare?: number;
    train_name?: string;
    train_number?: string;
    status?: string;
    seats?: string;
    passenger_id?: string;
  }

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [expandedBookingPnr, setExpandedBookingPnr] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      fetchBookings();
    }
  }, [isAuthenticated, router]);

  const getUpcomingCount = (items: any[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return items.filter((booking) => {
      const t = new Date(booking.travel_date);
      t.setHours(0, 0, 0, 0);
      return t >= today;
    }).length;
  };

  const sortBookings = (items: any[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return [...items].sort((a, b) => {
      const dateA = new Date(a.travel_date);
      const dateB = new Date(b.travel_date);
      dateA.setHours(0, 0, 0, 0);
      dateB.setHours(0, 0, 0, 0);

      const completedA = dateA < today;
      const completedB = dateB < today;

      if (completedA !== completedB) {
        return completedA ? 1 : -1;
      }

      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }

      return new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime();
    });
  };

  const fetchBookings = async () => {
    setLoadingBookings(true);
    setDashboardError(null);

    const token = localStorage.getItem("railx_profile");
    if (token) {
      try {
        const profile = JSON.parse(token);
        const response = await fetch("http://localhost:5001/api/bookings/my-bookings", {
          headers: {
            Authorization: `Bearer ${profile.token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setBookings(sortBookings(data));
        } else {
          setDashboardError("Failed to load bookings. Please try again.");
        }
      } catch (err) {
        console.error("Dashboard bookings fetch failed", err);
        setDashboardError("An error occurred while loading bookings.");
      }
    } else {
      setDashboardError("Authentication missing; please sign in again.");
    }

    setLoadingBookings(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (!user) return null;

  const upcomingCount = getUpcomingCount(bookings);

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold tracking-tighter">
            RAILX
          </Link>
          <div className="flex gap-3 items-center">
            <span className="text-gray-300">Welcome, {user.name}</span>
            <Link href="/notifications">
              <button className="p-2 border border-white/20 rounded-full hover:bg-white/10 transition-all">
                <Bell className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/profile">
              <button className="p-2 border border-white/20 rounded-full hover:bg-white/10 transition-all">
                <User className="w-4 h-4" />
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">My Dashboard</h1>
          <p className="text-gray-400">Manage your bookings and travel preferences</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 bg-white/5 border border-white/10 rounded-2xl"
          >
            <Ticket className="w-8 h-8 mb-4" />
            <h3 className="text-2xl font-bold mb-2">{bookings.length}</h3>
            <p className="text-gray-400">Total Bookings</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 bg-white/5 border border-white/10 rounded-2xl"
          >
            <Train className="w-8 h-8 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Active</h3>
            <p className="text-gray-400">Upcoming Journeys</p>
            <p className="text-3xl font-bold mt-2">{upcomingCount}</p>
          </motion.div>

          <Link href="/search">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 bg-white text-black rounded-2xl cursor-pointer"
            >
              <Calendar className="w-8 h-8 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Book Now</h3>
              <p className="text-gray-600">Plan your next trip</p>
            </motion.div>
          </Link>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Recent Bookings</h2>

          {loadingBookings ? (
            <div className="text-center py-20 bg-white/5 rounded-2xl">
              <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading your bookings...</p>
            </div>
          ) : dashboardError ? (
            <div className="text-center py-12 bg-white/5 rounded-2xl">
              <p className="text-red-400">{dashboardError}</p>
              <button
                className="mt-4 px-6 py-2 bg-white text-black rounded-full hover:bg-white/90 transition-all"
                onClick={fetchBookings}
              >
                Retry
              </button>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-2xl">
              <p className="text-gray-400">No bookings yet</p>
              <Link href="/search">
                <button className="mt-4 px-6 py-2 bg-white text-black rounded-full hover:bg-white/90 transition-all">
                  Book Your First Ticket
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking: any, idx: number) => {
                const bookingDate = new Date(booking.travel_date);
                bookingDate.setHours(0, 0, 0, 0);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const isCompleted = bookingDate < today;
                const statusText = isCompleted ? "Completed" : booking.status;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-6 rounded-2xl border ${isCompleted ? "bg-white/10 border-white/20 opacity-70" : "bg-white/5 border-white/10"}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-400">PNR: {booking.pnr_number}</p>
                        <p className="text-lg font-semibold mt-1">
                          {booking.from_station_name} → {booking.to_station_name}
                        </p>
                        <p className="text-gray-400 mt-2">
                          Date: {new Date(booking.travel_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">₹{booking.total_fare}</p>
                        <p className={`text-sm mt-1 ${isCompleted ? "text-gray-300" : booking.status === "Confirmed" ? "text-green-400" : "text-red-400"}`}>
                          {statusText}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => setExpandedBookingPnr(expandedBookingPnr === booking.pnr_number ? null : booking.pnr_number)}
                        className="px-3 py-1.5 border border-white/30 rounded-full text-sm hover:bg-white/10 transition-all"
                      >
                        {expandedBookingPnr === booking.pnr_number ? "Hide Details" : "Show Details"}
                      </button>
                    </div>

                    {expandedBookingPnr === booking.pnr_number && (
                      <div className="mt-4 bg-black/40 border border-white/15 rounded-xl p-4">
                        <div className="text-sm text-gray-200 space-y-1 mb-4">
                          <p><span className="font-semibold">PNR:</span> {booking.pnr_number}</p>
                          <p><span className="font-semibold">Train:</span> {booking.train_name} ({booking.train_number})</p>
                          <p><span className="font-semibold">Route:</span> {booking.from_station_name} → {booking.to_station_name}</p>
                          <p><span className="font-semibold">Travel Date:</span> {new Date(booking.travel_date).toLocaleDateString()}</p>
                          <p><span className="font-semibold">Booking Date:</span> {booking.booking_date ? new Date(booking.booking_date).toLocaleString() : "-"}</p>
                          <p><span className="font-semibold">Status:</span> {statusText}</p>
                          <p><span className="font-semibold">Seats:</span> {booking.seats ?? "N/A"}</p>
                          <p><span className="font-semibold">Fare:</span> ₹{booking.base_fare ?? booking.total_fare}</p>
                          <p><span className="font-semibold">Total Fare:</span> ₹{booking.total_fare}</p>
                          <p><span className="font-semibold">Passenger ID:</span> {booking.passenger_id ?? "N/A"}</p>
                        </div>

                        {booking.passenger_details && booking.passenger_details.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-white/15">
                            <p className="font-semibold text-gray-100 mb-3">Passengers ({booking.passenger_details.length})</p>
                            <div className="space-y-2">
                              {booking.passenger_details.map((passenger: any, pIdx: number) => (
                                <div key={pIdx} className="pl-3 border-l-2 border-white/20">
                                  <p className="text-gray-200">{passenger.name}</p>
                                  <p className="text-xs text-gray-400">Age: {passenger.age}, Gender: {passenger.gender}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {!isCompleted && booking.status === "Confirmed" && (
                          <div className="flex gap-3 pt-4 border-t border-white/10">
                            <Link href={`/cancellation?booking=${booking._id}`}>
                              <button className="flex-1 px-4 py-2 bg-red-600/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-600/30 transition-all flex items-center justify-center gap-2 text-sm">
                                <Trash2 className="w-4 h-4" />
                                Cancel Booking
                              </button>
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
