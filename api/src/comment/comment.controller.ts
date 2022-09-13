import { CommentService } from './comment.service';
import { CommentDto } from './comment.dto';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

@Controller('comment')
export class CommentController {
    constructor(private commentService: CommentService) {}
    @Post('create')
    create(@Body() comment: CommentDto) {
        return this.commentService.create(comment);
    }

    @Get('get/:id')
    getComment(@Param('id') id: number) {
        return this.commentService.getComment(id);
    }

    @Get('get-by-post-id/:postId')
    getCommentsByPostId(@Param('postId') postId: number) {
        return this.commentService.getCommentsByPostId(postId);
    }

    @Put('edit/:id')
    editComment(@Param('id') id: number, @Body() comment: CommentDto) {
        return this.commentService.editComment(id, comment);
    }

    @Delete('delete/:id')
    removeComment(@Param('id') id: number, @Body() comment: CommentDto) {
        return this.commentService.removeComment(id, comment);
    }
}
