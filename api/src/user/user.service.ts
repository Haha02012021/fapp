import { FRIEND_TYPE } from './../userfriends/userfriend.model';
import { CharactersusersService } from './../charactersusers/charactersusers.service';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { UserDto } from './user.dto';
import { User, EMOTION_STATE } from './user.model';
import { jwtConstants } from 'src/auth/constants';
import { Character } from 'src/character/character.model';
import UserFriends from 'src/userfriends/userfriend.model';
import { Op } from 'sequelize';

@Injectable({})
export class UsersService {
    constructor(
        private sequelize: Sequelize,
        private jwtService: JwtService,
        private charactersUsersService: CharactersusersService,
    ) {}

    async findAll() {
        const users = await User.findAll();

        //return users
        return {
            success: true,
            data: users,
        };
    }

    async findOne(id: number) {
        const user = await User.findOne({
            include: [
                {
                    model: Character,
                    as: 'characters',
                    attributes: ['id', 'name'],
                },
            ],
            where: {
                id,
            },
        });

        const data = {
            user,
            partner: null,
        };
        if (user.emotionState !== null && user.emotionState !== EMOTION_STATE.SINGLE) {
            data.partner = await User.findOne({
                where: {
                    id: user.partnerId,
                },
            });
        }

        if (!user) {
            return {
                success: false,
                message: 'user not found',
            };
        }
        return {
            success: true,
            data: data,
        };
    }

    async remove(id: number) {
        try {
            const user = await User.findOne({
                where: {
                    id,
                },
            });
            await user.destroy();

            return {
                success: true,
                message: 'delete user successfully',
            };
        } catch (error) {
            return {
                success: false,
                message: error,
            };
        }
    }

    async edit(id: number, userDto: UserDto) {
        try {
            console.log(userDto);

            await User.update(
                { ...userDto },
                {
                    where: {
                        id,
                    },
                },
            );

            if (userDto.characters) {
                // await userDto.characters.forEach(async (character: any) => {
                //   const res = await this.charactersUsersService.create({
                //     userId: id,
                //     characterId: character,
                //   });

                //   if (!res.success) {
                //     console.log(res);
                //   }
                // });

                this.charactersUsersService.deleteByUser(id);

                const charactersUser = userDto.characters.map((character: any) => {
                    return {
                        userId: id,
                        characterId: character,
                    };
                });

                const res = await this.charactersUsersService.create(charactersUser);

                if (!res.success) {
                    console.log(res);
                }
            }

            const updatedUser = await User.findOne({
                include: [
                    {
                        model: Character,
                        as: 'characters',
                        attributes: ['id', 'name'],
                    },
                ],
                where: {
                    id,
                },
            });

            const payload = {
                id: updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email,
                fullname: updatedUser.fullname,
                sex: updatedUser.sex,
                age: updatedUser.age,
                role: updatedUser.role,
                toward: updatedUser.toward,
                emotionState: updatedUser.emotionState,
                characters: updatedUser.characters,
                avatar: updatedUser.avatar,
                partnerId: updatedUser.partnerId,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt,
            };

            return {
                success: true,
                message: 'update user successfully',
                data: updatedUser,
                access_token: this.jwtService.sign(payload, {
                    secret: jwtConstants.secret,
                }),
            };
        } catch (error) {
            return {
                success: false,
                message: error,
            };
        }
    }

    async editState(id: number, state: any) {
        try {
            const user = await User.findOne({
                where: {
                    id,
                },
            });
            if (state.emotionState === EMOTION_STATE.SINGLE) {
                if (user.emotionState !== null) {
                    await User.update(
                        {
                            emotionState: EMOTION_STATE.SINGLE,
                            partnerId: null,
                        },
                        {
                            where: {
                                id: user.partnerId,
                            },
                        },
                    );
                }
            } else {
                if (user.emotionState === EMOTION_STATE.SINGLE || user.emotionState === null) {
                    await User.update(
                        {
                            emotionState: state.emotionState,
                            partnerId: user.id,
                        },
                        {
                            where: {
                                id: user.partnerId,
                            },
                        },
                    );
                } else {
                    await User.update(
                        {
                            emotionState: state.emotionState,
                        },
                        {
                            where: {
                                id: user.partnerId,
                            },
                        },
                    );
                }
            }
            await User.update(state, {
                where: {
                    id,
                },
            });
            return {
                success: true,
                message: 'update emotional state successfully',
            };
        } catch (error) {
            return {
                success: false,
                message: error,
            };
        }
    }

    async removeCurrentState(id: number) {
        try {
            const user = await User.findOne({
                where: {
                    id,
                },
            });

            await user.destroy();

            return {
                success: true,
                message: 'delete current state successfully',
            };
        } catch (error) {
            return {
                success: false,
                message: error,
            };
        }
    }

    async getCaredTops() {
        try {
            const time = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);
            const tops = await this.sequelize.query(
                `select users.id, users.fullname, users.username, users.avatar, pivot.postsAmount, count(postsusers.userId) as reactedAmount from postsusers join posts on posts.id = postsusers.postId join (select ownerId, count(id) as postsAmount from posts group by ownerId) as pivot on pivot.ownerId = posts.ownerId join users on users.id = pivot.ownerId where postsusers.updatedAt > "${time.toISOString()}" group by posts.ownerId order by reactedAmount desc limit 4;`,
            );

            return {
                success: true,
                data: tops[0],
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }

    async addFriend(friend: any) {
        try {
            switch (friend.type) {
                case FRIEND_TYPE.WAITING:
                    await UserFriends.create({
                        ...friend,
                    });
                    break;
                case FRIEND_TYPE.NORMAL:
                case FRIEND_TYPE.REFUSED:
                    await UserFriends.update(friend, {
                        where: {
                            [Op.and]: {
                                userId: friend.userId,
                                friendId: friend.friendId,
                            },
                        },
                    });

                    await UserFriends.create({
                        userId: friend.friendId,
                        friendId: friend.userId,
                        type: friend.type,
                    });
                    break;
                case FRIEND_TYPE.CLOSE:
                    await UserFriends.update(friend, {
                        where: {
                            [Op.and]: {
                                userId: friend.userId,
                                friendId: friend.friendId,
                            },
                        },
                    });

                    await UserFriends.update(
                        {
                            userId: friend.friendId,
                            friendId: friend.userId,
                            type: FRIEND_TYPE.CLOSE,
                        },
                        {
                            where: {
                                [Op.and]: {
                                    userId: friend.userId,
                                    friendId: friend.friendId,
                                },
                            },
                        },
                    );
                default:
                    break;
            }

            return {
                success: true,
                message: 'Add friend successfully!',
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }

    async addFriends(friends: any) {
        try {
            await UserFriends.destroy({
                where: {
                    userId: friends[0].userId,
                },
            });
            await UserFriends.bulkCreate(friends);

            return {
                success: true,
                message: 'Add friends successfully!',
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }

    async getFriendReqNumber(id: number) {
        try {
            const friends = await UserFriends.count({
                where: {
                    friendId: id,
                    type: FRIEND_TYPE.WAITING,
                },
            });
            return {
                success: true,
                data: friends,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }

    async getReqFriends(id: number) {
        try {
            const friends = await UserFriends.findAll({
                where: {
                    friendId: id,
                    type: FRIEND_TYPE.WAITING,
                },
            }).then(async (friends) => {
                const friendDetails = [];

                for (let i = 0; i < friends.length; i++) {
                    const friendDetail = await this.findOne(friends[i].userId).then((res) => {
                        return res.data;
                    });

                    friendDetails.push(friendDetail);
                }
                return friendDetails;
            });
            return {
                success: true,
                data: friends,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }

    async getAllFriends(id: number) {
        try {
            const friends = await this.sequelize.query(
                `select users.id, users.fullname, users.username, users.avatar from users join userfriends on users.id = userfriends.friendId where userfriends.type = 0 and userfriends.userId = ${id};`,
            );

            return {
                success: true,
                data: friends[0],
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }

    async getFriendsBySearch(id: number, searchValue: string) {
        try {
            const friends = await this.sequelize.query(
                `select users.id, users.username, users.avatar from userfriends join users on userfriends.friendId = users.id where userfriends.userId = ${id} and userfriends.type >= 0 and users.username like '%${searchValue}%';`
            );

            return {
                success: true,
                data: friends[0],
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }

    async getRelationshipOfTwoUser(userId: number, friendId: number) {
        try {
            const relationship = await UserFriends.findOne({
                where: {
                    [Op.or]: [
                        {
                            userId: friendId,
                            friendId: userId,
                        },
                        {
                            userId,
                            friendId,
                        },
                    ],
                },
                attributes: ['type', 'userId'],
            });

            return {
                success: true,
                data: relationship || { type: null },
            };
        } catch (error) {
            return {
                success: false,
                data: error.message,
            };
        }
    }

    async removeFriend(friend: any) {
        try {
            await UserFriends.destroy({
                where: {
                    userId: friend.userId,
                    friendId: friend.friendId,
                },
            });
            await UserFriends.destroy({
                where: {
                    userId: friend.friendId,
                    friendId: friend.userId,
                },
            });
            return {
                success: true,
                message: 'delete friend successfully',
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
}
