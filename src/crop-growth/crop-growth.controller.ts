import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CropGrowthService } from './crop-growth.service';
import { CreateCropGrowthDto } from './dto/create-crop-growth.dto';
import { UpdateCropGrowthDto } from './dto/update-crop-growth.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GrowthAnalysis } from './crop-growth.service';

@Controller('crop-growth')
@UseGuards(JwtAuthGuard)
export class CropGrowthController {
  constructor(private readonly cropGrowthService: CropGrowthService) {}

  @Post()
  create(@Body() createCropGrowthDto: CreateCropGrowthDto, @Request() req) {
    return this.cropGrowthService.create(createCropGrowthDto, req.user.id);
  }

  @Get()
  findAll(@Request() req) {
    return this.cropGrowthService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.cropGrowthService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCropGrowthDto: UpdateCropGrowthDto, @Request() req) {
    return this.cropGrowthService.update(+id, updateCropGrowthDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.cropGrowthService.remove(+id, req.user.id);
  }

  @Get('field/:fieldId/trends')
  getGrowthTrends(@Param('fieldId') fieldId: string, @Request() req): Promise<GrowthAnalysis> {
    return this.cropGrowthService.getGrowthTrends(req.user.id, +fieldId);
  }

  @Get('analysis/:fieldId')
  getGrowthAnalysis(@Param('fieldId') fieldId: string, @Request() req) {
    return this.cropGrowthService.getGrowthAnalysis(req.user.id, +fieldId);
  }
} 