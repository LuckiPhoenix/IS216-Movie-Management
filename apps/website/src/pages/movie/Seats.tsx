import { useState } from "react";
import { ArrowLeft, Zap, Monitor } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BookingSteps from "./components/BookingSteps.tsx";
import SeatGrid from "./components/SeatGrid.tsx";
import BookingSummary from "./components/BookingSummary.tsx";

const STEPS = [
  { id: 1, label: "Movies" },
  { id: 2, label: "Theater" },
  { id: 3, label: "Seats" },
  { id: 4, label: "Snacks" },
  { id: 5, label: "Payment" },
  { id: 6, label: "Confirmation" },
];

export default function Seats() {
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const handleSeatClick = (seatId: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId],
    );
  };

  return (
    <div className="pb-20">
      <BookingSteps currentStep={3} steps={STEPS} />

      <div className="px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2">
              Select Your Seats
            </h1>
            <p className="text-gray-500 font-medium">
              The Conjuring 4: Last Rites • 11:00 AM • Tickify IMAX Central
              Plaza
            </p>
          </div>

          <button
            onClick={() => navigate("/theater")}
            className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Theater
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-tickify-card/30 border border-white/5 rounded-[3rem] p-8 md:p-12">
              <div className="flex items-center gap-3 mb-12">
                <Monitor size={20} className="text-tickify-cyan" />
                <div>
                  <h4 className="text-sm font-bold">Theater Layout</h4>
                  <p className="text-xs text-gray-500">
                    Tickify IMAX Central Plaza - Screen 1
                  </p>
                </div>
              </div>

              <SeatGrid
                selectedSeats={selectedSeats}
                onSeatClick={handleSeatClick}
              />
              <div className="mt-12 bg-green-400/5 border border-green-400/20 rounded-2xl p-6 flex items-center gap-4">
                <div className="w-10 h-10 bg-green-400/10 rounded-xl flex items-center justify-center">
                  <Zap size={20} className="text-green-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-green-400">
                    Student-Friendly Pricing!
                  </h4>
                  <p className="text-xs text-gray-400">
                    We ve made movies affordable for students - enjoy premium
                    cinema experience without breaking the bank!
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <BookingSummary
              selectedSeats={selectedSeats}
              movieTitle="The Conjuring 4: Last Rites"
              time="11:00 AM"
              theater="Tickify IMAX Central Plaza"
              onContinue={() => navigate("/snacks")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
