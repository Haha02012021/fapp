import { Sequelize } from 'sequelize-typescript';
import { Injectable } from '@nestjs/common';
import { CommentDto } from './comment.dto';
import Comment from './comment.model';
import { Post } from 'src/post/post.model';
import { User } from 'src/user/user.model';
import { cp } from 'fs';

@Injectable()
export class CommentService {
    constructor(private sequelize: Sequelize) {}

    async create(comment: CommentDto) {
        try {
            await Comment.create({
                ...comment,
            });

            const newComments = await this.getCommentsByPostId(comment.postId);

            return {
                success: true,
                data: newComments,
                message: 'create comment successfully',
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }

    async getComment(id: number) {
        try {
            const comment = await Comment.findOne({
                where: {
                    id,
                },
                include: [
                    {
                        model: User,
                        as: 'owner',
                        attributes: ['id', 'fullname', 'username', 'avatar'],
                    },
                ],
            });

            comment.setDataValue('childComments', await this.getAllChildComments(id));

            return comment;
        } catch (error) {}
    }

    async getAllChildComments(id: number) {
        try {
            const comment = await Comment.findOne({
                where: {
                    id,
                },
                include: [
                    {
                        model: Comment,
                        as: 'childComments',
                        nested: true,
                        include: [
                            {
                                model: User,
                                as: 'owner',
                                attributes: ['id', 'fullname', 'username', 'avatar'],
                            },
                        ],
                        order: [['updatedAt', 'DESC']],
                    },
                ],
            });

            const childComments = [...comment.childComments];
            for (const childComment of childComments) {
                const childOfChildComment = await this.getAllChildComments(childComment.id);
                childComment.setDataValue('childComments', childOfChildComment);
            }
            return childComments;
        } catch (error) {}
    }

    async getCommentsByPostId(postId: number) {
        try {
            const comments = await Post.findOne({
                where: {
                    id: postId,
                },
                include: [
                    {
                        model: Comment,
                        as: 'comments',
                        order: [['updatedAt', 'DESC']],
                    },
                ],
            }).then(async (post) => {
                const comments = post.comments;

                const formatedComments = [];
                for (const comment of comments) {
                    if (comment.parentId === null) {
                        formatedComments.push(await this.getComment(comment.id));
                    }
                }

                return formatedComments;
            });

            return comments;
        } catch (error) {}
    }

    async removeComment(id: number, comment: CommentDto) {
        try {
            await Comment.destroy({
                where: {
                    id,
                },
            });
            const newComments = await this.getCommentsByPostId(comment.postId);
            return {
                success: true,
                data: newComments,
                message: 'delete comment successfully',
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }

    async editComment(id: number, comment: CommentDto) {
        try {
            await Comment.update(
                {
                    ...comment,
                },
                {
                    where: {
                        id,
                    },
                },
            );

            const newComments = await this.getCommentsByPostId(comment.postId);
            return {
                success: true,
                data: newComments,
                message: 'edit comment successfully',
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
}
