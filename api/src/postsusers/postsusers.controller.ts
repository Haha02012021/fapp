import { PostsUsersService } from './postsusers.service';
import { Body, Controller, Delete, Post, Put, Query } from '@nestjs/common';
import { PostsUsersDto } from './postsusers.dto';

@Controller('postsusers')
export class PostsUsersController {
  constructor(private postsusersService: PostsUsersService) {}

  @Post('create')
  create(@Body() postsUsersDto: PostsUsersDto) {
    return this.postsusersService.create(postsUsersDto);
  }

  @Put('update')
  update(@Body() postsUsersDto: PostsUsersDto) {
    return this.postsusersService.update(postsUsersDto);
  }

  @Delete('delete')
  delete(@Query('userId') userId: number, @Query('postId') postId: number) {
    return this.postsusersService.delete(userId, postId);
  }
}
