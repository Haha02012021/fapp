import { IsInt, IsNotEmpty } from 'class-validator';
import { STATUS } from './post.model';
export class PostDto {
  status: STATUS;

  content: string;

  @IsNotEmpty()
  @IsInt()
  ownerId: number;

  images: any;
}
