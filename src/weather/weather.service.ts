import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  isRaining: boolean;
  isSnowing: boolean;
  timestamp: Date;
}

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('OPENWEATHER_API_KEY');
    if (!apiKey) {
      throw new Error('OPENWEATHER_API_KEY is not defined');
    }
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
  }

  async getWeatherData(latitude: number, longitude: number): Promise<WeatherData> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/weather`, {
          params: {
            lat: latitude,
            lon: longitude,
            appid: this.apiKey,
            units: 'metric',
            lang: 'tr',
          },
        }),
      );

      const data = response.data;
      const weather = data.weather[0];

      return {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        description: weather.description,
        isRaining: weather.main === 'Rain',
        isSnowing: weather.main === 'Snow',
        timestamp: new Date(data.dt * 1000),
      };
    } catch (error) {
      this.logger.error(`Hava durumu verisi alınamadı: ${error.message}`);
      throw new Error('Hava durumu verisi alınamadı');
    }
  }

  getWeatherConditions(weatherData: any) {
    if (!weatherData) return 'bilinmiyor';

    if (weatherData.isRaining) return 'yağmurlu';
    if (weatherData.isSnowing) return 'karlı';
    if (weatherData.temperature > 30) return 'çok sıcak';
    if (weatherData.temperature < 5) return 'çok soğuk';
    if (weatherData.windSpeed > 20) return 'rüzgarlı';
    
    return 'uygun';
  }
} 