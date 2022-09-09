import { ImageService } from './../image/image.service';
import { PostService } from './post.service';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PostController } from './post.controller';
import { Post } from './post.model';

@Module({
  imports: [SequelizeModule.forFeature([Post])],
  providers: [PostService, ImageService],
  controllers: [PostController],
})
export class PostModule {}
