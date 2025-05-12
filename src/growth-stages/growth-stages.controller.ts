import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GrowthStagesService } from './growth-stages.service';
import { CreateGrowthStageDto } from './dto/create-growth-stage.dto';
import { UpdateGrowthStageDto } from './dto/update-growth-stage.dto';

@Controller('growth-stages')
export class GrowthStagesController {
  constructor(private readonly growthStagesService: GrowthStagesService) {}

  @Post()
  create(@Body() createGrowthStageDto: CreateGrowthStageDto) {
    return this.growthStagesService.create(createGrowthStageDto);
  }

  @Get()
  findAll() {
    return this.growthStagesService.findAll();
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
}
