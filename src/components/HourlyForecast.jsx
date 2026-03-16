import { interpretWeatherCode } from "../hooks/useWeather";
import { getNext24Hours, formatHour } from "../utils/helpers";

export default function HourlyForecast({ hourly, theme }) {
  const hours = getNext24Hours(hourly);

  return (
    <div className="panel">
      <h3 className="panel__title">24-Hour Forecast</h3>
      <div className="hourly-scroll">
        {hours.map((h, i) => {
          const wx = interpretWeatherCode(h.code);
          return (
            <div key={i} className="hour-card" style={{ "--accent": theme.accent }}>
              <div className="hour-card__time">{i === 0 ? "Now" : formatHour(h.time)}</div>
              <div className="hour-card__icon">{wx.icon}</div>
              <div className="hour-card__temp">{h.temp}°</div>
              {h.rain > 0 && (
                <div className="hour-card__rain">💧 {h.rain}%</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
