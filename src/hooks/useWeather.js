import { useState, useCallback } from "react";

// Geocoding: city name → lat/lon (Open-Meteo's free geocoding API)
export async function geocodeCity(query) {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
  );
  const data = await res.json();
  return data.results || [];
}

// Reverse geocoding: lat/lon → city name
export async function reverseGeocode(lat, lon) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
  );
  const data = await res.json();
  const city =
    data.address?.city ||
    data.address?.town ||
    data.address?.village ||
    data.address?.county ||
    "Unknown Location";
  const country = data.address?.country_code?.toUpperCase() || "";
  return { city, country };
}

// WMO weather code → description + icon
export function interpretWeatherCode(code, isDay = true) {
  const map = {
    0:  { label: "Clear Sky",         icon: isDay ? "☀️" : "🌙", group: "clear" },
    1:  { label: "Mainly Clear",      icon: isDay ? "🌤️" : "🌙", group: "clear" },
    2:  { label: "Partly Cloudy",     icon: "⛅",                  group: "cloudy" },
    3:  { label: "Overcast",          icon: "☁️",                  group: "overcast" },
    45: { label: "Foggy",             icon: "🌫️",                  group: "fog" },
    48: { label: "Icy Fog",           icon: "🌫️",                  group: "fog" },
    51: { label: "Light Drizzle",     icon: "🌦️",                  group: "rain" },
    53: { label: "Drizzle",           icon: "🌦️",                  group: "rain" },
    55: { label: "Heavy Drizzle",     icon: "🌧️",                  group: "rain" },
    61: { label: "Light Rain",        icon: "🌧️",                  group: "rain" },
    63: { label: "Rain",              icon: "🌧️",                  group: "rain" },
    65: { label: "Heavy Rain",        icon: "🌧️",                  group: "rain" },
    71: { label: "Light Snow",        icon: "🌨️",                  group: "snow" },
    73: { label: "Snow",              icon: "❄️",                  group: "snow" },
    75: { label: "Heavy Snow",        icon: "❄️",                  group: "snow" },
    77: { label: "Snow Grains",       icon: "🌨️",                  group: "snow" },
    80: { label: "Light Showers",     icon: "🌦️",                  group: "rain" },
    81: { label: "Showers",           icon: "🌧️",                  group: "rain" },
    82: { label: "Heavy Showers",     icon: "⛈️",                  group: "storm" },
    85: { label: "Snow Showers",      icon: "🌨️",                  group: "snow" },
    86: { label: "Heavy Snow Showers",icon: "❄️",                  group: "snow" },
    95: { label: "Thunderstorm",      icon: "⛈️",                  group: "storm" },
    96: { label: "Thunderstorm + Hail",icon: "⛈️",                 group: "storm" },
    99: { label: "Severe Thunderstorm",icon: "🌩️",                 group: "storm" },
  };
  return map[code] || { label: "Unknown", icon: "🌡️", group: "clear" };
}

export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationName, setLocationName] = useState("");

  const fetchWeather = useCallback(async (lat, lon, name = "") => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL("https://api.open-meteo.com/v1/forecast");
      url.searchParams.set("latitude", lat);
      url.searchParams.set("longitude", lon);
      url.searchParams.set("current", [
        "temperature_2m", "apparent_temperature", "relative_humidity_2m",
        "wind_speed_10m", "wind_direction_10m", "weather_code",
        "is_day", "precipitation", "visibility", "uv_index",
      ].join(","));
      url.searchParams.set("hourly", [
        "temperature_2m", "weather_code", "precipitation_probability",
        "apparent_temperature",
      ].join(","));
      url.searchParams.set("daily", [
        "weather_code", "temperature_2m_max", "temperature_2m_min",
        "precipitation_probability_max", "sunrise", "sunset", "uv_index_max",
        "wind_speed_10m_max",
      ].join(","));
      url.searchParams.set("wind_speed_unit", "mph");
      url.searchParams.set("timezone", "auto");
      url.searchParams.set("forecast_days", "7");

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Weather fetch failed");
      const data = await res.json();

      // Resolve location name if not provided
      let loc = name;
      if (!loc) {
        const geo = await reverseGeocode(lat, lon);
        loc = `${geo.city}${geo.country ? ", " + geo.country : ""}`;
      }
      setLocationName(loc);
      setWeather(data);
    } catch (e) {
      setError(e.message || "Failed to fetch weather");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      () => {
        setLoading(false);
        setError("Location access denied. Please search for a city.");
      }
    );
  }, [fetchWeather]);

  return { weather, loading, error, locationName, fetchWeather, fetchByGeolocation };
}
