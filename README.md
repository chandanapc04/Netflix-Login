# Movie App - TMDB API Integration

A React frontend application that fetches movies from the TMDB API and displays them in a Netflix-style interface.

## Features

- 🎬 **Trending Movies** - Weekly trending movies from TMDB
- 🔥 **Popular Movies** - Most popular movies
- ⭐ **Top Rated** - Highest rated movies
- 📅 **Upcoming** - Soon to be released movies
- 🔍 **Search** - Search movies by title
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Netflix-style UI** - Modern, dark theme interface

## Tech Stack

- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Axios** - HTTP client for API calls
- **TMDB API** - Movie database
- **Jest & React Testing Library** - Testing framework

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

### Running Tests

1. **Run unit tests:**
   ```bash
   npm test
   ```

2. **Run integration tests (tests actual TMDB API):**
   ```bash
   npm test -- --testPathPattern=TMDBIntegration
   ```

3. **Run tests with coverage:**
   ```bash
   npm test -- --coverage
   ```

## API Configuration

The app uses the TMDB API with the following key:
- **API Key:** `f52a112119e458b4490f42bb67f271d1`
- **Base URL:** `https://api.themoviedb.org/3`

## Project Structure

```
src/
├── services/
│   ├── tmdbApi.ts              # TMDB API service
│   └── __tests__/
│       └── tmdbApi.test.ts     # Unit tests for API service
├── __tests__/
│   └── TMDBIntegration.test.ts # Integration tests
├── App.tsx                     # Main application component
├── App.css                     # Netflix-style styling
├── index.tsx                   # Application entry point
└── index.css                   # Global styles
```

## Testing

### Unit Tests
- Mock API calls to test service logic
- Verify data structure and error handling
- Test API key usage and request parameters

### Integration Tests
- Make real API calls to TMDB
- Verify actual data is being fetched
- Test API performance and data consistency
- Validate image URLs and data formats

### Test Coverage

The test suite covers:
- ✅ API service methods
- ✅ Data structure validation
- ✅ Error handling
- ✅ Real API integration
- ✅ Data consistency checks
- ✅ Performance verification

## Features Details

### Movie Categories

1. **Trending Now** - Movies trending in the past week
2. **Popular** - Most popular movies of all time
3. **Top Rated** - Highest rated movies by TMDB users
4. **Upcoming** - Movies scheduled for future release

### UI Components

- **Header** - App logo and user avatar
- **Featured Section** - Hero banner with trending movie
- **Movie Rows** - Horizontal scrolling movie lists
- **Navigation** - Arrow buttons for scrolling movie rows
- **Loading State** - Spinner while fetching data

### Styling

- Dark theme matching Netflix design
- Smooth hover effects and transitions
- Responsive layout for mobile and desktop
- Image lazy loading and optimization

## API Endpoints Used

- `/trending/movie/week` - Get trending movies
- `/movie/popular` - Get popular movies
- `/movie/top_rated` - Get top rated movies
- `/movie/upcoming` - Get upcoming movies
- `/search/movie` - Search movies by query

## Troubleshooting

### Common Issues

1. **API Key Errors**
   - Ensure the TMDB API key is valid
   - Check if API key has proper permissions

2. **Network Issues**
   - Verify internet connection
   - Check TMDB API status

3. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

### Development Tips

- Use React DevTools for debugging
- Check browser console for API errors
- Use Network tab to inspect API requests
- Run tests frequently during development

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run the test suite
6. Submit a pull request

## License

This project is for educational purposes. TMDB API usage should comply with their terms of service.

## Acknowledgments

- TMDB for providing the movie database API
- Netflix for UI design inspiration
- React community for excellent tools and libraries
