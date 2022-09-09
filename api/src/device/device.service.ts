import { Sequelize } from 'sequelize-typescript';
import { Injectable } from '@nestjs/common';
import { Device } from './device.model';

@Injectable()
export class DeviceService {
  constructor(private sequelize: Sequelize) {}

  async create(device: any) {
    try {
      await Device.create({
        ...device,
      });

      return {
        success: true,
        message: 'create device successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async deleteByValue(userId: number, value: string) {
    try {
      await Device.destroy({
        where: {
          userId,
        },
      });
    } catch (error) {}
  }
}
