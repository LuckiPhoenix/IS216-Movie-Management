import React, { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { Movie } from "../../../types/movie";
import type { Showtime } from "../../../types/showtime";

interface ShowtimeSelectorProps {
  movies: Movie[];
  showtimes: Showtime[];
  onSelectShowtime: (showtime: Showtime) => void;
}

const ShowtimeSelector: React.FC<ShowtimeSelectorProps> = ({
  movies,
  showtimes,
  onSelectShowtime,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterUpcoming, setFilterUpcoming] = useState(false);

  // Group showtimes by movie
  const movieGroupedShowtimes = useMemo(() => {
    const grouped: Record<number, Showtime[]> = {};
    showtimes.forEach((st) => {
      if (!grouped[st.movieId]) grouped[st.movieId] = [];
      grouped[st.movieId].push(st);
    });

    // Sort showtimes within each group by time
    Object.keys(grouped).forEach((key) => {
      grouped[Number(key)].sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
      );
    });

    return grouped;
  }, [showtimes]);

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const hasShowtimes = movieGroupedShowtimes[movie.id]?.length > 0;

    if (filterUpcoming) {
      const now = new Date();
      const hasUpcoming = movieGroupedShowtimes[movie.id]?.some(
        (st) => new Date(st.startTime) > now,
      );
      return matchesSearch && hasUpcoming;
    }

    return matchesSearch && hasShowtimes;
  });

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-tickify-card/50 p-6 rounded-[2.5rem] border border-white/5">
        <div className="relative flex-1 group">
          <Search
            className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-tickify-cyan transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Search movie title for customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-tickify-cyan/50 transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterUpcoming(!filterUpcoming)}
            className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all border ${
              filterUpcoming
                ? "bg-tickify-cyan text-tickify-dark border-tickify-cyan shadow-[0_0_20px_rgba(0,255,242,0.3)]"
                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
            }`}
          >
            <Filter size={16} />
            Upcoming Only
          </button>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredMovies.map((movie) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={movie.id}
              className="group bg-tickify-card border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-tickify-cyan/30 transition-all duration-500 shadow-2xl"
            >
              <div className="flex flex-col md:flex-row">
                {/* Poster Area */}
                <div className="w-full md:w-56 shrink-0 aspect-[2/3] md:aspect-auto relative bg-tickify-dark border-r border-white/5 overflow-hidden">
                  <img
                    src={movie.poster_url}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-tickify-dark via-transparent to-transparent opacity-60" />
                </div>

                {/* Info & Showtimes Area */}
                <div className="flex-1 p-8 flex flex-col justify-between gap-6">
                  <div>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                      <div>
                        <h3 className="text-3xl font-display font-bold text-white mb-2 leading-tight">
                          {movie.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border border-white/5">
                            {movie.genre?.split(",")[0]}
                          </span>
                          <div className="w-1 h-1 bg-gray-700 rounded-full" />
                          <span className="text-[10px] font-black text-tickify-cyan uppercase tracking-[0.2em]">
                            {movie.duration_minutes} Minutes
                          </span>
                          <div className="w-1 h-1 bg-gray-700 rounded-full" />
                          <div className="flex items-center gap-1.5 text-yellow-400">
                            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                              {movie.rating} Rating
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-px flex-1 bg-linear-to-r from-white/10 to-transparent" />
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] whitespace-nowrap">
                        Today Showtimes
                      </p>
                      <div className="h-px flex-1 bg-linear-to-l from-white/10 to-transparent" />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                      {movieGroupedShowtimes[movie.id]?.map((st) => {
                        const isPast = new Date(st.startTime) < new Date();
                        return (
                          <button
                            key={st.id}
                            disabled={isPast}
                            onClick={() => onSelectShowtime(st)}
                            className={`group/time relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${
                              isPast
                                ? "bg-white/2 border-white/5 opacity-30 cursor-not-allowed"
                                : "bg-white/5 border-white/10 hover:border-tickify-cyan hover:bg-tickify-cyan/5 hover:shadow-[0_0_20px_rgba(0,255,242,0.15)] active:scale-95"
                            }`}
                          >
                            <span className="text-xl font-display font-bold text-white mb-1 group-hover/time:text-tickify-cyan transition-colors">
                              {new Date(st.startTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              })}
                            </span>
                            <span className="text-[9px] font-black text-gray-600 uppercase tracking-tighter">
                              {st.format} • {st.language}
                            </span>

                            {/* Room Label */}
                            <div className="mt-2 px-2 py-0.5 rounded-md bg-white/5 group-hover/time:bg-tickify-cyan/20 border border-white/5 group-hover/time:border-tickify-cyan/30 transition-all">
                              <span className="text-[8px] font-black text-gray-500 group-hover/time:text-tickify-cyan uppercase">
                                R{st.roomId}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredMovies.length === 0 && (
          <div className="py-24 text-center bg-tickify-card rounded-[3rem] border border-dashed border-white/10">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={32} className="text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              No movies found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters or search query.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowtimeSelector;
