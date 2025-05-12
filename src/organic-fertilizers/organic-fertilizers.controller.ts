import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { OrganicFertilizersService } from './organic-fertilizers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrganicFertilizer } from './entities/organic-fertilizer.entity';
import { CreateGrowthStageDto } from './dto/create-growth-stage.dto';
import { FertilizerRecommendationDto } from './dto/fertilizer-recommendation.dto';
import { FertilizerRulesService } from './fertilizer-rules.service';
interface SoilAnalysis {
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  moisture: number;
}

interface RecommendationDto {
  cropType: string;
  soilAnalysis: SoilAnalysis;
}

@Controller('organic-fertilizers')
@UseGuards(JwtAuthGuard)
export class OrganicFertilizersController {
  constructor(
    private readonly organicFertilizersService: OrganicFertilizersService,
    private readonly fertilizerRulesService: FertilizerRulesService) {}

  

  @Get()
  async findAll(): Promise<OrganicFertilizer[]> {
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

  

  

  
  @Post('recommend')
  async recommend(@Body() dto: FertilizerRecommendationDto) {
  return this.fertilizerRulesService.getRecommendedFertilizers(dto);
}
}
