import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ForumMessagesService } from './forum-messages.service';
import { CreateForumMessageDto } from './dto/create-forum-message.dto';
import { UpdateForumMessageDto } from './dto/update-forum-message.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('forum-messages')
@UseGuards(JwtAuthGuard)
export class ForumMessagesController {
  constructor(private readonly forumMessagesService: ForumMessagesService) {}

  @Post()
  create(@Request() req, @Body() createForumMessageDto: CreateForumMessageDto) {
    return this.forumMessagesService.create(req.user.id, createForumMessageDto);
  }

  @Get()
  findAll() {
    return this.forumMessagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.forumMessagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateForumMessageDto: UpdateForumMessageDto) {
    return this.forumMessagesService.update(+id, updateForumMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.forumMessagesService.remove(+id);
  }

  @Post(':id/like')
  likeMessage(@Param('id') id: string) {
    return this.forumMessagesService.likeMessage(+id);
  }
}