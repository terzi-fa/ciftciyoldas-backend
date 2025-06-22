import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CropRotationService } from './crop-rotation.service';
import { CreateCropRotationPlanDto } from './dto/create-crop-rotation-plan.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('crop-rotation')
@UseGuards(JwtAuthGuard)
export class CropRotationController {
  constructor(private readonly cropRotationService: CropRotationService) {}

  @Post()
  create(@Body() createDto: CreateCropRotationPlanDto, @Request() req) {
    return this.cropRotationService.create(createDto, req.user.id);
  }

  @Get()
  findAll(@Request() req) {
    return this.cropRotationService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.cropRotationService.findOne(+id, req.user.id);
  }

  @Get('recommendations/:fieldId/:soilType')
  getRotationRecommendations(
    @Param('fieldId') fieldId: string,
    @Param('soilType') soilType: string
  ) {
    return this.cropRotationService.getRotationRecommendations(+fieldId, soilType);
  }

  @Get('companion-planting/:cropName')
  getCompanionPlantingSuggestions(@Param('cropName') cropName: string) {
    return this.cropRotationService.getCompanionPlantingSuggestions(cropName);
  }

  @Get(':id/benefits')
  calculateRotationBenefits(@Param('id') id: string, @Request() req) {
    return this.cropRotationService.findOne(+id, req.user.id)
      .then(plan => this.cropRotationService.calculateRotationBenefits(plan));
  }
} 