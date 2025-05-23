import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GrowthStage } from './entities/growth-stage.entity';
import { CreateGrowthStageDto } from './dto/create-growth-stage.dto';
import { UpdateGrowthStageDto } from './dto/update-growth-stage.dto';

@Injectable()
export class GrowthStagesService {
  constructor(
    @InjectRepository(GrowthStage)
    private readonly growthStageRepository: Repository<GrowthStage>,
  ) {}

  async findAll() {
    return await this.growthStageRepository.find();
  }

  create(createGrowthStageDto: CreateGrowthStageDto) {
    return 'This action adds a new growthStage';
  }

  findOne(id: number) {
    return `This action returns a #${id} growthStage`;
  }

  update(id: number, updateGrowthStageDto: UpdateGrowthStageDto) {
    return `This action updates a #${id} growthStage`;
  }

  remove(id: number) {
    return `This action removes a #${id} growthStage`;
  }

  async findByCropType(cropTypeId: number) {
    return await this.growthStageRepository.find({
      where: { crop_type_id: cropTypeId }
    });
  }
}
