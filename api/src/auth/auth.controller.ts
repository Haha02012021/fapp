import { LocalAuthGuard } from './local-auth.guard';
import { AuthDto } from './auth.dto';
import { AuthService } from './auth.service';
import { Body, Controller, Post, Req, UseGuards, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() authDto: AuthDto) {
    return this.authService.signup(authDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Body() signInInfo: any, @Res() response: Response) {
    const res = await this.authService.signin(signInInfo);

    if (res.success) {
      response.setHeader('Set-Cookie', res.access_token);
    }

    return response.send(res);
  }
}
