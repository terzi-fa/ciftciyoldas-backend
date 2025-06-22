import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Cron } from '@nestjs/schedule';
import { WeatherService } from '../weather/weather.service';
import { FertilizerRulesService } from '../organic-fertilizers/fertilizer-rules.service';
import { OrganicPestControlService } from '../organic-pest-control/organic-pest-control.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private weatherService: WeatherService,
    private fertilizerRulesService: FertilizerRulesService,
    private organicPestControlService: OrganicPestControlService,
  ) {}

  async create(createDto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepository.create({
      user_id: createDto.user_id,
      title: createDto.title,
      message: createDto.message,
      type: createDto.type,
      category: createDto.category,
      is_read: createDto.is_read || false,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return this.notificationRepository.save(notification);
  }

  async getUserNotifications(userId: number): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async markAsRead(id: number, userId: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id, user_id: userId },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    notification.is_read = true;
    notification.updated_at = new Date();
    return this.notificationRepository.save(notification);
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.notificationRepository.update(
      { user_id: userId, is_read: false },
      { is_read: true, updated_at: new Date() },
    );
  }

  async delete(id: number, userId: number): Promise<void> {
    const result = await this.notificationRepository.delete({
      id,
      user_id: userId,
    });

    if (result.affected === 0) {
      throw new Error('Notification not found');
    }
  }

  // Her gün sabah 8'de kontrol et
  @Cron('0 8 * * *')
  async checkScheduledTasks() {
    // Gübre uygulama zamanı kontrolü
    await this.checkFertilizerApplications();
    
    // Organik zararlı mücadelesi zamanı kontrolü
    await this.checkOrganicPestControlApplications();
    
    // Hava durumu kontrolü
    await this.checkWeatherConditions();
  }

  private async checkFertilizerApplications() {
    // TODO: Veritabanından planlanmış gübre uygulamalarını kontrol et
    // Örnek:
    // const scheduledApplications = await this.fertilizerRulesService.getScheduledApplications();
    // for (const application of scheduledApplications) {
    //   await this.createNotification({
    //     user_id: application.user_id,
    //     title: 'Gübre Uygulama Zamanı',
    //     message: `${application.fertilizer_name} uygulaması için zaman geldi.`,
    //     type: 'info',
    //     category: 'fertilizer',
    //     action_url: `/fertilizer/${application.id}`,
    //   });
    // }
  }

  private async checkOrganicPestControlApplications() {
    // TODO: Veritabanından planlanmış organik zararlı mücadelesi uygulamalarını kontrol et
    // Örnek:
    // const scheduledControls = await this.organicPestControlService.getScheduledApplications();
    // for (const control of scheduledControls) {
    //   await this.createNotification({
    //     user_id: control.user_id,
    //     title: 'Organik Mücadele Zamanı',
    //     message: `${control.pest_name} için ${control.control_method} uygulaması zamanı geldi.`,
    //     type: 'info',
    //     category: 'pest',
    //   });
    // }
  }

  private async checkWeatherConditions() {
    // TODO: Kullanıcıların tarla konumlarına göre hava durumu kontrolü
    // Örnek:
    // const userLocations = await this.getUserLocations();
    // for (const location of userLocations) {
    //   const weather = await this.weatherService.getWeatherData(
    //     location.latitude,
    //     location.longitude
    //   );
    //   
    //   if (weather.isRaining) {
    //     await this.createNotification({
    //       user_id: location.user_id,
    //       title: 'Yağmur Uyarısı',
    //       message: 'Tarlanızda yağış bekleniyor. Gübre/ilaç uygulaması için uygun değil.',
    //       type: 'warning',
    //       category: 'weather',
    //     });
    //   }
    // }
  }
} 