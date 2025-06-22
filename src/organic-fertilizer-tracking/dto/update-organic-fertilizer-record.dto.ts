import { PartialType } from '@nestjs/mapped-types';
import { CreateOrganicFertilizerRecordDto } from './create-organic-fertilizer-record.dto';

export class UpdateOrganicFertilizerRecordDto extends PartialType(CreateOrganicFertilizerRecordDto) {} 