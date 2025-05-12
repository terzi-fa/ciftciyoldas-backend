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
      ph_value: +(Math.random() * (8.5 - 5.5) + 5.5).toFixed(2),
      nitrogen_ratio: +(Math.random() * 5).toFixed(2),
      phosphorus_ratio: +(Math.random() * 3).toFixed(2),
      potassium_ratio: +(Math.random() * 4).toFixed(2),
      humidity_ratio: +(Math.random() * 100).toFixed(2),
      soil_temperature: +(Math.random() * (35 - 10) + 10).toFixed(2),
      electrical_conductivity: +(Math.random() * 4).toFixed(2),
      magnesium: +(Math.random() * 60).toFixed(2),   // Mg
      boron: +(Math.random() * 2).toFixed(2),        // B
      calcium: +(Math.random() * 300).toFixed(2),    // Ca
      zinc: +(Math.random() * 5).toFixed(2),         // Zn
      sulfur: +(Math.random() * 50).toFixed(2),      // S
      iron: +(Math.random() * 20).toFixed(2),        // Fe
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
      where: { sensor_id: sensorId },
      relations: ['cropTypes']
    });

    if (!sensor) {
      throw new NotFoundException('Sensör bulunamadı');
    }

    return sensor;
  }
}