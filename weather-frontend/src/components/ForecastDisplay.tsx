import { ForecastData } from '../types/weather';

const ForecastDisplay = ({ forecast, unit }: { forecast: ForecastData[]; unit: string }) => {
  return (
    <div className="flex gap-4">
      {forecast.map((day, index) => (
        <div key={index} className="bg-gray-100 card p-4 text-center flex-1 flex flex-col items-center gap-4">
          {/* Date at the Top */}
          <p className="font-semibold mb-2">
            {new Date(day.date).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
            })}
          </p>

          {/* Icon in the Center */}
          <img
            src={`http://openweathermap.org/img/wn/${day.icon}.png`}
            alt={day.description}
            className="w-12 h-12 my-2"
          />

          {/* Temperature at the Bottom */}
          <p>
            {Math.round(day.tempMax)}°-{Math.round(day.tempMin)}°{unit === 'metric' ? 'C' : 'F'}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ForecastDisplay;