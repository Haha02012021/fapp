import { AuthDto } from './auth.dto';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'account' });
  }

  async validate(account: string, password: string): Promise<any> {
    const res = await this.authService.signin({ account, password });

    if (!res.data) {
      console.log(res);
      throw new UnauthorizedException();
    }
    return res.data;
  }
}
