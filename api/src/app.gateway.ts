import { Server, Socket } from 'socket.io';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { UsersService } from './user/user.service';
import { JwtService } from '@nestjs/jwt';
import { DeviceService } from './device/device.service';

@WebSocketGateway(3030, { cors: true })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('MessageGateway');
  constructor(
    private userService: UsersService,
    private deviceService: DeviceService,
    private jwtService: JwtService,
  ) {}
  async handleConnection(client: Socket) {
    this.logger.log(client.id, 'Connected..............................');
    const res = await this.getDataUserFromToken(client);

    if (res.success) {
      const device = {
        userId: res.data.user.id,
        value: client.id,
      };
  
      await this.deviceService.create(device);
    }
  }
  afterInit(server: any) {
    throw new Error('Method not implemented.');
  }
  async handleDisconnect(client: Socket) {
    const res = await this.getDataUserFromToken(client);
    if (res.success) {
      await this.deviceService.deleteByValue(res.data.user.id, client.id);

      // need handle remove socketId to table
      this.logger.log(client.id, 'Disconnect');
    }
  }

  //function get user from token
  async getDataUserFromToken(client: Socket) {
    const authToken: any = client.handshake?.query?.token;
    try {
      const decoded = this.jwtService.verify(authToken);

      return await this.userService.findOne(decoded.id); // response to function
    } catch (ex) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }
}
