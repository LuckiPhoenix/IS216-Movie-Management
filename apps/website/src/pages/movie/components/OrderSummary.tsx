import { ChevronRight } from "lucide-react";

interface OrderSummaryProps {
  onComplete: () => void;
  isFormValid: boolean;
  total: number;
}

export default function OrderSummary({
  onComplete,
  isFormValid,
  total,
}: OrderSummaryProps) {
  return (
    <div className="bg-tickify-card border border-white/5 rounded-[2.5rem] p-8 h-fit sticky top-8 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
      <h2 className="text-xl font-display font-bold mb-8">Order Summary</h2>

      <div className="space-y-6 mb-8">
        <div>
          <h3 className="text-tickify-pink font-bold text-sm mb-1">
            Deadpool & Wolverine
          </h3>
          <p className="text-xs text-gray-500 font-medium">10:00 AM</p>
        </div>

        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
            Selected Seats
          </h4>
          <div className="flex justify-between text-xs">
            <span className="text-gray-300">D10 (premium)</span>
            <span className="font-bold text-white">฿150</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-300">D11 (premium)</span>
            <span className="font-bold text-white">฿150</span>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
            Snacks & Drinks
          </h4>
          <div className="flex justify-between text-xs">
            <span className="text-gray-300">Large Classic Popcorn x1</span>
            <span className="font-bold text-white">฿85</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-300">Medium Caramel Popcorn x1</span>
            <span className="font-bold text-white">฿75</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-300">Iced Coffee x4</span>
            <span className="font-bold text-white">฿260</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 border-t border-white/5 pt-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 font-bold">Subtotal</span>
          <span className="text-white font-bold">฿720</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 font-bold">Service Fee</span>
          <span className="text-white font-bold">฿25</span>
        </div>
        <div className="flex items-center justify-between pt-4">
          <span className="text-lg font-display font-bold text-white">
            Total
          </span>
          <span className="text-2xl font-display font-bold text-tickify-pink">
            ฿{total}
          </span>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <button
          onClick={onComplete}
          disabled={!isFormValid}
          className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
            isFormValid
              ? "bg-tickify-pink text-white shadow-[0_0_20px_rgba(255,0,128,0.4)] hover:shadow-[0_0_30px_rgba(255,0,128,0.6)]"
              : "bg-white/5 text-gray-600 cursor-not-allowed"
          }`}
        >
          {isFormValid ? `Pay ฿${total}` : "Complete Card Details"}
          <ChevronRight size={18} />
        </button>

        <ul className="space-y-3">
          {[
            "Payment is secure and encrypted with bank-level security",
            "Tickets will be sent to your email instantly",
            "Refunds available up to 2 hours before showtime",
            "24/7 customer support available",
          ].map((text, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-[10px] font-bold text-gray-600"
            >
              <div className="w-1 h-1 rounded-full bg-gray-700 mt-1.5 shrink-0"></div>
              {text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
