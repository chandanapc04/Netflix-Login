import tmdbApi from '../services/tmdbApi';

// Integration test to verify actual TMDB API connection
// This test makes real API calls to verify data is coming from TMDB

describe('TMDB API Integration Tests', () => {
  // Set longer timeout for API calls
  jest.setTimeout(30000);

  describe('Real API Data Verification', () => {
    it('should fetch real trending movies from TMDB API', async () => {
      try {
        const response = await tmdbApi.getTrendingMovies();
        
        // Verify response structure
        expect(response).toHaveProperty('results');
        expect(response).toHaveProperty('page');
        expect(response).toHaveProperty('total_pages');
        expect(response).toHaveProperty('total_results');
        
        // Verify we got data
        expect(response.results.length).toBeGreaterThan(0);
        
        // Verify movie data structure
        const movie = response.results[0];
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
        expect(typeof movie.vote_average).toBe('number');
        
        // Verify poster path starts with /
        if (movie.poster_path) {
          expect(movie.poster_path.startsWith('/')).toBe(true);
        }
        
        console.log('✅ Successfully fetched trending movies:', response.results.length, 'movies');
        console.log('📽️ First movie:', movie.title);
        
      } catch (error) {
        console.error('❌ Error fetching trending movies:', error);
        throw error;
      }
    });

    it('should fetch real popular movies from TMDB API', async () => {
      try {
        const response = await tmdbApi.getPopularMovies();
        
        expect(response.results.length).toBeGreaterThan(0);
        
        const movie = response.results[0];
        expect(movie.title).toBeDefined();
        expect(movie.id).toBeGreaterThan(0);
        
        console.log('✅ Successfully fetched popular movies:', response.results.length, 'movies');
        
      } catch (error) {
        console.error('❌ Error fetching popular movies:', error);
        throw error;
      }
    });

    it('should fetch real top rated movies from TMDB API', async () => {
      try {
        const response = await tmdbApi.getTopRatedMovies();
        
        expect(response.results.length).toBeGreaterThan(0);
        
        // Top rated movies should have high vote averages
        const movie = response.results[0];
        expect(movie.vote_average).toBeGreaterThan(0);
        
        console.log('✅ Successfully fetched top rated movies:', response.results.length, 'movies');
        console.log('⭐ Top rated movie:', movie.title, 'with rating:', movie.vote_average);
        
      } catch (error) {
        console.error('❌ Error fetching top rated movies:', error);
        throw error;
      }
    });

    it('should fetch real upcoming movies from TMDB API', async () => {
      try {
        const response = await tmdbApi.getUpcomingMovies();
        
        expect(response.results.length).toBeGreaterThan(0);
        
        const movie = response.results[0];
        expect(movie.release_date).toBeDefined();
        
        console.log('✅ Successfully fetched upcoming movies:', response.results.length, 'movies');
        
      } catch (error) {
        console.error('❌ Error fetching upcoming movies:', error);
        throw error;
      }
    });

    it('should search real movies from TMDB API', async () => {
      try {
        const response = await tmdbApi.searchMovies('avatar');
        
        expect(response.results.length).toBeGreaterThan(0);
        
        // Should find Avatar related movies
        const avatarMovie = response.results.find(movie => 
          movie.title.toLowerCase().includes('avatar')
        );
        
        expect(avatarMovie).toBeDefined();
        
        console.log('✅ Successfully searched movies:', response.results.length, 'results');
        console.log('🔍 Found:', avatarMovie?.title);
        
      } catch (error) {
        console.error('❌ Error searching movies:', error);
        throw error;
      }
    });
  });

  describe('Data Consistency Checks', () => {
    it('should have consistent data across different endpoints', async () => {
      try {
        const [trending, popular] = await Promise.all([
          tmdbApi.getTrendingMovies(),
          tmdbApi.getPopularMovies(),
        ]);

        // Both should return valid movie data
        expect(trending.results.length).toBeGreaterThan(0);
        expect(popular.results.length).toBeGreaterThan(0);

        // Check data structure consistency
        const trendingMovie = trending.results[0];
        const popularMovie = popular.results[0];

        // Both should have the same required fields
        const requiredFields = ['id', 'title', 'overview', 'poster_path', 'backdrop_path', 'release_date', 'vote_average', 'popularity'];
        
        requiredFields.forEach(field => {
          expect(trendingMovie).toHaveProperty(field);
          expect(popularMovie).toHaveProperty(field);
        });

        console.log('✅ Data consistency verified across endpoints');
        
      } catch (error) {
        console.error('❌ Error checking data consistency:', error);
        throw error;
      }
    });

    it('should have valid TMDB image URLs', async () => {
      try {
        const response = await tmdbApi.getTrendingMovies();
        const movie = response.results[0];

        if (movie.poster_path) {
          const posterUrl = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
          expect(posterUrl).toContain('image.tmdb.org');
          expect(posterUrl).toContain(movie.poster_path);
        }

        if (movie.backdrop_path) {
          const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
          expect(backdropUrl).toContain('image.tmdb.org');
          expect(backdropUrl).toContain(movie.backdrop_path);
        }

        console.log('✅ Image URL format verified');
        
      } catch (error) {
        console.error('❌ Error verifying image URLs:', error);
        throw error;
      }
    });
  });

  describe('API Performance Checks', () => {
    it('should respond within reasonable time', async () => {
      try {
        const startTime = Date.now();
        await tmdbApi.getTrendingMovies();
        const endTime = Date.now();
        
        const responseTime = endTime - startTime;
        
        // Should respond within 10 seconds
        expect(responseTime).toBeLessThan(10000);
        
        console.log(`✅ API responded in ${responseTime}ms`);
        
      } catch (error) {
        console.error('❌ Error checking API performance:', error);
        throw error;
      }
    });
  });
});
