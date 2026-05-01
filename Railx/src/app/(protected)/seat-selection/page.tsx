"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, Check } from "lucide-react";
import Link from "next/link";

interface Seat {
  number: string;
  class: string;
  available: boolean;
  price: number;
}

interface SeatSection {
  class: string;
  berths: Seat[];
}

export default function SeatSelectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scheduleId = searchParams.get("schedule");
  
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [numPassengers, setNumPassengers] = useState(1);
  const [seatSections, setSeatSections] = useState<SeatSection[]>([]);

  useEffect(() => {
    generateSeats();
  }, []);

  const generateSeats = () => {
    const classes = ["General", "Sleeper", "AC2", "AC1"];
    const berths = ["Lower", "Middle", "Upper"];
    const sections: SeatSection[] = [];

    classes.forEach((classType) => {
      const seats: Seat[] = [];
      let seatNum = 1;

      for (let i = 0; i < 3; i++) {
        berths.forEach((berth) => {
          const prices: any = {
            General: 500,
            Sleeper: 800,
            AC2: 1200,
            AC1: 1500,
          };

          seats.push({
            number: `${classType.charAt(0)}${seatNum}${berth.charAt(0)}`,
            class: classType,
            available: Math.random() > 0.3,
            price: prices[classType],
          });
          seatNum++;
        });
      }

      sections.push({ class: classType, berths: seats });
    });

    setSeatSections(sections);
  };

  const toggleSeat = (seat: Seat) => {
    if (!seat.available && !selectedSeats.includes(seat)) return;

    const isSelected = selectedSeats.includes(seat);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else if (selectedSeats.length < numPassengers) {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleContinue = () => {
    if (selectedSeats.length !== numPassengers) {
      alert(`Please select ${numPassengers} seat(s)`);
      return;
    }

    const seatData = selectedSeats.map((seat) => ({
      number: seat.number,
      class: seat.class,
      berth_type: seat.number.charAt(seat.number.length - 1),
    }));

    router.push(
      `/booking?schedule=${scheduleId}&seats=${JSON.stringify(seatData)}`
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/search">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="text-2xl font-bold">Select Your Seats</h1>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 bg-white/5 border border-white/10 rounded-2xl"
        >
          <label className="block text-sm font-medium mb-3">
            Number of Passengers
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                onClick={() => {
                  setNumPassengers(num);
                  setSelectedSeats([]);
                }}
                className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                  numPassengers === num
                    ? "bg-white text-black"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-12 mb-8"
        >
          {seatSections.map((section, idx) => (
            <div key={idx} className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{section.class} Class</h2>
                <div className="flex gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white rounded"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white/20 rounded"></div>
                    <span>Booked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Selected</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3">
                {section.berths.map((seat) => {
                  const isSelected = selectedSeats.includes(seat);
                  return (
                    <button
                      key={seat.number}
                      onClick={() => toggleSeat(seat)}
                      disabled={!seat.available && !isSelected}
                      className={`aspect-square rounded-lg font-semibold text-sm transition-all ${
                        isSelected
                          ? "bg-green-500 text-black"
                          : seat.available
                          ? "bg-white text-black hover:bg-white/90"
                          : "bg-white/10 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {isSelected && (
                        <Check className="w-4 h-4 mx-auto" />
                      )}
                      {!isSelected && seat.number}
                    </button>
                  );
                })}
              </div>

              <p className="text-gray-400 text-sm mt-4">
                Price per seat: ₹{section.berths[0]?.price}
              </p>
            </div>
          ))}
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white/5 border border-white/10 rounded-2xl sticky bottom-6"
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-gray-400 text-sm">Selected Seats</p>
              <p className="text-2xl font-bold">
                {selectedSeats.length} / {numPassengers}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Total Fare</p>
              <p className="text-3xl font-bold">
                ₹{selectedSeats.reduce((sum, s) => sum + s.price, 0)}
              </p>
            </div>
          </div>
          <button
            onClick={handleContinue}
            disabled={selectedSeats.length !== numPassengers}
            className="w-full py-3 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition-all disabled:opacity-50"
          >
            Continue to Booking Details
          </button>
        </motion.div>
      </main>
    </div>
  );
}
