import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganicFertilizerRecord } from './entities/organic-fertilizer-record.entity';
import { CreateOrganicFertilizerRecordDto } from './dto/create-organic-fertilizer-record.dto';
import { UpdateOrganicFertilizerRecordDto } from './dto/update-organic-fertilizer-record.dto';

@Injectable()
export class OrganicFertilizerTrackingService {
  constructor(
    @InjectRepository(OrganicFertilizerRecord)
    private organicFertilizerRecordRepository: Repository<OrganicFertilizerRecord>,
  ) {}

  async create(createDto: CreateOrganicFertilizerRecordDto, userId: number) {
    const record = this.organicFertilizerRecordRepository.create({
      ...createDto,
      user: { id: userId },
      field: { id: createDto.fieldId },
    });
    return await this.organicFertilizerRecordRepository.save(record);
  }

  async findAll(userId: number) {
    return await this.organicFertilizerRecordRepository.find({
      where: { user: { id: userId } },
      relations: ['field'],
    });
  }

  async findOne(id: number, userId: number) {
    return await this.organicFertilizerRecordRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['field'],
    });
  }

  async update(id: number, updateDto: UpdateOrganicFertilizerRecordDto, userId: number) {
    const record = await this.findOne(id, userId);
    if (!record) {
      return null;
    }

    Object.assign(record, updateDto);
    return await this.organicFertilizerRecordRepository.save(record);
  }

  async remove(id: number, userId: number) {
    const record = await this.findOne(id, userId);
    if (!record) {
      return null;
    }

    return await this.organicFertilizerRecordRepository.remove(record);
  }

  async findByField(fieldId: number, userId: number) {
    return await this.organicFertilizerRecordRepository.find({
      where: { field: { id: fieldId }, user: { id: userId } },
      relations: ['field'],
    });
  }
} 