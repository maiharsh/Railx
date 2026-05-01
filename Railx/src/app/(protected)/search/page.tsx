"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Train, Clock, MapPin, CreditCard, ChevronDown } from "lucide-react";
import Link from "next/link";

interface TrainSchedule {
  _id: string;
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

interface Station {
  _id: string;
  station_code: string;
  station_name: string;
  city: string;
  state: string;
}

export default function AvailableTrainsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [trains, setTrains] = useState<TrainSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  
  
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [travelDate, setTravelDate] = useState("");
  
  
  const [filteredFromStations, setFilteredFromStations] = useState<Station[]>([]);
  const [filteredToStations, setFilteredToStations] = useState<Station[]>([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  useEffect(() => {
    fetchStations();
    
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const date = searchParams.get('date');
    
    if (from) setFromStation(from);
    if (to) setToStation(to);
    if (date) setTravelDate(date);
    
    if (from && to) {
      fetchTrains(from, to, date);
    }
  }, [searchParams]);

  const fetchStations = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/stations");
      if (response.ok) {
        const data = await response.json();
        setStations(data);
      }
    } catch (error) {
      console.error("Failed to fetch stations", error);
    }
  };

  const fetchTrains = async (from: string, to: string, date?: string | null) => {
    if (!from || !to) return;

    setLoading(true);
    setError(null);

    try {
      const dateQuery = date ? `&date=${date}` : "";
      const response = await fetch(`http://localhost:5001/api/trains/search?from=${from}&to=${to}${dateQuery}`);
      if (response.ok) {
        const data = await response.json();
        setTrains(data);
      } else {
        setError('Unable to fetch train schedules for the selected date/station combination.');
      }
    } catch (err) {
      console.error("Failed to fetch trains", err);
      setError("Failed to fetch trains. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFromStationSearch = (value: string) => {
    setFromStation(value);
    setShowFromDropdown(true);

    if (value.length > 0) {
      const filtered = stations.filter(s =>
        s.station_code.toLowerCase().includes(value.toLowerCase()) ||
        s.station_name.toLowerCase().includes(value.toLowerCase()) ||
        s.city.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredFromStations(filtered.slice(0, 10));
    } else {
      setFilteredFromStations(stations.slice(0, 50));
    }
  };

  const handleToStationSearch = (value: string) => {
    setToStation(value);
    setShowToDropdown(true);

    if (value.length > 0) {
      const filtered = stations.filter(s =>
        s.station_code.toLowerCase().includes(value.toLowerCase()) ||
        s.station_name.toLowerCase().includes(value.toLowerCase()) ||
        s.city.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredToStations(filtered.slice(0, 10));
    } else {
      setFilteredToStations(stations.slice(0, 50));
    }
  };

  const handleSelectFromStation = (station: Station) => {
    setFromStation(station.station_code);
    setShowFromDropdown(false);
  };

  const handleSelectToStation = (station: Station) => {
    setToStation(station.station_code);
    setShowToDropdown(false);
  };

  const handleSearch = () => {
    if (!fromStation || !toStation) {
      setError("Please select both stations");
      return;
    }
    
    
    fetchTrains(fromStation, toStation, travelDate);
    
    const params = new URLSearchParams();
    params.set('from', fromStation);
    params.set('to', toStation);
    if (travelDate) params.set('date', travelDate);
    
    router.push(`/search?${params.toString()}`);
  };

  const handleBook = (scheduleId: string) => {
    router.push(`/booking?schedule=${scheduleId}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold tracking-tighter">
            RAILX
          </Link>
          <div className="flex gap-4">
            <Link href="/search" className="px-4 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all">
              New Search
            </Link>
            <Link href="/dashboard" className="px-4 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">Available Trains</h1>
          <p className="text-gray-400">
            {travelDate ? new Date(travelDate).toLocaleDateString() : "Any date"} | {trains.length} train{trains.length !== 1 ? 's' : ''} found
          </p>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-12"
        >
          <h2 className="text-xl font-bold mb-6">Search Trains</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {}
            <div className="relative">
              <label className="block text-sm font-medium mb-2">From Station</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter station code or name"
                  value={fromStation}
                  onChange={(e) => handleFromStationSearch(e.target.value)}
                  onFocus={() => {
                    setShowFromDropdown(true);
                    if (!fromStation) setFilteredFromStations(stations.slice(0, 50));
                  }}
                  onBlur={() => setTimeout(() => setShowFromDropdown(false), 150)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white/40 text-white placeholder-gray-400 transition-colors"
                />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {showFromDropdown && filteredFromStations.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-black border border-white/20 rounded-lg max-h-64 overflow-y-auto">
                  {filteredFromStations.map(station => (
                    <button
                      key={station._id}
                      type="button"
                      onClick={() => handleSelectFromStation(station)}
                      className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/5 last:border-b-0"
                    >
                      <div className="font-medium">{station.station_name}</div>
                      <div className="text-sm text-gray-400">{station.station_code} • {station.city}, {station.state}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {}
            <div className="relative">
              <label className="block text-sm font-medium mb-2">To Station</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter station code or name"
                  value={toStation}
                  onChange={(e) => handleToStationSearch(e.target.value)}
                  onFocus={() => {
                    setShowToDropdown(true);
                    if (!toStation) setFilteredToStations(stations.slice(0, 50));
                  }}
                  onBlur={() => setTimeout(() => setShowToDropdown(false), 150)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white/40 text-white placeholder-gray-400 transition-colors"
                />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {showToDropdown && filteredToStations.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-black border border-white/20 rounded-lg max-h-64 overflow-y-auto">
                  {filteredToStations.map(station => (
                    <button
                      key={station._id}
                      type="button"
                      onClick={() => handleSelectToStation(station)}
                      className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/5 last:border-b-0"
                    >
                      <div className="font-medium">{station.station_name}</div>
                      <div className="text-sm text-gray-400">{station.station_code} • {station.city}, {station.state}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {}
            <div>
              <label className="block text-sm font-medium mb-2">Travel Date</label>
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-white/40 text-white transition-colors"
              />
            </div>

            {}
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full px-6 py-2 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition-all"
              >
                Search
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}
        </motion.div>

        {}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading trains...</p>
          </div>
        ) : trains.length === 0 ? (
          <div className="text-center py-20">
            <Train className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-semibold mb-2">No trains found</h3>
            <p className="text-gray-400 mb-4">Try different dates or stations</p>
          </div>
        ) : (
          <div className="space-y-4">
            {trains.map((train, idx) => (
              <motion.div
                key={train._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-white/30 transition-all"
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  {}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Train className="w-5 h-5" />
                      <h3 className="text-lg font-bold">{train.train_name}</h3>
                    </div>
                    <div className="text-sm text-gray-400 space-y-1">
                      <p>{train.train_number} • {train.train_type}</p>
                    </div>
                  </div>

                  {}
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between md:justify-start gap-4">
                      <div>
                        <p className="font-medium text-lg">{train.from_station_name}</p>
                        <p className="text-sm text-gray-400">{train.from_city}</p>
                      </div>
                      <div className="text-2xl text-gray-400">→</div>
                      <div>
                        <p className="font-medium text-lg">{train.to_station_name}</p>
                        <p className="text-sm text-gray-400">{train.to_city}</p>
                      </div>
                    </div>
                  </div>

                  {}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{new Date(train.travel_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{train.available_seats} seats left</span>
                    </div>
                  </div>

                  {}
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-3xl font-bold flex items-center gap-1">
                      <span className="text-sm text-gray-400">₹</span>
                      {train.base_fare}
                    </div>
                    <button
                      onClick={() => handleBook(train._id)}
                      className="px-6 py-2 bg-white text-black rounded-full font-semibold hover:bg-white/90 transition-all text-sm"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
