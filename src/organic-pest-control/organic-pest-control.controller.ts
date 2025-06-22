import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { OrganicPestControlService } from './organic-pest-control.service';
import { CreateOrganicPestControlDto } from './dto/create-organic-pest-control.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('organic-pest-control')
@UseGuards(JwtAuthGuard)
export class OrganicPestControlController {
  constructor(private readonly organicPestControlService: OrganicPestControlService) {}

  @Post()
  create(@Body() createDto: CreateOrganicPestControlDto, @Request() req) {
    return this.organicPestControlService.create(createDto, req.user.id);
  }

  @Get()
  findAll(@Request() req) {
    return this.organicPestControlService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.organicPestControlService.findOne(+id, req.user.id);
  }

  @Get('field/:fieldId/effectiveness')
  getEffectivenessByField(@Param('fieldId') fieldId: string, @Request() req) {
    return this.organicPestControlService.getEffectivenessByField(+fieldId, req.user.id);
  }

  @Get('companion-planting/:cropName')
  getCompanionPlantingRecommendations(@Param('cropName') cropName: string) {
    console.log(`[Companion Planting] Received request for cropName: ${cropName}`);
    return this.organicPestControlService.getCompanionPlantingRecommendations(cropName);
  }

  @Get('biological-control/:pestType')
  getBiologicalControlRecommendations(@Param('pestType') pestType: string) {
    return this.organicPestControlService.getBiologicalControlRecommendations(pestType);
  }
} 