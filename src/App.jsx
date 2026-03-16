import { useEffect } from "react";
import { MapPin, RefreshCw } from "lucide-react";
import { useWeather, interpretWeatherCode } from "./hooks/useWeather";
import { getWeatherTheme } from "./utils/helpers";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import HourlyForecast from "./components/HourlyForecast";
import DailyForecast from "./components/DailyForecast";
import "./App.css";

export default function App() {
  const { weather, loading, error, locationName, fetchWeather, fetchByGeolocation } = useWeather();

  // Auto-detect on mount
  useEffect(() => {
    fetchByGeolocation();
  }, [fetchByGeolocation]);

  const current = weather?.current;
  const wx = current ? interpretWeatherCode(current.weather_code, current.is_day === 1) : null;
  const theme = wx ? getWeatherTheme(wx.group, current.is_day === 1) : getWeatherTheme("clear", true);

  return (
    <div
      className="app"
      style={{
        background: `linear-gradient(160deg, ${theme.from} 0%, ${theme.mid} 50%, ${theme.to} 100%)`,
        color: theme.text,
      }}
    >
      {/* Atmospheric grain overlay */}
      <div className="grain" />

      <header className="header">
        <div className="header__brand">
          <span className="header__logo">☁</span>
          <span className="header__name">Skies</span>
        </div>
        <div className="header__controls">
          <SearchBar onSelect={(lat, lon, name) => fetchWeather(lat, lon, name)} />
          <button
            className="geo-btn"
            onClick={fetchByGeolocation}
            title="Use my location"
            style={{ "--accent": theme.accent }}
          >
            <MapPin size={17} />
          </button>
        </div>
      </header>

      <main className="main">
        {loading && (
          <div className="state-center">
            <RefreshCw size={32} className="spin" />
            <p>Fetching weather…</p>
          </div>
        )}

        {error && !loading && (
          <div className="state-center">
            <div className="error-card">
              <p>⚠️ {error}</p>
              <button className="retry-btn" onClick={fetchByGeolocation} style={{ "--accent": theme.accent }}>
                Try Again
              </button>
            </div>
          </div>
        )}

        {weather && !loading && (
          <div className="content">
            <CurrentWeather
              current={weather.current}
              daily={weather.daily}
              locationName={locationName}
              theme={theme}
            />
            <HourlyForecast hourly={weather.hourly} theme={theme} />
            <DailyForecast daily={weather.daily} theme={theme} />
          </div>
        )}

        {!weather && !loading && !error && (
          <div className="state-center">
            <div className="welcome">
              <div className="welcome__icon">🌍</div>
              <h2>Welcome to Skies</h2>
              <p>Search for a city or allow location access to see the weather.</p>
              <button className="retry-btn" onClick={fetchByGeolocation} style={{ "--accent": theme.accent }}>
                <MapPin size={15} /> Use My Location
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        Powered by <a href="https://open-meteo.com" target="_blank" rel="noreferrer">Open-Meteo</a>
      </footer>
    </div>
  );
}
