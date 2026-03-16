export function getWindDirection(deg) {
  const dirs = ["N","NE","E","SE","S","SW","W","NW"];
  return dirs[Math.round(deg / 45) % 8];
}

export function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatDay(dateStr, index) {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  return new Date(dateStr).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}

export function formatHour(isoStr) {
  const h = new Date(isoStr).getHours();
  if (h === 0) return "12 AM";
  if (h === 12) return "12 PM";
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

// Returns the next 24 hours of hourly data aligned to current hour
export function getNext24Hours(hourly, timezone) {
  const now = new Date();
  const times = hourly.time;
  const startIdx = times.findIndex((t) => new Date(t) >= now);
  if (startIdx === -1) return [];
  return times.slice(startIdx, startIdx + 24).map((t, i) => ({
    time: t,
    temp: Math.round(hourly.temperature_2m[startIdx + i]),
    feelsLike: Math.round(hourly.apparent_temperature[startIdx + i]),
    code: hourly.weather_code[startIdx + i],
    rain: hourly.precipitation_probability[startIdx + i],
  }));
}

// Background gradient based on weather group + is_day
export function getWeatherTheme(group, isDay) {
  if (!isDay) return { from: "#0a0e1a", mid: "#111827", to: "#1e2a3a", accent: "#60a5fa", text: "#e0f2fe" };
  switch (group) {
    case "clear":   return { from: "#1a3a5c", mid: "#1e5c8c", to: "#f97316", accent: "#fbbf24", text: "#fff7ed" };
    case "cloudy":  return { from: "#374151", mid: "#4b5563", to: "#6b7280", accent: "#d1d5db", text: "#f9fafb" };
    case "overcast":return { from: "#1f2937", mid: "#374151", to: "#4b5563", accent: "#9ca3af", text: "#f3f4f6" };
    case "fog":     return { from: "#374151", mid: "#6b7280", to: "#9ca3af", accent: "#e5e7eb", text: "#f9fafb" };
    case "rain":    return { from: "#0f172a", mid: "#1e3a5f", to: "#1e40af", accent: "#93c5fd", text: "#dbeafe" };
    case "snow":    return { from: "#1e3a5f", mid: "#3b82f6", to: "#bfdbfe", accent: "#eff6ff", text: "#eff6ff" };
    case "storm":   return { from: "#0f0f1a", mid: "#1e1b4b", to: "#312e81", accent: "#a78bfa", text: "#ede9fe" };
    default:        return { from: "#1a3a5c", mid: "#1e5c8c", to: "#2563eb", accent: "#93c5fd", text: "#dbeafe" };
  }
}
