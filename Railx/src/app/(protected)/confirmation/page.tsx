"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Download, Home, QrCode, Mail, X } from "lucide-react";
import Link from "next/link";
import { generateTicketPDF } from "@/lib/pdf-generator";

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pnr = searchParams.get('pnr');
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrImage, setQrImage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleDownloadPDF = () => {
    generateTicketPDF({
      pnr_number: pnr,
      booking_date: new Date().toLocaleDateString(),
      train_name: "Express Train",
      train_number: "12345",
      from_station_name: "Station A",
      to_station_name: "Station B",
      travel_date: new Date().toLocaleDateString(),
      passenger_name: "Passenger",
      seat_number: "A1",
      total_fare: 500,
      status: "Confirmed"
    });
  };

  const handleGenerateQR = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/qr/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pnr: pnr || '',
          bookingId: searchParams.get('booking') || 'booking123'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setQrImage(data.qrCode);
        setShowQRModal(true);
      } else {
        alert('Failed to generate QR code');
      }
    } catch (error) {
      console.error("Failed to generate QR code:", error);
      alert("Failed to generate QR code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-10 h-10 text-white" />
        </motion.div>

        <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
        <p className="text-gray-400 mb-6">Your ticket has been successfully booked</p>

        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl mb-8">
          <p className="text-sm text-gray-400 mb-2">PNR Number</p>
          <p className="text-2xl font-bold tracking-wider mb-4">{pnr}</p>
          <p className="text-sm text-gray-400">
            Please save this PNR for future reference
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <button
            onClick={handleDownloadPDF}
            className="w-full py-3 border border-white/20 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all"
          >
            <Download className="w-4 h-4" />
            Download Ticket (PDF)
          </button>
          
          <button
            onClick={handleGenerateQR}
            className="w-full py-3 border border-white/20 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all"
          >
            <QrCode className="w-4 h-4" />
            View QR Code
          </button>

          <button
            className="w-full py-3 border border-white/20 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all"
          >
            <Mail className="w-4 h-4" />
            Send to Email
          </button>
        </div>
          
        <Link href="/dashboard">
          <button className="w-full py-3 bg-white text-black rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-white/90 transition-all">
            <Home className="w-4 h-4" />
            Go to Dashboard
          </button>
        </Link>
      </motion.div>

      {showQRModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setShowQRModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-black border border-white/20 rounded-2xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Booking QR Code</h2>
              <button
                onClick={() => setShowQRModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-400 mt-4">Generating QR code...</p>
              </div>
            ) : qrImage ? (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg flex items-center justify-center">
                  <img src={qrImage} alt="Booking QR Code" className="w-64 h-64" />
                </div>
                <p className="text-sm text-gray-400 text-center">
                  Scan this QR code to view your booking details
                </p>
                <a
                  href={qrImage}
                  download={`qr-${pnr}.png`}
                  className="w-full py-2 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download QR Code
                </a>
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}