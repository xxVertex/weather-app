import { Wind, Droplets, Eye, Thermometer, Gauge, Sun } from "lucide-react";
import { interpretWeatherCode } from "../hooks/useWeather";
import { getWindDirection, formatTime } from "../utils/helpers";

export default function CurrentWeather({ current, daily, locationName, theme }) {
  const { temperature_2m, apparent_temperature, relative_humidity_2m,
          wind_speed_10m, wind_direction_10m, weather_code, is_day,
          visibility, uv_index } = current;

  const wx = interpretWeatherCode(weather_code, is_day === 1);
  const sunrise = formatTime(daily.sunrise[0]);
  const sunset  = formatTime(daily.sunset[0]);

  const stats = [
    { icon: <Thermometer size={16}/>, label: "Feels like", value: `${Math.round(apparent_temperature)}°` },
    { icon: <Droplets size={16}/>,    label: "Humidity",   value: `${relative_humidity_2m}%` },
    { icon: <Wind size={16}/>,        label: "Wind",       value: `${Math.round(wind_speed_10m)} mph ${getWindDirection(wind_direction_10m)}` },
    { icon: <Eye size={16}/>,         label: "Visibility", value: visibility >= 1000 ? `${(visibility/1000).toFixed(0)} km` : `${visibility} m` },
    { icon: <Sun size={16}/>,         label: "UV Index",   value: uv_index ?? "—" },
    { icon: <Gauge size={16}/>,       label: "Sunrise / Sunset", value: `${sunrise} / ${sunset}` },
  ];

  return (
    <div className="current-weather" style={{ "--accent": theme.accent }}>
      <div className="current-weather__hero">
        <div className="current-weather__location">{locationName}</div>
        <div className="current-weather__icon">{wx.icon}</div>
        <div className="current-weather__temp">{Math.round(temperature_2m)}<span>°C</span></div>
        <div className="current-weather__condition">{wx.label}</div>
        <div className="current-weather__range">
          H: {Math.round(daily.temperature_2m_max[0])}° &nbsp;·&nbsp; L: {Math.round(daily.temperature_2m_min[0])}°
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-card__icon">{s.icon}</div>
            <div className="stat-card__label">{s.label}</div>
            <div className="stat-card__value">{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
