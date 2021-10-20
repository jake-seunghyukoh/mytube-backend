import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { User } from '.prisma/client';
import { SignUpResponseDto } from './dto/signup.dto';
import { hash } from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '24h' },
        }),
      ],
      providers: [AuthService, LocalStrategy, JwtStrategy],
      controllers: [AuthController],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(usersService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate a user', async () => {
      const userInfo: User = {
        id: 1,
        username: 'username',
        password: await hash('password', 10),
      };

      jest
        .spyOn(usersService, 'findOne')
        .mockImplementation(async () => userInfo);

      const result: SignUpResponseDto | null = await authService.validateUser(
        'username',
        'password',
      );
      expect(result).not.toBeNull();
      expect(result).toEqual({ id: 1, username: 'username' });
    });

    it('should return null with not existing user', async () => {
      jest.spyOn(usersService, 'findOne').mockImplementation(async () => null);

      const result: SignUpResponseDto | null = await authService.validateUser(
        'username',
        'password',
      );
      expect(result).toBeNull();
    });

    it('should return null with wrong password', async () => {
      const userInfo: User = {
        id: 1,
        username: 'username',
        password: await hash('password', 10),
      };

      jest
        .spyOn(usersService, 'findOne')
        .mockImplementation(async () => userInfo);

      const result: SignUpResponseDto | null = await authService.validateUser(
        'username',
        'wrong_password!!!!',
      );
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should be defined', () => {});
  });

  describe('signUp', () => {
    it('should be defined', () => {});
  });
});
