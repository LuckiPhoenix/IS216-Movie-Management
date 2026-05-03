import { useState } from "react";
import StaffLayout from "../../layouts/StaffLayout";
import ShowtimeSelector from "./components/ShowTimeSelector";
import POSSeatMap from "./components/POSSeatMap";
import PricingPopup from "./components/PircingPopup";
import CheckoutPanel from "./components/CheckoutPanel";
import type { Showtime } from "../../types/showtime";
import type { Movie } from "../../types/movie";
import type { Seat, SeatType, SeatTypeConfig } from "../../types/cinema";
import { motion, AnimatePresence } from "motion/react";
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

  const handleSelectShowtime = (showtime: Showtime) => {
    setSelectedShowtime(showtime);
    setStep(BookingStep.SEATS);
    setSelectedSeatIds([]);
  };

  const handleToggleSeat = (seatId: string) => {
    setSelectedSeatIds((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId],
    );
  };

  const selectedSeats = MOCK_ROOM_DATA.seats.filter((s) =>
    selectedSeatIds.includes(s.id),
  );
  const totalPrice = selectedSeats.reduce((acc, s) => {
    const config = DEFAULT_TYPE_CONFIGS.find((c) => c.type === s.type);
    return acc + (config?.price || 0);
  }, 0);

  const selectedMovie = MOCK_MOVIES.find(
    (m) => m.id === selectedShowtime?.movieId,
  );

  const getStepTitle = () => {
    switch (step) {
      case BookingStep.SHOWTIME:
        return "Quick Select Showtime";
      case BookingStep.SEATS:
        return "Select Seats";
      case BookingStep.PAYMENT:
        return "Payment Details";
      case BookingStep.TICKET:
        return "Print Ticket";
      default:
        return "Booking";
    }
  };

  return (
    <StaffLayout>
      <div className="space-y-10 max-w-7xl mx-auto pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-tickify-cyan mb-3">
              <Ticket size={24} />
              <span className="text-xs font-black uppercase tracking-[0.3em]">
                POS Terminal
              </span>
            </div>
            <h1 className="text-5xl font-display font-bold text-white tracking-tight">
              {getStepTitle()}
            </h1>
            <p className="text-gray-500 font-medium mt-2">
              Serving Customer at Counter 01
            </p>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10">
            {Object.values(BookingStep).map((s, idx) => (
              <div key={s} className="flex items-center gap-4 group">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-all ${
                    step === s
                      ? "bg-tickify-cyan text-tickify-dark shadow-[0_0_15px_rgba(0,255,242,0.4)]"
                      : idx < Object.values(BookingStep).indexOf(step)
                        ? "bg-tickify-cyan/20 text-tickify-cyan"
                        : "bg-white/5 text-gray-600"
                  }`}
                >
                  {idx + 1}
                </div>
                {idx < Object.values(BookingStep).length - 1 && (
                  <ChevronRight size={16} className="text-gray-700" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="min-h-[60vh]">
          <AnimatePresence mode="wait">
            {step === BookingStep.SHOWTIME && (
              <motion.div
                key="step-showtime"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <ShowtimeSelector
                  movies={MOCK_MOVIES}
                  showtimes={MOCK_SHOWTIMES}
                  onSelectShowtime={handleSelectShowtime}
                />
              </motion.div>
            )}

            {step === BookingStep.SEATS && (
              <motion.div
                key="step-seats"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-1 xl:grid-cols-3 gap-10"
              >
                {/* Seat Map Area */}
                <div className="xl:col-span-2 space-y-6">
                  <div className="bg-tickify-card border border-white/10 rounded-[3rem] p-12 overflow-x-auto shadow-2xl">
                    <POSSeatMap
                      rowCount={MOCK_ROOM_DATA.rowCount}
                      colCount={MOCK_ROOM_DATA.colCount}
                      seats={MOCK_ROOM_DATA.seats}
                      selectedSeatIds={selectedSeatIds}
                      bookedSeatIds={["B4", "B5", "C7"]} // Mock booked seats
                      typeConfigs={MOCK_ROOM_DATA.typeConfigs}
                      onToggleSeat={handleToggleSeat}
                    />
                  </div>
                </div>

                {/* Booking Summary Sidebar */}
                <div className="space-y-6">
                  <div className="bg-tickify-card border border-white/10 rounded-[2.5rem] p-8 sticky top-12 shadow-2xl overflow-hidden relative">
                    {/* Background Glow */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-tickify-cyan/10 rounded-full blur-3xl pointer-events-none" />

                    <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
                      <Armchair size={20} className="text-tickify-cyan" />
                      Booking Summary
                    </h3>

                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-gray-500 uppercase tracking-widest">
                          Movie
                        </span>
                        <span className="text-white text-right max-w-[150px] truncate">
                          {selectedMovie?.title}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-gray-500 uppercase tracking-widest">
                          Showtime
                        </span>
                        <span className="text-white">
                          {selectedShowtime?.startTime
                            .split("T")[1]
                            .substring(0, 5)}{" "}
                          • {selectedShowtime?.format}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-gray-500 uppercase tracking-widest">
                          Room
                        </span>
                        <span className="text-white">
                          Theater {selectedShowtime?.roomId}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-6 mb-8">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">
                        Selected Seats ({selectedSeats.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedSeats.length > 0 ? (
                          selectedSeats.map((s) => (
                            <span
                              key={s.id}
                              className="px-3 py-1.5 bg-tickify-cyan/10 border border-tickify-cyan/20 rounded-lg text-xs font-bold text-tickify-cyan"
                            >
                              {s.label}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] italic text-gray-600">
                            No seats selected yet
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-6 mb-8">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-tickify-cyan/10 flex items-center justify-center text-tickify-cyan">
                            <Wallet size={20} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                              Grand Total
                            </p>
                            <p className="text-2xl font-display font-bold text-white">
                              ${totalPrice}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <button
                        disabled={selectedSeats.length === 0}
                        onClick={() => setIsPricingOpen(true)}
                        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                          selectedSeats.length > 0
                            ? "bg-tickify-cyan text-tickify-dark shadow-[0_0_20px_rgba(0,255,242,0.4)] hover:scale-[1.02] active:scale-95"
                            : "bg-white/5 text-gray-600 cursor-not-allowed"
                        }`}
                      >
                        Confirm Seats <ArrowRight size={18} />
                      </button>
                      <button
                        onClick={() => setStep(BookingStep.SHOWTIME)}
                        className="w-full py-4 rounded-xl font-bold text-gray-500 hover:text-white transition-all text-xs uppercase tracking-widest"
                      >
                        Back
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === BookingStep.PAYMENT && (
              <motion.div
                key="step-payment"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <CheckoutPanel
                  selectedMovie={selectedMovie || null}
                  selectedShowtime={selectedShowtime}
                  selectedSeats={selectedSeats}
                  typeConfigs={MOCK_ROOM_DATA.typeConfigs}
                  totalPrice={totalPrice}
                  onBack={() => setStep(BookingStep.SEATS)}
                  onComplete={(method, amount) => {
                    console.log(
                      `Payment Complete via ${method} for $${amount}`,
                    );
                    setStep(BookingStep.TICKET);
                  }}
                />
              </motion.div>
            )}

            {step === BookingStep.TICKET && (
              <motion.div
                key="step-ticket"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="bg-tickify-card border border-white/10 rounded-[3rem] p-24 text-center flex flex-col items-center justify-center gap-10 shadow-2xl overflow-hidden relative"
              >
                {/* Background Decorations */}
                <div className="absolute top-0 inset-x-0 h-1 bg-tickify-cyan shadow-[0_0_20px_rgba(0,255,242,0.6)]" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-tickify-cyan/10 rounded-full blur-3xl" />

                <div className="w-32 h-32 bg-tickify-cyan/10 rounded-full flex items-center justify-center text-tickify-cyan border-2 border-tickify-cyan/30 shadow-[0_0_40px_rgba(0,255,242,0.2)]">
                  <CheckCircle2
                    size={64}
                    className="animate-in zoom-in duration-500"
                  />
                </div>

                <div className="max-w-md">
                  <h2 className="text-4xl font-display font-bold text-white mb-4">
                    Transaction Successful
                  </h2>
                  <p className="text-gray-500 font-medium">
                    The ticket has been printed and sent to the thermal printer.
                    Electronic copy generated as #TK-$
                    {Math.floor(Math.random() * 1000000)}.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => {
                      setStep(BookingStep.SHOWTIME);
                      setSelectedShowtime(null);
                      setSelectedSeatIds([]);
                    }}
                    className="px-10 py-5 bg-tickify-cyan text-tickify-dark font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-[0_15px_30px_rgba(0,255,242,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Serve Next Customer
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Global Popups */}
        <PricingPopup
          isOpen={isPricingOpen}
          onClose={() => setIsPricingOpen(false)}
          onConfirm={() => {
            setIsPricingOpen(false);
            setStep(BookingStep.PAYMENT);
          }}
          selectedSeats={selectedSeats}
          typeConfigs={MOCK_ROOM_DATA.typeConfigs}
          movieTitle={selectedMovie?.title || ""}
        />
      </div>
    </StaffLayout>
  );
}
