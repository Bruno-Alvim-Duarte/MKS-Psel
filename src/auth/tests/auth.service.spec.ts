import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../../entity/User';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createUserDto } from '../../dto/user.dto';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { jwtConstants } from '../auth.constants';

describe('Auth Service', () => {
  let service: AuthService;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '15m' },
        }),
      ],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('signup', () => {
    it('should create a new user and return the user object', async () => {
      const user: createUserDto = {
        email: 'test@gmail.com',
        password: 'password',
      };

      const hashedPassword = await bcrypt.hash(user.password, 10);
      const savedUser: User = {
        id: 1,
        email: user.email,
        password: hashedPassword,
      };

      jest.spyOn(usersRepository, 'save').mockResolvedValue(savedUser);

      const result = await service.signup(user);

      expect(result).toEqual(savedUser);
    });
  });

  describe('signin', () => {
    it('should return an access token when the user credentials are valid', async () => {
      const user: createUserDto = {
        email: 'test@gmail.com',
        password: 'password',
      };

      const savedUser: User = {
        id: 1,
        email: user.email,
        password: await bcrypt.hash(user.password, 10),
      };

      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(savedUser);
      jest
        .spyOn(bcrypt, 'compare')
        .mockResolvedValue(Promise.resolve(true) as never);

      const result = await service.signin(user);

      expect(result.access_token).toBeDefined();
    });

    it('should throw an UnauthorizedException when the user credentials are invalid', async () => {
      const user: createUserDto = {
        email: 'test@gmail.com',
        password: 'password',
      };

      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(null);
      jest
        .spyOn(bcrypt, 'compare')
        .mockResolvedValue(Promise.resolve(false) as never);

      await expect(service.signin(user)).rejects.toThrow(UnauthorizedException);
    });
  });
});
