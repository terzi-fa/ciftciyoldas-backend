import { Test, TestingModule } from '@nestjs/testing';
import { OrganicFertilizersController } from './organic-fertilizers.controller';
import { OrganicFertilizersService } from './organic-fertilizers.service';

describe('OrganicFertilizersController', () => {
  let controller: OrganicFertilizersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganicFertilizersController],
      providers: [OrganicFertilizersService],
    }).compile();

    controller = module.get<OrganicFertilizersController>(OrganicFertilizersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
