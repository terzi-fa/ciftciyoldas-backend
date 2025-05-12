import { Test, TestingModule } from '@nestjs/testing';
import { ForumMessagesService } from './forum-messages.service';

describe('ForumMessagesService', () => {
  let service: ForumMessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ForumMessagesService],
    }).compile();

    service = module.get<ForumMessagesService>(ForumMessagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
