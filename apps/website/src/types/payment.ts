export type PaymentMethod = "CASH" | "VNPAY";
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

export interface Payment {
  id: number;
  bookingId: number | null;
  orderId: number | null;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  paidAt: string | null;
}

export interface PaymentRequest {
  bookingId: number | null;
  orderId: number | null;
  amount: number;
  method: PaymentMethod;
}
