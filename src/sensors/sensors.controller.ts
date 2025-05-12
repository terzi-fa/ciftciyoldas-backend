import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
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
    return this.sensorsService.connectSensor(sensorId, req.user.id);
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

  // Belirli bir sensörün verilerini getirme
  @Get(':sensorId')
  async getSensorData(@Param('sensorId') sensorId: string) {
    return this.sensorsService.getSensorData(sensorId);
  }

  // Sensör verilerini güncelleme
  @Post(':sensorId/update')
  async updateSensorData(@Param('sensorId') sensorId: string) {
    return this.sensorsService.updateSensorData(sensorId);
  }
}