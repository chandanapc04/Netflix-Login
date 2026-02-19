import React, { useState, useEffect } from 'react';
import tmdbApi, { Movie } from './services/tmdbApi';
import authService from './services/authService';
import AuthPage from './components/AuthPage';
import './App.css';

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

const MovieRow: React.FC<MovieRowProps> = ({ title, movies }) => {
  const [scrollX, setScrollX] = useState(0);

  const handleLeftArrow = () => {
    let x = scrollX + Math.round(window.innerWidth / 2);
    if (x > 0) {
      x = 0;
    }
    setScrollX(x);
  };

  const handleRightArrow = () => {
    let x = scrollX - Math.round(window.innerWidth / 2);
    const listW = movies.length * 200;
    if ((window.innerWidth - listW) > x) {
      x = (window.innerWidth - listW) - 60;
    }
    setScrollX(x);
  };

  return (
    <div className="movieRow">
      <h2>{title}</h2>
      <div className="movieRow--left" onClick={handleLeftArrow}>
        <span style={{ fontSize: 50 }}>‹</span>
      </div>
      <div className="movieRow--right" onClick={handleRightArrow}>
        <span style={{ fontSize: 50 }}>›</span>
      </div>

      <div className="movieRow--listarea">
        <div
          className="movieRow--list"
          style={{
            marginLeft: scrollX,
            width: movies.length * 200,
          }}
        >
          {movies.length > 0 &&
            movies.map((movie) => (
              <div key={movie.id} className="movieRow--item">
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    if (authService.isAuthenticated()) {
      setIsAuthenticated(true);
      loadMovies();
    } else {
      setLoading(false);
    }
  }, []);

  const loadMovies = async () => {
    try {
      const [trending, popular, topRated, upcoming] = await Promise.all([
        tmdbApi.getTrendingMovies(),
        tmdbApi.getPopularMovies(),
        tmdbApi.getTopRatedMovies(),
        tmdbApi.getUpcomingMovies(),
      ]);

      setTrendingMovies(trending.results);
      setPopularMovies(popular.results);
      setTopRatedMovies(topRated.results);
      setUpcomingMovies(upcoming.results);

      if (trending.results.length > 0) {
        setFeaturedMovie(trending.results[0]);
      }
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    loadMovies();
  };

  const handleLogout = () => {
    authService.removeToken();
    setIsAuthenticated(false);
    // Reset movie data
    setTrendingMovies([]);
    setPopularMovies([]);
    setTopRatedMovies([]);
    setUpcomingMovies([]);
    setFeaturedMovie(null);
  };

  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="header">
        <div className="header--logo">
          <h1>MOVIE APP</h1>
        </div>
        <div className="header--user">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
          <div className="header--user--avatar">U</div>
        </div>
      </header>

      {featuredMovie && (
        <section
          className="featured"
          style={{
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundImage: `url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`,
          }}
        >
          <div className="featured--vertical">
            <div className="featured--horizontal">
              <div className="featured--name">{featuredMovie.title}</div>
              <div className="featured--info">
                <div className="featured--points">{featuredMovie.vote_average} points</div>
                <div className="featured--year">{new Date(featuredMovie.release_date).getFullYear()}</div>
              </div>
              <div className="featured--description">{featuredMovie.overview}</div>
              <div className="featured--buttons">
                <button className="featured--watchbutton">▶ Watch</button>
                <button className="featured--mylistbutton">+ My List</button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="lists">
        <MovieRow title="Trending Now" movies={trendingMovies} />
        <MovieRow title="Popular" movies={popularMovies} />
        <MovieRow title="Top Rated" movies={topRatedMovies} />
        <MovieRow title="Upcoming" movies={upcomingMovies} />
      </section>

      <footer>
        <p>Made with ❤️ using TMDB API</p>
      </footer>
    </div>
  );
};

export default App;
