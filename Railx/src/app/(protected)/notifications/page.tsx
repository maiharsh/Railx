"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bell, Check, Trash2 } from "lucide-react";
import Link from "next/link";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const profile = JSON.parse(localStorage.getItem("railx_profile") || "{}");
      const response = await fetch("http://localhost:5001/api/notifications", {
        headers: { Authorization: `Bearer ${profile.token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const profile = JSON.parse(localStorage.getItem("railx_profile") || "{}");
      await fetch(`http://localhost:5001/api/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${profile.token}` },
      });

      setNotifications(
        notifications.map((n) =>
          n._id === id ? { ...n, is_read: true } : n
        )
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const profile = JSON.parse(localStorage.getItem("railx_profile") || "{}");
      await fetch(`http://localhost:5001/api/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${profile.token}` },
      });

      setNotifications(notifications.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Notifications</h1>
          </div>
          <Link href="/dashboard">
            <button className="px-4 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20">
            <Bell className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-semibold mb-2">No notifications</h3>
            <p className="text-gray-400">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif, idx) => (
              <motion.div
                key={notif._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-6 border rounded-xl flex justify-between items-start transition-all ${
                  notif.is_read
                    ? "bg-black/50 border-white/10"
                    : "bg-white/5 border-white/20"
                }`}
              >
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">{notif.title}</h3>
                  <p className="text-gray-400 mb-2">{notif.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(notif.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!notif.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(notif._id)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-all"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notif._id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
