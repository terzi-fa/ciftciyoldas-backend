import { Test, TestingModule } from '@nestjs/testing';
import { GrowthStagesService } from './growth-stages.service';

describe('GrowthStagesService', () => {
  let service: GrowthStagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GrowthStagesService],
    }).compile();

    service = module.get<GrowthStagesService>(GrowthStagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
