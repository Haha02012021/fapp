import { ImageService } from './image.service';
import { Body, Controller, Post } from '@nestjs/common';
import { ImageDto } from './image.dto';

@Controller('image')
export class ImageController {
  constructor(private imageService: ImageService) {}
  @Post('save-images')
  saveImages(@Body() images: ImageDto[]) {
    return this.imageService.saveImages(images);
  }
}
