import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt-promise';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interface/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async createUser(dto: AuthCredentialDto): Promise<User> {
    return this.userRepository.createUser(dto);
  }

  async signin(dto: AuthCredentialDto): Promise<{ accessToken: string }> {
    const { username, password } = dto;
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    }

    throw new UnauthorizedException('Invalid login');
  }
}
