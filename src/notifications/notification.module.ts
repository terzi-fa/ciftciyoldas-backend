import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Notification } from './entities/notification.entity';
import { WeatherModule } from '../weather/weather.module';
import { OrganicFertilizersModule } from '../organic-fertilizers/organic-fertilizers.module';
import { OrganicPestControlModule } from '../organic-pest-control/organic-pest-control.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    ScheduleModule.forRoot(),
    WeatherModule,
    OrganicFertilizersModule,
    OrganicPestControlModule,
  ],
  providers: [NotificationService],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {} 