export interface Movie {
  id: number;
  title: string;
  description: string | null;
  duration_minutes: number;
  release_date: string | null; // ISO Date string
  rating: number;
  genre: string | null;
  poster_url: string;
  
  created_at: string;
  created_by: number | null;
  updated_at: string | null;
  updated_by: number | null;
  deleted_at: string | null; 
  deleted_by: number | null;
}

export type CreateMovieInput = Omit<Movie, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;