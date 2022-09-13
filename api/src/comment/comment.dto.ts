import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CommentDto {
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsInt()
    @IsNotEmpty()
    ownerId: number;

    parentId: number;

    @IsInt()
    @IsNotEmpty()
    postId: number;
}
