import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(@Request() req, @Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(req.user.id, createMessageDto);
  }

  @Get('received')
  getReceivedMessages(@Request() req) {
    return this.messagesService.getReceivedMessages(req.user.id);
  }

  @Get('sent')
  getSentMessages(@Request() req) {
    return this.messagesService.getSentMessages(req.user.id);
  }

  @Get('conversation/:userId')
  getConversation(@Request() req, @Param('userId') userId: string) {
    return this.messagesService.getConversation(req.user.id, +userId);
  }

  @Post(':id/read')
  markAsRead(@Request() req, @Param('id') id: string) {
    return this.messagesService.markAsRead(+id, req.user.id);
  }
}