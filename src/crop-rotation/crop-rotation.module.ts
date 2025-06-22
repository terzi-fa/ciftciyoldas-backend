import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CropRotationPlan } from './entities/crop-rotation-plan.entity';
import { CropRotationService } from './crop-rotation.service';
import { CropRotationController } from './crop-rotation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CropRotationPlan])],
  providers: [CropRotationService],
  controllers: [CropRotationController],
  exports: [CropRotationService],
})
export class CropRotationModule {} 