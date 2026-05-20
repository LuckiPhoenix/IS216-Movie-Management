import React, { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import AdminMovieCard from "../admin/components/AdminMovieCard";
import MovieFormPopup from "../../components/Popups/MovieFormPopup";
import DeleteConfirmPopup from "../../components/Popups/DeleteConfirmPopup";
import { Plus } from "lucide-react";
import type { Movie } from "../../types/movie";

const MOCK_MOVIES: Movie[] = [ 
  {
    id: 1,
    title: "The Conjuring 4: Last Rites",
    description: "The Warrens face their most terrifying case yet as they investigate a series of unexplained deaths at a remote monastery.",
    duration_minutes: 112,
    rating: 8.1,
    genre: "Horror, Thriller, Supernatural",
    age_rating: "T18",
    poster_url: "https://picsum.photos/seed/horror/400/600",
    release_date: "2024-10-15",
    created_at: new Date().toISOString(),
    created_by: 1,
    updated_at: null,
    updated_by: null,
    deleted_at: null,
    deleted_by: null
  },
];

const AdminMovies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>(MOCK_MOVIES);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Movie | null>(null);
  const [editTarget, setEditTarget] = useState<Movie | null>(null);

  const handleOpenAdd = () => {
    setEditTarget(null); 
    setIsPopupOpen(true);
  };

  const handleOpenEdit = (movie: Movie) => {
    setEditTarget(movie); 
    setIsPopupOpen(true);
  };

  const handleSaveMovie = (movieData: Partial<Movie>) => {
    if (editTarget) {
        setMovies(prev => prev.map(m => m.id === editTarget.id ? { ...m, ...movieData, updated_at: new Date().toISOString() } as Movie : m));
    } else {
      const maxId = movies.length > 0 ? Math.max(...movies.map(m => m.id)) : 0;
      const newMovie: Movie = {
        ...movieData,
        id: maxId + 1,
        created_at: new Date().toISOString(),
        updated_at: null,
        deleted_at: null,
      } as Movie;
      setMovies([...movies, newMovie]);
    }
    setIsPopupOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      setMovies(movies.filter(m => m.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-10 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2 text-white">Movie Management</h1>
            <p className="text-gray-500 font-medium">Add, update or remove movies from the catalog.</p>
          </div>
        </div>

        {/* Grid Movies */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Ô Add New Movie - Giao diện Dashed */}
          <button 
            onClick={() => handleOpenAdd()}
            className="group relative aspect-2/3 border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 hover:border-tickify-pink/50 hover:bg-tickify-pink/5 transition-all duration-500"
          >
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-tickify-pink/20 transition-all">
              <Plus size={32} className="text-gray-500 group-hover:text-tickify-pink" />
            </div>
            <span className="text-xs font-black text-gray-500 uppercase tracking-widest group-hover:text-tickify-pink">
              Add New Movie
            </span>
          </button>

          {/* Danh sách phim */}
          {movies.map((movie) => (
            <AdminMovieCard 
              key={movie.id} 
              movie={movie} 
              onEdit={() => handleOpenEdit(movie)}
              onDelete={() => setDeleteTarget(movie)}
            />
          ))}
          
        </div>
      </div>

      {/* Popup Thêm phim */}
      <MovieFormPopup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)} 
        onSave={handleSaveMovie} 
        movieToEdit={editTarget}
      />

      <DeleteConfirmPopup 
        isOpen={!!deleteTarget}
        movieTitle={deleteTarget?.title || ""}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
};

export default AdminMovies;