import type { Movie } from "./movie";
import type { Room } from "./cinema";
export type ShowtimeFormat = "2D" | "3D" | "IMAX" | "4DX";
export type ShowtimeLanguage = "Sub" | "Dub";

export interface Showtime {
  id: string;
  movieId: number;
  movie?: Movie;
  roomId: string;
  room?: Room;
  startTime: string;
  endTime: string;
  format: ShowtimeFormat;
  language: ShowtimeLanguage;
  price: number;
}
