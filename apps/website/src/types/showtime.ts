export interface Showtime {
  id: number;
  movieId: number;
  roomId: number;

  startTime: string;
  endTime?: string;

  format: string;
  language: string;

  price?: number;
  status?: "SCHEDULED" | "ONGOING" | "COMPLETED";
}