import { Test, TestingModule } from '@nestjs/testing';
import { GrowthStagesController } from './growth-stages.controller';
import { GrowthStagesService } from './growth-stages.service';

describe('GrowthStagesController', () => {
  let controller: GrowthStagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrowthStagesController],
      providers: [GrowthStagesService],
    }).compile();

    controller = module.get<GrowthStagesController>(GrowthStagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
