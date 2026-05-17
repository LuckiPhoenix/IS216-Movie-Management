export const DEFAULT_TYPE_CONFIGS: SeatTypeConfig[] = [
  { type: "Regular", color: "#FF0080", price: 150 },
  { type: "VIP", color: "#7B2CBF", price: 250 },
  { type: "Couple", color: "#00D2FF", price: 400 },
  { type: "Blocked", color: "#374151", price: 0 },
];

export type SeatType = "Regular" | "VIP" | "Couple" | "Blocked" | "Aisle";

export interface Seat {
  id: string;
  row: number;
  col: number;
  type: SeatType;
  label: string;
}

export interface SeatTypeConfig {
  type: SeatType;
  color: string;
  price: number;
}

export interface Room {
  id: string;
  roomId: string;
  name: string;
  description: string;
  rowCount: number;
  colCount: number;
  seats: Seat[];
  seatTypeConfigs: SeatTypeConfig[];
  createdAt: string;
}
