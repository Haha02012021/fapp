import { IMAGE_TYPE } from './image.model';
import { IsNotEmpty, IsString } from 'class-validator';

export class ImageDto {
  @IsString()
  @IsNotEmpty()
  imgLink: string;

  @IsNotEmpty()
  type: IMAGE_TYPE;

  @IsNotEmpty()
  typeId: number;

  @IsString()
  description: string;
}
