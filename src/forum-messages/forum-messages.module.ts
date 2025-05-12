import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForumMessagesService } from './forum-messages.service';
import { ForumMessagesController } from './forum-messages.controller';
import { ForumMessage } from './entities/forum-message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ForumMessage])],
  controllers: [ForumMessagesController],
  providers: [ForumMessagesService]
})
export class ForumMessagesModule {}