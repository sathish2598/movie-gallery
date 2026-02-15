
import React, { useState, useEffect, useCallback } from 'react';
import { Search, Download, Image as ImageIcon, Film, Loader2, ArrowLeft } from 'lucide-react';
import { Movie } from './types';
import { searchMovies, getPopularMovies, getImageUrl, downloadImage } from './services/tmdb';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load popular movies by default on first visit
  useEffect(() => {
    if (movies.length === 0 && !query && !selectedMovie) {
      setLoading(true);
      setError(null);
      getPopularMovies(1)
        .then((data) => setMovies(data.results))
        .catch(() => setError('Could not load movies. Try searching instead.'))
        .finally(() => setLoading(false));
    }
  }, []);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await searchMovies(searchQuery);
      setMovies(data.results);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    }
  };

  const clearSelection = () => setSelectedMovie(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:text-blue-400 transition-colors"
            onClick={() => {
              clearSelection();
              setQuery('');
              setError(null);
              setLoading(true);
              getPopularMovies(1)
                .then((data) => setMovies(data.results))
                .catch(() => setError('Could not load movies. Try searching instead.'))
                .finally(() => setLoading(false));
            }}
          >
            <Film className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold tracking-tight">MovieGallery</h1>
          </div>

          <div className="relative w-full max-w-md group">
            <input
              type="text"
              placeholder="Search movie title..."
              className="w-full bg-slate-900 border border-slate-700 rounded-full px-5 py-2.5 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all group-hover:border-slate-500"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Search 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-400 transition-colors w-5 h-5 cursor-pointer" 
              onClick={() => handleSearch(query)}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <p className="text-slate-400 animate-pulse">Fetching high-res assets...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-500 text-center">
            {error}
          </div>
        )}

        {!loading && !selectedMovie && movies.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <div 
                key={movie.id}
                className="group relative bg-slate-900 rounded-2xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all shadow-xl"
                onClick={() => setSelectedMovie(movie)}
              >
                <div className="aspect-[2/3] overflow-hidden">
                  <img 
                    src={movie.poster_path ? getImageUrl(movie.poster_path, 'w500') : 'https://picsum.photos/500/750'} 
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                  <h3 className="font-semibold truncate">{movie.title}</h3>
                  <p className="text-xs text-slate-400">{movie.release_date?.split('-')[0]}</p>
                </div>
                <div className="p-3 bg-slate-900 border-t border-slate-800">
                  <h3 className="text-sm font-medium truncate">{movie.title}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 uppercase font-bold tracking-wider">
                      {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedMovie && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button 
              onClick={clearSelection}
              className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to search results
            </button>

            <div className="mb-10">
              <h2 className="text-4xl font-extrabold mb-2 text-white">{selectedMovie.title}</h2>
              <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">{selectedMovie.overview}</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Poster Column */}
              <div className="w-full lg:w-1/3 flex flex-col gap-4">
                <div className="relative group bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
                   <div className="absolute top-4 left-4 z-10">
                    <span className="bg-blue-600/90 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                      Poster (w500)
                    </span>
                  </div>
                  <img 
                    src={selectedMovie.poster_path ? getImageUrl(selectedMovie.poster_path, 'w500') : 'https://picsum.photos/500/750'} 
                    alt="Poster"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => selectedMovie.poster_path && downloadImage(getImageUrl(selectedMovie.poster_path, 'original'), `${selectedMovie.title}_Poster.jpg`)}
                      className="bg-white text-slate-900 p-4 rounded-full hover:scale-110 transition-transform shadow-2xl"
                    >
                      <Download className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <button 
                  disabled={!selectedMovie.poster_path}
                  onClick={() => selectedMovie.poster_path && downloadImage(getImageUrl(selectedMovie.poster_path, 'original'), `${selectedMovie.title}_Poster.jpg`)}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20"
                >
                  <Download className="w-5 h-5" />
                  Download High-Res Poster
                </button>
              </div>

              {/* Backdrop Column */}
              <div className="w-full lg:w-2/3 flex flex-col gap-4">
                <div className="relative group bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-indigo-600/90 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                      Backdrop (w1920)
                    </span>
                  </div>
                  <img 
                    src={selectedMovie.backdrop_path ? getImageUrl(selectedMovie.backdrop_path, 'w1920') : 'https://picsum.photos/1920/1080'} 
                    alt="Backdrop"
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => selectedMovie.backdrop_path && downloadImage(getImageUrl(selectedMovie.backdrop_path, 'original'), `${selectedMovie.title}_Backdrop.jpg`)}
                      className="bg-white text-slate-900 p-4 rounded-full hover:scale-110 transition-transform shadow-2xl"
                    >
                      <Download className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <button 
                  disabled={!selectedMovie.backdrop_path}
                  onClick={() => selectedMovie.backdrop_path && downloadImage(getImageUrl(selectedMovie.backdrop_path, 'original'), `${selectedMovie.title}_Backdrop.jpg`)}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/20"
                >
                  <Download className="w-5 h-5" />
                  Download Ultra-Wide Backdrop
                </button>
              </div>
            </div>
          </div>
        )}

        {!loading && movies.length === 0 && !selectedMovie && !query && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="bg-slate-900 p-8 rounded-full mb-6 border border-slate-800">
              <ImageIcon className="w-16 h-16 text-slate-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-300">Start Your Search</h2>
            <p className="text-slate-500 mt-2 text-lg">Type a movie title to explore high-definition posters and cinematic backdrops.</p>
          </div>
        )}

        {!loading && movies.length === 0 && query && !selectedMovie && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <h2 className="text-3xl font-bold text-slate-300">No Movies Found</h2>
            <p className="text-slate-500 mt-2 text-lg">We couldn't find any movies matching "{query}". Try a different title.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
          <p className="text-slate-500 text-sm">
            All imagery provided by <a href="https://www.themoviedb.org/" target="_blank" className="text-blue-400 hover:underline">The Movie Database (TMDB)</a>.
          </p>
          <div className="flex gap-6 text-slate-600 text-xs uppercase tracking-widest font-semibold">
            <span>High Fidelity Assets</span>
            <span>Fast Fetch</span>
            <span>Instant Download</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
