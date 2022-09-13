import { PostDto } from './post.dto';
import { Body, Controller, Get, Post, Query, Put, Param, Delete } from '@nestjs/common';
import { PostService } from './post.service';
import { DeletedAt } from 'sequelize-typescript';

@Controller('post')
export class PostController {
    constructor(private postService: PostService) {}

    @Get('get-all')
    findAllByUser(@Query('userId') userId: number) {
        return this.postService.findAll(userId);
    }

    @Get('get-by-owner-id')
    findPostsByOwnerId(@Query('ownerId') ownerId: number, @Query('userId') userId: number) {
        return this.postService.findPostsByOwnerId(ownerId, userId);
    }

    @Post('create')
    create(@Body() postDto: PostDto) {
        return this.postService.create(postDto);
    }

    @Get(':id/get-react-details')
    getReactDetails(@Param('id') id: number) {
        return this.postService.getReactDetails(id);
    }

    @Put(':id/edit')
    edit(@Param('id') id: number, @Body() postDto: PostDto) {
        return this.postService.edit(id, postDto);
    }

    @Delete(':id/delete')
    delete(@Param('id') id: number) {
        return this.postService.delete(id);
    }

    @Get('get-top-3-react')
    getThreeTopReact(@Query('ownerId') ownerId: number) {
        return this.postService.getFourTopReact(ownerId);
    }
}
