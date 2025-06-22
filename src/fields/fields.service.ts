import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Field } from './entities/field.entity';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { WeatherService } from '../weather/weather.service';

@Injectable()
export class FieldsService {
  constructor(
    @InjectRepository(Field)
    private fieldRepository: Repository<Field>,
    private weatherService: WeatherService,
  ) {}

  async create(createDto: CreateFieldDto, userId: number): Promise<Field> {
    const field = this.fieldRepository.create({
      ...createDto,
      user: { id: userId },
    });
    return this.fieldRepository.save(field);
  }

  async findAll(userId: number): Promise<Field[]> {
    console.log('findAll userId:', userId);
    const fields = await this.fieldRepository.find({
      where: { user: { id: userId } },
    });
    console.log('findAll fields:', fields);
    // Her tarla için hava durumu bilgisini al
    for (const field of fields) {
      try {
        const weather = await this.weatherService.getWeatherData(
          field.latitude,
          field.longitude,
        );
        field.weather = weather;
      } catch (error) {
        console.error(`Hava durumu bilgisi alınamadı: ${error.message}`);
      }
    }
    return fields;
  }

  async findAllWithoutAuth(): Promise<Field[]> {
    console.log('findAllWithoutAuth çağrıldı');
    const fields = await this.fieldRepository.find({
      relations: ['user'],
    });
    console.log('findAllWithoutAuth fields:', fields);
    // Her tarla için hava durumu bilgisini al
    for (const field of fields) {
      try {
        const weather = await this.weatherService.getWeatherData(
          field.latitude,
          field.longitude,
        );
        field.weather = weather;
      } catch (error) {
        console.error(`Hava durumu bilgisi alınamadı: ${error.message}`);
      }
    }
    return fields;
  }

  async findOne(id: number, userId: number): Promise<Field> {
    const field = await this.fieldRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!field) {
      throw new NotFoundException('Tarla bulunamadı');
    }

    try {
      const weather = await this.weatherService.getWeatherData(
        field.latitude,
        field.longitude,
      );
      field.weather = weather;
    } catch (error) {
      console.error(`Hava durumu bilgisi alınamadı: ${error.message}`);
    }

    return field;
  }

  async update(id: number, updateDto: UpdateFieldDto, userId: number): Promise<Field> {
    const field = await this.findOne(id, userId);
    Object.assign(field, updateDto);
    return this.fieldRepository.save(field);
  }

  async remove(id: number, userId: number): Promise<void> {
    const field = await this.findOne(id, userId);
    await this.fieldRepository.remove(field);
  }

  async getFieldAnalytics(id: number, userId: number) {
    const field = await this.findOne(id, userId);
    if (!field) return null;

    // Son toprak analizi
    const latestSoilAnalysis = field.soilAnalyses.sort(
      (a, b) => b.analysisDate.getTime() - a.analysisDate.getTime(),
    )[0];

    // Son gübre uygulaması
    const latestFertilizer = field.fertilizerRecords.sort(
      (a, b) => b.applicationDate.getTime() - a.applicationDate.getTime(),
    )[0];

    // Son bitki büyüme kaydı
    const latestCropGrowth = field.cropGrowths.sort(
      (a, b) => b.measurementDate.getTime() - a.measurementDate.getTime(),
    )[0];

    return {
      field,
      latestSoilAnalysis,
      latestFertilizer,
      latestCropGrowth,
    };
  }
} 