import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  CreditCard,
  Banknote,
  Printer,
  ChevronLeft,
  Ticket,
  Calculator,
  QrCode,
} from "lucide-react";
import type { Seat, SeatTypeConfig } from "../../../types/cinema";
import type { Showtime } from "../../../types/showtime";
import type { Movie } from "../../../types/movie";

interface CheckoutPanelProps {
  selectedMovie: Movie | null;
  selectedShowtime: Showtime | null;
  selectedSeats: Seat[];
  typeConfigs: SeatTypeConfig[];
  totalPrice: number;
  onBack: () => void;
  onComplete: (paymentMethod: string, amountReceived?: number) => void;
}

const CheckoutPanel: React.FC<CheckoutPanelProps> = ({
  selectedMovie,
  selectedShowtime,
  selectedSeats,
  totalPrice,
  onBack,
  onComplete,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<
    "CASH" | "CARD" | "TRANSFER"
  >("CASH");
  const [amountReceived, setAmountReceived] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const change = useMemo(() => {
    const received = parseFloat(amountReceived) || 0;
    return Math.max(0, received - totalPrice);
  }, [amountReceived, totalPrice]);

  const canComplete = useMemo(() => {
    if (paymentMethod === "CASH") {
      return (parseFloat(amountReceived) || 0) >= totalPrice;
    }
    return true;
  }, [paymentMethod, amountReceived, totalPrice]);

  const handleFinish = () => {
    setIsProcessing(true);
    // Simulate API call and printing delay
    setTimeout(() => {
      onComplete(paymentMethod, parseFloat(amountReceived));
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
      {/* Left Column: Order Summary */}
      <div className="space-y-8">
        <div className="bg-tickify-card border border-white/10 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-tickify-cyan/5 rounded-full blur-3xl pointer-events-none" />

          <h3 className="text-2xl font-display font-bold text-white mb-8 flex items-center gap-3">
            <Ticket className="text-tickify-cyan" /> Final Invoice
          </h3>

          <div className="space-y-6">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                Movie Detail
              </span>
              <p className="text-xl font-bold text-white">
                {selectedMovie?.title}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Showtime
                </span>
                <p className="text-white font-bold">
                  {selectedShowtime?.startTime.split("T")[1].substring(0, 5)} •{" "}
                  {selectedShowtime?.format}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Room
                </span>
                <p className="text-white font-bold">
                  Theater {selectedShowtime?.roomId}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                Selected Seats
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map((s) => (
                  <span
                    key={s.id}
                    className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-gray-300"
                  >
                    {s.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-dashed border-white/10 pt-6 mt-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-400">
                  Grand Total
                </span>
                <span className="text-4xl font-display font-bold text-tickify-cyan">
                  ${totalPrice}
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-all font-bold text-xs uppercase tracking-widest px-6"
        >
          <ChevronLeft size={16} /> Edit Seats or Selection
        </button>
      </div>

      {/* Right Column: Payment & Process */}
      <div className="space-y-8">
        <div className="bg-tickify-card border border-white/10 rounded-[3rem] p-10 shadow-2xl">
          <h3 className="text-xl font-display font-bold text-white mb-8 flex items-center gap-3">
            <CreditCard className="text-tickify-cyan" /> Payment Method
          </h3>

          <div className="grid grid-cols-3 gap-4 mb-10">
            <button
              onClick={() => setPaymentMethod("CASH")}
              className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl transition-all border ${
                paymentMethod === "CASH"
                  ? "bg-tickify-cyan text-tickify-dark border-tickify-cyan shadow-[0_0_20px_rgba(0,255,241,0.3)]"
                  : "bg-white/5 border-white/10 text-gray-500 hover:bg-white/10"
              }`}
            >
              <Banknote size={24} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Cash
              </span>
            </button>
            <button
              onClick={() => setPaymentMethod("CARD")}
              className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl transition-all border ${
                paymentMethod === "CARD"
                  ? "bg-linear-to-br from-purple-500 to-blue-600 text-white border-transparent shadow-xl"
                  : "bg-white/5 border-white/10 text-gray-500 hover:bg-white/10"
              }`}
            >
              <CreditCard size={24} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Card
              </span>
            </button>
            <button
              onClick={() => setPaymentMethod("TRANSFER")}
              className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl transition-all border ${
                paymentMethod === "TRANSFER"
                  ? "bg-white text-tickify-dark border-transparent shadow-xl"
                  : "bg-white/5 border-white/10 text-gray-500 hover:bg-white/10"
              }`}
            >
              <QrCode size={24} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Transfer
              </span>
            </button>
          </div>

          <div className="space-y-6">
            {paymentMethod === "CASH" ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="relative group">
                  <Calculator
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-tickify-cyan transition-colors"
                    size={20}
                  />
                  <input
                    type="number"
                    placeholder="Enter amount received..."
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-2xl font-display font-bold text-white focus:outline-none focus:border-tickify-cyan/50 transition-all placeholder:text-gray-700"
                  />
                </div>

                <div className="bg-white/5 rounded-2xl p-6 border border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      Customer Change
                    </p>
                    <p
                      className={`text-3xl font-display font-bold ${change > 0 ? "text-green-400" : "text-gray-600"}`}
                    >
                      ${change.toFixed(2)}
                    </p>
                  </div>
                  {change > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-12 h-12 bg-green-400/10 rounded-full flex items-center justify-center text-green-400"
                    >
                      <Banknote size={24} />
                    </motion.div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center bg-white/5 rounded-2xl border border-dashed border-white/10 animate-in fade-in">
                <div className="w-16 h-16 bg-tickify-cyan/10 rounded-full flex items-center justify-center mx-auto mb-4 text-tickify-cyan">
                  <CreditCard size={32} />
                </div>
                <p className="text-gray-400 font-medium">
                  Please initiate the terminal transaction...
                </p>
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-2">
                  Waiting for response
                </p>
              </div>
            )}

            <button
              disabled={!canComplete || isProcessing}
              onClick={handleFinish}
              className={`w-full py-6 rounded-3xl font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all ${
                canComplete && !isProcessing
                  ? "bg-tickify-cyan text-tickify-dark shadow-[0_20px_40px_rgba(0,255,241,0.25)] hover:scale-[1.02] active:scale-95"
                  : "bg-white/5 text-gray-700 cursor-not-allowed"
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-4 border-tickify-dark/30 border-t-tickify-dark rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Printer size={20} />
                  Complete & Print Ticket
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPanel;
