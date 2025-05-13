// src/organic-fertilizers/organic-fertilizers.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganicFertilizersController } from './organic-fertilizers.controller';
import { FertilizerRulesController } from './fertilizer-rules.controller';
import { OrganicFertilizersService } from './organic-fertilizers.service';
import { FertilizerRulesService } from './fertilizer-rules.service';
import { OrganicFertilizer } from './entities/organic-fertilizer.entity';
import { FertilizerRule } from './entities/fertilizer-rule.entity';
import { GrowthStage } from './entities/growth-stage.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrganicFertilizer,
      FertilizerRule,
      GrowthStage  // GrowthStage entity'sini ekledik
    ])
  ],
  controllers: [OrganicFertilizersController, FertilizerRulesController],
  providers: [OrganicFertilizersService, FertilizerRulesService],
})
export class OrganicFertilizersModule {}