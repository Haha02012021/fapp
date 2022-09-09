import { jwtConstants } from './constants';
import { AuthDto } from './auth.dto';
import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { User } from 'src/user/user.model';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { JwtService } from '@nestjs/jwt';
import { Character } from 'src/character/character.model';

@Injectable({})
export class AuthService {
  constructor(private sequelize: Sequelize, private jwtService: JwtService) {}

  async signin(signInInfo: any) {
    try {
      let user = null;
      //console.log(signInInfo);
      user = await User.findOne({
        include: [
          {
            model: Character,
            as: 'characters',
          },
        ],
        where: {
          [Op.or]: [
            { username: signInInfo.account },
            { email: signInInfo.account },
          ],
        },
      });

      if (!user) {
        return {
          success: false,
          message: 'username or email is not exist',
        };
      }

      if (user.password && signInInfo.password) {
        const pwMatches = await argon.verify(
          user.password,
          signInInfo.password,
        );
        if (!pwMatches) {
          return {
            success: false,
            message: `${user.username}'s password is wrong`,
          };
        }
      }

      const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        sex: user.sex,
        age: user.age,
        height: user.height,
        weight: user.weight,
        bloodType: user.bloodType,
        phoneNumber: user.phoneNumber,
        role: user.role,
        toward: user.toward,
        characters: user.characters,
        emotionState: user.emotionState,
        avatar: user.avatar,
        partnerId: user.partnerId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return {
        success: true,
        access_token: this.jwtService.sign(payload, {
          secret: jwtConstants.secret,
        }),
        data: payload,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async signup(authDto: AuthDto) {
    try {
      console.log(authDto);

      const user = await User.create({
        username: authDto.username,
        email: authDto.email,
        password: await argon.hash(authDto.password),
      });

      return {
        success: true,
        data: user,
      };
    } catch (err) {
      // Transaction has been rolled back
      // err is whatever rejected the promise chain returned to the transaction callback
      return {
        success: false,
        message: err,
      };
    }
  }
}
