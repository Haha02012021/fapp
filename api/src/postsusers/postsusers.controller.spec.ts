import { Test, TestingModule } from '@nestjs/testing';
import { PostsUsersController } from './postsusers.controller';

describe('PostsusersController', () => {
  let controller: PostsUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsUsersController],
    }).compile();

    controller = module.get<PostsUsersController>(PostsUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
