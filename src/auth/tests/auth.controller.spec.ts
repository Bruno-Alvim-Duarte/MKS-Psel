import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { createUserDto } from '../../dto/user.dto';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth.constants';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entity/User';
import * as bcrypt from 'bcryptjs';

describe('Auth Controller', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '15m' },
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn(),
            findOneBy: jest.fn().mockResolvedValue({
              id: 1,
              email: 'test@gmail.com',
              password:
                '2a$10$l44Ab8otIc8cTttrzQ0PlegewDyJyJJcgsoivY54lY44xRBUPv5I.',
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should call AuthService signup method when making a request to AuthController signup method', async () => {
    const user: createUserDto = {
      email: 'test@gmail.com',
      password: 'password',
    };

    const authServiceSpy = jest.spyOn(authService, 'signup');

    await controller.signup(user);

    expect(authServiceSpy).toHaveBeenCalledWith(user);
  });

  it('should call AuthService signin method when making a request to AuthController signin method', async () => {
    const user: createUserDto = {
      email: 'test@gmail.com',
      password: 'password',
    };

    jest
      .spyOn(bcrypt, 'compare')
      .mockResolvedValue(Promise.resolve(true) as never);
    const authServiceSpy = jest.spyOn(authService, 'signin');

    await controller.signin(user);

    expect(authServiceSpy).toHaveBeenCalledWith(user);
  });
});
