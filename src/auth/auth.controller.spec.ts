import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;

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
      exports: [AuthService],
      controllers: [AuthController],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signup', () => {
    it('should register a user', async () => {
      const result = {
        id: 1,
        username: 'test',
      };

      expect(
        await authController.signUp({ username: 'test', password: 'password' }),
      ).toBe(result);
    });

    it("should throw an HttpException 'User Already Exists' if user already exist", async () => {
      expect(
        authController.signUp({
          username: 'test',
          password: 'password',
        }),
      ).rejects.toEqual(
        new HttpException('User Already Exists', HttpStatus.BAD_REQUEST),
      );
    });

    // Should we test things with dto and validation pipe?
  });
});
