import { WeatherData } from '../types/weather';

const WeatherDisplay = ({ weather, unit }: { weather: WeatherData; unit: string }) => {
  return (
    <div className="flex flex-col items-center bg-gray-200 justify-between h-screen p-5">
        <div className='flex flex-col items-center pb-10 gap-5 mt-10'>
            {/* Weather Icon */}
            <img
                src={`http://openweathermap.org/img/wn/${weather.icon}.png`}
                alt={weather.description}
                className="w-16 h-16 mb-2"
            />

            {/* Temperature */}
            <p className="text-4xl font-bold mb-2">
                {Math.round(weather.temperature)}°{unit === 'metric' ? 'C' : 'F'}
            </p>

            {/* Description */}
            <p className="text-lg capitalize mb-6">{weather.description}</p>
        </div>
      
        <div className='flex flex-col items-center mb-10'>
            {/* Date */}
            <p className="text-md mb-2">
                {new Date(weather.date).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                })}
            </p>

            {/* City */}
            <p className="text-xl font-semibold">{weather.city}</p>
        </div>
    </div>
  );
};

export default WeatherDisplay;