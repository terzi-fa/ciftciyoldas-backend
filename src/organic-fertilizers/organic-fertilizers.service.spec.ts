import { Test, TestingModule } from '@nestjs/testing';
import { OrganicFertilizersService } from './organic-fertilizers.service';

describe('OrganicFertilizersService', () => {
  let service: OrganicFertilizersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganicFertilizersService],
    }).compile();

    service = module.get<OrganicFertilizersService>(OrganicFertilizersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
