import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FieldsService } from './fields.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('fields')
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createFieldDto: CreateFieldDto, @GetUser() user: any) {
    return this.fieldsService.create(createFieldDto, user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@GetUser() user: any) {
    return this.fieldsService.findAll(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @GetUser() user: any) {
    return this.fieldsService.findOne(+id, user.id);
  }

  @Get(':id/analytics')
  @UseGuards(JwtAuthGuard)
  getFieldAnalytics(@Param('id') id: string, @GetUser() user: any) {
    return this.fieldsService.getFieldAnalytics(+id, user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateFieldDto: UpdateFieldDto,
    @GetUser() user: any,
  ) {
    return this.fieldsService.update(+id, updateFieldDto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @GetUser() user: any) {
    return this.fieldsService.remove(+id, user.id);
  }
} 