import { Controller, Post, Get, Body, Param, UseGuards, Patch, Delete, NotFoundException } from '@nestjs/common';
import { OrganicFertilizersService } from './organic-fertilizers.service';
import { FertilizerRulesService } from './fertilizer-rules.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateFertilizerRuleDto } from './dto/create-fertilizer-rule.dto';
import { UpdateFertilizerRuleDto } from './dto/update-fertilizer-rule.dto.ts';

@Controller('organic-fertilizers')
@UseGuards(JwtAuthGuard)
export class OrganicFertilizersController {
  constructor(
    private readonly organicFertilizersService: OrganicFertilizersService,
    private readonly fertilizerRulesService: FertilizerRulesService
  ) {}

  @Get()
  async findAll() {
    return this.organicFertilizersService.findAll();
  }

  @Get(':id/details')
  async getFertilizerDetails(@Param('id') id: string) {
    const fertilizer = await this.organicFertilizersService.findOne(+id);
    return {
      name: fertilizer.name,
      uygulama_yontemi: {
        title: "Uygulama Yöntemi",
        content: fertilizer.application_method
      },
      dozaj: {
        title: "Dozaj ve Zamanlama",
        content: fertilizer.dosage
      },
      depolama: {
        title: "Depolama ve Saklama Koşulları",
        content: fertilizer.storage_conditions
      },
      malzeme: {
        title: "Kaliteli Malzeme Seçimi ve Dikkat Edilmesi Gerekenler",
        content: fertilizer.material_quality
      },
      dikkat: {
        title: "Dikkat Edilmesi Gerekenler",
        content: fertilizer.precautions
      }
    };
  }

  @Get('growth-stages/:cropTypeId')
  async getGrowthStagesByCropType(@Param('cropTypeId') cropTypeId: number) {
    return this.organicFertilizersService.getGrowthStagesByCropType(cropTypeId);
  }

  @Post('rules')
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

  @Patch('rules/:id')
  async updateFertilizerRule(
    @Param('id') id: string,
    @Body() updateFertilizerRuleDto: UpdateFertilizerRuleDto
  ) {
    const rule = await this.fertilizerRulesService.findOne(+id);
    if (!rule) {
      throw new NotFoundException(`ID ${id} olan gübre kuralı bulunamadı`);
    }

    return this.fertilizerRulesService.updateFertilizerRule(+id, {
      applicationMethod: updateFertilizerRuleDto.applicationMethod,
      recommendedAmount: updateFertilizerRuleDto.recommendedAmount,
      frequency: updateFertilizerRuleDto.frequency
    });
  }
}