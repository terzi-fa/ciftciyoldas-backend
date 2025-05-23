import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sensor } from './entities/sensor.entity';
import { User } from '../users/entities/user.entity';
import { CreateSensorDto } from './dto/create-sensor.dto';
@Injectable()
export class SensorsService {
  constructor(
    @InjectRepository(Sensor)
    private readonly sensorRepository: Repository<Sensor>,
  ) {}

  // CreateSensorDto parametresi ile güncellendi
  async createSensor(createSensorDto: CreateSensorDto): Promise<Sensor> {
    const existingSensor = await this.sensorRepository.findOne({
      where: { sensor_id: createSensorDto.sensor_id }
    });

    if (existingSensor) {
      throw new ConflictException('Bu sensör ID zaten kayıtlı');
    }

    const sensor = this.sensorRepository.create({
      ...createSensorDto,
      is_connected: false
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

  // Sensör verilerini güncelle (simülasyon)
  async updateSensorData(sensorId: string): Promise<Sensor> {
    const sensor = await this.sensorRepository.findOne({
      where: { sensor_id: sensorId }
    });

    if (!sensor) {
      throw new NotFoundException('Sensör bulunamadı');
    }

    if (!sensor.is_connected) {
      throw new ConflictException('Sensör bağlı değil');
    }

    const sensorData = this.generateSimulatedData();
    Object.assign(sensor, sensorData);
    sensor.last_reading_at = new Date();

    return await this.sensorRepository.save(sensor);
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
      magnesium_ratio: +(Math.random() * (0.4 - 0.2) + 0.2).toFixed(2),
      boron_ratio: +(Math.random() * (0.3 - 0.1) + 0.1).toFixed(2),
      sulfur_ratio: +(Math.random() * (0.3 - 0.1) + 0.1).toFixed(2),
      zinc_ratio: +(Math.random() * (0.05 - 0.01) + 0.01).toFixed(2),
      calcium_ratio: +(Math.random() * (4.0 - 2.0) + 2.0).toFixed(2),
      iron_ratio: +(Math.random() * (0.3 - 0.1) + 0.1).toFixed(2)
    };
  }

  // Kullanıcının sensörlerini getir
  async getUserSensors(userId: number): Promise<Sensor[]> {
    return await this.sensorRepository.find({
      where: { user: { id: userId } }
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
      where: { id: Number(sensorId) },
      relations: ['cropTypes', 'user']
    });

    if (!sensor) {
      throw new NotFoundException('Sensör bulunamadı');
    }

    return sensor;
  }
}