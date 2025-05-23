import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GrowthStagesService } from './growth-stages.service';
import { CreateGrowthStageDto } from './dto/create-growth-stage.dto';
import { UpdateGrowthStageDto } from './dto/update-growth-stage.dto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrowthStage } from './entities/growth-stage.entity'; 

@Controller('growth-stages')
export class GrowthStagesController {
  constructor(private readonly growthStagesService: GrowthStagesService) {}

  @Post()
  create(@Body() createGrowthStageDto: CreateGrowthStageDto) {
    return this.growthStagesService.create(createGrowthStageDto);
  }

  @Get()
  async findAll() {
    return await this.growthStagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.growthStagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGrowthStageDto: UpdateGrowthStageDto) {
    return this.growthStagesService.update(+id, updateGrowthStageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.growthStagesService.remove(+id);
  }

  @Get('by-crop-type/:cropTypeId')
  async findByCropType(@Param('cropTypeId') cropTypeId: number) {
    return await this.growthStagesService.findByCropType(cropTypeId);
  }
}
