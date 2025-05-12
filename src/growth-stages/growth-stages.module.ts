import { Module } from '@nestjs/common';
import { GrowthStagesService } from './growth-stages.service';
import { GrowthStagesController } from './growth-stages.controller';

@Module({
  controllers: [GrowthStagesController],
  providers: [GrowthStagesService],
})
export class GrowthStagesModule {}
