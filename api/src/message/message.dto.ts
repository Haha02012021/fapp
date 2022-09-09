import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { MESSAGE_TYPE } from './message.model';

export class MessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsInt()
  @IsNotEmpty()
  type: MESSAGE_TYPE;

  @IsInt()
  @IsNotEmpty()
  ownerId: number;

  @IsInt()
  @IsNotEmpty()
  chatId: number;

  replyFor: number;
}
