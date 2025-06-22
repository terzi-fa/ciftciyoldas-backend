import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FieldsModule } from './fields/fields.module';
import { WeatherModule } from './weather/weather.module';
import { SoilAnalysisModule } from './soil-analysis/soil-analysis.module';
import { CropGrowthModule } from './crop-growth/crop-growth.module';
import { OrganicFertilizerTrackingModule } from './organic-fertilizer-tracking/organic-fertilizer-tracking.module';
import { OrganicPestControlModule } from './organic-pest-control/organic-pest-control.module';
import { CropRotationModule } from './crop-rotation/crop-rotation.module';
import { SensorsModule } from './sensors/sensors.module';
import { CropTypesModule } from './crop-types/crop-types.module';
import { OrganicFertilizersModule } from './organic-fertilizers/organic-fertilizers.module';
import { ProductsModule } from './products/products.module';
import { MessagesModule } from './messages/messages.module';
import { ForumMessagesModule } from './forum-messages/forum-messages.module';
import { GrowthStagesModule } from './growth-stages/growth-stages.module';
import { FertilizerRecommendationsModule } from './fertilizer-recommendations/fertilizer-recommendations.module';
import { NewsModule } from './news/news.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    AuthModule,
    UsersModule,
    FieldsModule,
    WeatherModule,
    SoilAnalysisModule,
    CropGrowthModule,
    OrganicFertilizerTrackingModule,
    OrganicPestControlModule,
    CropRotationModule,
    SensorsModule,
    CropTypesModule,
    OrganicFertilizersModule,
    ProductsModule,
    MessagesModule,
    ForumMessagesModule,
    GrowthStagesModule,
    FertilizerRecommendationsModule,
    NewsModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}