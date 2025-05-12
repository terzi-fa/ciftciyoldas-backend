// src/crop-types/crop-types.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CropType } from './entities/crop-type.entity';

@Injectable()
export class CropTypesService {
  constructor(
    @InjectRepository(CropType)
    private cropTypeRepository: Repository<CropType>,
  ) {}

  // Tüm ekin türlerini getir (opsiyonel arama ile)
  async findAll(search?: string): Promise<CropType[]> {
    if (search) {
      return await this.cropTypeRepository.find({
        where: { name: ILike(`%${search}%`) },
        order: { name: 'ASC' }
      });
    }
    return await this.cropTypeRepository.find({
      order: { name: 'ASC' }
    });
  }

  // ID'ye göre tek bir ekin türü getir
  async findOne(id: number): Promise<CropType> {
    const cropType = await this.cropTypeRepository.findOne({
      where: { id }
    });

    if (!cropType) {
      throw new NotFoundException('Ekin türü bulunamadı');
    }

    return cropType;
  }
}