import { Test, TestingModule } from '@nestjs/testing';
import { ForumMessagesController } from './forum-messages.controller';
import { ForumMessagesService } from './forum-messages.service';

describe('ForumMessagesController', () => {
  let controller: ForumMessagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForumMessagesController],
      providers: [ForumMessagesService],
    }).compile();

    controller = module.get<ForumMessagesController>(ForumMessagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});