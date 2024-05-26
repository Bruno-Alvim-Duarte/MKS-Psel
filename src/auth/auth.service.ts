import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entity/User';
import { hash, compare } from 'bcryptjs';
import { createUserDto } from '../dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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
    const isTokenInCache = await this.cacheManager.get(`user-${user.id}-token`);
    if (isTokenInCache) {
      return {
        access_token: isTokenInCache as string,
      };
    }
    const payload = { id: user.id, email: user.email };
    const access_token = await this.jwtService.signAsync(payload);
    // 900000 ms = 15 minutos - tempo que o token fica válido
    this.cacheManager.set(`user-${user.id}-token`, access_token, 900000);
    return {
      access_token,
    };
  }
}
