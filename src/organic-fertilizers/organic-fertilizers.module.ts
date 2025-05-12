import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FertilizerRulesService } from './fertilizer-rules.service';
import { FertilizerRulesController } from './fertilizer-rules.controller';
import { FertilizerRule } from './entities/fertilizer-rule.entity';
import { OrganicFertilizer } from './entities/organic-fertilizer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FertilizerRule, OrganicFertilizer])],
  controllers: [FertilizerRulesController],
  providers: [FertilizerRulesService],
  exports: [FertilizerRulesService],
})
export class OrganicFertilizersModule {}