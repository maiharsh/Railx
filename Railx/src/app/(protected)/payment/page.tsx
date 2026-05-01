"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CreditCard, DollarSign, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking");
  const amount = searchParams.get("amount");

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      const profile = JSON.parse(localStorage.getItem("railx_profile") || "{}");

      const response = await fetch("http://localhost:5001/api/payments/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${profile.token}`,
        },
        body: JSON.stringify({
          booking_id: bookingId,
          amount: parseInt(amount || "0"),
          payment_method: paymentMethod,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/confirmation?pnr=${searchParams.get("pnr")}`);
        }, 2000);
      } else {
        setError(data.message || "Payment failed");
      }
    } catch (err: any) {
      setError(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-gray-400">Redirecting to confirmation...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Payment</h1>
          <p className="text-gray-400">Amount: ₹{amount}</p>
        </div>

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

        <div className="space-y-4 mb-8">
          {[
            { value: "card", label: "Credit/Debit Card", icon: CreditCard },
            { value: "upi", label: "UPI", icon: DollarSign },
            { value: "net_banking", label: "Net Banking", icon: DollarSign },
          ].map((method) => {
            const Icon = method.icon;
            return (
              <button
                key={method.value}
                onClick={() => setPaymentMethod(method.value)}
                className={`w-full p-4 border-2 rounded-lg transition-all flex items-center gap-3 ${
                  paymentMethod === method.value
                    ? "border-white bg-white/10"
                    : "border-white/20 hover:border-white/40"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{method.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full py-3 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition-all disabled:opacity-50"
        >
          {loading ? "Processing..." : `Pay ₹${amount}`}
        </button>

        <Link href="/dashboard">
          <button className="w-full mt-4 py-3 border border-white/20 rounded-lg font-semibold hover:bg-white/10 transition-all">
            Cancel
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
