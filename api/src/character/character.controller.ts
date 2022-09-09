import { CharacterService } from './character.service';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('character')
export class CharacterController {
  constructor(private characterService: CharacterService) {}
  @Post('create')
  create(@Body('name') character: string) {
    // console.log(character);

    return this.characterService.create(character);
  }

  @Get('get-all')
  findAll() {
    return this.characterService.findAll();
  }
}
