import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entity/User';
import { hash, compare } from 'bcryptjs';
import { createUserDto } from '../dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async signup(userBody: createUserDto): Promise<User> {
    const user = new User();
    user.email = userBody.email;
    const hashedPass = await hash(userBody.password, 10);
    user.password = hashedPass;
    return await this.usersRepository.save(user);
  }

  async signin(userBody: createUserDto): Promise<{ access_token: string }> {
    const user = await this.usersRepository.findOneBy({
      email: userBody.email,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    const isPasswordMatching = await compare(userBody.password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException();
    }
    const payload = { id: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
