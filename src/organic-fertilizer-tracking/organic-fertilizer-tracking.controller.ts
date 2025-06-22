import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { OrganicFertilizerTrackingService } from './organic-fertilizer-tracking.service';
import { CreateOrganicFertilizerRecordDto } from './dto/create-organic-fertilizer-record.dto';
import { UpdateOrganicFertilizerRecordDto } from './dto/update-organic-fertilizer-record.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('organic-fertilizer')
@UseGuards(JwtAuthGuard)
export class OrganicFertilizerTrackingController {
  constructor(private readonly organicFertilizerTrackingService: OrganicFertilizerTrackingService) {}

  @Post()
  create(@Body() createDto: CreateOrganicFertilizerRecordDto, @Request() req) {
    return this.organicFertilizerTrackingService.create(createDto, req.user.id);
  }

  @Get()
  findAll(@Request() req) {
    return this.organicFertilizerTrackingService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.organicFertilizerTrackingService.findOne(+id, req.user.id);
  }

  @Get('field/:fieldId')
  findByField(@Param('fieldId') fieldId: string, @Request() req) {
    return this.organicFertilizerTrackingService.findByField(+fieldId, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateOrganicFertilizerRecordDto,
    @Request() req,
  ) {
    return this.organicFertilizerTrackingService.update(+id, updateDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.organicFertilizerTrackingService.remove(+id, req.user.id);
  }
} 