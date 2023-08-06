import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './entity/user.entity';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() dto: AuthCredentialDto): Promise<User> {
    return this.authService.createUser(dto);
  }

  @Post('signin')
  signIn(@Body() dto: AuthCredentialDto): Promise<{ accessToken: string }> {
    return this.authService.signin(dto);
  }

  @Post('test')
  @UseGuards(AuthGuard('jwt'))
  test(@Req() req) {
    console.log(req);
  }
}
