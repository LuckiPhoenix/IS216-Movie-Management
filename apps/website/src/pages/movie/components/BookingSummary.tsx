import { Monitor, MapPin, Star, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BookingSummaryProps {
  selectedSeats: string[];
  movieTitle: string;
  time: string;
  theater: string;
  onContinue: () => void;
  submitting?: boolean;
}

const SEAT_PRICES: Record<string, number> = {
  A: 180, B: 180, C: 180,
  D: 150, E: 150, F: 150, G: 150,
  H: 120, I: 120, J: 120
};

export default function BookingSummary({
  selectedSeats,
  movieTitle,
  time,
  theater,
  onContinue,
  submitting = false,
}: BookingSummaryProps) {
  const totalPrice = selectedSeats.reduce((sum, seatId) => {
    const row = seatId.split("-")[0];
    return sum + (SEAT_PRICES[row] || 0);
  }, 0);

  return (
    <div className="bg-tickify-card border border-white/5 rounded-[2.5rem] p-8 h-fit sticky top-8 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
      <h2 className="text-xl font-display font-bold mb-8">Booking Summary</h2>

      <div className="space-y-6 mb-10">
        <div>
          <h3 className="text-tickify-pink font-bold text-lg mb-1">{movieTitle}</h3>
          <p className="text-sm text-gray-400 font-medium">{time}</p>
        </div>

        <div className="flex items-start gap-3 text-sm text-gray-400">
          <MapPin size={16} className="text-tickify-cyan shrink-0 mt-0.5" />
          <p>{theater}</p>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Star size={16} className="text-yellow-500 fill-yellow-500" />
          <p>Rating: 4.8/5</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selectedSeats.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-12 flex flex-col items-center justify-center text-center space-y-4 border-y border-white/5"
          >
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-gray-500">
              <Monitor size={32} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Please select at least one seat</p>
              <p className="text-xs text-gray-500">Click on available seats to select them</p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="selected"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6 border-y border-white/5 py-8"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Selected Seats</span>
              <span className="text-xs font-bold text-tickify-pink">{selectedSeats.length} Seats</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map((seatId) => (
                <span key={seatId} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-bold text-white">
                  {seatId}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4">
              <span className="text-sm font-bold text-gray-400">Total Price</span>
              <span className="text-2xl font-display font-bold text-white">${totalPrice}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 space-y-4">
        <ul className="space-y-3">
          {[
            "Click on available seats to select",
            "You can select multiple seats",
            "Gray seats are already occupied",
            "VIP seats include premium amenities",
            "All prices are student-friendly!"
          ].map((text, i) => (
            <li key={i} className="flex items-start gap-3 text-[10px] font-bold text-gray-500">
              <div className="w-1 h-1 rounded-full bg-tickify-pink mt-1.5 shrink-0"></div>
              {text}
            </li>
          ))}
        </ul>

        <button
          disabled={selectedSeats.length === 0 || submitting}
          onClick={onContinue}
          className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
            selectedSeats.length > 0 && !submitting
              ? "bg-tickify-pink text-white shadow-[0_0_20px_rgba(255,0,128,0.4)] hover:shadow-[0_0_30px_rgba(255,0,128,0.6)]"
              : "bg-white/5 text-gray-600 cursor-not-allowed"
          }`}
        >
          {submitting ? "Confirming..." : selectedSeats.length > 0 ? "Continue to Snacks" : "Select Seats"}
          {!submitting && <ChevronRight size={18} />}
        </button>
      </div>
    </div>
  );
}
