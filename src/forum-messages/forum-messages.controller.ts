import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
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
    return this.forumMessagesService.findAllMainMessages();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.forumMessagesService.findOne(+id);
  }

  @Put(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateForumMessageDto: UpdateForumMessageDto
  ) {
    return this.forumMessagesService.update(+id, req.user.id, updateForumMessageDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.forumMessagesService.remove(+id, req.user.id);
  }

  @Post(':id/like')
  likeMessage(@Param('id') id: string) {
    return this.forumMessagesService.likeMessage(+id);
  }
}