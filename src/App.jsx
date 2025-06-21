// src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Star, 
  Sun, 
  Moon, 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye,
  Calendar,
  X,
  Plus,
  Cloud, 
  CloudDrizzle, 
  CloudFog, 
  CloudLightning, 
  CloudRain, 
  CloudSnow, 
  Cloudy
} from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

// Weather icon mapping
const getWeatherIcon = (iconCode) => {
  const iconMap = {
    '01d': <Sun size={48} />, '01n': <Moon size={48} />,
    '02d': <Cloudy size={48} />, '02n': <Cloudy size={48} />,
    '03d': <Cloud size={48} />, '03n': <Cloud size={48} />,
    '04d': <Cloudy size={48} />, '04n': <Cloudy size={48} />,
    '09d': <CloudDrizzle size={48} />, '09n': <CloudDrizzle size={48} />,
    '10d': <CloudRain size={48} />, '10n': <CloudRain size={48} />,
    '11d': <CloudLightning size={48} />, '11n': <CloudLightning size={48} />,
    '13d': <CloudSnow size={48} />, '13n': <CloudSnow size={48} />,
    '50d': <CloudFog size={48} />, '50n': <CloudFog size={48} />
  };
  return iconMap[iconCode] || <Sun size={48} />;
};

const getSmallWeatherIcon = (iconCode) => {
  const iconMap = {
    '01d': <Sun size={36} />, '01n': <Moon size={36} />,
    '02d': <Cloudy size={36} />, '02n': <Cloudy size={36} />,
    '03d': <Cloud size={36} />, '03n': <Cloud size={36} />,
    '04d': <Cloudy size={36} />, '04n': <Cloudy size={36} />,
    '09d': <CloudDrizzle size={36} />, '09n': <CloudDrizzle size={36} />,
    '10d': <CloudRain size={36} />, '10n': <CloudRain size={36} />,
    '11d': <CloudLightning size={36} />, '11n': <CloudLightning size={36} />,
    '13d': <CloudSnow size={36} />, '13n': <CloudSnow size={36} />,
    '50d': <CloudFog size={36} />, '50n': <CloudFog size={36} />
  };
  return iconMap[iconCode] || <Sun size={36} />;
}

// Process forecast data
const processForecastData = (list) => {
  if (!list || list.length === 0) return [];
  
  const dailyData = {};
  list.forEach(item => {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0];
    if (!dailyData[date]) {
      dailyData[date] = { temps: [], icons: [], descriptions: [] };
    }
    if (item.main && item.main.temp) {
      dailyData[date].temps.push(item.main.temp);
    }
    if (item.weather && item.weather[0]) {
      dailyData[date].icons.push(item.weather[0].icon);
      dailyData[date].descriptions.push(item.weather[0].description);
    }
  });

  return Object.keys(dailyData).map(date => {
    const dayInfo = dailyData[date];
    if (!dayInfo.temps || dayInfo.temps.length === 0) return null;
    
    const minTemp = Math.min(...dayInfo.temps);
    const maxTemp = Math.max(...dayInfo.temps);
    const icon = dayInfo.icons[0] || '01d';
    const description = dayInfo.descriptions[0] || 'Clear';
    const dateObj = new Date(date + 'T00:00:00');
    const formattedDate = dateObj.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
    
    return { 
      date: formattedDate, 
      minTemp: Math.round(minTemp), 
      maxTemp: Math.round(maxTemp), 
      icon, 
      description 
    };
  }).filter(day => day !== null).slice(0, 5);
};

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [unit, setUnit] = useState('metric');
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('weatherFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Get user's location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  // Fetch weather for user's location
  useEffect(() => {
    if (userLocation) {
      fetchWeatherByCoords(userLocation.lat, userLocation.lon);
    }
  }, [userLocation]);

  // Toggle dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError(null);
    
    try {
      const [currentWeatherResponse, forecastResponse] = await Promise.all([
        axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}&lang=en`),
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}&lang=en`)
      ]);
      
      setWeatherData(currentWeatherResponse.data);
      setDailyForecast(processForecastData(forecastResponse?.data?.list));
      setError(null);
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError("Failed to fetch weather data for your location.");
      setWeatherData(null);
      setDailyForecast([]);
    } finally {
      setLoading(false);
    }
  };

  const convertTemp = (temp) => {
    if (unit === 'imperial') {
      return Math.round((temp * 9/5) + 32);
    }
    return Math.round(temp);
  };

  const toggleFavorite = () => {
    if (!weatherData) return;
    
    const cityData = {
      name: weatherData.name,
      country: weatherData.sys.country,
      lat: weatherData.coord.lat,
      lon: weatherData.coord.lon
    };

    const isFavorite = favorites.some(fav => 
      fav.name === cityData.name && fav.country === cityData.country
    );

    if (isFavorite) {
      setFavorites(favorites.filter(fav => 
        !(fav.name === cityData.name && fav.country === cityData.country)
      ));
    } else {
      setFavorites([...favorites, cityData]);
    }
  };

  const fetchFavoriteWeather = (favorite) => {
    setCity(favorite.name);
    fetchWeatherByCoords(favorite.lat, favorite.lon);
    setShowFavorites(false);
  };

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const [currentWeatherResponse, forecastResponse] = await Promise.all([
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}&lang=en`),
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${unit}&lang=en`)
      ]);
      
      setWeatherData(currentWeatherResponse.data);
      setDailyForecast(processForecastData(forecastResponse?.data?.list));
      setError(null);
    } catch (err) {
      let errorMessage = "An error occurred while fetching data.";
      if (err.response?.status === 404) {
        errorMessage = "City not found. Please check the spelling and try again.";
      } else if (err.request) {
        errorMessage = "Unable to connect to weather server.";
      }
      setError(errorMessage);
      setWeatherData(null);
      setDailyForecast([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      fetchWeather();
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported in this browser.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoading(false);
        fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        setLoading(false);
        setError('Failed to get location. Please ensure location permission is enabled.');
      }
    );
  };

  const removeFavorite = (favoriteToRemove) => {
    setFavorites(favorites.filter(fav => 
      !(fav.name === favoriteToRemove.name && fav.country === favoriteToRemove.country)
    ));
  };

  return (
    <ErrorBoundary>
      <div className={`App`}>
        {(loading) && <LoadingSpinner message="Loading weather data..." />}
        
        {/* Header */}
        <motion.header 
          className="header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="header-left">
            <h1>WeatherBebe</h1>
            <p className="subtitle">Simple & Beautiful Weather</p>
          </div>
          <div className="header-controls">
            <button 
              className="control-btn"
              onClick={() => setUnit(unit === 'metric' ? 'imperial' : 'metric')}
              title={`Switch to ${unit === 'metric' ? 'Fahrenheit' : 'Celsius'}`}
            >
              <Thermometer size={20} />
              {unit === 'metric' ? '°C' : '°F'}
            </button>
            <button 
              className="control-btn"
              onClick={() => setDarkMode(!darkMode)}
              title={`Switch to ${darkMode ? 'Light' : 'Dark'} mode`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              className="control-btn"
              onClick={() => setShowFavorites(!showFavorites)}
              title="Favorites"
            >
              <Star size={20} />
            </button>
          </div>
        </motion.header>

        {/* Search Section */}
        <motion.section 
          className="search-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="search-container">
            <div className="search-input-wrapper">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search for a city..."
                className="search-input"
              />
              {city && (
                <button 
                  className="clear-btn"
                  onClick={() => setCity('')}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button 
              onClick={fetchWeather} 
              disabled={loading || !city.trim()}
              className="search-btn"
            >
              Search
            </button>
            <button 
              onClick={handleUseMyLocation} 
              disabled={loading}
              className="location-btn"
              title="Use my location"
            >
              <MapPin size={20} />
            </button>
          </div>
        </motion.section>

        {/* Error Display */}
        <AnimatePresence>
          {error && !weatherData && (
            <motion.div 
              className="error-container"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <p className="error-text">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Favorites Panel */}
        <AnimatePresence>
          {showFavorites && (
            <motion.div 
              className="favorites-panel"
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="favorites-header">
                <h3>Favorites</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowFavorites(false)}
                >
                  <X size={20} />
                </button>
              </div>
              {favorites.length === 0 ? (
                <p className="no-favorites">No favorite cities yet</p>
              ) : (
                <div className="favorites-list">
                  {favorites.map((favorite, index) => (
                    <motion.div 
                      key={index} 
                      className="favorite-item"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <button
                        className="favorite-city-btn"
                        onClick={() => fetchFavoriteWeather(favorite)}
                      >
                        <MapPin size={16} />
                        {favorite.name}, {favorite.country}
                      </button>
                      <button
                        className="remove-favorite-btn"
                        onClick={() => removeFavorite(favorite)}
                      >
                        <X size={14} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Weather Display */}
        <AnimatePresence>
          {weatherData && !error && (
            <motion.div 
              className="weather-container"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Current Weather */}
              <motion.div 
                className="current-weather"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="weather-header">
                  <div className="location-info">
                    <h2>{weatherData.name}, {weatherData.sys?.country}</h2>
                    <p className="weather-description">
                      {weatherData.weather[0]?.description}
                    </p>
                  </div>
                  <button 
                    className={`favorite-btn ${favorites.some(fav => 
                      fav.name === weatherData.name && fav.country === weatherData.sys.country
                    ) ? 'active' : ''}`}
                    onClick={toggleFavorite}
                    title={favorites.some(fav => 
                      fav.name === weatherData.name && fav.country === weatherData.sys.country
                    ) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Star size={24} />
                  </button>
                </div>

                <div className="weather-main">
                  <div className="temperature-section">
                    <div className="weather-icon">
                      {getWeatherIcon(weatherData.weather[0]?.icon)}
                    </div>
                    <div className="temperature-info">
                      <h1 className="temperature">
                        {convertTemp(weatherData.main?.temp)}°
                      </h1>
                      <p className="feels-like">
                        Feels like {convertTemp(weatherData.main?.feels_like)}°
                      </p>
                    </div>
                  </div>
                </div>

                <div className="weather-details">
                  <div className="detail-item">
                    <Droplets size={20} />
                    <div>
                      <p className="detail-label">Humidity</p>
                      <p className="detail-value">{weatherData.main?.humidity}%</p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <Wind size={20} />
                    <div>
                      <p className="detail-label">Wind Speed</p>
                      <p className="detail-value">
                        {weatherData.wind?.speed} {unit === 'metric' ? 'm/s' : 'mph'}
                      </p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <Eye size={20} />
                    <div>
                      <p className="detail-label">Visibility</p>
                      <p className="detail-value">
                        {(weatherData.visibility / 1000).toFixed(1)} km
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Forecast */}
              {dailyForecast.length > 0 && (
                <motion.div 
                  className="forecast-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="forecast-title">
                    <Calendar size={20} />
                    5-Day Forecast
                  </h3>
                  <div className="forecast-grid">
                    {dailyForecast.map((day, index) => (
                      <motion.div 
                        key={index} 
                        className="forecast-day"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <p className="forecast-date">{day.date}</p>
                        <div className="forecast-icon">
                          {getSmallWeatherIcon(day.icon)}
                        </div>
                        <div className="forecast-temps">
                          <span className="max-temp">{convertTemp(day.maxTemp)}°</span>
                          <span className="min-temp">{convertTemp(day.minTemp)}°</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}

export default App;