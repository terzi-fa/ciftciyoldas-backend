import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrowthStagesService } from './growth-stages.service';
import { GrowthStagesController } from './growth-stages.controller';
import { GrowthStage } from './entities/growth-stage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GrowthStage])],
  controllers: [GrowthStagesController],
  providers: [GrowthStagesService],
})
export class GrowthStagesModule {}
