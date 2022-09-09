import { Post } from 'src/post/post.model';
import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { ImageDto } from './image.dto';
import { Image } from './image.model';

@Injectable()
export class ImageService {
  constructor(private sequelize: Sequelize) {}

  async saveImages(images: any) {
    try {
      console.log(images);
      await Image.destroy({
        where: {
          typeId: images[0].typeId,
        },
      });

      const newImgs = await Image.bulkCreate([...images]);

      return {
        success: true,
        data: newImgs,
        message: 'save images successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
