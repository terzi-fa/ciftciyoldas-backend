import { Controller, Post, Get, Body, Param, UseGuards, Patch, Delete, NotFoundException } from '@nestjs/common';
import { FertilizerRulesService } from './fertilizer-rules.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateFertilizerRuleDto } from './dto/create-fertilizer-rule.dto';
import { UpdateFertilizerRuleDto } from './dto/update-fertilizer-rule.dto.ts';

@Controller('fertilizer-rules')
@UseGuards(JwtAuthGuard)
export class FertilizerRulesController {
  constructor(private readonly fertilizerRulesService: FertilizerRulesService) {}

  @Post('recommendations')
  async getFertilizerRecommendations(
    @Body('cropTypeId') cropTypeId: number,
    @Body('growthStageId') growthStageId: number,
    @Body('nutrientType') nutrientType: string,
    @Body('value') value: number
  ) {
    return this.fertilizerRulesService.getFertilizerRecommendations(
      cropTypeId,
      growthStageId,
      nutrientType,
      value
    );
  }
  @Patch(':id')
  async updateFertilizerRule(
  @Param('id') id: string,
  @Body() updateFertilizerRuleDto: UpdateFertilizerRuleDto
) {
  const rule = await this.fertilizerRulesService.findOne(+id);
  if (!rule) {
    throw new NotFoundException(`ID ${id} olan gübre kuralı bulunamadı`);
  }
  return this.fertilizerRulesService.updateFertilizerRule(+id, updateFertilizerRuleDto);
}

  @Post()
  async createFertilizerRule(@Body() createFertilizerRuleDto: CreateFertilizerRuleDto) {
    return this.fertilizerRulesService.createFertilizerRule({
      fertilizerId: createFertilizerRuleDto.fertilizerId,
      cropTypeId: createFertilizerRuleDto.cropTypeId,
      growthStageId: createFertilizerRuleDto.growthStageId,
      nutrientType: createFertilizerRuleDto.nutrientType,
      operator: createFertilizerRuleDto.operator,
      value: createFertilizerRuleDto.value,
      applicationMethod: createFertilizerRuleDto.applicationMethod,
      recommendedAmount: createFertilizerRuleDto.recommendedAmount,
      frequency: createFertilizerRuleDto.frequency,
      notes: createFertilizerRuleDto.notes
    });
  }
  

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const rule = await this.fertilizerRulesService.findOne(+id);
    if (!rule) {
      throw new NotFoundException(`ID ${id} olan gübre kuralı bulunamadı`);
    }
    return this.fertilizerRulesService.remove(+id);
  }
}