import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock3, User2, Film, MonitorPlay, Timer } from "lucide-react";

import StaffLayout from "../../layouts/StaffLayout";
import ShowtimeSelector from "./components/ShowtimeSelector";
import POSSeatMap from "./components/POSSeatMap";
import CheckoutPanel from "./components/CheckoutPanel";
import PricingPopup from "./components/PircingPopup";
import PaymentSuccessModal from "./components/PaymentSuccessModal";

import type { Movie } from "../../types/movie";
import type { Showtime } from "../../types/showTime";
import type { Seat, SeatTypeConfig } from "../../types/cinema";

import {
  ChevronRight,
  Ticket,
  Armchair,
  Wallet,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

// Mock Data for Seats
const DEFAULT_TYPE_CONFIGS: SeatTypeConfig[] = [
  { type: "Regular", color: "#00D2FF", price: 120 },
  { type: "VIP", color: "#FFB700", price: 180 },
  { type: "Couple", color: "#7B2CBF", price: 250 },
  { type: "Blocked", color: "#1f2937", price: 0 },
  { type: "Aisle", color: "#000000", price: 0 },
];

const generateMockSeats = (rowCount: number, colCount: number): Seat[] => {
  const seats: Seat[] = [];
  const rowLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  for (let r = 0; r < rowCount; r++) {
    for (let c = 0; c < colCount; c++) {
      let type: SeatType = "Regular";
      if (r >= 6) type = "VIP";
      if (r === rowCount - 1) type = "Couple";
      if (c === 3 || c === 8) type = "Aisle";

      seats.push({
        id: `${rowLabels[r]}${c + 1}`,
        row: r,
        col: c,
        type,
        label: `${rowLabels[r]}${c + 1}`,
      });
    }
  }
  return seats;
};

const MOCK_ROOM_DATA = {
  rowCount: 10,
  colCount: 12,
  seats: generateMockSeats(10, 12),
  typeConfigs: DEFAULT_TYPE_CONFIGS,
};

const MOCK_MOVIES: Movie[] = [
  {
    id: 1,
    title: "Godzilla x Kong: The New Empire",
    description: "Two ancient titans, Godzilla and Kong, clash in an epic battle as humans unravel their intertwined origins and connection to Skull Island's mysteries.",
    duration_minutes: 115,
    rating: 8.5,
    genre: "Action, Sci-Fi",
    age_rating: "T13",
    poster_url: "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&q=80&w=500",
    release_date: "2024-03-27",
    created_at: new Date().toISOString(),
    created_by: 1,
    updated_at: null,
    updated_by: null,
    deleted_at: null,
    deleted_by: null
  },
  {
    id: 2,
    title: "Dune: Part Two",
    description: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
    duration_minutes: 166,
    rating: 9.0,
    genre: "Action, Adventure, Sci-Fi",
    age_rating: "T13",
    poster_url: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=500",
    release_date: "2024-03-01",
    created_at: new Date().toISOString(),
    created_by: 1,
    updated_at: null,
    updated_by: null,
    deleted_at: null,
    deleted_by: null
  },
  {
    id: 3,
    title: "Kung Fu Panda 4",
    description: "After Po is tapped to become the Spiritual Leader of the Valley of Peace, he needs to find and train a new Dragon Warrior.",
    duration_minutes: 94,
    rating: 7.8,
    genre: "Animation, Comedy, Family",
    age_rating: "K",
    poster_url: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=500",
    release_date: "2024-03-08",
    created_at: new Date().toISOString(),
    created_by: 1,
    updated_at: null,
    updated_by: null,
    deleted_at: null,
    deleted_by: null
  }
];

const now = new Date();
const today = now.toISOString().split("T")[0];

const MOCK_SHOWTIMES: Showtime[] = [
  {
    id: "st-1",
    movieId: 1,
    roomId: "R1",
    startTime: `${today}T10:00:00`,
    endTime: `${today}T12:00:00`,
    format: "3D",
    language: "Sub",
    price: 150,
  },
  {
    id: "st-2",
    movieId: 1,
    roomId: "R2",
    startTime: `${today}T14:30:00`,
    endTime: `${today}T16:30:00`,
    format: "2D",
    language: "Dub",
    price: 120,
  },
  {
    id: "st-3",
    movieId: 2,
    roomId: "R1",
    startTime: `${today}T13:00:00`,
    endTime: `${today}T15:45:00`,
    format: "IMAX",
    language: "Sub",
    price: 250,
  },
  {
    id: "st-4",
    movieId: 2,
    roomId: "R3",
    startTime: `${today}T19:00:00`,
    endTime: `${today}T21:45:00`,
    format: "IMAX",
    language: "Sub",
    price: 250,
  },
  {
    id: "st-5",
    movieId: 3,
    roomId: "R4",
    startTime: `${today}T11:15:00`,
    endTime: `${today}T12:50:00`,
    format: "2D",
    language: "Dub",
    price: 100,
  },
];

const BookingStep = {
  SHOWTIME: "showtime",
  SEATS: "seats",
  PAYMENT: "payment",
  TICKET: "ticket",
} as const;

type BookingStep = (typeof BookingStep)[keyof typeof BookingStep];

export default function StaffPOS() {
  const [step, setStep] = useState<BookingStep>(BookingStep.SHOWTIME);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(
    null,
  );
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);

  const [isPricingOpen, setIsPricingOpen] = useState(false);

  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  const [bookingCode, setBookingCode] = useState("");

  // Clock updater
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle showtime selection
  const handleSelectShowtime = (showtime: Showtime) => {
    const movie = MOCK_MOVIES.find((m: { id: number; }) => m.id === showtime.movieId) || null;

    setSelectedMovie(movie);
    setSelectedShowtime(showtime);

    // Reset selected seats when changing showtime
    setSelectedSeatIds([]);
  };

  // Toggle seat selection
  const handleToggleSeat = (seatId: string) => {
    setSelectedSeatIds((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId);
      }

      return [...prev, seatId];
    });
  };

  // Selected seats object list
  const selectedSeats = useMemo(() => {
    return MOCK_ROOM_DATA.seats.filter((seat: { id: string; }) =>
      selectedSeatIds.includes(seat.id),
    );
  }, [selectedSeatIds]);

  // Total price
  const totalPrice = useMemo(() => {
    return selectedSeats.reduce((total: number, seat: { type: string; }) => {
      const config = MOCK_ROOM_DATA.typeConfigs.find(
        (c: SeatTypeConfig) => c.type === seat.type,
      );

      return total + (config?.price || 0);
    }, 0);
  }, [selectedSeats]);

  // Simulated booked seats
  const bookedSeatIds = useMemo(() => {
    return MOCK_ROOM_DATA.seats
      .filter((seat: Seat) => seat.type === "Blocked")
      .map((seat: Seat) => seat.id);
  }, []);

  const resetPOS = () => {
    setSelectedSeatIds([]);
    setSelectedShowtime(null);
    setSelectedMovie(null);

    setIsPaymentSuccess(false);
    setBookingCode("");
  };

  return (
    <StaffLayout>
      <div className="min-h-screen bg-slate-950 text-white px-6 py-6 space-y-6">
        {/* POS Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2.5rem] border border-white/[0.06] bg-slate-900/70 backdrop-blur-xl px-8 py-6 shadow-2xl"
        >
          {/* Glow */}
          <div className="absolute -top-24 right-0 w-72 h-72 bg-tickify-cyan/10 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            {/* Left */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-tickify-cyan/10 border border-tickify-cyan/20 flex items-center justify-center text-tickify-cyan shadow-[0_0_20px_rgba(0,255,242,0.15)]">
                  <Film size={22} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500 font-black">
                    Ticket POS System
                  </p>

                  <h1 className="text-3xl font-display font-bold text-white">
                    Cinema Counter
                  </h1>
                </div>
              </div>

              {selectedMovie && selectedShowtime ? (
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2">
                    <Film size={14} className="text-tickify-cyan" />
                    <span className="font-bold text-white">
                      {selectedMovie.title}
                    </span>
                  </div>

                  <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2">
                    <Timer size={14} className="text-tickify-cyan" />
                    <span className="font-bold text-white">
                      {new Date(selectedShowtime.startTime).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        },
                      )}
                    </span>
                  </div>

                  <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2">
                    <MonitorPlay
                      size={14}
                      className="text-tickify-cyan"
                    />
                    <span className="font-bold text-white">
                      Room {selectedShowtime.roomId}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  Select a movie showtime to begin ticket booking.
                </p>
              )}
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">
              <div className="px-5 py-4 rounded-2xl bg-white/5 border border-white/10 min-w-[160px]">
                <div className="flex items-center gap-2 text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">
                  <User2 size={12} />
                  Cashier
                </div>

                <p className="text-white font-bold text-sm">
                  Staff Counter #01
                </p>
              </div>

              <div className="px-5 py-4 rounded-2xl bg-white/5 border border-white/10 min-w-[160px]">
                <div className="flex items-center gap-2 text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">
                  <Clock3 size={12} />
                  Current Time
                </div>

                <p className="text-white font-display font-bold text-lg tracking-wide">
                  {currentTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Showtime Selection */}
        {!selectedShowtime && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ShowtimeSelector
              movies={MOCK_MOVIES}
              showtimes={MOCK_SHOWTIMES}
              onSelectShowtime={handleSelectShowtime}
            />
          </motion.div>
        )}

        {/* Main POS Layout */}
        <AnimatePresence>
          {selectedShowtime && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6"
            >
              {/* Seat Map */}
              <div className="rounded-[2.5rem] border border-white/[0.06] bg-slate-900/60 backdrop-blur-xl p-8 overflow-hidden">
                <POSSeatMap
                  rowCount={MOCK_ROOM_DATA.rowCount}
                  colCount={MOCK_ROOM_DATA.colCount}
                  seats={MOCK_ROOM_DATA.seats}
                  selectedSeatIds={selectedSeatIds}
                  bookedSeatIds={bookedSeatIds}
                  typeConfigs={MOCK_ROOM_DATA.typeConfigs}
                  onToggleSeat={handleToggleSeat}
                />
              </div>

              {/* Checkout Panel */}
              <div className="sticky top-6 h-fit">
                <CheckoutPanel
                  selectedMovie={selectedMovie}
                  selectedShowtime={selectedShowtime}
                  selectedSeats={selectedSeats}
                  typeConfigs={MOCK_ROOM_DATA.typeConfigs}
                  totalPrice={totalPrice}
                  onBack={() => setSelectedSeatIds([])}
                  onComplete={() => {
                    setIsPricingOpen(true);
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pricing Popup */}
        <PricingPopup
          isOpen={isPricingOpen}
          onClose={() => setIsPricingOpen(false)}
          onConfirm={() => {
            setIsPricingOpen(false);

            const generatedCode = `TKF-${Math.floor(
              10000 + Math.random() * 90000,
            )}`;

            setBookingCode(generatedCode);

            setIsPaymentSuccess(true);
          }}
          selectedSeats={selectedSeats}
          typeConfigs={MOCK_ROOM_DATA.typeConfigs}
          movieTitle={selectedMovie?.title || ""}
        />

        <PaymentSuccessModal
          isOpen={isPaymentSuccess}
          bookingCode={bookingCode}
          totalPrice={totalPrice}
          seatLabels={selectedSeats.map((seat) => seat.label)}
          onClose={resetPOS}
        />
      </div>
    </StaffLayout>
  );
}
