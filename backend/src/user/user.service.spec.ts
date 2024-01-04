import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../db/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<UserEntity>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
        JwtService,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should create a new user and return a JWT', async () => {
    const user = new UserEntity();
    user.login = 'test';
    user.passwordHash = 'hashedPassword';

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);
    jest.spyOn(userRepository, 'create').mockResolvedValue(user as never);
    jest.spyOn(userRepository, 'save').mockResolvedValue(user);
    jest.spyOn(jwtService, 'sign').mockReturnValue('jwtToken');

    expect(await service.createUser('test', 'password')).toBe('jwtToken');
  });

  it('should throw an error when creating a user that already exists', async () => {
    const user = new UserEntity();
    user.login = 'test';
    user.passwordHash = 'hashedPassword';

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

    await expect(service.createUser('test', 'password')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should return a user when finding an existing user', async () => {
    const user = new UserEntity();
    user.login = 'test';
    user.passwordHash = 'hashedPassword';

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

    expect(await service.findUser('test')).toBe(user);
  });

  it('should return null when finding a non-existing user', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

    expect(await service.findUser('test')).toBeNull();
  });

  it('should return null when logging in with incorrect credentials', async () => {
    const user = new UserEntity();
    user.login = 'test';
    user.passwordHash = 'hashedPassword';

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

    expect(await service.login('test', 'wrongPassword')).toBeNull();
  });

  it('should return undefined when logging in with a non-existing user', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

    expect(await service.login('test', 'password')).toBeUndefined();
  });
});
