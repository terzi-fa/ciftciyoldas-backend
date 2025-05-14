import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; // Yeni eklenen import
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SensorsModule } from './sensors/sensors.module';
import { CropTypesModule } from './crop-types/crop-types.module';
import { OrganicFertilizersModule } from './organic-fertilizers/organic-fertilizers.module';
import { ProductsModule } from './products/products.module';
import { MessagesModule } from './messages/messages.module';
import { ForumMessagesModule } from './forum-messages/forum-messages.module';
import { OrganicFertilizer } from './organic-fertilizers/entities/organic-fertilizer.entity';
import { GrowthStagesModule } from './growth-stages/growth-stages.module';
import { FertilizerRecommendationsModule } from './fertilizer-recommendations/fertilizer-recommendations.module';
import { NewsModule } from './news/news.module';

@Module({
  imports: [
    ConfigModule.forRoot({  // Yeni eklenen modül
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({  // Mevcut TypeORM yapılandırması aynen kalır
      type: 'sqlite',
      database: 'data.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
      logging: true 
    }),
    UsersModule,
    AuthModule,
    SensorsModule,
    
    CropTypesModule,
    OrganicFertilizersModule,
    ProductsModule,
    MessagesModule,
    ForumMessagesModule,
    GrowthStagesModule,
    FertilizerRecommendationsModule,
    NewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}