import { PartialType } from '@nestjs/mapped-types';
import { CreateSoilAnalysisDto } from './create-soil-analysis.dto';

export class UpdateSoilAnalysisDto extends PartialType(CreateSoilAnalysisDto) {} 