import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganicPestControl } from './entities/organic-pest-control.entity';
import { OrganicPestControlService } from './organic-pest-control.service';
import { OrganicPestControlController } from './organic-pest-control.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OrganicPestControl])],
  providers: [OrganicPestControlService],
  controllers: [OrganicPestControlController],
  exports: [OrganicPestControlService],
})
export class OrganicPestControlModule {} 