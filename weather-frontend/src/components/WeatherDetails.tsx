import { WeatherData } from '../types/weather';

const WeatherDetails = ({ weather }: { weather: WeatherData }) => {
  return (
    <div className="flex gap-4">
      {/* Wind Status Box */}
      <div className="card p-5 flex-1 bg-gray-100">
        <p className="font-semibold mb-2">Wind Status</p>
        <p className="text-lg mb-2">{weather.windSpeed} m/s</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-500 h-2.5 rounded-full"
            style={{ width: `${Math.min(weather.windSpeed * 10, 100)}%` }} // Scale wind speed for the bar
          ></div>
        </div>
      </div>

      {/* Humidity Box */}
      <div className="card p-4 flex-1">
        <p className="font-semibold mb-2">Humidity</p>
        <p className="text-lg mb-2">{weather.humidity}%</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-500 h-2.5 rounded-full"
            style={{ width: `${weather.humidity}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails;