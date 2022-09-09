import { IsInt, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { SEX, EMOTION_STATE, BLOOD_TYPE } from './user.model';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @IsString()
  avatar: string;

  @IsNotEmpty()
  sex: SEX;

  @IsInt()
  @IsNotEmpty()
  age: number;

  @IsInt()
  height: number;

  @IsInt()
  weight: number;

  bloodType: BLOOD_TYPE;

  @IsNotEmpty()
  toward: SEX;

  @IsNotEmpty()
  emotionState: EMOTION_STATE;

  @IsNotEmpty()
  characters: any;

  @IsPhoneNumber()
  phoneNumber: string;
}
