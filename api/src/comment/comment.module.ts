import { CommentService } from './comment.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';
import Comment from './comment.model';
import { CommentController } from './comment.controller';

@Module({
    imports: [SequelizeModule.forFeature([Comment])],
    controllers: [CommentController],
    providers: [CommentService],
})
export class CommentModule {}
