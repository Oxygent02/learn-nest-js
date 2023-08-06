import { DataSource, Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthCredentialDto } from '../dto/auth-credential.dto';
import * as bcrypt from 'bcrypt-promise';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(dto: AuthCredentialDto): Promise<User> {
    const { username, password } = dto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      username,
      password: hashedPassword,
    });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('username is exist');
      }
      throw new InternalServerErrorException(error.detail);
    }
    delete user.password;
    return user;
  }
}
