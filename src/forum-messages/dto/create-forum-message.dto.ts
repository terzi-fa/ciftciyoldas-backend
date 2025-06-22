import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateForumMessageDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsNumber()
  parent_message_id?: number;
}
