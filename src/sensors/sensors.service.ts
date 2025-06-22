import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sensor } from './entities/sensor.entity';
import { User } from '../users/entities/user.entity';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { SensorReading } from './entities/sensor-reading.entity';
@Injectable()
export class SensorsService {
  constructor(
    @InjectRepository(Sensor)
    private readonly sensorRepository: Repository<Sensor>,
    @InjectRepository(SensorReading)
    private readonly sensorReadingRepository: Repository<SensorReading>,
  ) {}

  // CreateSensorDto parametresi ile güncellendi
  async createSensor(createSensorDto: CreateSensorDto): Promise<Sensor> {
    const existingSensor = await this.sensorRepository.findOne({
      where: { sensor_id: createSensorDto.sensor_id }
    });

    if (existingSensor) {
      throw new ConflictException('Bu sensör ID zaten kayıtlı');
    }

    const initialData = this.generateSimulatedData();

    const sensor = this.sensorRepository.create({
      ...createSensorDto,
      ...initialData,
      is_connected: false,
      last_reading_at: new Date(),
    });

    return await this.sensorRepository.save(sensor);
  }


  // Sensöre bağlan
  async connectSensor(sensorId: string, userId: number): Promise<Sensor> {
    const sensor = await this.sensorRepository.findOne({
      where: { sensor_id: sensorId }
    });

    if (!sensor) {
      throw new NotFoundException('Sensör bulunamadı');
    }

    if (sensor.is_connected) {
      throw new ConflictException('Bu sensör zaten başka bir kullanıcıya bağlı');
    }

    sensor.is_connected = true;
    sensor.user = { id: userId } as User;

    return await this.sensorRepository.save(sensor);
  }

  // Sensör verilerini güncelle ve geçmişi kaydet
  async updateSensorData(sensorId: string): Promise<Sensor> {
    const sensor = await this.sensorRepository.findOne({
      where: { sensor_id: sensorId },
    });

    if (!sensor) {
      throw new NotFoundException('Sensör bulunamadı');
    }
    if (!sensor.is_connected) {
      throw new ConflictException('Sensör bağlı değil');
    }

    const newSensorData = this.generateSimulatedData();
    const timestamp = new Date();

    // 1. Yeni okumaları SensorReading tablosuna kaydet
    const readings = Object.entries(newSensorData).map(([type, value]) =>
      this.sensorReadingRepository.create({
        sensor,
        type,
        value: value as number,
        timestamp,
      }),
    );
    await this.sensorReadingRepository.save(readings);

    // 2. Ana Sensor tablosundaki son değerleri güncelle
    Object.assign(sensor, newSensorData);
    sensor.last_reading_at = timestamp;

    return await this.sensorRepository.save(sensor);
  }

  // Belirli bir sensörün geçmiş okumalarını getir
  async getSensorHistory(sensorId: string): Promise<SensorReading[]> {
    const sensor = await this.sensorRepository.findOne({
      where: { sensor_id: sensorId },
      relations: ['readings'],
    });

    if (!sensor) {
      throw new NotFoundException('Sensör bulunamadı');
    }

    return sensor.readings;
  }

  // Simüle edilmiş sensör verilerini oluştur
  private generateSimulatedData() {
    return {
      ph_value: +(Math.random() * (7.5 - 5.5) + 5.5).toFixed(2),
      nitrogen_ratio: +(Math.random() * (4.0 - 2.0) + 2.0).toFixed(2),
      phosphorus_ratio: +(Math.random() * (0.5 - 0.2) + 0.2).toFixed(2),
      potassium_ratio: +(Math.random() * (3.0 - 1.5) + 1.5).toFixed(2),
      humidity_ratio: +(Math.random() * (80 - 40) + 40).toFixed(2),
      soil_temperature: +(Math.random() * (30 - 15) + 15).toFixed(2),
      electrical_conductivity: +(Math.random() * (2.0 - 0.5) + 0.5).toFixed(2),
      calcium_ratio: +(Math.random() * (4.0 - 2.0) + 2.0).toFixed(2),
      magnesium_ratio: +(Math.random() * (0.4 - 0.2) + 0.2).toFixed(2),
      boron_ratio: +(Math.random() * (0.3 - 0.1) + 0.1).toFixed(2),
      zinc_ratio: +(Math.random() * (5 - 1) + 1).toFixed(2),
      iron_ratio: +(Math.random() * (10 - 2) + 2).toFixed(2),
      sulfur_ratio: +(Math.random() * (20 - 5) + 5).toFixed(2)
    };
  }

  // Kullanıcının sensörlerini getir
  async getUserSensors(userId: number): Promise<Sensor[]> {
    return await this.sensorRepository.find({
      where: { user: { id: userId } }
    });
  }

  // Belirli bir tarlaya ait sensörleri getir
  async getFieldSensors(fieldId: number, userId: number): Promise<Sensor[]> {
    return await this.sensorRepository.find({
      where: { 
        user: { id: userId },
        field_id: fieldId 
      },
      relations: ['user']
    });
  }

  // Sensör bağlantısını kes
  async disconnectSensor(sensorId: string, userId: number): Promise<void> {
    const sensor = await this.sensorRepository.findOne({
      where: { sensor_id: sensorId, user: { id: userId } }
    });

    if (!sensor) {
      throw new NotFoundException('Sensör bulunamadı');
    }

    // İlişkiyi kaldırmak için QueryBuilder kullanıyoruz
    await this.sensorRepository
      .createQueryBuilder()
      .relation(Sensor, "user")
      .of(sensor)
      .set(null);

    sensor.is_connected = false;
    await this.sensorRepository.save(sensor);
  }

  // Belirli bir sensörün verilerini getir
  async getSensorData(sensorId: string): Promise<Sensor> {
    const sensor = await this.sensorRepository.findOne({
      where: { sensor_id: sensorId },
      relations: ['cropTypes', 'user']
    });

    if (!sensor) {
      throw new NotFoundException('Sensör bulunamadı');
    }

    return sensor;
  }
}