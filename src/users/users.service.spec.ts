import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { mockReset } from 'jest-mock-extended';
import { prismaMock } from '../singleton';
import { User } from '.prisma/client';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    mockReset(prismaMock);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaMock },
      ],
      controllers: [UsersController],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an user', async () => {
    const user: User = { id: 1, username: 'test', password: 'password' };
    prismaMock.user.create.mockResolvedValue(user);

    const input = { username: 'test', password: 'password' };

    const result = await service.createOne(input.username, input.password);

    expect(result).toBe(user);
  });
});
