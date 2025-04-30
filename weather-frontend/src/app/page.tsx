"use client";

import { FormEvent, useState, useEffect } from 'react';
import WeatherDisplay from '@/components/WeatherDisplay';
import ForecastDisplay from '@/components/ForecastDisplay';
import WeatherDetails from '@/components/WeatherDetails';
import { ForecastData, GeocodeData, WeatherData } from '@/types/weather';

export default function WeatherApp() {
  const [cityInput, setCityInput] = useState<string>('Nairobi');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [baseUrl, setBaseUrl] = useState<string>('http://127.0.0.1:8000/api');

  useEffect(() => {
    fetchWeather('Nairobi', unit);
  }, []);

  const handleUnitToggle = () => {
    const newUnit = unit === 'metric' ? 'imperial' : 'metric';
    setUnit(newUnit);
    if (cityInput && weather) {
      fetchWeather(cityInput, newUnit);
    }
  };

  const fetchWeather = async (city: string, unit: 'metric' | 'imperial') => {
    setError('');
    setLoading(true);

    try {
      const weatherRes = await fetch(`${baseUrl}/weather/current?city=${encodeURIComponent(city)}&unit=${unit}`);
      const weatherData = await weatherRes.json();
      if (!weatherRes.ok) throw new Error(weatherData.message || 'Failed to fetch weather');

      const geocodeRes = await fetch(`${baseUrl}/weather/geocode?city=${encodeURIComponent(city)}`);
      const geocodeData: GeocodeData = await geocodeRes.json();
      if (!geocodeRes.ok) throw new Error( 'Failed to geocode city');

      const { lat, lon } = geocodeData;

      const forecastRes = await fetch(`${baseUrl}/weather/forecast?lat=${lat}&lon=${lon}&unit=${unit}`);
      const forecastData: ForecastData[] = await forecastRes.json();
      if (!forecastRes.ok) throw new Error( 'Failed to fetch forecast');

      if (!Array.isArray(forecastData)) {
        throw new Error('Forecast data is not an array');
      }

      setWeather(weatherData);
      setForecast(forecastData);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!cityInput) {
      setError('Please enter a city name');
      return;
    }
    await fetchWeather(cityInput, unit);
  };

  return (
    <main className="h-screen bg-white flex p-4 gap-4">
      {/* Left Section (1/4 of the page) */}
      <div className="w-1/4 flex flex-col items-center justify-center">
        {weather && (
          <WeatherDisplay weather={weather} unit={unit} />
        )}
      </div>

      {/* Right Section (3/4 of the page) */}
      <div className="w-3/4 flex flex-col gap-5 h-100">
        {/* Top Subsection: Search and Toggle */}
        <div className="w-full flex flex-row justify-between px-4 py-1">
          <form onSubmit={handleSearch} className="flex gap-2 p-1">
            <input
              type="text"
              placeholder="Search city..."
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              className="input w-80 p-3"
            />
            <button type="submit" disabled={loading} className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition">
              {loading ? 'Loading...' : 'Go'}
            </button>
          </form>
          <div className="flex items-center gap-2 p-1">
            <span>{unit === 'metric' ? '°C' : '°F'}</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={unit === 'imperial'}
                onChange={handleUnitToggle}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Middle Subsection: 3-Day Forecast */}
        {forecast.length > 0 && (
          <ForecastDisplay forecast={forecast} unit={unit} />
        )}

        {/* Bottom Subsection: Wind and Humidity */}
        {weather && (
          <WeatherDetails weather={weather} />
        )}
      </div>
    </main>
  );
}