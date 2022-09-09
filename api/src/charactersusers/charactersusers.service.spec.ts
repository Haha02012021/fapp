import { Test, TestingModule } from '@nestjs/testing';
import { CharactersusersService } from './charactersusers.service';

describe('CharactersusersService', () => {
  let service: CharactersusersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CharactersusersService],
    }).compile();

    service = module.get<CharactersusersService>(CharactersusersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
