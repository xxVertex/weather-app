import { interpretWeatherCode } from "../hooks/useWeather";
import { formatDay } from "../utils/helpers";

export default function DailyForecast({ daily, theme }) {
  const days = daily.time.map((date, i) => ({
    date,
    code: daily.weather_code[i],
    max: Math.round(daily.temperature_2m_max[i]),
    min: Math.round(daily.temperature_2m_min[i]),
    rain: daily.precipitation_probability_max[i],
    uv: daily.uv_index_max[i],
    wind: Math.round(daily.wind_speed_10m_max[i]),
  }));

  // For the temp bar, find global min/max across all days
  const allMaxes = days.map((d) => d.max);
  const allMins  = days.map((d) => d.min);
  const globalMax = Math.max(...allMaxes);
  const globalMin = Math.min(...allMins);
  const range = globalMax - globalMin || 1;

  return (
    <div className="panel">
      <h3 className="panel__title">7-Day Forecast</h3>
      <div className="daily-list">
        {days.map((day, i) => {
          const wx = interpretWeatherCode(day.code);
          const barLeft  = ((day.min - globalMin) / range) * 100;
          const barWidth = ((day.max - day.min) / range) * 100;
          return (
            <div key={i} className="day-row">
              <div className="day-row__day">{formatDay(day.date, i)}</div>
              <div className="day-row__icon">{wx.icon}</div>
              <div className="day-row__condition">{wx.label}</div>
              {day.rain > 0 && <div className="day-row__rain">💧 {day.rain}%</div>}
              <div className="day-row__temps">
                <span className="day-row__min">{day.min}°</span>
                <div className="temp-bar">
                  <div
                    className="temp-bar__fill"
                    style={{
                      left: `${barLeft}%`,
                      width: `${barWidth}%`,
                      background: `linear-gradient(to right, ${theme.accent}88, ${theme.accent})`,
                    }}
                  />
                </div>
                <span className="day-row__max">{day.max}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
