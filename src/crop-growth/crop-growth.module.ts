import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CropGrowthService } from './crop-growth.service';
import { CropGrowthController } from './crop-growth.controller';
import { CropGrowth } from './entities/crop-growth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CropGrowth])],
  controllers: [CropGrowthController],
  providers: [CropGrowthService],
  exports: [CropGrowthService],
})
export class CropGrowthModule {} 