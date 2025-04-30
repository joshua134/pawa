<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\JsonResponse;

class WeatherController extends Controller
{
    private string $apiKey;
    private string $baseUrl;
    private string $geoBaseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.openweathermap.key');
        $this->baseUrl = 'https://api.openweathermap.org/data/2.5';
        $this->geoBaseUrl = 'http://api.openweathermap.org/geo/1.0';
    }

    public function geocode(Request $request): JsonResponse
    {
        $city = $request->query('city');
        if (!$city) {
            return response()->json(['message' => 'City is required'], 400);
        }

        try {
            $response = Http::get("{$this->geoBaseUrl}/direct", [
                'q' => $city,
                'limit' => 1,
                'appid' => $this->apiKey,
            ]);

            if ($response->failed() || empty($response->json())) {
                return response()->json(['message' => 'City not found'], 404);
            }

            $data = $response->json()[0];
            return response()->json([
                'lat' => $data['lat'],
                'lon' => $data['lon'],
                'city' => $data['name'],
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch geocode data'], 500);
        }
    }

    public function current(Request $request): JsonResponse
    {
        $city = $request->query('city');
        $unit = $request->query('unit', 'metric'); // Default to metric (Celsius)

        if (!$city) {
            return response()->json(['message' => 'City is required'], 400);
        }

        try {
            $response = Http::get("{$this->baseUrl}/weather", [
                'q' => $city,
                'appid' => $this->apiKey,
                'units' => $unit,
            ]);

            if ($response->failed()) {
                return response()->json(['message' => 'City not found'], 404);
            }

            $data = $response->json();
            return response()->json([
                'city' => $data['name'],
                'temperature' => $data['main']['temp'],
                'description' => $data['weather'][0]['description'],
                'icon' => $data['weather'][0]['icon'],
                'humidity' => $data['main']['humidity'],
                'windSpeed' => $data['wind']['speed'],
                'date' => date('Y-m-d', $data['dt']), // Add date field
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch weather data'], 500);
        }
    }

    public function forecast(Request $request): JsonResponse
    {
        $lat = $request->query('lat');
        $lon = $request->query('lon');
        $unit = $request->query('unit', 'metric'); // Default to metric (Celsius)

        if (!$lat || !$lon) {
            return response()->json(['message' => 'Latitude and longitude are required'], 400);
        }

        try {
            $response = Http::get("{$this->baseUrl}/forecast", [
                'lat' => $lat,
                'lon' => $lon,
                'appid' => $this->apiKey,
                'units' => $unit,
            ]);

            if ($response->failed()) {
                return response()->json(['message' => 'Forecast data not found'], 404);
            }

            $data = $response->json();
            $forecast = collect($data['list'])
                ->filter(fn($item) => strpos($item['dt_txt'], '12:00:00'))
                ->map(fn($item) => [
                    'date' => $item['dt_txt'],
                    'temperature' => $item['main']['temp'],
                    'tempMin' => $item['main']['temp_min'],
                    'tempMax' => $item['main']['temp_max'],
                    'description' => $item['weather'][0]['description'],
                    'icon' => $item['weather'][0]['icon'], // Fixed: Use $item instead of $data
                ])
                ->take(3) // Limit to 3 days
                ->values()
                ->toArray();

            return response()->json($forecast);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch forecast data'], 500);
        }
    }
}