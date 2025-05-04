// src/App.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Kita akan gunakan CSS sederhana lagi

// Fungsi Helper untuk memproses data forecast list dari API
const processForecastData = (list) => {
  if (!list || list.length === 0) { return []; }
  const dailyData = {};
  list.forEach(item => {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0];
    if (!dailyData[date]) { dailyData[date] = { temps: [], icons: [], descriptions: [] }; }
    if (item.main && item.main.temp) { dailyData[date].temps.push(item.main.temp); }
    if (item.weather && item.weather[0]) {
        dailyData[date].icons.push(item.weather[0].icon);
        dailyData[date].descriptions.push(item.weather[0].description);
    }
  });
  const processedForecast = Object.keys(dailyData).map(date => {
    const dayInfo = dailyData[date];
    if (!dayInfo.temps || dayInfo.temps.length === 0) { return null; }
    const minTemp = Math.min(...dayInfo.temps);
    const maxTemp = Math.max(...dayInfo.temps);
    const icon = dayInfo.icons[0] || 'unknown';
    const description = dayInfo.descriptions[0] || 'tidak tersedia';
    const dateObj = new Date(date + 'T00:00:00');
    const formattedDate = dateObj.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
    return { date: formattedDate, minTemp: Math.round(minTemp), maxTemp: Math.round(maxTemp), icon: icon, description: description };
  }).filter(day => day !== null).slice(0, 5);
  return processedForecast;
};

// Komponen App Utama
function App() {
  // State Variables
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // === MASUKKAN API KEY ANDA DI SINI ===
  const apiKey = '339da1d9ef3fd8a933f3d9d1a6b00d08'; // Ganti jika perlu
  // ====================================

  // Fungsi Fetch Weather (Current & Forecast)
  const fetchWeather = async () => {
    if (!city) { setError("Silakan masukkan nama kota."); return; }
    setLoading(true); setError(null); setWeatherData(null); setDailyForecast([]);
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=id`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=id`;
    try {
      const [currentWeatherResponse, forecastResponse] = await Promise.all([
        axios.get(currentWeatherUrl), axios.get(forecastUrl)
      ]);
      setWeatherData(currentWeatherResponse.data);
      const processedData = processForecastData(forecastResponse?.data?.list);
      setDailyForecast(processedData);
      console.log("Current Weather:", currentWeatherResponse.data);
      console.log("Processed Daily Forecast:", processedData);
    } catch (err) {
      console.error("Error fetching weather data:", err);
      let errorMessage = "Terjadi kesalahan saat mengambil data.";
      if (err.response) { errorMessage = `Gagal: ${err.response.data?.message || 'Error server.'} (Status: ${err.response.status})`; }
      else if (err.request) { errorMessage = "Tidak dapat terhubung ke server cuaca."; }
      setError(errorMessage); setWeatherData(null); setDailyForecast([]);
    } finally { setLoading(false); }
  };

  // Fungsi Handle Key Press
   const handleKeyPress = (event) => {
    if (event.key === 'Enter') { fetchWeather(); }
   };

  // JSX Tampilan
  return (
    <div className="App"> {/* Menggunakan class App dari App.css */}
      <h1>Aplikasi Cuaca (React - Dasar)</h1>
      <div className="input-area"> {/* Menggunakan class input-area dari App.css */}
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Masukkan nama kota..."
        />
        <button onClick={fetchWeather} disabled={loading}>
          {loading ? 'Mencari...' : 'Cari Cuaca'}
        </button>
      </div>

      {/* Tampilkan Error */}
      {error && <p className="error-text">{error}</p>}

      {/* Tampilkan Cuaca Saat Ini */}
      {weatherData && !error && (
        <div className="weather-info"> {/* Menggunakan class weather-info dari App.css */}
          <h2>{weatherData.name}, {weatherData.sys?.country}</h2>
          <div className='weather-details'>
             <img
               src={`https://openweathermap.org/img/wn/${weatherData.weather[0]?.icon}@2x.png`}
               alt={weatherData.weather[0]?.description}
             />
             <div>
               <p className='temperature'>{Math.round(weatherData.main?.temp)}°C</p>
               <p className='description'>{weatherData.weather[0]?.description}</p>
             </div>
          </div>
          <div className='extra-details'>
              <p>Kelembapan: {weatherData.main?.humidity}%</p>
              <p>Angin: {weatherData.wind?.speed} m/s</p>
              <p>Terasa seperti: {Math.round(weatherData.main?.feels_like)}°C</p>
          </div>
        </div>
      )}

      {/* Tampilkan Prakiraan Harian (Tampilan Teks Sederhana) */}
      {/* Kondisi yang sudah dipastikan bekerja sebelumnya */}
      {!loading && !error && dailyForecast.length > 0 && (
        <div className="forecast-preview"> {/* Menggunakan class forecast-preview dari App.css */}
          <h3>Prakiraan 5 Hari:</h3>

      {dailyForecast.map((day, index) => (
  <div key={index} className="forecast-day-item" style={{ display: 'flex', alignItems: 'center', borderBottom: '1px dashed #eee', paddingBottom: '5px', marginBottom: '5px' }}>
    <img
      src={`https://openweathermap.org/img/wn/${day.icon}.png`} // <-- Membuat URL gambar dari kode ikon
      alt={day.description} // Teks alternatif jika gambar gagal dimuat
      style={{ width: '35px', height: '35px', marginRight: '10px' }} // Atur ukuran ikon kecil & beri jarak
    />
    <span> {/* Bungkus teks dengan span */}
      {day.date}: Min {day.minTemp}°C, Max {day.maxTemp}°C ({day.description}) {/* Tampilkan deskripsi juga */}
    </span>
  </div>
    ))}
        </div>
      )}
    </div>
  );
}

export default App;