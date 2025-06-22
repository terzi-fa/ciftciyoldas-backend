import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { SoilAnalysisService } from './soil-analysis.service';
import { CreateSoilAnalysisDto } from './dto/create-soil-analysis.dto';
import { UpdateSoilAnalysisDto } from './dto/update-soil-analysis.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('soil-analysis')
@UseGuards(JwtAuthGuard)
export class SoilAnalysisController {
  constructor(private readonly soilAnalysisService: SoilAnalysisService) {}

  @Post()
  create(@Body() createDto: CreateSoilAnalysisDto, @Request() req) {
    return this.soilAnalysisService.create(createDto, req.user.id);
  }

  @Get()
  findAll(@Request() req) {
    return this.soilAnalysisService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.soilAnalysisService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateSoilAnalysisDto, @Request() req) {
    return this.soilAnalysisService.update(+id, updateDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.soilAnalysisService.remove(+id, req.user.id);
  }

  @Get('field/:fieldId')
  getSoilAnalysis(@Param('fieldId') fieldId: string, @Request() req) {
    return this.soilAnalysisService.getSoilAnalysis(req.user.id, +fieldId);
  }

  @Get('field/:fieldId/fertilization-plan')
  getFertilizationPlan(@Param('fieldId') fieldId: string, @Request() req) {
    return this.soilAnalysisService.getFertilizationPlan(req.user.id, +fieldId);
  }
} 