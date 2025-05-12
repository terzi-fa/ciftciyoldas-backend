import { Test, TestingModule } from '@nestjs/testing';
import { CropTypesService } from './crop-types.service';

describe('CropTypesService', () => {
  let service: CropTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CropTypesService],
    }).compile();

    service = module.get<CropTypesService>(CropTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
