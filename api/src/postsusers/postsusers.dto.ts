import { IsInt, IsNotEmpty } from "class-validator";
import { REACT_TYPE } from "./postsusers.model";

export class PostsUsersDto {
    @IsNotEmpty()
    @IsInt()
    userId: number;

    @IsNotEmpty()
    @IsInt()
    postId: number;

    @IsNotEmpty()
    reactType: REACT_TYPE;
}