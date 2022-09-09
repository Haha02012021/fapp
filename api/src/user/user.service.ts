import { FRIEND_TYPE } from './../userfriends/userfriend.model';
import { CharactersusersService } from './../charactersusers/charactersusers.service';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { UserDto } from './user.dto';
import { User, EMOTION_STATE } from './user.model';
import { jwtConstants } from 'src/auth/constants';
import { CharactersUsers } from 'src/charactersusers/charactersusers.model';
import { Character } from 'src/character/character.model';
import { Chat } from 'src/chat/chat.model';
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
    if (
      user.emotionState !== null &&
      user.emotionState !== EMOTION_STATE.SINGLE
    ) {
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
        if (
          user.emotionState === EMOTION_STATE.SINGLE ||
          user.emotionState === null
        ) {
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

  async addFriend(friend: any) {
    try {
      switch (friend.type) {
        case FRIEND_TYPE.WAIT:
          await UserFriends.create({
            ...friend,
          });
          break;
        case FRIEND_TYPE.NORMAL:
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

  async getFriendReqNumber(id: number) {
    try {
      const friends = await UserFriends.count({
        where: {
          friendId: id,
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
        },
      }).then(async (friends) => {
        const friendDetails = [];

        for (let i = 0; i < friends.length; i++) {
          const friendDetail = await this.findOne(friends[i].userId).then(
            (res) => {
              return res.data;
            },
          );

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
