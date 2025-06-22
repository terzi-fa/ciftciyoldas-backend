import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, ConflictException } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateSensorDto } from './dto/create-sensor.dto';  // DTO'yu import ettik


@Controller('sensors')
@UseGuards(JwtAuthGuard)  // Tüm controller için JWT koruması
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {}
  
  // Yeni sensör ekleme endpoint'i
  @Post()
  async createSensor(@Request() req, @Body() createSensorDto: CreateSensorDto) {
    return this.sensorsService.createSensor({
      ...createSensorDto,
      userId: req.user.id, // JWT'den gelen id
    });
  }

  // Sensör bağlama (tekrarı kaldırdık)
  @Post('connect/:sensorId')
  async connectSensor(
    @Param('sensorId') sensorId: string,
    @Request() req
  ) {
    const sensor = await this.sensorsService.getSensorData(sensorId);
    const userId = req.user.id;

    if (sensor.is_connected) {
      if (!sensor.user || sensor.user.id !== userId) {
        throw new ConflictException('Bu sensör zaten başka bir kullanıcıya bağlı');
      }
    }
    return this.sensorsService.connectSensor(sensorId, userId);
  }

  // Sensör bağlantısını kesme
  @Delete('disconnect/:sensorId')
  async disconnectSensor(
    @Param('sensorId') sensorId: string,
    @Request() req
  ) {
    return this.sensorsService.disconnectSensor(sensorId, req.user.id);
  }

  // Kullanıcının sensörlerini getirme
  @Get('my-sensors')
  async getUserSensors(@Request() req) {
    return this.sensorsService.getUserSensors(req.user.id);
  }

  // Belirli bir tarlaya ait sensörleri getirme
  @Get('field/:fieldId')
  async getFieldSensors(@Param('fieldId') fieldId: string, @Request() req) {
    return this.sensorsService.getFieldSensors(parseInt(fieldId, 10), req.user.id);
  }

  // Belirli bir sensörün geçmiş okumalarını getirme
  @Get(':sensorId/history')
  getSensorHistory(@Param('sensorId') sensorId: string) {
    return this.sensorsService.getSensorHistory(sensorId);
  }

  // Belirli bir sensörün verilerini getirme
  @Get(':sensorId')
  async getSensorData(@Param('sensorId') sensorId: string) {
    const sensor = await this.sensorsService.getSensorData(sensorId);
    return {
      id: sensor.id,
      sensor_id: sensor.sensor_id,
      is_connected: sensor.is_connected,
      ph_value: sensor.ph_value,
      nitrogen_ratio: sensor.nitrogen_ratio,
      phosphorus_ratio: sensor.phosphorus_ratio,
      potassium_ratio: sensor.potassium_ratio,
      magnesium_ratio: sensor.magnesium_ratio,
      boron_ratio: sensor.boron_ratio,
      sulfur_ratio: sensor.sulfur_ratio,
      zinc_ratio: sensor.zinc_ratio,
      calcium_ratio: sensor.calcium_ratio,
      iron_ratio: sensor.iron_ratio,
      humidity_ratio: sensor.humidity_ratio,
      soil_temperature: sensor.soil_temperature,
      electrical_conductivity: sensor.electrical_conductivity,
      notes: sensor.notes,
      user: sensor.user ? { id: sensor.user.id, full_name: sensor.user.full_name, email: sensor.user.email } : null,
      cropTypes: sensor.cropTypes,
      created_at: sensor.created_at,
      last_reading_at: sensor.last_reading_at
    };
  }

  

  // Sensör verilerini güncelleme
  @Post(':sensorId/update')
  async updateSensorData(@Param('sensorId') sensorId: string) {
    return this.sensorsService.updateSensorData(sensorId);
  }

  
  
}