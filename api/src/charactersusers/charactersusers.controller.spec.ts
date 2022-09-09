import { Test, TestingModule } from '@nestjs/testing';
import { CharactersusersController } from './charactersusers.controller';

describe('CharactersusersController', () => {
  let controller: CharactersusersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharactersusersController],
    }).compile();

    controller = module.get<CharactersusersController>(CharactersusersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
