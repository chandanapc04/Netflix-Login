import tmdbApi, { Movie } from '../tmdbApi';

// Mock axios to avoid actual API calls during tests
jest.mock('axios');
import axios from 'axios';
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('TMDB API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTrendingMovies', () => {
    it('should fetch trending movies successfully', async () => {
      const mockResponse = {
        data: {
          results: [
            {
              id: 1,
              title: 'Test Movie',
              overview: 'Test overview',
              poster_path: '/test_poster.jpg',
              backdrop_path: '/test_backdrop.jpg',
              release_date: '2023-01-01',
              vote_average: 8.5,
              popularity: 100,
            },
          ],
          page: 1,
          total_pages: 1,
          total_results: 1,
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await tmdbApi.getTrendingMovies();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/trending/movie/week',
        {
          params: {
            api_key: 'f52a112119e458b4490f42bb67f271d1',
          },
        }
      );

      expect(result).toEqual(mockResponse.data);
      expect(result.results).toHaveLength(1);
      expect(result.results[0].title).toBe('Test Movie');
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Network Error';
      mockedAxios.get.mockRejectedValue(new Error(errorMessage));

      await expect(tmdbApi.getTrendingMovies()).rejects.toThrow(errorMessage);
    });
  });

  describe('getPopularMovies', () => {
    it('should fetch popular movies with default page', async () => {
      const mockResponse = {
        data: {
          results: [
            {
              id: 2,
              title: 'Popular Movie',
              overview: 'Popular overview',
              poster_path: '/popular_poster.jpg',
              backdrop_path: '/popular_backdrop.jpg',
              release_date: '2023-02-01',
              vote_average: 9.0,
              popularity: 200,
            },
          ],
          page: 1,
          total_pages: 1,
          total_results: 1,
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await tmdbApi.getPopularMovies();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/movie/popular',
        {
          params: {
            api_key: 'f52a112119e458b4490f42bb67f271d1',
            page: 1,
          },
        }
      );

      expect(result.results[0].title).toBe('Popular Movie');
    });

    it('should fetch popular movies with custom page', async () => {
      const mockResponse = {
        data: {
          results: [],
          page: 2,
          total_pages: 10,
          total_results: 200,
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      await tmdbApi.getPopularMovies(2);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/movie/popular',
        {
          params: {
            api_key: 'f52a112119e458b4490f42bb67f271d1',
            page: 2,
          },
        }
      );
    });
  });

  describe('getTopRatedMovies', () => {
    it('should fetch top rated movies', async () => {
      const mockResponse = {
        data: {
          results: [
            {
              id: 3,
              title: 'Top Rated Movie',
              overview: 'Top rated overview',
              poster_path: '/top_rated_poster.jpg',
              backdrop_path: '/top_rated_backdrop.jpg',
              release_date: '2023-03-01',
              vote_average: 9.5,
              popularity: 300,
            },
          ],
          page: 1,
          total_pages: 1,
          total_results: 1,
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await tmdbApi.getTopRatedMovies();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/movie/top_rated',
        {
          params: {
            api_key: 'f52a112119e458b4490f42bb67f271d1',
          },
        }
      );

      expect(result.results[0].vote_average).toBe(9.5);
    });
  });

  describe('getUpcomingMovies', () => {
    it('should fetch upcoming movies', async () => {
      const mockResponse = {
        data: {
          results: [
            {
              id: 4,
              title: 'Upcoming Movie',
              overview: 'Upcoming overview',
              poster_path: '/upcoming_poster.jpg',
              backdrop_path: '/upcoming_backdrop.jpg',
              release_date: '2024-01-01',
              vote_average: 7.5,
              popularity: 150,
            },
          ],
          page: 1,
          total_pages: 1,
          total_results: 1,
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await tmdbApi.getUpcomingMovies();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/movie/upcoming',
        {
          params: {
            api_key: 'f52a112119e458b4490f42bb67f271d1',
          },
        }
      );

      expect(result.results[0].title).toBe('Upcoming Movie');
    });
  });

  describe('searchMovies', () => {
    it('should search movies by query', async () => {
      const mockResponse = {
        data: {
          results: [
            {
              id: 5,
              title: 'Search Result Movie',
              overview: 'Search result overview',
              poster_path: '/search_poster.jpg',
              backdrop_path: '/search_backdrop.jpg',
              release_date: '2023-04-01',
              vote_average: 8.0,
              popularity: 120,
            },
          ],
          page: 1,
          total_pages: 1,
          total_results: 1,
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await tmdbApi.searchMovies('test query');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/search/movie',
        {
          params: {
            api_key: 'f52a112119e458b4490f42bb67f271d1',
            query: 'test query',
          },
        }
      );

      expect(result.results[0].title).toBe('Search Result Movie');
    });
  });

  describe('Data Structure Validation', () => {
    it('should validate movie data structure', async () => {
      const mockMovie: Movie = {
        id: 1,
        title: 'Test Movie',
        overview: 'Test overview',
        poster_path: '/test_poster.jpg',
        backdrop_path: '/test_backdrop.jpg',
        release_date: '2023-01-01',
        vote_average: 8.5,
        popularity: 100,
      };

      const mockResponse = {
        data: {
          results: [mockMovie],
          page: 1,
          total_pages: 1,
          total_results: 1,
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await tmdbApi.getTrendingMovies();
      const movie = result.results[0];

      // Verify all required fields are present
      expect(movie).toHaveProperty('id');
      expect(movie).toHaveProperty('title');
      expect(movie).toHaveProperty('overview');
      expect(movie).toHaveProperty('poster_path');
      expect(movie).toHaveProperty('backdrop_path');
      expect(movie).toHaveProperty('release_date');
      expect(movie).toHaveProperty('vote_average');
      expect(movie).toHaveProperty('popularity');

      // Verify data types
      expect(typeof movie.id).toBe('number');
      expect(typeof movie.title).toBe('string');
      expect(typeof movie.overview).toBe('string');
      expect(typeof movie.poster_path).toBe('string');
      expect(typeof movie.backdrop_path).toBe('string');
      expect(typeof movie.release_date).toBe('string');
      expect(typeof movie.vote_average).toBe('number');
      expect(typeof movie.popularity).toBe('number');
    });
  });

  describe('API Key Validation', () => {
    it('should use the correct API key in all requests', async () => {
      const mockResponse = {
        data: { results: [], page: 1, total_pages: 1, total_results: 0 },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      await Promise.all([
        tmdbApi.getTrendingMovies(),
        tmdbApi.getPopularMovies(),
        tmdbApi.getTopRatedMovies(),
        tmdbApi.getUpcomingMovies(),
        tmdbApi.searchMovies('test'),
      ]);

      // Verify all calls use the correct API key
      mockedAxios.get.mock.calls.forEach((call) => {
        expect(call[1]?.params?.api_key).toBe('f52a112119e458b4490f42bb67f271d1');
      });
    });
  });
});
