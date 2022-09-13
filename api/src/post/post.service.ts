import { ImageService } from './../image/image.service';
import { PostDto } from './post.dto';
import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Post } from './post.model';
import { User } from 'src/user/user.model';
import { PostsUsers } from 'src/postsusers/postsusers.model';
import { Image } from 'src/image/image.model';

@Injectable()
export class PostService {
    constructor(private sequelize: Sequelize, private imageService: ImageService) {}

    async findAll(userId: number) {
        const posts = await Post.findAll({
            order: [['updatedAt', 'DESC']],
            include: [
                {
                    model: Image,
                    as: 'images',
                },
                {
                    model: User,
                    as: 'owner',
                    attributes: ['id', 'username', 'avatar'],
                },
                {
                    model: User,
                    as: 'users',
                    attributes: ['id', 'fullname', 'username', 'avatar'],
                },
            ],
        });

        const data = [];

        for (const post of posts) {
            const reactType = await PostsUsers.findOne({
                attributes: ['reactType'],
                where: {
                    userId,
                    postId: post.id,
                },
            });

            const reactAmount = await PostsUsers.count({
                where: {
                    userId,
                    postId: post.id,
                },
            });

            data.push({
                post,
                react: {
                    reactType: reactType?.reactType >= 0 ? reactType?.reactType : null,
                    reactAmount,
                },
            });
        }

        return {
            success: true,
            data: data,
        };
    }

    async findPostsByOwnerId(ownerId: number, userId: number) {
        const posts = await Post.findAll({
            order: [['updatedAt', 'DESC']],
            where: {
                ownerId,
            },
            include: [
                {
                    model: Image,
                    as: 'images',
                },
                {
                    model: User,
                    as: 'owner',
                    attributes: ['id', 'username', 'avatar'],
                },
                {
                    model: User,
                    as: 'users',
                    attributes: ['id', 'fullname', 'username', 'avatar'],
                },
            ],
        });

        const data = [];

        for (const post of posts) {
            const reactType = await PostsUsers.findOne({
                attributes: ['reactType'],
                where: {
                    userId,
                    postId: post.id,
                },
            });

            const reactAmount = await PostsUsers.count({
                where: {
                    userId,
                    postId: post.id,
                },
            });

            data.push({
                post,
                react: {
                    reactType: reactType?.reactType >= 0 ? reactType?.reactType : null,
                    reactAmount,
                },
            });
        }

        return {
            success: true,
            data: data,
        };
    }

    async findOne(id: number) {
        try {
            const post = await Post.findOne({
                include: [
                    {
                        model: Image,
                        as: 'images',
                    },
                    {
                        model: User,
                        as: 'owner',
                        attributes: ['id', 'username', 'avatar'],
                    },
                    {
                        model: User,
                        as: 'users',
                        attributes: ['id', 'fullname', 'username', 'avatar'],
                    },
                ],
                where: {
                    id,
                },
            });

            return {
                success: true,
                data: post,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }

    async create(postDto: PostDto) {
        try {
            const newPost = await Post.create({
                ...postDto,
            });

            const newPostDetailRes = await this.findOne(newPost.id);

            if (newPostDetailRes.success) {
                return {
                    success: true,
                    data: newPostDetailRes.data,
                    message: 'create post successfully',
                };
            } else {
                return newPostDetailRes;
            }
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }

    async edit(id: number, postDto: PostDto) {
        try {
            await Post.update(
                {
                    ...postDto,
                },
                {
                    where: {
                        id,
                    },
                },
            );

            if (postDto.images) {
                const imgRes = await this.imageService.saveImages(postDto.images);

                if (!imgRes.success) {
                    return imgRes;
                }
            }

            const updatedPostRes = await this.findOne(id);

            if (updatedPostRes.success) {
                return {
                    success: true,
                    data: updatedPostRes.data,
                    message: 'update post successfully',
                };
            } else {
                return updatedPostRes;
            }
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }

    async delete(id: number) {
        try {
            await Post.destroy({
                where: {
                    id,
                },
            });

            return {
                success: true,
                message: 'delete post successfully',
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }

    async getFourTopReact(ownerId: number) {
        try {
            const users = await this.sequelize.query(
                `select * from (select userId, count(id) as reactAmount from posts join postsusers on postId = id where ownerId = ${ownerId} group by userId) as pivot join users on pivot.userId = users.id order by pivot.reactAmount desc limit 4;`,
            );

            return {
                success: true,
                data: users[0],
            };
        } catch (error) {}
    }

    async getReactDetails(id: number) {
        try {
            const reactDetails = await this.sequelize.query(
                `select users.id, users.fullname, users.username, users.avatar, postsusers.reactType from users join postsusers on users.id = postsusers.userId where postsusers.postId = ${id};`,
            );
            return {
                success: true,
                data: reactDetails[0],
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
}
