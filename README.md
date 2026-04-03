# ☁ Skies — Weather App

A beautiful, atmospheric weather app built with React and powered by the completely free [Open-Meteo](https://open-meteo.com) API. No API key required.

## Features

- 📍 **Geolocation** — auto-detects your location on load
- 🔍 **City search** — search any city worldwide with autocomplete
- 🌡️ **Current conditions** — temperature, feels like, humidity, wind, UV index, visibility, sunrise/sunset
- ⏱️ **24-hour hourly forecast** — scrollable with rain probability
- 📅 **7-day daily forecast** — with visual temp range bars
- 🎨 **Dynamic theming** — background gradients shift based on weather (sunny, rainy, stormy, snowy…)
- 💎 **Glassmorphism UI** — frosted glass cards with grain texture overlay

## No API Key Needed

This app uses:
- [Open-Meteo](https://open-meteo.com) — weather data (completely free, no signup)
- [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api) — city search
- [Nominatim (OpenStreetMap)](https://nominatim.openstreetmap.org) — reverse geocoding

## Getting Started

```bash
git clone https://github.com/xxVertex/weather-app.git
cd weather-app
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Build & Deploy

```bash
npm run build
```

Deploy the `/build` folder to **Vercel**, **Netlify**, or **GitHub Pages** — works out of the box.

## Project Structure

```
src/
├── components/
│   ├── SearchBar.jsx        # City search with debounced geocoding
│   ├── CurrentWeather.jsx   # Hero section with current conditions
│   ├── HourlyForecast.jsx   # Horizontal 24h scroll
│   └── DailyForecast.jsx    # 7-day list with temp bars
├── hooks/
│   └── useWeather.js        # Open-Meteo API, geocoding, WMO codes
├── utils/
│   └── helpers.js           # Formatting, weather theming, data slicing
├── App.jsx                  # Root layout + dynamic theming
└── App.css                  # Full design system (glassmorphism)
```

## License

MIT
