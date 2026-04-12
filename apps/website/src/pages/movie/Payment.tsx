import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BookingSteps from "./components/BookingSteps.tsx";
import PaymentMethodSelector from "./components/PaymentMethod.tsx";
import CardPaymentForm from "./components/CardPaymentForm.tsx";
import QRPayment from "./components/QRPayment.tsx";
import OrderSummary from "./components/OrderSummary.tsx";

const STEPS = [
  { id: 1, label: "Movies" },
  { id: 2, label: "Theater" },
  { id: 3, label: "Seats" },
  { id: 4, label: "Snacks" },
  { id: 5, label: "Payment" },
  { id: 6, label: "Confirmation" },
];

export default function Payment() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<"card" | "qr">("card");
  const [isCardValid, setIsCardValid] = useState(false);
  const isFormValid =
    paymentMethod === "qr" || (paymentMethod === "card" && isCardValid);

  return (
    <div className="pb-20">
      <BookingSteps currentStep={5} steps={STEPS} />

      <div className="px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2">
              Complete Payment
            </h1>
            <p className="text-gray-500 font-medium">
              Secure payment with multiple options including PromptPay
            </p>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/snacks")}
              className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Snacks
            </button>
            <div className="hidden md:block">
              <p className="text-[10px] font-bold text-tickify-pink uppercase tracking-widest">
                Deadpool & Wolverine
              </p>
              <p className="text-sm font-bold">
                10:00 AM • 2 seats • 3 snack items
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Payment Options */}
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-tickify-card/30 border border-white/5 rounded-[3rem] p-8 md:p-12">
              <PaymentMethodSelector
                selectedMethod={paymentMethod}
                onSelect={setPaymentMethod}
              />
            </div>

            <div className="bg-tickify-card/30 border border-white/5 rounded-[3rem] p-8 md:p-12">
              {paymentMethod === "card" ? (
                <CardPaymentForm
                  onValidationChange={(isValid) => setIsCardValid(isValid)}
                />
              ) : (
                <QRPayment />
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <OrderSummary
              total={745}
              isFormValid={isFormValid}
              onComplete={() => navigate("/confirmation")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
