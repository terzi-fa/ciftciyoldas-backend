import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CropType } from './entities/crop-type.entity';
import { CropTypesService } from './crop-types.service';
import { CropTypesController } from './crop-types.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CropType])],  // CropType entity'sini module'e dahil ediyoruz
  providers: [CropTypesService],  // CropTypesService sınıfını service olarak kullanıyoruz
  controllers: [CropTypesController],  // CropTypesController sınıfını controller olarak kullanıyoruz
})
export class CropTypesModule {}
