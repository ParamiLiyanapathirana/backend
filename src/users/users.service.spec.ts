import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch all users', async () => {
    const users = await service.findAll();
    expect(users).toBeInstanceOf(Array);
  });

  it('should create a new user', async () => {
    const user = await service.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });
    expect(user).toHaveProperty('id');
    expect(user.name).toBe('Test User');
  });
});
