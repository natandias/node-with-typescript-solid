import UserInMemoryRepository from '../userInMemory.repository';
import UserEntity from '../../entities/userInMemory.local.entity';
import UserRepository from '../../interfaces/userRepository.interface';
import CreateUser from '../../interfaces/dtos/createUser.dto';

describe('UserInMemoryRepository', () => {
  let userRepository: UserRepository;
  let userEntity: UserEntity;

  beforeEach(() => {
    userEntity = new UserEntity();
    userRepository = new UserInMemoryRepository(userEntity);
  });

  // List
  it('should return a list of users', async () => {
    userEntity.create = jest.fn((user: CreateUser) => ({
      id: '1234',
      ...user,
    }));

    const user1 = {
      name: 'jest',
      age: 20,
      city: 'Diamantina',
    };

    const user2 = {
      name: 'jest2',
      age: 21,
      city: 'Ouro Preto',
    };

    await userRepository.createUser(user1);
    await userRepository.createUser(user2);

    const usersList = await userRepository.findAllUsers();
    expect(usersList.length).toBe(2);
    expect(usersList[0]).toEqual({
      id: '1234',
      ...user1,
    });
    expect(usersList[1]).toEqual({
      id: '1234',
      ...user2,
    });
    expect(userEntity.create).toBeCalledTimes(2);
  });

  it('should return empty array when there are no users', async () => {
    const usersList = await userRepository.findAllUsers();
    expect(usersList).toEqual([]);
  });

  // Find One
  it('should return a user', async () => {
    userEntity.create = jest.fn((user: CreateUser) => ({
      id: '1234',
      ...user,
    }));

    const user = {
      name: 'Jest',
      age: 20,
      city: 'Salvador',
    };

    await userRepository.createUser(user);

    const foundUser = await userRepository.findOneUser('1234');
    expect(foundUser).toEqual({ id: '1234', ...user });
  });

  it('should return error if user is not found', async () => {
    const user = await userRepository.findOneUser('1234');
    expect(user).toBe('User not found');
  });

  // Create
  it('should create and return user', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    userEntity.create = jest.fn((user: CreateUser) => ({
      id: '1234',
      ...user,
    }));

    const userCreated = await userRepository.createUser({
      name: 'Jest',
      age: 20,
      city: 'Salvador',
    });

    expect(userCreated).toEqual({
      id: '1234',
      name: 'Jest',
      age: 20,
      city: 'Salvador',
    });
  });

  it('should not create user if params are missing', async () => {
    userEntity.create = jest.fn((user: CreateUser) => ({
      id: '1234',
      ...user,
    }));

    const userCreated = await userRepository.createUser({
      name: 'Jest',
      age: 20,
      city: '',
    });

    expect(userCreated).toBe(false);
  });

  // Update
  it('should update user', async () => {
    userEntity.create = jest.fn((user: CreateUser) => ({
      id: '1234',
      ...user,
    }));

    const user = await userRepository.createUser({
      name: 'Jest',
      age: 20,
      city: 'Diamantina',
    });

    const userUpdated = await userRepository.updateUser({
      id: '1234',
      name: 'Natan',
    });
    expect(userUpdated).toEqual({ ...user, id: '1234', name: 'Natan' });
  });

  it("should not update user if user doesn't exists", async () => {
    const userUpdated = await userRepository.updateUser({
      id: '1234',
      name: 'Natan',
    });
    expect(userUpdated).toBe(false);
  });

  it("should return the same item if there aren't new data", async () => {
    userEntity.create = jest.fn((user: CreateUser) => ({
      id: '1234',
      ...user,
    }));

    const user = await userRepository.createUser({
      name: 'Jest',
      age: 20,
      city: 'Diamantina',
    });

    const userUpdated = await userRepository.updateUser({
      id: '1234',
    });

    expect(userUpdated).toEqual({ id: '1234', ...user });
  });

  // Remove
  it('should remove user', async () => {
    userEntity.create = jest.fn((user: CreateUser) => ({
      id: '1234',
      ...user,
    }));

    await userRepository.createUser({
      name: 'Jest',
      age: 20,
      city: 'Diamantina',
    });

    const deletedUser = await userRepository.removeUser('1234');
    expect(deletedUser).toBe(true);
  });

  it("shouldn't remove user if it doesn't exists", async () => {
    const deletedUser = await userRepository.removeUser('1234');
    expect(deletedUser).toBe(false);
  });
});