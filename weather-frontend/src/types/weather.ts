export interface WeatherData{
    city: string,
    temperature: number;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    date: string;
}

export interface ForecastData {
    date: string;
    temperature: number;
    tempMin: number;
    tempMax: number;
    description: string;
    icon: string;
}
  
export interface GeocodeData {
    city: string;
    lat: number;
    lon: number;
}