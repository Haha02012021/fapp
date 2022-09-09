import { Test, TestingModule } from '@nestjs/testing';
import { PostsUsersService } from './postsusers.service';

describe('PostsusersService', () => {
  let service: PostsUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsUsersService],
    }).compile();

    service = module.get<PostsUsersService>(PostsUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
