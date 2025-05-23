// src/crop-types/crop-types.controller.ts
import { Controller, Get, Param, Query } from '@nestjs/common';
import { CropTypesService } from './crop-types.service';

@Controller('crop-types')
export class CropTypesController {
  constructor(private readonly cropTypesService: CropTypesService) {}

  // Tüm ekin türlerini listeleme veya arama
  @Get()
  async findAll(@Query('search') search?: string) {
    const cropTypes = await this.cropTypesService.findAll(search);
    return {
      success: true,
      data: cropTypes,
      message: 'Ekin türleri başarıyla listelendi'
    };
  }

  // Tek bir ekin türünü görüntüleme
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const cropType = await this.cropTypesService.findOne(+id);
    return {
      success: true,
      data: cropType,
      message: 'Ekin türü başarıyla getirildi'
    };
  }
}