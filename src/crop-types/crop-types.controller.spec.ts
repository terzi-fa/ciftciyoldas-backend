import { Test, TestingModule } from '@nestjs/testing';
import { CropTypesController } from './crop-types.controller';
import { CropTypesService } from './crop-types.service';

describe('CropTypesController', () => {
  let controller: CropTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CropTypesController],
      providers: [CropTypesService],
    }).compile();

    controller = module.get<CropTypesController>(CropTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
